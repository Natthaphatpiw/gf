import { use } from "react";
import { CheckinFlow } from "@/components/checkin/CheckinFlow";

/* ============================================================
 * /checkin/[bookingId] — the T1/T2 compass check-in flow.
 * The timepoint is inferred from what already exists:
 * no T1 yet -> T1; T1 only -> T2; both -> result links.
 * ============================================================ */

export default function CheckinPage({
  params,
}: {
  params: Promise<{ bookingId: string }>;
}) {
  const { bookingId } = use(params);
  return <CheckinFlow bookingId={bookingId.toUpperCase()} />;
}
