import { NextResponse } from "next/server";
import {
  verifyLineSignature,
  hasLineConfig,
  getLineUserProfile,
} from "@/lib/line";
import { logLineWebhookEvent, upsertLineLink } from "@/lib/store";

/* ============================================================
 * POST /api/line/webhook
 *
 * The endpoint you register as the "Webhook URL" in the LINE
 * Developers console (Messaging API channel 2008409511):
 *     {NEXT_PUBLIC_SITE_URL}/api/line/webhook
 *
 * It verifies the X-Line-Signature, logs every inbound event to
 * public.line_webhook_events, links followers (so we know which
 * LINE user maps to the expert OA), and acks 200 fast (LINE
 * requires a quick 200). The actual consult work happens inside
 * the LIFF apps, not via native LINE messages.
 * ============================================================ */

export const runtime = "nodejs";

export async function POST(req: Request) {
  const raw = await req.text();
  const signature = req.headers.get("x-line-signature");

  // When LINE isn't configured (demo) just ack so local testing never 500s.
  if (!hasLineConfig()) return NextResponse.json({ ok: true });

  if (!verifyLineSignature(raw, signature)) {
    return NextResponse.json({ error: "bad_signature" }, { status: 401 });
  }

  let body: { events?: unknown[] };
  try {
    body = JSON.parse(raw);
  } catch {
    return NextResponse.json({ error: "bad_json" }, { status: 400 });
  }

  const events = Array.isArray(body.events) ? body.events : [];

  // Process best-effort; never block (or fail) the 200 ack.
  await Promise.all(
    events.map(async (e) => {
      const ev = e as Record<string, unknown>;
      const type = typeof ev.type === "string" ? ev.type : "unknown";
      const source = (ev.source as Record<string, unknown>) ?? {};
      const userId = typeof source.userId === "string" ? source.userId : null;

      await logLineWebhookEvent(type, userId, null, ev);

      // A follow means a LINE user added the expert OA — remember them so we
      // can target pushes (and audit who acts). We treat OA followers as
      // experts (the customer side lives in the web app, not LINE).
      if (type === "follow" && userId) {
        const profile = await getLineUserProfile(userId);
        await upsertLineLink(userId, "expert", {
          displayName: profile?.displayName,
        });
      }
    }),
  ).catch(() => {});

  return NextResponse.json({ ok: true });
}

// LINE sometimes probes the endpoint with GET — answer it.
export function GET() {
  return NextResponse.json({ ok: true });
}
