"use client";

import { ArrowLeft, Mail } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";
import { useT } from "@/lib/i18n";
import privacy from "@/lib/i18n/dictionaries/privacy";

/* ============================================================
 * Privacy policy — PDPA (Thailand, B.E. 2562) aligned.
 * Calm editorial layout, bilingual.
 * ============================================================ */

export default function PrivacyPage() {
  const t = useT(privacy);

  return (
    <article className="mx-auto max-w-3xl px-6 py-16 md:py-24">
      <header className="text-center">
        <p className="eyebrow">{t.eyebrow}</p>
        <h1 className="mt-3 font-display text-4xl font-medium leading-tight text-teal-900 md:text-5xl">
          {t.title}
        </h1>
        <p className="mt-4 text-xs font-medium tracking-wide text-ink-faint">
          {t.updated}
        </p>
        <div className="ornament my-8" />
        <p className="mx-auto max-w-2xl text-sm leading-relaxed text-ink-soft md:text-base">
          {t.intro}
        </p>
      </header>

      <div className="mt-14 space-y-10">
        {t.sections.map((section, i) => {
          const isContact = i === t.sections.length - 1;
          return (
            <section key={section.heading}>
              <h2 className="font-display text-2xl font-semibold text-teal-900">
                {section.heading}
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-ink-soft md:text-[0.95rem]">
                {section.body}
              </p>

              {isContact && (
                <div className="mt-5 inline-flex items-center gap-3 rounded-2xl border border-teal-900/10 bg-white px-5 py-4 shadow-soft">
                  <span className="grid h-10 w-10 place-items-center rounded-xl bg-teal-50 text-teal-700">
                    <Mail className="h-5 w-5" strokeWidth={1.6} />
                  </span>
                  <span>
                    <span className="block text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-ink-faint">
                      {t.contactLabel}
                    </span>
                    <a
                      href={`mailto:${t.contactEmail}`}
                      className="font-display text-lg font-semibold text-teal-800 hover:text-teal-600"
                    >
                      {t.contactEmail}
                    </a>
                  </span>
                </div>
              )}
            </section>
          );
        })}
      </div>

      <div className="mt-16 border-t border-teal-900/10 pt-10">
        <ButtonLink href="/" variant="ghost" size="md">
          <ArrowLeft className="h-4 w-4" />
          {t.back}
        </ButtonLink>
      </div>
    </article>
  );
}
