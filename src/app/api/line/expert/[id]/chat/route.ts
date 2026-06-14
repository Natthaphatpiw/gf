import { NextResponse } from "next/server";
import {
  getConsultation,
  getChatThread,
  addChatMessage,
  addConsultationStatus,
} from "@/lib/store";
import { authLiffRequest } from "@/lib/line";

/* ============================================================
 * GET  /api/line/expert/[id]/chat  -> { thread }   (poll)
 * POST /api/line/expert/[id]/chat  -> { message }  (send)
 *
 * Expert side of the realtime chat. Token-authed. The first
 * expert reply moves the order awaiting_expert -> expert_processing.
 * ============================================================ */

export const runtime = "nodejs";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = await authLiffRequest(req);
  if (!auth.ok) return NextResponse.json({ error: "unauthorized" }, { status: auth.status });
  const { id } = await params;
  const consultation = await getConsultation(id);
  if (!consultation) return NextResponse.json({ error: "not_found" }, { status: 404 });
  const thread = await getChatThread(id);
  return NextResponse.json({ thread });
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = await authLiffRequest(req);
  if (!auth.ok) return NextResponse.json({ error: "unauthorized" }, { status: auth.status });

  const { id } = await params;
  const consultation = await getConsultation(id);
  if (!consultation) return NextResponse.json({ error: "not_found" }, { status: 404 });

  const body = (await req.json().catch(() => ({}))) as { body?: unknown };
  const text = typeof body.body === "string" ? body.body.trim() : "";
  if (!text) return NextResponse.json({ error: "empty" }, { status: 400 });

  const message = await addChatMessage(id, "expert", text, auth.profile?.userId);
  if (!message) return NextResponse.json({ error: "chat_closed" }, { status: 409 });

  if (consultation.status === "awaiting_expert") {
    await addConsultationStatus(id, "expert_processing", "expert", "expert joined chat");
  }

  return NextResponse.json({ message });
}
