import { use } from "react";
import { JourneyClient } from "@/components/outcome/JourneyClient";

/* ============================================================
 * /journey/[bookingId] — the consolidated pre/post program
 * journey: baseline → after → 30-day, a shareable card and the
 * 30-day self-care plan.
 * ============================================================ */

export default function JourneyPage({
  params,
}: {
  params: Promise<{ bookingId: string }>;
}) {
  const { bookingId } = use(params);
  return <JourneyClient bookingId={bookingId.toUpperCase()} />;
}
