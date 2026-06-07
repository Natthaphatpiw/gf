"use client";

import {
  BedDouble,
  Flower2,
  Brain,
  Activity,
  Salad,
  Stethoscope,
  Mountain,
  ConciergeBell,
  type LucideIcon,
} from "lucide-react";
import { useT } from "@/lib/i18n";
import landing from "@/lib/i18n/dictionaries/landing";

/* ============================================================
 * Pillars — the 8 ecosystem dimensions of Samui wellness.
 * 2-col mobile / 4-col desktop.
 * ============================================================ */

const ICONS: LucideIcon[] = [
  BedDouble,
  Flower2,
  Brain,
  Activity,
  Salad,
  Stethoscope,
  Mountain,
  ConciergeBell,
];

export function Pillars() {
  const t = useT(landing).pillars;

  return (
    <section className="bg-teal-50/60 py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="eyebrow">{t.eyebrow}</p>
          <h2 className="mt-3 font-display text-3xl font-medium leading-tight text-teal-900 md:text-4xl">
            {t.title}
          </h2>
          <div className="ornament my-6" />
          <p className="text-sm leading-relaxed text-ink-soft md:text-base">
            {t.intro}
          </p>
        </div>

        <div className="mt-14 grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-5">
          {t.items.map((item, i) => {
            const Icon = ICONS[i];
            return (
              <div
                key={item.name}
                className="rounded-3xl border border-teal-900/10 bg-white p-6 shadow-soft transition-all duration-500 hover:-translate-y-1 hover:shadow-lift"
              >
                <span className="grid h-11 w-11 place-items-center rounded-2xl bg-gold-100 text-gold-600">
                  <Icon className="h-[22px] w-[22px]" strokeWidth={1.6} />
                </span>
                <h3 className="mt-5 font-display text-lg font-semibold leading-snug text-teal-900">
                  {item.name}
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-ink-soft">
                  {item.body}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
