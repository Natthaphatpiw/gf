"use client";

import { useMemo, useState } from "react";
import {
  EXPERTS,
  EXPERT_CATEGORY_ORDER,
  type ExpertCategory,
} from "@/data/experts";
import { ExpertCard } from "@/components/experts/ExpertCard";
import { ButtonLink } from "@/components/ui/Button";
import { useT } from "@/lib/i18n";
import expertsDict from "@/lib/i18n/dictionaries/experts";

type ExpertFilter = "all" | ExpertCategory;

export function ExpertsDirectoryClient() {
  const t = useT(expertsDict);
  const [filter, setFilter] = useState<ExpertFilter>("all");

  const filters = useMemo<ExpertFilter[]>(
    () => [
      "all",
      ...EXPERT_CATEGORY_ORDER.filter((cat) =>
        EXPERTS.some((expert) => expert.category === cat),
      ),
    ],
    [],
  );

  const visibleExperts =
    filter === "all"
      ? EXPERTS
      : EXPERTS.filter((expert) => expert.category === filter);

  return (
    <main className="bg-cream-50">
      <section className="bg-white">
        <div className="mx-auto max-w-6xl px-4 py-12 md:px-6 md:py-16">
          <div className="max-w-[44rem] animate-rise">
            <p className="eyebrow">{t.directory.eyebrow}</p>
            <h1 className="mt-3 font-display text-3xl font-semibold leading-tight text-teal-900 md:text-[2.35rem]">
              {t.directory.title}
            </h1>
            <p className="mt-4 text-[0.92rem] leading-relaxed text-ink-soft md:text-base">
              {t.directory.intro}
            </p>
            <div className="mt-6">
              <ButtonLink href="/assessment" size="md" className="px-5 py-2.5 text-[0.86rem]">
                {t.directory.cta}
              </ButtonLink>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-cream-100">
        <div className="mx-auto max-w-6xl px-4 py-10 md:px-6 md:py-14">
          <div className="grid gap-7 md:grid-cols-[minmax(0,0.8fr)_minmax(0,1fr)] md:items-start md:gap-12">
            <div>
              <h2 className="font-display text-2xl font-semibold leading-tight text-teal-900 md:text-[2rem]">
                {t.directory.trust.title}
              </h2>
              <p className="mt-3 text-[0.88rem] leading-relaxed text-ink-soft md:text-[0.95rem]">
                {t.directory.trust.intro}
              </p>
            </div>
            <div className="grid rounded-[1rem] border border-teal-900/8 bg-white">
              {t.directory.trust.items.map((item) => (
                <div
                  key={item.title}
                  className="border-b border-teal-900/8 px-5 py-4 last:border-b-0"
                >
                  <h3 className="text-[0.98rem] font-bold leading-tight text-ink">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-[0.84rem] leading-relaxed text-ink-soft md:text-[0.9rem]">
                    {item.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-cream-50">
        <div className="mx-auto max-w-6xl px-4 py-10 md:px-6 md:py-14">
          <div className="mb-5 flex flex-col gap-4 md:mb-7 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="eyebrow">{t.directory.filterLabel}</p>
              <h2 className="mt-2 font-display text-2xl font-semibold text-teal-900 md:text-[2rem]">
                {t.directory.rosterTitle}
              </h2>
            </div>
            <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1 no-scrollbar md:mx-0 md:px-0">
              {filters.map((item) => (
                <button
                  key={item}
                  type="button"
                  data-testid={`expert-filter-${item}`}
                  onClick={() => setFilter(item)}
                  aria-pressed={filter === item}
                  className={`shrink-0 rounded-full px-3.5 py-1.5 text-[0.72rem] font-semibold tracking-wide transition-all ${
                    filter === item
                      ? "bg-teal-700 text-cream-50 shadow-soft"
                      : "border border-teal-900/10 bg-white text-teal-700 hover:border-teal-600/45"
                  }`}
                >
                  {t.directory.filters[item]}
                </button>
              ))}
            </div>
          </div>

          {visibleExperts.length === 0 ? (
            <p className="py-10 text-center text-sm text-ink-faint">
              {t.directory.empty}
            </p>
          ) : (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {visibleExperts.map((expert) => (
                <ExpertCard
                  key={expert.id}
                  expert={expert}
                  labels={t.card}
                  categoryLabel={t.directory.filters[expert.category]}
                />
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
