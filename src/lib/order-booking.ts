"use client";

/* ============================================================
 * Bridge: a package order (consultation) <-> a booking, so the
 * pre/post check-in + journey system (which is keyed by booking)
 * works from inside the order process. We create one booking per
 * order the first time the customer opens pre/post, and remember
 * the mapping in localStorage.
 * ============================================================ */

const KEY = "gc-order-bookings";

type OrderBookingMap = Record<string, string>; // orderId -> bookingId

function read(): OrderBookingMap {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(window.localStorage.getItem(KEY) ?? "{}") as OrderBookingMap;
  } catch {
    return {};
  }
}
function write(map: OrderBookingMap): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(map));
  } catch {
    /* ignore */
  }
}

export function getOrderBookingId(orderId: string): string | null {
  return read()[orderId.toUpperCase()] ?? null;
}

/** Ensure a booking exists for this order; returns its id (or null). */
export async function ensureOrderBooking(args: {
  orderId: string;
  packageId: string;
  assessmentId?: string;
  customer: { firstName: string; lastName: string; phone: string; email: string };
}): Promise<string | null> {
  const existing = getOrderBookingId(args.orderId);
  if (existing) return existing;
  try {
    const res = await fetch("/api/bookings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        packageId: args.packageId,
        consent: true,
        assessmentId: args.assessmentId,
        customer: args.customer,
      }),
    });
    if (!res.ok) return null;
    const bookingId = (await res.json())?.booking?.id as string | undefined;
    if (!bookingId) return null;
    const map = read();
    map[args.orderId.toUpperCase()] = bookingId;
    write(map);
    return bookingId;
  } catch {
    return null;
  }
}
