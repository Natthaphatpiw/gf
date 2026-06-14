"use client";

import Image from "next/image";
import Link from "next/link";
import { Check, Heart, Clock, ShoppingBag } from "lucide-react";
import type { LText, WellnessPackage } from "@/lib/types";
import { useL, useT } from "@/lib/i18n";
import common from "@/lib/i18n/dictionaries/common";
import accountDict from "@/lib/i18n/dictionaries/account";
import { useAccount } from "@/lib/account";

/* ============================================================
 * PackageCard — the shared card used on the recommendation
 * grid, favourites page and landing highlights.
 * ============================================================ */

const TIER_STYLES: Record<WellnessPackage["tier"], string> = {
  basic: "bg-sage-100 text-teal-800",
  premium: "bg-gold-100 text-gold-600",
  deluxe: "bg-teal-800 text-gold-200",
};

export function TierBadge({ tier }: { tier: WellnessPackage["tier"] }) {
  const t = useT(common);
  return (
    <span
      className={`inline-block rounded-full px-3 py-1 text-[0.62rem] font-semibold uppercase tracking-[0.16em] ${TIER_STYLES[tier]}`}
    >
      {t.tier[tier]}
    </span>
  );
}

export function FavoriteButton({
  packageId,
  className = "",
}: {
  packageId: string;
  className?: string;
}) {
  const t = useT(common);
  const { isFavorite, toggleFavorite } = useAccount();
  const fav = isFavorite("program", packageId);

  return (
    <button
      type="button"
      aria-pressed={fav}
      aria-label={fav ? t.actions.unfavorite : t.actions.favorite}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleFavorite("program", packageId);
      }}
      className={`grid h-9 w-9 place-items-center rounded-full bg-cream-50/90 shadow-soft backdrop-blur transition-transform active:scale-90 ${className}`}
    >
      <Heart
        className={`h-[17px] w-[17px] transition-colors ${
          fav ? "fill-gold-500 text-gold-500" : "text-teal-800"
        }`}
      />
    </button>
  );
}

export function CartButton({
  packageId,
  className = "",
}: {
  packageId: string;
  className?: string;
}) {
  const ta = useT(accountDict);
  const { isInCart, addToCart } = useAccount();
  const inCart = isInCart("program", packageId);

  return (
    <button
      type="button"
      aria-label={inCart ? ta.item.inCart : ta.item.addToCart}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        addToCart("program", packageId);
      }}
      className={`grid h-9 w-9 place-items-center rounded-full shadow-soft backdrop-blur transition-transform active:scale-90 ${
        inCart ? "bg-teal-600 text-white" : "bg-cream-50/90 text-teal-800"
      } ${className}`}
    >
      {inCart ? (
        <Check className="h-[17px] w-[17px]" />
      ) : (
        <ShoppingBag className="h-[17px] w-[17px]" />
      )}
    </button>
  );
}

export function formatPrice(price: number): string {
  return price.toLocaleString("en-US");
}

export function PackageCard({
  pkg,
  reason,
  matchScore,
}: {
  pkg: WellnessPackage;
  /** Optional AI "why this fits you" line. */
  reason?: LText;
  matchScore?: number;
}) {
  const t = useT(common);
  const l = useL();

  return (
    <Link
      href={`/packages/${pkg.id}`}
      className="group block overflow-hidden rounded-3xl bg-white shadow-soft transition-all duration-500 hover:-translate-y-1 hover:shadow-lift"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={pkg.image}
          alt={l(pkg.name)}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/35 to-transparent" />
        <div className="absolute left-3 top-3">
          <TierBadge tier={pkg.tier} />
        </div>
        <div className="absolute right-3 top-3 flex flex-col gap-2">
          <FavoriteButton packageId={pkg.id} />
          <CartButton packageId={pkg.id} />
        </div>
        {typeof matchScore === "number" && (
          <span className="absolute bottom-3 left-3 rounded-full bg-cream-50/90 px-2.5 py-1 text-[0.62rem] font-bold tracking-wide text-teal-800 backdrop-blur">
            {matchScore}% {t.match}
          </span>
        )}
      </div>

      <div className="space-y-2.5 p-5">
        <div className="flex items-center gap-2 text-[0.68rem] font-medium tracking-wide text-ink-faint">
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
        <h3 className="font-display text-xl font-semibold leading-snug text-teal-900">
          {l(pkg.name)}
        </h3>
        <p className="line-clamp-2 text-xs leading-relaxed text-ink-soft">
          {l(pkg.tagline)}
        </p>
        {reason && (
          <p className="rounded-xl bg-teal-50 px-3 py-2.5 text-xs leading-relaxed text-teal-800">
            {l(reason)}
          </p>
        )}
        <div className="flex items-baseline justify-between pt-1">
          <p className="text-ink">
            <span className="font-display text-lg font-bold text-teal-800">
              {formatPrice(pkg.price)}
            </span>{" "}
            <span className="text-[0.65rem] text-ink-faint">
              {t.units.baht} / {t.units.perPerson}
            </span>
          </p>
          <span className="text-[0.7rem] font-semibold tracking-wide text-gold-600 transition-transform duration-300 group-hover:translate-x-0.5">
            {t.actions.seeDetail} →
          </span>
        </div>
      </div>
    </Link>
  );
}
