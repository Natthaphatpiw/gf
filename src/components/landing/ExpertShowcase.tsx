"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { EXPERTS } from "@/data/experts";
import { ExpertCard } from "@/components/experts/ExpertCard";
import { useT } from "@/lib/i18n";
import landing from "@/lib/i18n/dictionaries/landing";
import expertsDict from "@/lib/i18n/dictionaries/experts";

export function ExpertShowcase() {
  const t = useT(landing).expertShowcase;
  const expertText = useT(expertsDict);
  const filters = expertText.directory.filters;
  const railRef = useRef<HTMLDivElement>(null);

  const scrollExperts = useCallback((direction: -1 | 1) => {
    const rail = railRef.current;
    if (!rail) return;
    rail.scrollBy({
      left: direction * rail.clientWidth * 0.92,
      behavior: "smooth",
    });
  }, []);

  useEffect(() => {
    const rail = railRef.current;
    if (!rail) return;

    const timer = window.setInterval(() => {
      if (document.hidden) return;
      const atEnd = rail.scrollLeft + rail.clientWidth >= rail.scrollWidth - 12;
      rail.scrollTo({
        left: atEnd ? 0 : rail.scrollLeft + rail.clientWidth * 0.92,
        behavior: "smooth",
      });
    }, 12000);

    return () => window.clearInterval(timer);
  }, []);

  return (
    <section className="overflow-hidden bg-cream-100">
      <div className="mx-auto max-w-6xl px-4 py-10 md:px-6 md:py-14">
        <div className="mb-6 flex flex-col gap-5 md:mb-8 md:flex-row md:items-end md:justify-between">
          <div className="max-w-[42rem]">
            <p className="eyebrow">{t.eyebrow}</p>
            <h2 className="mt-2 font-display text-3xl font-semibold leading-tight text-teal-900 md:text-[2.05rem]">
              {t.title}
            </h2>
            <p className="mt-3 text-[0.88rem] leading-relaxed text-ink-soft md:text-[0.95rem]">
              {t.intro}
            </p>
          </div>
          <div className="flex items-center justify-between gap-3 md:justify-end">
            <Link
              href="/experts"
              className="rounded-full bg-teal-700 px-4 py-2 text-[0.82rem] font-semibold text-cream-50 shadow-soft transition-colors hover:bg-teal-800"
            >
              {t.cta}
            </Link>
            <div className="flex flex-none items-center gap-2">
              <button
                type="button"
                onClick={() => scrollExperts(-1)}
                aria-label={t.previous}
                className="grid h-9 w-9 place-items-center rounded-full border border-teal-700/15 bg-white text-teal-700 shadow-soft transition-colors hover:bg-teal-50"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => scrollExperts(1)}
                aria-label={t.next}
                className="grid h-9 w-9 place-items-center rounded-full border border-teal-700/15 bg-white text-teal-700 shadow-soft transition-colors hover:bg-teal-50"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        <div
          ref={railRef}
          data-testid="expert-showcase-rail"
          className="-mx-4 overflow-x-auto px-4 pb-2 no-scrollbar md:mx-0 md:px-0"
        >
          <div className="flex snap-x snap-mandatory gap-4 md:gap-6">
            {EXPERTS.map((expert) => (
              <div
                key={expert.id}
                className="basis-[86vw] shrink-0 snap-start sm:basis-[calc((100%-1rem)/2)] md:basis-[calc((100%-3rem)/3)]"
              >
                <ExpertCard
                  expert={expert}
                  labels={t}
                  categoryLabel={filters[expert.category]}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
