"use client";

import { useState } from "react";
import type { PackageTier } from "@/lib/types";
import { useT } from "@/lib/i18n";
import packagesDict from "@/lib/i18n/dictionaries/packages";
import common from "@/lib/i18n/dictionaries/common";
import { PACKAGES } from "@/data/packages";
import { PackageCard } from "@/components/packages/PackageCard";

/* ============================================================
 * ExploreGrid — Stage C. All 15 packages with tier filter chips
 * (all / basic / premium / deluxe).
 * ============================================================ */

type Filter = "all" | PackageTier;

const FILTERS: Filter[] = ["all", "basic", "premium", "deluxe"];

export function ExploreGrid() {
  const t = useT(packagesDict).explore;
  const c = useT(common);
  const [filter, setFilter] = useState<Filter>("all");

  const visible =
    filter === "all"
      ? PACKAGES
      : PACKAGES.filter((p) => p.tier === filter);

  function chipLabel(f: Filter): string {
    return f === "all" ? t.all : c.tier[f];
  }

  return (
    <section className="space-y-6">
      <header className="animate-rise text-center">
        <p className="eyebrow">{t.eyebrow}</p>
        <h2 className="mt-2 font-display text-3xl font-semibold text-teal-900 md:text-4xl">
          {t.title}
        </h2>
        <div className="ornament mt-4" />
      </header>

      <div className="no-scrollbar -mx-1 flex items-center justify-start gap-2 overflow-x-auto px-1 sm:justify-center">
        {FILTERS.map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFilter(f)}
            aria-pressed={filter === f}
            className={`shrink-0 rounded-full px-5 py-2 text-xs font-medium tracking-wide transition-all ${
              filter === f
                ? "bg-teal-700 text-cream-50 shadow-soft"
                : "border border-teal-900/10 bg-white text-teal-700 hover:border-teal-700/40"
            }`}
          >
            {chipLabel(f)}
          </button>
        ))}
      </div>

      {visible.length === 0 ? (
        <p className="py-10 text-center text-sm text-ink-faint">{t.empty}</p>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((pkg) => (
            <PackageCard key={pkg.id} pkg={pkg} />
          ))}
        </div>
      )}
    </section>
  );
}
