"use client";

import { ArrowRight } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";
import { PackageCard } from "@/components/packages/PackageCard";
import { getPackage } from "@/data/packages";
import { useT } from "@/lib/i18n";
import landing from "@/lib/i18n/dictionaries/landing";

/* ============================================================
 * Featured — one journey per tier, shared PackageCard.
 * ============================================================ */

const FEATURED_IDS = [
  "samui-reset",
  "deep-sleep-sanctuary",
  "samui-recharge",
];

export function Featured() {
  const t = useT(landing).featured;
  const packages = FEATURED_IDS.map(getPackage).filter(
    (p): p is NonNullable<typeof p> => Boolean(p),
  );

  return (
    <section className="bg-cream-50 py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="eyebrow">{t.eyebrow}</p>
          <h2 className="mt-3 font-display text-2xl font-semibold leading-tight text-teal-900 sm:text-3xl md:text-4xl">
            {t.title}
          </h2>
          <div className="ornament my-6" />
          <p className="text-sm leading-relaxed text-ink-soft md:text-base">
            {t.intro}
          </p>
        </div>

      <div className="mt-12 grid gap-6 md:grid-cols-3">
        {packages.map((pkg) => (
          <PackageCard key={pkg.id} pkg={pkg} />
        ))}
      </div>

      <div className="mt-12 flex justify-center">
        <ButtonLink href="/packages" variant="secondary" size="lg">
          {t.cta}
          <ArrowRight className="h-4 w-4" />
        </ButtonLink>
      </div>
      </div>
    </section>
  );
}
