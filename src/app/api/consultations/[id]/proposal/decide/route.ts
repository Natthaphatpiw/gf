import { NextResponse } from "next/server";
import {
  getConsultation,
  getLatestProposal,
  decideProposal,
  logConsultationActivity,
} from "@/lib/store";
import { getSessionCustomerId } from "@/lib/session-server";

/* ============================================================
 * POST /api/consultations/[id]/proposal/decide
 *
 * The customer accepts either the expert's adjusted plan or the
 * original. Either way the order advances to coordinating_partner.
 * Body: { choice: "original" | "adjusted" }. Owner-only.
 * ============================================================ */

export const runtime = "nodejs";

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
  if (consultation.status !== "awaiting_customer") {
    return NextResponse.json({ error: "not_awaiting_customer" }, { status: 409 });
  }

  const body = (await req.json().catch(() => ({}))) as { choice?: unknown };
  const choice = body.choice === "original" || body.choice === "adjusted" ? body.choice : null;
  if (!choice) return NextResponse.json({ error: "bad_choice" }, { status: 400 });

  const proposal = await getLatestProposal(id);
  if (!proposal) return NextResponse.json({ error: "no_proposal" }, { status: 409 });

  const updated = await decideProposal(id, proposal.id, choice);
  await logConsultationActivity(id, "customer", "proposal.decided", { choice });

  return NextResponse.json({ consultation: updated ?? consultation });
}
