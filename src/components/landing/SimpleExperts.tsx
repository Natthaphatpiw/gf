"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { getFeaturedExperts, type ExpertProfile } from "@/data/experts";
import { useL, useT } from "@/lib/i18n";
import landing from "@/lib/i18n/dictionaries/landing";
import { lockScroll, unlockScroll } from "@/lib/scroll-lock";

/* ============================================================
 * SimpleExperts — warm, human expert cards with portrait,
 * personal quote and a soft popup for fuller detail.
 * ============================================================ */

export function SimpleExperts() {
  const t = useT(landing).expertShowcase;
  const l = useL();
  const [active, setActive] = useState<ExpertProfile | null>(null);

  const experts = getFeaturedExperts();

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-cream-100 via-cream-50 to-teal-50/35">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-16 top-8 h-56 w-56 rounded-full bg-gold-200/25 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-20 bottom-0 h-64 w-64 rounded-full bg-teal-200/20 blur-3xl"
      />

      <div className="relative mx-auto max-w-4xl px-4 py-14 md:px-6 md:py-20">
        <div className="mx-auto max-w-2xl text-center">
          <p className="eyebrow">{t.eyebrow}</p>
          <h2 className="mt-3 font-display text-2xl font-semibold leading-snug text-teal-900 sm:text-3xl md:text-4xl">
            {t.title}
          </h2>
          <div className="ornament my-5" />
          <p className="text-[0.92rem] leading-relaxed text-ink-soft md:text-base">
            {t.intro}
          </p>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2">
          {experts.map((e) => (
            <button
              key={e.id}
              type="button"
              onClick={() => setActive(e)}
              className="group flex flex-col overflow-hidden rounded-[1.75rem] border border-teal-900/8 bg-cream-50/95 text-left shadow-soft transition-all duration-500 hover:-translate-y-1 hover:border-teal-700/15 hover:shadow-lift"
            >
              <div className="px-6 pt-8 pb-5 text-center">
                <span className="relative mx-auto block h-[7.25rem] w-[7.25rem] overflow-hidden rounded-full bg-cream-200 shadow-soft ring-2 ring-gold-300/45 ring-offset-[3px] ring-offset-cream-50">
                  {e.image && (
                    <Image
                      src={e.image}
                      alt={l(e.name)}
                      fill
                      unoptimized
                      sizes="116px"
                      className="object-cover object-top contrast-[1.03] saturate-[1.04]"
                    />
                  )}
                </span>
                <h3 className="mt-5 font-display text-[1.15rem] font-semibold leading-snug text-teal-900">
                  {l(e.name)}
                </h3>
                <p className="mt-1.5 text-[0.84rem] leading-relaxed text-ink-soft">
                  {l(e.title)}
                </p>
              </div>

              <blockquote className="flex-1 px-6 pb-5 text-center font-display text-[0.9rem] italic leading-relaxed text-teal-800/92">
                “{l(e.quote)}”
              </blockquote>

              <div className="border-t border-teal-900/6 bg-white/40 px-6 py-4 text-center">
                <span className="text-[0.82rem] font-medium text-teal-700 transition-colors group-hover:text-teal-900">
                  {t.viewProfile}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {active && <ExpertPopup expert={active} onClose={() => setActive(null)} />}
    </section>
  );
}

function ExpertPopup({
  expert,
  onClose,
}: {
  expert: ExpertProfile;
  onClose: () => void;
}) {
  const t = useT(landing).expertShowcase;
  const l = useL();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    lockScroll();
    return () => {
      document.removeEventListener("keydown", onKey);
      unlockScroll();
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[80] flex items-end justify-center sm:items-center">
      <button
        type="button"
        aria-label={t.close}
        onClick={onClose}
        className="absolute inset-0 bg-teal-950/45 backdrop-blur-[2px]"
      />
      <div className="relative max-h-[88vh] w-full max-w-lg overflow-y-auto rounded-t-3xl bg-cream-50 p-6 shadow-deep sm:rounded-3xl">
        <button
          type="button"
          aria-label={t.close}
          onClick={onClose}
          className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-full text-teal-800 transition-colors hover:bg-teal-50"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="text-center">
          <span className="relative mx-auto block h-28 w-28 overflow-hidden rounded-full bg-cream-200 shadow-soft ring-2 ring-gold-300/45 ring-offset-[3px] ring-offset-cream-50">
            {expert.image && (
              <Image
                src={expert.image}
                alt={l(expert.name)}
                fill
                unoptimized
                sizes="112px"
                className="object-cover object-top contrast-[1.03] saturate-[1.04]"
              />
            )}
          </span>
          <h3 className="mt-5 font-display text-xl font-semibold leading-snug text-teal-900">
            {l(expert.name)}
          </h3>
          <p className="mt-1 text-[0.88rem] leading-relaxed text-ink-soft">{l(expert.title)}</p>
          {expert.isVerified && (
            <p className="mt-2 text-[0.74rem] text-teal-700">{t.verified}</p>
          )}
        </div>

        <blockquote className="mt-5 rounded-2xl border border-teal-900/8 bg-teal-50/60 px-5 py-4 text-center font-display text-[0.92rem] italic leading-relaxed text-teal-800">
          “{l(expert.quote)}”
        </blockquote>

        <p className="mt-5 text-[0.88rem] leading-relaxed text-ink">{l(expert.shortBio)}</p>

        {expert.specialties.length > 0 && (
          <div className="mt-5">
            <p className="text-[0.72rem] font-semibold text-gold-600">{t.specialties}</p>
            <div className="mt-2.5 flex flex-wrap gap-2">
              {expert.specialties.map((s, i) => (
                <span
                  key={i}
                  className="rounded-full bg-sage-100 px-3 py-1 text-[0.76rem] font-medium text-teal-800"
                >
                  {l(s)}
                </span>
              ))}
            </div>
          </div>
        )}

        {expert.credentials.length > 0 && (
          <div className="mt-5">
            <p className="text-[0.72rem] font-semibold text-gold-600">{t.credentials}</p>
            <ul className="mt-2.5 space-y-2">
              {expert.credentials.map((c, i) => (
                <li key={i} className="flex gap-2.5 text-[0.84rem] leading-relaxed text-ink-soft">
                  <span className="mt-2 h-1 w-1 flex-none rounded-full bg-gold-500" />
                  <span>{l(c)}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
