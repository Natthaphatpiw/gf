import { NextResponse } from "next/server";
import {
  getConsultation,
  endChatThread,
  addConsultationStatus,
  logConsultationActivity,
} from "@/lib/store";
import { getSessionCustomerId } from "@/lib/session-server";
import { CONSULT_STATUS_FLOW } from "@/lib/consultation";

/* ============================================================
 * POST /api/consultations/[id]/chat/end
 *
 * The customer ends the chat. We close the thread and move the
 * order forward to coordinating_partner (the expert then arranges
 * the booking with partners). Owner-only. Idempotent-ish.
 * ============================================================ */

export const runtime = "nodejs";

const ADVANCE_TO = "coordinating_partner" as const;

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const customerId = await getSessionCustomerId();
  if (!customerId) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const { id } = await params;
  const consultation = await getConsultation(id);
  if (!consultation || consultation.customerId !== customerId) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }

  // Only chat consultations have a thread; never advance a managed/video
  // order through this endpoint.
  const thread = await endChatThread(id, "customer");
  if (!thread) return NextResponse.json({ error: "no_chat" }, { status: 409 });

  await logConsultationActivity(id, "customer", "chat.ended");

  // Move past the chat phase if we're still in it.
  let updated = consultation;
  const here = CONSULT_STATUS_FLOW.indexOf(consultation.status);
  const target = CONSULT_STATUS_FLOW.indexOf(ADVANCE_TO);
  if (here >= 0 && here < target) {
    updated = (await addConsultationStatus(id, ADVANCE_TO, "customer", "chat ended")) ?? consultation;
  }

  return NextResponse.json({ consultation: updated, thread });
}
