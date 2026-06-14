"use client";

import { CONSULT_STATUS_LABEL, type ConsultStatus } from "@/lib/consultation";
import { useL } from "@/lib/i18n";

const TONE: Record<ConsultStatus, string> = {
  awaiting_deposit: "bg-gold-100 text-gold-600",
  awaiting_expert: "bg-gold-100 text-gold-600",
  expert_processing: "bg-teal-50 text-teal-700",
  awaiting_customer: "bg-gold-100 text-gold-600",
  coordinating_partner: "bg-teal-50 text-teal-700",
  payment: "bg-gold-100 text-gold-600",
  trip_started: "bg-teal-100 text-teal-800",
  in_progress: "bg-teal-100 text-teal-800",
  completed: "bg-teal-700 text-cream-50",
  awaiting_feedback: "bg-sage-200 text-teal-800",
  cancelled: "bg-cream-200 text-ink-faint",
};

export function StatusBadge({ status }: { status: ConsultStatus }) {
  const l = useL();
  return (
    <span
      className={`inline-block rounded-full px-2.5 py-0.5 text-[0.66rem] font-semibold ${TONE[status]}`}
    >
      {l(CONSULT_STATUS_LABEL[status])}
    </span>
  );
}
