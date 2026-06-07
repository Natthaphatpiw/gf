import { use } from "react";
import { BookingTracker } from "@/components/booking/BookingTracker";

/* ============================================================
 * /bookings/[id] — status tracking page.
 * ============================================================ */

export default function BookingTrackPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  return <BookingTracker id={id} />;
}
