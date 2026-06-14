import { NextResponse } from "next/server";
import { getCheckinsByBooking } from "@/lib/store";
import { isAuthorizedExpert } from "@/components/expert/auth";

/* ============================================================
 * GET /api/expert/checkins/[bookingId]
 *   -> { checkins: WellnessCheckin[] }  (oldest first: T1, T2)
 * Full check-in records — staff brief, red flags, vitals — for
 * the review workbench. Expert-gated like the other /api/expert
 * routes.
 * ============================================================ */

export const dynamic = "force-dynamic";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ bookingId: string }> },
) {
  if (!isAuthorizedExpert(req)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const { bookingId } = await params;
  try {
    const checkins = await getCheckinsByBooking(bookingId);
    return NextResponse.json({ checkins });
  } catch {
    return NextResponse.json({ error: "lookup_failed" }, { status: 500 });
  }
}
