"use client";

import { RefreshCw } from "lucide-react";
import type { PackageRecommendation, PackageTier } from "@/lib/types";
import { useT } from "@/lib/i18n";
import packagesDict from "@/lib/i18n/dictionaries/packages";
import { getPackage } from "@/data/packages";
import { RecommendationCard } from "@/components/packages/RecommendationCard";

/* ============================================================
 * RecommendationResults — Stage B output. Renders the 9 curated
 * packages grouped Basic (3) / Premium (3) / Deluxe (3), each
 * group under its own tier header, with the AI's top pick per
 * tier shown as a wider, ribboned hero card.
 * ============================================================ */

const TIER_ORDER: PackageTier[] = ["basic", "premium", "deluxe"];

export function RecommendationResults({
  recommendations,
  onRecurate,
  recurating,
}: {
  recommendations: PackageRecommendation[];
  onRecurate: () => void;
  recurating: boolean;
}) {
  const t = useT(packagesDict).curate;

  const tierHeader: Record<PackageTier, string> = {
    basic: t.tierBasic,
    premium: t.tierPremium,
    deluxe: t.tierDeluxe,
  };

  return (
    <section className="space-y-8">
      <header className="animate-rise text-center">
        <p className="eyebrow">{t.resultsEyebrow}</p>
        <h2 className="mt-2 font-display text-3xl font-semibold text-teal-900 md:text-4xl">
          {t.resultsTitle}
        </h2>
        <div className="ornament mt-4" />
        <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-ink-soft">
          {t.resultsBody}
        </p>
        <button
          type="button"
          onClick={onRecurate}
          disabled={recurating}
          className="mt-5 inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-medium text-teal-700 transition-colors hover:bg-teal-50 disabled:opacity-50"
        >
          <RefreshCw
            className={`h-3.5 w-3.5 ${recurating ? "animate-spin" : ""}`}
          />
          {t.again}
        </button>
      </header>

      {TIER_ORDER.map((tier, ti) => {
        const group = recommendations.filter((r) => r.tier === tier);
        if (group.length === 0) return null;
        // hero(es) first, then the rest
        const ordered = [...group].sort(
          (a, b) => (b.hero ? 1 : 0) - (a.hero ? 1 : 0),
        );
        return (
          <div key={tier} className={`animate-rise-${Math.min(ti + 1, 3)}`}>
            <p className="eyebrow mb-3">{tierHeader[tier]}</p>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              {ordered.map((rec) => {
                const pkg = getPackage(rec.packageId);
                if (!pkg) return null;
                return (
                  <div key={rec.packageId} className={rec.hero ? "sm:col-span-2" : ""}>
                    <RecommendationCard
                      pkg={pkg}
                      reason={rec.reason}
                      matchScore={rec.matchScore}
                      hero={rec.hero}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </section>
  );
}
