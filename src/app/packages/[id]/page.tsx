"use client";

import { use } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Check,
  Clock,
  Info,
  MapPin,
  PackageOpen,
  Utensils,
} from "lucide-react";
import type { PackageCareDetails, PackageMeal } from "@/lib/types";
import { useT, useL } from "@/lib/i18n";
import packagesDict from "@/lib/i18n/dictionaries/packages";
import common from "@/lib/i18n/dictionaries/common";
import { getPackage, getPackageCareDetails } from "@/data/packages";
import { ButtonLink } from "@/components/ui/Button";
import {
  TierBadge,
  FavoriteButton,
  formatPrice,
} from "@/components/packages/PackageCard";
import { ConsultToggle } from "@/components/packages/ConsultToggle";
import { ConsultButton } from "@/components/consult/ConsultButton";
import { BookPackageButton } from "@/components/packages/BookPackageButton";
import { ItineraryTimeline } from "@/components/packages/ItineraryTimeline";

/* ============================================================
 * /packages/[id] — immersive package detail.
 * ============================================================ */

export default function PackageDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const t = useT(packagesDict).detail;
  const c = useT(common);
  const l = useL();
  const router = useRouter();

  const pkg = getPackage(id);
  const careDetails = getPackageCareDetails(id);

  /* ---- Not found ---- */
  if (!pkg) {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center px-4 py-24 text-center">
        <span className="grid h-16 w-16 place-items-center rounded-full bg-teal-50 text-teal-700">
          <PackageOpen className="h-7 w-7" />
        </span>
        <h1 className="mt-5 font-display text-2xl font-semibold text-teal-900">
          {t.notFoundTitle}
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-ink-soft">
          {t.notFoundBody}
        </p>
        <div className="mt-6">
          <ButtonLink href="/packages" variant="primary" size="md">
            {t.notFoundCta}
          </ButtonLink>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-28 md:pb-12">
      {/* ---- Hero ---- */}
      <div className="relative aspect-[16/10] w-full overflow-hidden md:aspect-[21/9]">
        <Image
          src={pkg.image}
          alt={l(pkg.name)}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/5 to-black/25" />

        {/* Back button */}
        <button
          type="button"
          onClick={() => router.back()}
          aria-label={t.back}
          className="absolute left-4 top-4 grid h-10 w-10 place-items-center rounded-full bg-cream-50/90 text-teal-800 shadow-soft backdrop-blur transition-transform active:scale-90 md:left-6 md:top-6"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>

        {/* Tier + favourite */}
        <div className="absolute right-4 top-4 flex items-center gap-2 md:right-6 md:top-6">
          <TierBadge tier={pkg.tier} />
          <FavoriteButton packageId={pkg.id} />
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-4 md:px-6">
        {/* ---- Title block ---- */}
        <div className="animate-rise -mt-10 rounded-3xl border border-teal-900/10 bg-white p-6 shadow-lift md:-mt-14 md:p-8">
          <h1 className="font-display text-3xl font-semibold leading-tight text-teal-900 md:text-4xl">
            {l(pkg.name)}
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-ink-soft md:text-base">
            {l(pkg.tagline)}
          </p>
          <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-teal-900/10 pt-4">
            <span className="inline-flex items-center gap-2 text-sm font-medium text-ink-soft">
              <Clock className="h-4 w-4 text-teal-600" />
              {pkg.days} {pkg.days === 1 ? c.units.day : c.units.days}
              {pkg.nights > 0 && (
                <>
                  {" · "}
                  {pkg.nights} {pkg.nights === 1 ? c.units.night : c.units.nights}
                </>
              )}
            </span>
            <p>
              <span className="font-display text-2xl font-bold text-teal-800">
                {formatPrice(pkg.price)}
              </span>{" "}
              <span className="text-xs text-ink-faint">
                {c.units.baht} / {c.units.perPerson}
              </span>
            </p>
          </div>
        </div>

        {/* ---- Highlights ---- */}
        <section className="animate-rise-1 mt-10">
          <p className="eyebrow">{t.highlights}</p>
          <ul className="mt-4 space-y-3">
            {pkg.highlights.map((h, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-teal-700/10 text-teal-700">
                  <Check className="h-3.5 w-3.5" />
                </span>
                <span className="text-sm leading-relaxed text-ink">
                  {l(h)}
                </span>
              </li>
            ))}
          </ul>
        </section>

        {/* ---- Partners ---- */}
        <section className="animate-rise-1 mt-10">
          <p className="eyebrow">{t.partners}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {pkg.partners.map((p) => (
              <span
                key={p}
                className="inline-flex items-center gap-1.5 rounded-full border border-teal-900/10 bg-white px-3.5 py-2 text-xs font-medium text-teal-800 shadow-soft"
              >
                <MapPin className="h-3.5 w-3.5 text-gold-500" />
                {p}
              </span>
            ))}
          </div>
        </section>

        {/* ---- Itinerary ---- */}
        <section className="animate-rise-2 mt-10">
          <p className="eyebrow mb-4">{t.itinerary}</p>
          <ItineraryTimeline days={pkg.itinerary} />
        </section>

        {/* ---- Food and nutrition ---- */}
        {careDetails && (
          <section className="animate-rise-2 mt-10">
            <NutritionSection details={careDetails} />
          </section>
        )}

        {/* ---- Made for ---- */}
        <section className="animate-rise-2 mt-10">
          <div className="rounded-3xl bg-sage-100 p-6 md:p-7">
            <p className="eyebrow text-teal-700">{t.madeForTitle}</p>
            <p className="mt-3 text-sm leading-relaxed text-teal-900 md:text-base">
              {l(pkg.suitableFor)}
            </p>
          </div>
        </section>

        {/* ---- Expert consult toggle ---- */}
        <section className="animate-rise-3 mt-10">
          <ConsultToggle packageId={pkg.id} />
          <div className="mt-4">
            <ConsultButton
              item={{
                itemType: "package",
                itemId: pkg.id,
                itemName: pkg.name,
                itemImage: pkg.image,
              }}
              className="w-full"
            />
          </div>
        </section>
      </div>

      {/* ---- Sticky bottom bar (above mobile tabs) ---- */}
      <div className="fixed inset-x-0 bottom-20 z-30 border-t border-teal-900/10 bg-cream-50/95 px-4 py-3 shadow-deep backdrop-blur md:bottom-0 md:px-6">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-4">
          <p className="leading-tight">
            <span className="font-display text-xl font-bold text-teal-800">
              {formatPrice(pkg.price)}
            </span>{" "}
            <span className="text-[0.65rem] text-ink-faint">
              {c.units.baht} / {c.units.perPerson}
            </span>
          </p>
          <BookPackageButton
            pkg={pkg}
            label={c.actions.bookNow}
            className="flex-1 sm:flex-none"
          />
        </div>
      </div>
    </div>
  );
}

