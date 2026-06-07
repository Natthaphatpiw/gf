import { NextResponse } from "next/server";
import { getBooking, updateBooking } from "@/lib/store";
import { isAuthorizedExpert } from "@/components/expert/auth";
import type {
  Booking,
  BookingStatus,
  ExpertAdjustment,
  ExpertReview,
} from "@/lib/types";

/* ============================================================
 * POST /api/expert/review
 *   body: { bookingId, action, review?, status? }
 *
 *   action 'send'       -> store ExpertReview{approved:false}, keep
 *                          / set status 'expert_review', append note.
 *   action 'approve'    -> expertReview.approved = true, advance
 *                          'expert_review' -> 'processing'.
 *   action 'set_status' -> move status forward along the valid chain.
 *
 *   -> { booking }
 * ============================================================ */

export const dynamic = "force-dynamic";

const VALID_STATUSES: BookingStatus[] = [
  "booked",
  "expert_review",
  "processing",
  "contacted",
  "completed",
];

interface ReviewPayload {
  expertName?: string;
  role?: string;
  comment?: string;
  adjustments?: ExpertAdjustment[];
}

interface ReviewBody {
  bookingId?: string;
  action?: "send" | "approve" | "set_status";
  review?: ReviewPayload;
  status?: BookingStatus;
}

function sanitizeAdjustments(input: unknown): ExpertAdjustment[] {
  if (!Array.isArray(input)) return [];
  return input
    .map((row) => {
      const r = (row ?? {}) as Record<string, unknown>;
      return {
        target: String(r.target ?? ""),
        original: String(r.original ?? ""),
        replacement: String(r.replacement ?? ""),
        reason: String(r.reason ?? ""),
      };
    })
    .filter((a) => a.replacement.trim() || a.reason.trim() || a.original.trim());
}

function pushHistory(booking: Booking, status: BookingStatus, note: string) {
  booking.statusHistory = [
    ...(booking.statusHistory ?? []),
    { status, at: new Date().toISOString(), note },
  ];
}

export async function POST(req: Request) {
  if (!isAuthorizedExpert(req)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  let body: ReviewBody;
  try {
    body = (await req.json()) as ReviewBody;
  } catch {
    return NextResponse.json({ error: "bad_request" }, { status: 400 });
  }

  const { bookingId, action } = body;

  if (!bookingId || !action || !["send", "approve", "set_status"].includes(action)) {
    return NextResponse.json({ error: "invalid_action" }, { status: 400 });
  }

  let booking: Booking | null;
  try {
    booking = await getBooking(bookingId);
  } catch {
    return NextResponse.json({ error: "lookup_failed" }, { status: 500 });
  }
  if (!booking) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }

  const now = new Date().toISOString();

  if (action === "send" || action === "approve") {
    const payload = body.review ?? {};
    const expertName = String(payload.expertName ?? "").trim();
    const role = String(payload.role ?? "").trim();
    const comment = String(payload.comment ?? "").trim();
    const adjustments = sanitizeAdjustments(payload.adjustments);

    const existing = booking.expertReview;
    const review: ExpertReview = {
      expertName: expertName || existing?.expertName || "",
      comment: comment || existing?.comment || "",
      adjustments: adjustments.length ? adjustments : existing?.adjustments ?? [],
      approved: action === "approve" ? true : existing?.approved ?? false,
      reviewedAt: now,
      customerAccepted: existing?.customerAccepted,
    };
    // Carry the role into the stored name when provided, so downstream
    // pages can render "Name · Role" without a schema change.
    if (role) {
      review.expertName = expertName
        ? `${expertName} · ${role}`
        : existing?.expertName || role;
    }
    booking.expertReview = review;

    if (action === "send") {
      if (booking.status === "booked") {
        booking.status = "expert_review";
      }
      pushHistory(
        booking,
        booking.status,
        review.approved ? "Expert guidance updated" : "Expert sent guidance",
      );
    } else {
      // approve
      review.approved = true;
      if (booking.status === "expert_review" || booking.status === "booked") {
        booking.status = "processing";
      }
      pushHistory(booking, booking.status, "Expert approved");
    }
  } else {
    // set_status
    const next = body.status;
    if (!next || !VALID_STATUSES.includes(next)) {
      return NextResponse.json({ error: "invalid_status" }, { status: 400 });
    }
    booking.status = next;
    pushHistory(booking, next, "Status updated by expert console");
  }

  try {
    await updateBooking(booking);
  } catch {
    return NextResponse.json({ error: "update_failed" }, { status: 500 });
  }

  return NextResponse.json({ booking });
}
