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
    <section className="bg-cream-50 py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="eyebrow">{t.eyebrow}</p>
          <h2 className="landing-heading mt-3 font-display text-2xl font-semibold leading-snug text-teal-900 sm:text-3xl md:text-4xl">
            {t.title}
          </h2>
          <div className="ornament my-6" />
          <p className="landing-copy whitespace-pre-line text-sm text-ink-soft md:text-base">
            {t.intro}
          </p>
        </div>

        <ol className="mt-14 flex flex-col gap-6 max-w-3xl mx-auto">
          {t.steps.map((step, i) => {
            const Icon = ICONS[i];
            return (
              <li
                key={step.title}
                className="relative flex flex-col sm:flex-row items-start gap-5 rounded-3xl border border-teal-900/10 bg-white p-5 shadow-soft transition-all duration-300 hover:shadow-lift sm:gap-6 sm:p-8"
              >
                <div className="flex items-center gap-4 shrink-0">
                  <span className="grid h-12 w-12 place-items-center rounded-2xl bg-teal-50 text-teal-700">
                    <Icon className="h-6 w-6" strokeWidth={1.6} />
                  </span>
                  <span className="font-display text-4xl font-semibold text-gold-500">
                    {`0${i + 1}`}
                  </span>
                </div>
                <div className="text-left">
                  <h3 className="landing-heading font-display text-lg font-semibold leading-snug text-teal-900 sm:text-xl">
                    {step.title}
                  </h3>
                  <p className="landing-copy mt-2 whitespace-pre-line text-sm text-ink-soft">
                    {step.body}
                  </p>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
