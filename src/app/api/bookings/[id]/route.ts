import { NextResponse } from "next/server";
import { getBooking, updateBooking } from "@/lib/store";

/* ============================================================
 * GET   /api/bookings/[id]   — single booking
 * PATCH /api/bookings/[id]   — guest accepts expert adjustments
 * ============================================================ */

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  let booking;
  try {
    booking = await getBooking(id.trim().toUpperCase());
  } catch {
    return NextResponse.json({ error: "Lookup failed" }, { status: 500 });
  }
  if (!booking) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json({ booking });
}

interface PatchBody {
  action?: string;
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  let body: PatchBody;
  try {
    body = (await req.json()) as PatchBody;
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  if (body.action !== "accept_adjustments") {
    return NextResponse.json(
      { error: "Unsupported action" },
      { status: 400 },
    );
  }

  let booking;
  try {
    booking = await getBooking(id.trim().toUpperCase());
  } catch {
    return NextResponse.json({ error: "Lookup failed" }, { status: 500 });
  }
  if (!booking) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  if (!booking.expertReview) {
    return NextResponse.json(
      { error: "No expert review to accept" },
      { status: 400 },
    );
  }

  booking.expertReview = {
    ...booking.expertReview,
    customerAccepted: true,
  };

  try {
    await updateBooking(booking);
  } catch {
    return NextResponse.json(
      { error: "Could not update booking" },
      { status: 500 },
    );
  }

  return NextResponse.json({ booking });
}
