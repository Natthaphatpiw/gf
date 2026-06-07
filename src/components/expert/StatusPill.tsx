"use client";

import { useT } from "@/lib/i18n";
import common from "@/lib/i18n/dictionaries/common";
import type { BookingStatus } from "@/lib/types";

/* ============================================================
 * StatusPill — compact booking status chip, tuned for the
 * denser expert console.
 * ============================================================ */

const STYLES: Record<BookingStatus, string> = {
  booked: "bg-sage-100 text-teal-800",
  expert_review: "bg-gold-100 text-gold-600",
  processing: "bg-teal-100 text-teal-700",
  contacted: "bg-teal-50 text-teal-600",
  completed: "bg-teal-800 text-cream-50",
};

export function StatusPill({ status }: { status: BookingStatus }) {
  const t = useT(common);
  return (
    <span
      className={`inline-block rounded-full px-2.5 py-1 text-[0.6rem] font-semibold uppercase tracking-[0.12em] ${STYLES[status]}`}
    >
      {t.status[status]}
    </span>
  );
}
