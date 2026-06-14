import { NextResponse } from "next/server";
import { getCheckin, setCheckinTestimonialConsent } from "@/lib/store";

/* ============================================================
 * GET   /api/checkin/[id] — full check-in for the result page.
 * PATCH /api/checkin/[id] — { action: "testimonial_consent",
 *       granted: boolean } records the separate opt-in to reuse
 *       the guest's open answer as a testimonial (PDPA).
 * ============================================================ */

export const runtime = "nodejs";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  try {
    const checkin = await getCheckin(id);
    if (!checkin) {
      return NextResponse.json({ error: "not_found" }, { status: 404 });
    }
    return NextResponse.json({ checkin });
  } catch {
    return NextResponse.json({ error: "lookup_failed" }, { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  let body: { action?: string; granted?: unknown };
  try {
    body = (await req.json()) as { action?: string; granted?: unknown };
  } catch {
    return NextResponse.json({ error: "invalid_body" }, { status: 400 });
  }

  if (body.action !== "testimonial_consent") {
    return NextResponse.json({ error: "invalid_action" }, { status: 400 });
  }

  try {
    const checkin = await setCheckinTestimonialConsent(id, body.granted === true);
    if (!checkin) {
      return NextResponse.json({ error: "not_found" }, { status: 404 });
    }
    return NextResponse.json({ checkin });
  } catch {
    return NextResponse.json({ error: "update_failed" }, { status: 500 });
  }
}
