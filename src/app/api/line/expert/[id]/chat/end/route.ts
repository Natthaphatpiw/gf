import { NextResponse } from "next/server";
import {
  getConsultation,
  endChatThread,
  addConsultationStatus,
  logConsultationActivity,
} from "@/lib/store";
import { authLiffRequest } from "@/lib/line";
import { CONSULT_STATUS_FLOW } from "@/lib/consultation";

/* ============================================================
 * POST /api/line/expert/[id]/chat/end
 *
 * Expert ends the chat from the LIFF. Closes the thread and moves
 * the order forward to coordinating_partner. Token-authed.
 * ============================================================ */

export const runtime = "nodejs";

const ADVANCE_TO = "coordinating_partner" as const;

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = await authLiffRequest(req);
  if (!auth.ok) return NextResponse.json({ error: "unauthorized" }, { status: auth.status });

  const { id } = await params;
  const consultation = await getConsultation(id);
  if (!consultation) return NextResponse.json({ error: "not_found" }, { status: 404 });

  // Only chat consultations have a thread; never advance a managed/video
  // order through this endpoint.
  const thread = await endChatThread(id, "expert");
  if (!thread) return NextResponse.json({ error: "no_chat" }, { status: 409 });

  await logConsultationActivity(id, "expert", "chat.ended", {
    lineUserId: auth.profile?.userId,
  });

  let updated = consultation;
  const here = CONSULT_STATUS_FLOW.indexOf(consultation.status);
  const target = CONSULT_STATUS_FLOW.indexOf(ADVANCE_TO);
  if (here >= 0 && here < target) {
    updated = (await addConsultationStatus(id, ADVANCE_TO, "expert", "chat ended")) ?? consultation;
  }

  return NextResponse.json({ consultation: updated, thread });
}
