"use client";

import Image from "next/image";
import { ArrowRight, Check } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";
import { useT } from "@/lib/i18n";
import landing from "@/lib/i18n/dictionaries/landing";

/* ============================================================
 * AssessmentTeaser — split layout inviting guests to discover
 * their Samui Wellness Archetype.
 * ============================================================ */

export function AssessmentTeaser() {
  const t = useT(landing).teaser;

  return (
    <section className="mx-auto max-w-6xl px-6 py-20 md:py-28">
      <div className="overflow-hidden rounded-[2rem] border border-teal-900/10 bg-white shadow-lift md:grid md:grid-cols-2">
        <div className="relative aspect-[4/3] md:aspect-auto md:min-h-[26rem]">
          <Image
            src="/images/well4.jpeg"
            alt=""
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-teal-900/30 to-transparent md:bg-gradient-to-r" />
        </div>

        <div className="p-8 md:p-12">
          <p className="eyebrow">{t.eyebrow}</p>
          <h2 className="mt-3 font-display text-2xl font-semibold leading-tight text-teal-900 sm:text-3xl md:text-4xl">
            {t.title}
          </h2>
          <p className="mt-5 text-sm leading-relaxed text-ink-soft md:text-base">
            {t.body}
          </p>

          <ul className="mt-7 space-y-3">
            {t.points.map((point) => (
              <li key={point} className="flex items-start gap-3">
                <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-teal-50 text-teal-700">
                  <Check className="h-3 w-3" strokeWidth={2.5} />
                </span>
                <span className="text-sm leading-relaxed text-ink">{point}</span>
              </li>
            ))}
          </ul>

          <div className="mt-9">
            <ButtonLink href="/assessment" size="lg">
              {t.cta}
              <ArrowRight className="h-4 w-4" />
            </ButtonLink>
          </div>
        </div>
      </div>
    </section>
  );
}
