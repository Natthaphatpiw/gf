"use client";

import type { BookingStatus } from "@/lib/types";
import { useT } from "@/lib/i18n";
import common from "@/lib/i18n/dictionaries/common";

/* ============================================================
 * StatusPill — small coloured label for a booking status.
 * Colour map per spec: booked=sage, expert_review=gold,
 * processing=teal-300, contacted=teal-600, completed=teal-800.
 * ============================================================ */

const STATUS_STYLES: Record<BookingStatus, string> = {
  booked: "bg-sage-100 text-teal-800",
  expert_review: "bg-gold-100 text-gold-600",
  processing: "bg-teal-100 text-teal-700",
  contacted: "bg-teal-600 text-cream-50",
  completed: "bg-teal-800 text-gold-200",
};

export function StatusPill({ status }: { status: BookingStatus }) {
  const t = useT(common);
  return (
    <span
      className={`inline-block rounded-full px-3 py-1 text-[0.62rem] font-semibold uppercase tracking-[0.14em] ${STATUS_STYLES[status]}`}
    >
      {t.status[status]}
    </span>
  );
}
