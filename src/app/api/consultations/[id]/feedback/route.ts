import { NextResponse } from "next/server";
import { getConsultation, logConsultationActivity } from "@/lib/store";
import { getSessionCustomerId } from "@/lib/session-server";

/* ============================================================
 * POST /api/consultations/[id]/feedback  { rating, comment }
 *
 * The customer's end-of-journey feedback. Owner-only. Recorded to
 * the activity log (no dedicated table for the POC).
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

  const body = (await req.json().catch(() => ({}))) as {
    rating?: unknown;
    comment?: unknown;
  };
  const rating =
    typeof body.rating === "number" && body.rating >= 1 && body.rating <= 5
      ? Math.round(body.rating)
      : null;
  if (!rating) return NextResponse.json({ error: "bad_rating" }, { status: 400 });
  const comment =
    typeof body.comment === "string" ? body.comment.trim().slice(0, 2000) : "";

  await logConsultationActivity(id, "customer", "feedback.submitted", { rating, comment });
  return NextResponse.json({ ok: true });
}
