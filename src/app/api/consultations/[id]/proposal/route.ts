import { NextResponse } from "next/server";
import { getConsultation, getLatestProposal } from "@/lib/store";
import { getSessionCustomerId } from "@/lib/session-server";
import { getOriginalPlanSlots } from "@/lib/plan";

/* ============================================================
 * GET /api/consultations/[id]/proposal
 *
 * Returns the expert's latest adjusted plan plus the program's
 * original plan, so the customer can compare them side by side.
 * Owner-only.
 * ============================================================ */

export const runtime = "nodejs";

export async function GET(
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

  const proposal = await getLatestProposal(id);
  const original = getOriginalPlanSlots(consultation.itemType, consultation.itemId);
  return NextResponse.json({ proposal, original });
}
