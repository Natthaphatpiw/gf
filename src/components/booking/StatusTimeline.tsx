"use client";

import { Check } from "lucide-react";
import type { Booking, BookingStatus } from "@/lib/types";
import { useLocale, useT } from "@/lib/i18n";
import common from "@/lib/i18n/dictionaries/common";
import booking from "@/lib/i18n/dictionaries/booking";

/* ============================================================
 * StatusTimeline — vertical, mobile-first process view.
 * Steps depend on whether expert consultation was requested.
 * ============================================================ */

const ORDER: BookingStatus[] = [
  "booked",
  "expert_review",
  "processing",
  "contacted",
  "completed",
];

export function StatusTimeline({ data }: { data: Booking }) {
  const tc = useT(common);
  const t = useT(booking);
  const { locale } = useLocale();
  const dateLocale = locale === "th" ? "th-TH" : "en-GB";

  const steps: BookingStatus[] = data.consultRequested
    ? ORDER
    : ORDER.filter((s) => s !== "expert_review");

  const currentIndex = steps.indexOf(data.status);

  const timeFor = (status: BookingStatus): string | null => {
    const entry = data.statusHistory.find((h) => h.status === status);
    if (!entry) return null;
    return new Date(entry.at).toLocaleDateString(dateLocale, {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div>
      <p className="eyebrow text-ink-faint">{t.track.timelineTitle}</p>
      <ol className="mt-4">
        {steps.map((step, i) => {
          const isDone = i < currentIndex;
          const isCurrent = i === currentIndex;
          const isLast = i === steps.length - 1;
          const at = timeFor(step);

          return (
            <li key={step} className="flex gap-4">
              {/* node + connector */}
              <div className="flex flex-col items-center">
                <span
                  className={`grid h-9 w-9 shrink-0 place-items-center rounded-full transition-colors ${
                    isDone
                      ? "bg-teal-700 text-cream-50"
                      : isCurrent
                        ? "bg-teal-50 ring-2 ring-teal-600"
                        : "bg-cream-200 text-ink-faint"
                  }`}
                >
                  {isDone ? (
                    <Check className="h-4 w-4" />
                  ) : isCurrent ? (
                    <span className="animate-breathe h-2.5 w-2.5 rounded-full bg-teal-600" />
                  ) : (
                    <span className="h-2 w-2 rounded-full bg-ink-faint/40" />
                  )}
                </span>
                {!isLast && (
                  <span
                    className={`my-1 w-px flex-1 ${
                      isDone ? "bg-teal-600/40" : "bg-teal-900/10"
                    }`}
                  />
                )}
              </div>

              {/* label + description */}
              <div className={`pb-7 ${isLast ? "pb-0" : ""}`}>
                <div className="flex flex-wrap items-baseline gap-x-2.5">
                  <p
                    className={`text-sm font-semibold ${
                      isDone || isCurrent ? "text-teal-900" : "text-ink-faint"
                    }`}
                  >
                    {tc.status[step]}
                  </p>
                  {at && (
                    <span className="text-[0.68rem] text-ink-faint">{at}</span>
                  )}
                </div>
                <p
                  className={`mt-1 text-xs leading-relaxed ${
                    isCurrent
                      ? "text-ink-soft"
                      : isDone
                        ? "text-ink-soft/80"
                        : "text-ink-faint"
                  }`}
                >
                  {t.track.stepDesc[step]}
                </p>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
