"use client";

import { ArrowRight } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";
import { useT } from "@/lib/i18n";
import landing from "@/lib/i18n/dictionaries/landing";

/* ============================================================
 * ClosingCTA — final teal band with gold accents driving
 * the visitor into the assessment.
 * ============================================================ */

export function ClosingCTA() {
  const t = useT(landing).closing;

  return (
    <section className="bg-teal-900 px-6 py-24 md:py-32">
      <div className="mx-auto max-w-2xl text-center">
        <p className="eyebrow text-gold-200">{t.eyebrow}</p>
        <h2 className="mt-3 font-display text-2xl font-semibold leading-tight text-cream-50 sm:text-3xl md:text-4xl">
          {t.title}
        </h2>
        <div className="ornament my-7" />
        <p className="mx-auto max-w-md text-sm leading-relaxed text-cream-100/80 md:text-base">
          {t.body}
        </p>

        <div className="mt-10 flex flex-col items-center gap-4">
          <ButtonLink href="/assessment" variant="gold" size="lg">
            {t.cta}
            <ArrowRight className="h-4 w-4" />
          </ButtonLink>
          <p className="text-xs font-medium tracking-wide text-gold-200">
            {t.note}
          </p>
        </div>
      </div>
    </section>
  );
}
