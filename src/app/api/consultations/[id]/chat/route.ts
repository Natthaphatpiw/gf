import { NextResponse } from "next/server";
import {
  getConsultation,
  getChatThread,
  addChatMessage,
} from "@/lib/store";
import { getSessionCustomerId } from "@/lib/session-server";

/* ============================================================
 * Customer-side chat for a consultation (the other end is the
 * expert's LIFF at /api/line/expert/[id]).
 *
 *   GET  /api/consultations/[id]/chat  -> { thread }
 *   POST /api/consultations/[id]/chat  -> { message }   (send)
 *
 * Realtime is polling-based: the customer panel re-fetches GET on
 * an interval. Owner-only.
 * ============================================================ */

export const runtime = "nodejs";

async function ownedConsultation(id: string) {
  const customerId = await getSessionCustomerId();
  if (!customerId) return { error: "unauthorized" as const, status: 401 };
  const consultation = await getConsultation(id);
  if (!consultation || consultation.customerId !== customerId) {
    return { error: "not_found" as const, status: 404 };
  }
  return { customerId, consultation };
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const ctx = await ownedConsultation(id);
  if ("error" in ctx) return NextResponse.json({ error: ctx.error }, { status: ctx.status });

  const thread = await getChatThread(id);
  return NextResponse.json({ thread });
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const ctx = await ownedConsultation(id);
  if ("error" in ctx) return NextResponse.json({ error: ctx.error }, { status: ctx.status });

  const body = (await req.json().catch(() => ({}))) as { body?: unknown };
  const text = typeof body.body === "string" ? body.body.trim() : "";
  if (!text) return NextResponse.json({ error: "empty" }, { status: 400 });

  const message = await addChatMessage(id, "customer", text, ctx.customerId);
  if (!message) return NextResponse.json({ error: "chat_closed" }, { status: 409 });

  return NextResponse.json({ message });
}
