import { use } from "react";
import { CheckinResult } from "@/components/checkin/CheckinResult";

/* ============================================================
 * /checkin/result/[id] — one check-in's before/after card.
 * ============================================================ */

export default function CheckinResultPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  return <CheckinResult checkinId={id.toUpperCase()} />;
}
