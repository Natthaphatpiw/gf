"use client";

import { ClipboardList, Sparkles, ShieldCheck, type LucideIcon } from "lucide-react";
import { useT } from "@/lib/i18n";
import landing from "@/lib/i18n/dictionaries/landing";

/* ============================================================
 * HowItWorks — three calm steps, premium-care tone.
 * ============================================================ */

const ICONS: LucideIcon[] = [ClipboardList, Sparkles, ShieldCheck];

export function HowItWorks() {
  const t = useT(landing).how;

  return (
    <section className="mx-auto max-w-6xl px-6 py-20 md:py-28">
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

      <ol className="mt-14 grid gap-8 md:grid-cols-3 md:gap-6">
        {t.steps.map((step, i) => {
          const Icon = ICONS[i];
          return (
            <li
              key={step.title}
              className="relative rounded-3xl border border-teal-900/10 bg-white p-8 shadow-soft"
            >
              <div className="flex items-center gap-4">
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-teal-50 text-teal-700">
                  <Icon className="h-6 w-6" strokeWidth={1.6} />
                </span>
                <span className="font-display text-4xl font-medium text-gold-400">
                  {`0${i + 1}`}
                </span>
              </div>
              <h3 className="mt-6 font-display text-xl font-semibold text-teal-900">
                {step.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-ink-soft">
                {step.body}
              </p>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
