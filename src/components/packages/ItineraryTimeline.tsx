"use client";

import { useState } from "react";
import { MapPin } from "lucide-react";
import type { ItineraryDay } from "@/lib/types";
import { useT, useL } from "@/lib/i18n";
import packagesDict from "@/lib/i18n/dictionaries/packages";

/* ============================================================
 * ItineraryTimeline — segmented day selector plus a vertical
 * timeline of items (time, activity, partner caption) with a
 * thin teal line and gold dots.
 * ============================================================ */

export function ItineraryTimeline({ days }: { days: ItineraryDay[] }) {
  const t = useT(packagesDict).detail;
  const l = useL();
  const [active, setActive] = useState(0);

  if (days.length === 0) return null;
  const day = days[Math.min(active, days.length - 1)];

  return (
    <div>
      {/* Segmented control */}
      {days.length > 1 && (
        <div className="no-scrollbar -mx-1 mb-6 flex gap-2 overflow-x-auto px-1">
          {days.map((d, i) => (
            <button
              key={d.day}
              type="button"
              onClick={() => setActive(i)}
              aria-pressed={i === active}
              className={`shrink-0 rounded-full px-4 py-2 text-xs font-medium tracking-wide transition-all ${
                i === active
                  ? "bg-teal-700 text-cream-50 shadow-soft"
                  : "border border-teal-900/10 bg-white text-teal-700 hover:border-teal-700/40"
              }`}
            >
              {t.dayLabel} {d.day}
            </button>
          ))}
        </div>
      )}

      {/* Day title */}
      <p className="mb-5 font-display text-xl font-semibold text-teal-900">
        {l(day.title)}
      </p>

      {/* Vertical timeline */}
      <ol className="relative space-y-6 border-l border-teal-700/20 pl-6">
        {day.items.map((item, i) => (
          <li key={i} className="relative">
            <span className="absolute -left-[1.95rem] top-1.5 h-2.5 w-2.5 rounded-full border-2 border-cream-100 bg-gold-500" />
            <p className="text-xs font-semibold tracking-wide text-gold-600">
              {item.time}
            </p>
            <p className="mt-1 text-sm leading-relaxed text-ink">
              {l(item.activity)}
            </p>
            {item.partner && (
              <p className="mt-1.5 inline-flex items-center gap-1 text-xs text-ink-faint">
                <MapPin className="h-3 w-3" />
                {item.partner}
              </p>
            )}
          </li>
        ))}
      </ol>
    </div>
  );
}
