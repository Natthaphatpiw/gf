"use client";

import { use } from "react";
import { ExpertGate } from "@/components/expert/ExpertGate";
import { Workbench } from "@/components/expert/Workbench";

/* ============================================================
 * /expert/[bookingId] — the review workbench for one booking.
 * ============================================================ */

export default function ExpertBookingPage({
  params,
}: {
  params: Promise<{ bookingId: string }>;
}) {
  const { bookingId } = use(params);
  return (
    <ExpertGate>
      <Workbench bookingId={bookingId} />
    </ExpertGate>
  );
}
