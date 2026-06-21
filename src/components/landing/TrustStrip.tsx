"use client";

import { useT } from "@/lib/i18n";
import landing from "@/lib/i18n/dictionaries/landing";

/* ============================================================
 * TrustStrip - non-clickable hotel and wellness place names.
 * Displays partner names in an elegant text-based horizontal strip.
 * Styled in warm champagne gold with no line breaks.
 * ============================================================ */

export function TrustStrip() {
  const t = useT(landing).trust;

  return (
    <section className="overflow-hidden bg-cream-50 py-10 md:py-14">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mx-auto max-w-3xl text-center">
          <p className="eyebrow text-gold-600 tracking-[0.16em]">{t.eyebrow}</p>
          <h2 className="mt-3 font-display text-2xl font-semibold leading-tight text-gold-500 sm:text-3xl md:text-4xl">
            {t.title}
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm font-medium leading-relaxed text-ink-soft md:text-base">
            {t.intro}
          </p>
        </div>
      </div>

      <div
        aria-label={t.listLabel}
        className="mt-10 border-y border-teal-700/20 bg-teal-50 py-6 shadow-soft bg-gradient-to-r from-teal-500 to-teal-500"
      >
        <div className="w-full overflow-x-auto no-scrollbar px-6 md:px-12">
          <ul className="flex flex-nowrap items-center justify-start md:justify-center gap-x-8 md:gap-x-12 py-1 mx-auto w-max min-w-full md:min-w-0">
            {t.partners.map((name) => (
              <li
                key={name}
                className="font-sans text-xs font-semibold tracking-widest text-gold-500 whitespace-nowrap sm:text-sm md:text-[15px] hover:text-gold-200 transition-colors duration-300 px-2"
              >
                {name}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
