"use client";

import Image from "next/image";
import Link from "next/link";
import { Clock, Sparkles, Star } from "lucide-react";
import type { LText, WellnessPackage } from "@/lib/types";
import { useL, useT } from "@/lib/i18n";
import common from "@/lib/i18n/dictionaries/common";
import packagesDict from "@/lib/i18n/dictionaries/packages";
import { packageMeta, packageInside } from "@/lib/packageMeta";
import {
  TierBadge,
  FavoriteButton,
  CartButton,
  formatPrice,
} from "@/components/packages/PackageCard";

/* ============================================================
 * RecommendationCard — the rich result card on the curation
 * page: image, launch discount, star rating, "what's inside"
 * chips, struck-through price. The AI's top pick per tier (hero)
 * gets a ribbon, a gold ring and a wider, horizontal layout.
 * ============================================================ */

const MAX_CHIPS = 4;

export function RecommendationCard({
  pkg,
  reason,
  matchScore,
  hero = false,
}: {
  pkg: WellnessPackage;
  reason?: LText;
  matchScore?: number;
  hero?: boolean;
}) {
  const t = useT(common);
  const tc = useT(packagesDict).curate;
  const l = useL();

  const meta = packageMeta(pkg);
  const inside = packageInside(pkg);
  const chips = inside.slice(0, MAX_CHIPS);
  const moreCount = inside.length - chips.length;

  const Media = (
    <div className={`relative overflow-hidden ${hero ? "aspect-[16/10] sm:h-full sm:aspect-auto" : "aspect-[4/3]"}`}>
      <Image
        src={pkg.image}
        alt={l(pkg.name)}
        fill
        sizes={hero ? "(max-width: 640px) 100vw, 40vw" : "(max-width: 768px) 100vw, 33vw"}
        className="object-cover transition-transform duration-700 group-hover:scale-105"
      />
      <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/35 to-transparent" />
      <div className="absolute left-3 top-3">
        <TierBadge tier={pkg.tier} />
      </div>
      {meta.discountPct > 0 && (
        <span
          className="absolute right-3 top-3 rounded-full px-2.5 py-1 text-[0.62rem] font-bold tracking-wide text-white shadow-soft"
          style={{ backgroundColor: "#d6447a" }}
        >
          {tc.discountBadge.replace("{n}", String(meta.discountPct))}
        </span>
      )}
      <div className="absolute bottom-3 right-3 flex gap-2">
        <FavoriteButton packageId={pkg.id} />
        <CartButton packageId={pkg.id} />
      </div>
      {typeof matchScore === "number" && (
        <span className="absolute bottom-3 left-3 rounded-full bg-cream-50/90 px-2.5 py-1 text-[0.62rem] font-bold tracking-wide text-teal-800 backdrop-blur">
          {matchScore}% {t.match}
        </span>
      )}
    </div>
  );

  const Body = (
    <div className="flex flex-1 flex-col gap-2.5 p-5">
      {/* rating + duration */}
      <div className="flex items-center justify-between gap-2 text-[0.7rem] text-ink-faint">
        <span className="inline-flex items-center gap-1 rounded-full bg-gold-100 px-2 py-0.5 font-semibold text-gold-600">
          <Star className="h-3 w-3 fill-current" />
          {meta.rating.toFixed(1)}
          <span className="font-normal text-ink-faint">({meta.reviews})</span>
        </span>
        <span className="inline-flex items-center gap-1 font-medium">
          <Clock className="h-3.5 w-3.5" />
          {pkg.days} {pkg.days === 1 ? t.units.day : t.units.days}
          {pkg.nights > 0 && (
            <>
              {" · "}
              {pkg.nights} {pkg.nights === 1 ? t.units.night : t.units.nights}
            </>
          )}
        </span>
      </div>

      <h3 className="font-display text-xl font-semibold leading-snug text-teal-900">
        {l(pkg.name)}
      </h3>
      <p className="line-clamp-2 text-xs leading-relaxed text-ink-soft">
        {l(pkg.tagline)}
      </p>

      {reason && (
        <p className="line-clamp-3 rounded-xl bg-teal-50 px-3 py-2.5 text-xs leading-relaxed text-teal-800">
          {l(reason)}
        </p>
      )}

      {/* what's inside */}
      {chips.length > 0 && (
        <div>
          <p className="text-[0.62rem] font-semibold uppercase tracking-[0.12em] text-ink-faint">
            {tc.inside}
          </p>
          <div className="mt-1.5 flex flex-wrap gap-1.5">
            {chips.map((c, i) => (
              <span
                key={i}
                className="rounded-full bg-cream-100 px-2.5 py-1 text-[0.7rem] font-medium text-teal-800"
              >
                {l(c)}
              </span>
            ))}
            {moreCount > 0 && (
              <span className="rounded-full bg-cream-100 px-2.5 py-1 text-[0.7rem] font-medium text-ink-faint">
                {tc.more.replace("{n}", String(moreCount))}
              </span>
            )}
          </div>
        </div>
      )}

      {/* price + cta */}
      <div className="mt-auto flex items-end justify-between gap-2 pt-2">
        <div>
          {meta.originalPrice > pkg.price && (
            <span className="mr-1.5 text-[0.72rem] text-ink-faint line-through">
              {formatPrice(meta.originalPrice)}
            </span>
          )}
          <span className="font-display text-xl font-bold text-teal-800">
            ฿{formatPrice(pkg.price)}
          </span>
          <span className="ml-1 text-[0.62rem] text-ink-faint">{tc.perPerson}</span>
        </div>
        <span className="text-[0.7rem] font-semibold tracking-wide text-gold-600 transition-transform duration-300 group-hover:translate-x-0.5">
          {t.actions.seeDetail} →
        </span>
      </div>
    </div>
  );

  return (
    <Link
      href={`/packages/${pkg.id}`}
      className={`group relative flex flex-col overflow-hidden rounded-3xl bg-white transition-all duration-500 hover:-translate-y-1 hover:shadow-lift ${
        hero
          ? "shadow-lift ring-2 ring-gold-400 sm:flex-row"
          : "shadow-soft"
      }`}
    >
      {hero && (
        <span className="absolute -top-px left-1/2 z-10 inline-flex -translate-x-1/2 items-center gap-1 rounded-b-full bg-gold-500 px-4 py-1 text-[0.66rem] font-bold tracking-wide text-white shadow-soft">
          <Sparkles className="h-3.5 w-3.5" />
          {tc.heroBadge}
        </span>
      )}
      <div className={hero ? "sm:w-2/5" : ""}>{Media}</div>
      {Body}
    </Link>
  );
}
