"use client";

import { Clock, MapPin } from "lucide-react";
import { useL, useT } from "@/lib/i18n";
import expert from "@/lib/i18n/dictionaries/expert";
import common from "@/lib/i18n/dictionaries/common";
import { TierBadge, formatPrice } from "@/components/packages/PackageCard";
import type { WellnessPackage } from "@/lib/types";

/* ============================================================
 * PackageItinerary — the full current itinerary of the booked
 * package, day by day, every item with time / activity / partner.
 * ============================================================ */

export function PackageItinerary({ pkg }: { pkg: WellnessPackage | null }) {
  const t = useT(expert).bench.pkg;
  const c = useT(common);
  const l = useL();

  if (!pkg) {
    return (
      <div className="rounded-2xl border border-teal-900/10 bg-cream-50 p-4 text-sm italic text-ink-faint">
        {t.none}
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-teal-900/10 bg-white shadow-soft">
      {/* package header */}
      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-teal-900/10 bg-cream-50 p-4">
        <div className="min-w-0">
          <div className="mb-1.5">
            <TierBadge tier={pkg.tier} />
          </div>
          <h3 className="font-display text-xl font-semibold leading-snug text-teal-900">
            {l(pkg.name)}
          </h3>
          <p className="mt-1 text-xs leading-relaxed text-ink-soft">
            {l(pkg.tagline)}
          </p>
        </div>
        <div className="shrink-0 text-right">
          <p className="font-display text-lg font-bold text-teal-800">
            {formatPrice(pkg.price)}
          </p>
          <p className="text-[0.62rem] text-ink-faint">
            {c.units.baht} / {c.units.perPerson}
          </p>
          <p className="mt-1 text-[0.65rem] text-ink-faint">
            {pkg.days} {pkg.days === 1 ? c.units.day : c.units.days}
            {pkg.nights > 0 && (
              <>
                {" · "}
                {pkg.nights} {pkg.nights === 1 ? c.units.night : c.units.nights}
              </>
            )}
          </p>
        </div>
      </div>

      {/* itinerary */}
      <div className="divide-y divide-teal-900/10">
        {pkg.itinerary.map((day) => (
          <div key={day.day} className="p-4">
            <div className="mb-3 flex items-baseline gap-2">
              <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-teal-800 text-[0.62rem] font-bold text-cream-50">
                {day.day}
              </span>
              <h4 className="font-display text-base font-semibold text-teal-900">
                {l(day.title)}
              </h4>
              <span className="text-[0.62rem] uppercase tracking-[0.12em] text-ink-faint">
                {t.day} {day.day}
              </span>
            </div>

            <ul className="space-y-3 border-l border-teal-900/10 pl-4">
              {day.items.map((item, i) => (
                <li key={i} className="relative">
                  <span className="absolute -left-[1.32rem] top-1.5 h-2 w-2 rounded-full border-2 border-white bg-teal-300" />
                  <div className="flex items-center gap-2 text-[0.68rem] font-semibold tracking-wide text-teal-700">
                    <Clock className="h-3 w-3" />
                    {item.time}
                  </div>
                  <p className="mt-0.5 text-sm leading-relaxed text-ink">
                    {l(item.activity)}
                  </p>
                  {item.partner && (
                    <p className="mt-0.5 flex items-center gap-1 text-[0.68rem] text-ink-faint">
                      <MapPin className="h-3 w-3" />
                      {item.partner}
                    </p>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
