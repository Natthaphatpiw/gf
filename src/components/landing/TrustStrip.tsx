"use client";

import { useT } from "@/lib/i18n";
import landing from "@/lib/i18n/dictionaries/landing";

/* ============================================================
 * TrustStrip - non-clickable hotel and wellness place names.
 * ============================================================ */

export function TrustStrip() {
  const t = useT(landing).trust;
  const rail = [...t.partners, ...t.partners];

  return (
    <section className="overflow-hidden bg-cream-50 py-12 md:py-16">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mx-auto max-w-3xl text-center">
          <p className="eyebrow">{t.eyebrow}</p>
          <h2 className="mt-3 whitespace-pre-line break-words font-display text-[1.95rem] font-semibold leading-tight text-teal-900 [overflow-wrap:anywhere] sm:text-3xl md:text-[2.45rem]">
            {t.title}
          </h2>
          <p className="mx-auto mt-4 max-w-2xl break-words text-sm font-medium leading-7 text-ink-soft [overflow-wrap:anywhere] md:text-base">
            {t.intro}
          </p>
        </div>
      </div>

      <div
        aria-label={t.listLabel}
        className="mt-9 border-y border-teal-900/12 bg-teal-950 py-5 text-cream-50 shadow-soft"
      >
        <div className="brand-rail-mask overflow-hidden">
          <ul className="brand-marquee flex w-max items-center gap-9 whitespace-nowrap pr-9">
            {rail.map((name, index) => (
              <li
                key={`${name}-${index}`}
                aria-hidden={index >= t.partners.length}
                className="inline-flex items-center gap-9 font-display text-[1.35rem] font-semibold leading-none tracking-wide text-cream-50 md:text-[1.75rem]"
              >
                <span>{name}</span>
                <span className="h-1.5 w-1.5 rounded-full bg-gold-400" />
              </li>
            ))}
          </ul>
        </div>

        <div className="brand-rail-mask mt-4 overflow-hidden">
          <ul className="brand-marquee-reverse flex w-max items-center gap-9 whitespace-nowrap pr-9">
            {rail.map((name, index) => (
              <li
                key={`${name}-reverse-${index}`}
                aria-hidden={index >= t.partners.length}
                className="inline-flex items-center gap-9 font-display text-[1.05rem] font-semibold leading-none tracking-wide text-gold-200/92 md:text-[1.35rem]"
              >
                <span>{name}</span>
                <span className="h-px w-8 bg-gold-400/70" />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
