import type { CheckinDials, LText, WellnessCheckin } from "@/lib/types";

/* Shape returned by GET /api/journey/[bookingId] — the consolidated
 * T0 → T1 → T2 → T3 pre/post arc for one booking. */

export interface JourneyData {
  booking: {
    id: string;
    packageId: string;
    createdAt: string;
    guestFirstName?: string;
  };
  archetypeName?: LText;
  /** The "before" reading for the whole arc: the booking's T1, or the T0
   *  assessment baseline when the guest booked from their own assessment. */
  baseline: { dials: CheckinDials; source: "T1" | "assessment" } | null;
  /** All check-ins for the booking (oldest first), full records. */
  checkins: WellnessCheckin[];
}
