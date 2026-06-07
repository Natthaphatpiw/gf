import { NextResponse } from "next/server";
import type {
  Booking,
  CustomerInfo,
  FamilyMember,
} from "@/lib/types";
import { getPackage } from "@/data/packages";
import { getBookingsByEmail, newBookingId, saveBooking } from "@/lib/store";

/* ============================================================
 * POST /api/bookings   — create a booking
 * GET  /api/bookings?email=...   — list a guest's bookings
 * ============================================================ */

interface CreateBody {
  packageId?: string;
  customer?: Partial<CustomerInfo>;
  assessmentId?: string;
  isFamily?: boolean;
  familySize?: number;
  familyMembers?: FamilyMember[];
  consultRequested?: boolean;
  consent?: boolean;
}

function isNonEmpty(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

export async function POST(req: Request) {
  let body: CreateBody;
  try {
    body = (await req.json()) as CreateBody;
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  // PDPA: consent is mandatory.
  if (body.consent !== true) {
    return NextResponse.json(
      { error: "Consent is required" },
      { status: 400 },
    );
  }

  // Package must exist.
  if (!isNonEmpty(body.packageId) || !getPackage(body.packageId)) {
    return NextResponse.json(
      { error: "Unknown package" },
      { status: 400 },
    );
  }

  // Required customer fields.
  const c = body.customer ?? {};
  if (
    !isNonEmpty(c.firstName) ||
    !isNonEmpty(c.lastName) ||
    !isNonEmpty(c.phone) ||
    !isNonEmpty(c.email)
  ) {
    return NextResponse.json(
      { error: "Missing customer details" },
      { status: 400 },
    );
  }

  const isFamily = body.isFamily === true;
  const familyMembers = isFamily
    ? (body.familyMembers ?? [])
        .filter((m) => m && (isNonEmpty(m.assessmentId) || isNonEmpty(m.label)))
        .map((m) => ({
          assessmentId: (m.assessmentId ?? "").trim().toUpperCase(),
          label: isNonEmpty(m.label) ? m.label.trim() : undefined,
        }))
    : undefined;

  const familySize =
    isFamily && typeof body.familySize === "number"
      ? Math.min(8, Math.max(2, Math.round(body.familySize)))
      : undefined;

  const now = new Date().toISOString();
  const booking: Booking = {
    id: newBookingId(),
    packageId: body.packageId,
    customer: {
      firstName: c.firstName.trim(),
      lastName: c.lastName.trim(),
      phone: c.phone.trim(),
      email: c.email.trim().toLowerCase(),
    },
    assessmentId: isNonEmpty(body.assessmentId)
      ? body.assessmentId.trim().toUpperCase()
      : undefined,
    isFamily,
    familySize,
    familyMembers,
    consultRequested: body.consultRequested === true,
    status: "booked",
    statusHistory: [{ status: "booked", at: now }],
    consent: true,
    createdAt: now,
    updatedAt: now,
  };

  try {
    await saveBooking(booking);
  } catch {
    return NextResponse.json(
      { error: "Could not save booking" },
      { status: 500 },
    );
  }

  return NextResponse.json({ booking }, { status: 201 });
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const email = searchParams.get("email");
  if (!isNonEmpty(email)) {
    return NextResponse.json({ bookings: [] });
  }
  try {
    const bookings = await getBookingsByEmail(email);
    return NextResponse.json({ bookings });
  } catch {
    return NextResponse.json(
      { error: "Lookup failed", bookings: [] },
      { status: 500 },
    );
  }
}
