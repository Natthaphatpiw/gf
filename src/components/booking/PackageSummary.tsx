"use client";

import Image from "next/image";
import { Clock } from "lucide-react";
import type { WellnessPackage } from "@/lib/types";
import { useL, useT } from "@/lib/i18n";
import common from "@/lib/i18n/dictionaries/common";
import { TierBadge, formatPrice } from "@/components/packages/PackageCard";

/* ============================================================
 * PackageSummary — compact horizontal package card with image
 * thumb, name, tier, duration and price. Shared by the booking
 * form, tracking header and bookings list.
 * ============================================================ */

export function PackageSummary({
  pkg,
  children,
}: {
  pkg: WellnessPackage;
  /** Optional trailing slot (e.g. consult pill). */
  children?: React.ReactNode;
}) {
  const t = useT(common);
  const l = useL();

  return (
    <div className="rounded-3xl border border-teal-900/10 bg-white p-3 shadow-soft">
      <div className="flex gap-4">
        <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-2xl sm:h-28 sm:w-28">
          <Image
            src={pkg.image}
            alt={l(pkg.name)}
            fill
            sizes="120px"
            className="object-cover"
          />
        </div>
        <div className="min-w-0 flex-1 py-1">
          <TierBadge tier={pkg.tier} />
          <h3 className="font-display mt-1.5 text-lg font-semibold leading-snug text-teal-900">
            {l(pkg.name)}
          </h3>
          <div className="mt-1 flex items-center gap-1.5 text-[0.68rem] font-medium text-ink-faint">
            <Clock className="h-3.5 w-3.5" />
            <span>
              {pkg.days} {pkg.days === 1 ? t.units.day : t.units.days}
              {pkg.nights > 0 && (
                <>
                  {" · "}
                  {pkg.nights} {pkg.nights === 1 ? t.units.night : t.units.nights}
                </>
              )}
            </span>
          </div>
          <p className="mt-1.5 text-ink">
            <span className="font-display text-base font-bold text-teal-800">
              {formatPrice(pkg.price)}
            </span>{" "}
            <span className="text-[0.65rem] text-ink-faint">
              {t.units.baht} / {t.units.perPerson}
            </span>
          </p>
        </div>
      </div>
      {children}
    </div>
  );
}
