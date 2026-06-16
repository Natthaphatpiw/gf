import { NextResponse } from "next/server";
import {
  getConsultation,
  addConsultationStatus,
  logConsultationActivity,
} from "@/lib/store";
import { getSessionCustomerId } from "@/lib/session-server";
import { CONSULT_STATUS_FLOW, type ConsultStatus } from "@/lib/consultation";

/* ============================================================
 * POST /api/consultations/[id]/advance  { to: ConsultStatus }
 *
 * Customer-driven progression through the order lifecycle — mark
 * the consult done, start the trip, finish the program, move to
 * feedback. Owner-only and forward-only, restricted to the
 * statuses the customer controls.
 * ============================================================ */

export const runtime = "nodejs";

const CUSTOMER_ADVANCEABLE: ConsultStatus[] = [
  "coordinating_partner",
  "trip_started",
  "in_progress",
  "completed",
  "awaiting_feedback",
];

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const customerId = await getSessionCustomerId();
  if (!customerId) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const { id } = await params;
  const consultation = await getConsultation(id);
  if (!consultation || consultation.customerId !== customerId) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }

  const body = (await req.json().catch(() => ({}))) as { to?: unknown };
  const to = body.to as ConsultStatus;
  if (!CUSTOMER_ADVANCEABLE.includes(to)) {
    return NextResponse.json({ error: "not_advanceable" }, { status: 400 });
  }

  const here = CONSULT_STATUS_FLOW.indexOf(consultation.status);
  const target = CONSULT_STATUS_FLOW.indexOf(to);
  if (here < 0 || target <= here) {
    return NextResponse.json({ error: "not_forward" }, { status: 409 });
  }

  const updated = await addConsultationStatus(id, to, "customer", "customer advanced");
  await logConsultationActivity(id, "customer", "status.advanced", { to });
  return NextResponse.json({ consultation: updated ?? consultation });
}
