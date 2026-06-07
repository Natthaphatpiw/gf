import { NextResponse } from "next/server";
import { getBooking, getAssessment } from "@/lib/store";
import { getPackage } from "@/data/packages";
import { isAuthorizedExpert } from "@/components/expert/auth";
import type { WellnessProfile } from "@/lib/types";

/* ============================================================
 * GET /api/expert/booking/[id]
 *   -> {
 *        booking,
 *        package: getPackage(booking.packageId) ?? null,
 *        profile: linked primary assessment | null,
 *        familyProfiles: [{ id, label?, profile|null }],
 *      }
 * Joins the booking with its package and assessment profile(s).
 * ============================================================ */

export const dynamic = "force-dynamic";

interface FamilyProfileJoin {
  id: string;
  label?: string;
  profile: WellnessProfile | null;
}

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!isAuthorizedExpert(req)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  try {
    const booking = await getBooking(id);
    if (!booking) {
      return NextResponse.json({ error: "not_found" }, { status: 404 });
    }

    const pkg = getPackage(booking.packageId) ?? null;

    const profile = booking.assessmentId
      ? await getAssessment(booking.assessmentId)
      : null;

    const familyProfiles: FamilyProfileJoin[] = await Promise.all(
      (booking.familyMembers ?? []).map(async (member) => ({
        id: member.assessmentId,
        label: member.label,
        profile: member.assessmentId
          ? await getAssessment(member.assessmentId)
          : null,
      })),
    );

    return NextResponse.json({
      booking,
      package: pkg,
      profile,
      familyProfiles,
    });
  } catch {
    return NextResponse.json({ error: "detail_failed" }, { status: 500 });
  }
}
