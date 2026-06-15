import { NextResponse } from "next/server";
import { getBooking, getCheckinsByBooking, getAssessment } from "@/lib/store";
import type { JourneyData } from "@/lib/journey";
import type { WellnessCheckin } from "@/lib/types";

/* ============================================================
 * GET /api/journey/[bookingId]
 *
 * The consolidated pre/post arc for a booking: baseline (T1 or
 * the T0 assessment), every check-in (T1/T2/T3), and the linked
 * archetype. Keyed by bookingId like the rest of the sessionless
 * booking surfaces (/bookings/[id], /checkin/result/[id]).
 * ============================================================ */

export const runtime = "nodejs";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ bookingId: string }> },
) {
  const { bookingId: raw } = await params;
  const bookingId = raw.trim().toUpperCase();

  let booking;
  try {
    booking = await getBooking(bookingId);
  } catch {
    booking = null;
  }
  if (!booking) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }

  let checkins: WellnessCheckin[] = [];
  try {
    checkins = await getCheckinsByBooking(bookingId);
  } catch {
    checkins = [];
  }

  let profile = null;
  if (booking.assessmentId) {
    try {
      profile = await getAssessment(booking.assessmentId);
    } catch {
      profile = null;
    }
  }

  const t1 = checkins.find((c) => c.timepoint === "T1");
  const baseline: JourneyData["baseline"] = t1
    ? { dials: t1.dials, source: "T1" }
    : profile?.baselineCheckin
      ? { dials: profile.baselineCheckin.dials, source: "assessment" }
      : null;

  const data: JourneyData = {
    booking: {
      id: booking.id,
      packageId: booking.packageId,
      createdAt: booking.createdAt,
      guestFirstName: booking.customer?.firstName,
    },
    archetypeName: profile?.archetype.name,
    baseline,
    checkins,
  };

  return NextResponse.json(data);
}
