"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { TOP_BRAND_PARTNERS } from "@/data/partners";
import { useL, useT } from "@/lib/i18n";
import landing from "@/lib/i18n/dictionaries/landing";

export function TopBrands() {
  const t = useT(landing).topBrands;
  const l = useL();

  const scrollBrands = useCallback(
    (button: HTMLButtonElement, direction: -1 | 1) => {
      const rail = button
        .closest("section")
        ?.querySelector<HTMLElement>('[data-testid="top-brands-rail"]');
      if (!rail) return;
      rail.scrollLeft += direction * rail.clientWidth * 0.82;
    },
    [],
  );

  return (
    <section className="bg-gradient-to-b from-gold-100/70 to-cream-100">
      <div className="mx-auto max-w-6xl px-4 py-10 md:px-6 md:py-12">
        <div className="mb-6 flex items-end justify-between gap-4 md:mb-7 md:gap-6">
          <div>
            <h2 className="font-sans text-3xl font-bold leading-tight text-ink md:text-[2.35rem]">
              {t.title}
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink-soft md:text-[0.95rem]">
              {t.intro}
            </p>
          </div>
          <div className="flex flex-none items-center gap-2">
            <button
              type="button"
              onClick={(event) => scrollBrands(event.currentTarget, -1)}
              aria-label={t.previous}
              className="grid h-9 w-9 place-items-center rounded-full border border-gold-200 bg-white/75 text-gold-600 shadow-soft transition-colors hover:bg-white"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={(event) => scrollBrands(event.currentTarget, 1)}
              aria-label={t.next}
              className="grid h-9 w-9 place-items-center rounded-full border border-gold-200 bg-white/75 text-gold-600 shadow-soft transition-colors hover:bg-white"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div
          data-testid="top-brands-rail"
          className="-mx-4 overflow-x-auto px-4 pb-2 no-scrollbar md:mx-0 md:px-0"
        >
          <div className="flex snap-x snap-mandatory gap-4 md:gap-7">
            {TOP_BRAND_PARTNERS.map((partner) => {
              const name = l(partner.name);
              const content = (
                <>
                  <span className="grid aspect-square w-full max-w-[86px] place-items-center overflow-hidden rounded-full border border-white/70 bg-white shadow-soft md:max-w-[112px]">
                    {partner.logo ? (
                      <Image
                        src={partner.logo}
                        alt={name}
                        width={180}
                        height={180}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <span
                        aria-hidden="true"
                        className="block h-7 w-7 rounded-full border border-gold-200 md:h-8 md:w-8"
                      />
                    )}
                  </span>
                  <span className="mt-3 block max-w-[8rem] text-balance text-center text-sm font-semibold leading-snug text-ink md:max-w-[9.5rem] md:text-base">
                    {name}
                  </span>
                </>
              );
              const className =
                "flex basis-[calc((100vw-4rem)/3)] shrink-0 snap-start flex-col items-center md:basis-[9.75rem]";

              if (partner.id === "hug-samui") {
                return (
                  <Link
                    key={partner.id}
                    href={`/partners/${partner.id}`}
                    aria-label={`${t.open}: ${name}`}
                    className={`${className} rounded-2xl transition-transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:ring-offset-4 focus:ring-offset-gold-100`}
                  >
                    {content}
                  </Link>
                );
              }

              return (
                <div key={partner.id} className={className}>
                  {content}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
