"use client";

import { useT } from "@/lib/i18n";
import landing from "@/lib/i18n/dictionaries/landing";

/* ============================================================
 * TrustStrip — horizontally scrolling row of partner marks.
 * Real Samui wellness houses, rendered as elegant text.
 * ============================================================ */

const PARTNERS = [
  "Kamalaya",
  "Six Senses Samui",
  "Banyan Tree Samui",
  "Four Seasons",
  "Absolute Sanctuary",
  "Samahita Retreat",
  "Vikasa",
  "Bangkok Hospital Samui",
];

export function TrustStrip() {
  const t = useT(landing).trust;

  return (
    <section className="border-y border-teal-900/10 bg-cream-50 py-10 md:py-12">
      <div className="mx-auto max-w-6xl px-6">
        <p className="eyebrow text-center">{t.eyebrow}</p>
        <h2 className="mt-2 text-center font-display text-lg font-medium text-teal-900 md:text-xl">
          {t.title}
        </h2>
      </div>

      <div className="no-scrollbar mt-7 flex gap-8 overflow-x-auto px-6 md:justify-center md:gap-12">
        {PARTNERS.map((name) => (
          <span
            key={name}
            className="shrink-0 whitespace-nowrap font-display text-lg font-medium tracking-wide text-ink-soft/70 transition-colors hover:text-teal-700 md:text-xl"
          >
            {name}
          </span>
        ))}
      </div>
    </section>
  );
}