function NutritionSection({ details }: { details: PackageCareDetails }) {
  const t = useT(packagesDict).detail;
  const l = useL();

  return (
    <div className="rounded-[2rem] border border-teal-900/10 bg-white p-5 shadow-soft md:p-7">
      <div className="flex items-start gap-3">
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-teal-50 text-teal-700">
          <Utensils className="h-5 w-5" strokeWidth={1.7} />
        </span>
        <div>
          <p className="eyebrow">{t.nutrition}</p>
          <p className="mt-2 text-sm leading-relaxed text-ink-soft">
            {t.nutritionIntro}
          </p>
        </div>
      </div>

      <div className="mt-6 grid gap-4">
        {details.meals.map((item) => (
          <MealCard key={item.id} item={item} />
        ))}
      </div>

      {details.notes.length > 0 && (
        <div className="mt-6 rounded-2xl bg-cream-50 p-4">
          <div className="flex items-center gap-2 text-teal-700">
            <Info className="h-4 w-4" />
            <p className="text-sm font-semibold">{t.careDetails}</p>
          </div>
          <ul className="mt-3 space-y-2.5">
            {details.notes.map((note, i) => (
              <li key={i} className="flex gap-2.5 text-sm leading-relaxed text-ink-soft">
                <Check className="mt-1 h-4 w-4 shrink-0 text-teal-700" />
                <span>{l(note)}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function MealCard({ item }: { item: PackageMeal }) {
  const t = useT(packagesDict).detail;
  const l = useL();
  const metrics = [
    { label: t.calories, value: item.nutrition.calories },
    { label: t.protein, value: item.nutrition.protein },
    { label: t.carbs, value: item.nutrition.carbs },
    { label: t.fiber, value: item.nutrition.fiber },
    ...(item.nutrition.sodium
      ? [{ label: t.sodium, value: item.nutrition.sodium }]
      : []),
  ];

  return (
    <article className="rounded-2xl border border-teal-900/10 bg-cream-50 p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h3 className="font-display text-xl font-semibold leading-snug text-teal-900">
            {l(item.name)}
          </h3>
          <p className="mt-1 text-xs font-semibold tracking-wide text-gold-600">
            {t.fromPartner} {item.partner}
          </p>
        </div>
        <p className="rounded-full bg-white px-3 py-1.5 text-xs font-medium text-teal-800 shadow-soft">
          {t.portion}: {l(item.portion)}
        </p>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-5">
        {metrics.map((metric) => (
          <div key={metric.label} className="rounded-xl bg-white px-3 py-2 shadow-soft">
            <p className="text-[0.68rem] font-semibold text-ink-faint">
              {metric.label}
            </p>
            <p className="mt-0.5 text-sm font-bold text-teal-900">
              {metric.value}
            </p>
          </div>
        ))}
      </div>

      <p className="mt-4 border-t border-teal-900/10 pt-3 text-sm leading-relaxed text-ink-soft">
        <span className="font-semibold text-teal-800">{t.wellnessNote}: </span>
        {l(item.wellnessNote)}
      </p>
    </article>
  );
}
