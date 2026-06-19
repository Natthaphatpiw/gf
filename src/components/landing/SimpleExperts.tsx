"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { BadgeCheck, X } from "lucide-react";
import { getFeaturedExperts, type ExpertProfile } from "@/data/experts";
import { useL, useT } from "@/lib/i18n";
import landing from "@/lib/i18n/dictionaries/landing";
import { lockScroll, unlockScroll } from "@/lib/scroll-lock";

/* ============================================================
 * SimpleExperts — the trimmed expert section: just the two
 * experts we have verified data for, shown as name + title.
 * Tapping a card opens a concise popup; no sprawling detail
 * page, no carousel of stubs.
 * ============================================================ */

export function SimpleExperts() {
  const t = useT(landing).expertShowcase;
  const l = useL();
  const [active, setActive] = useState<ExpertProfile | null>(null);

  const experts = getFeaturedExperts();

  return (
    <section className="bg-cream-100">
      <div className="mx-auto max-w-4xl px-4 py-12 md:px-6 md:py-16">
        <div className="text-center">
          <p className="eyebrow">{t.eyebrow}</p>
          <h2 className="mt-2 font-display text-3xl font-semibold leading-tight text-teal-900 md:text-[2.05rem]">
            {t.title}
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-[0.9rem] leading-relaxed text-ink-soft">
            {t.intro}
          </p>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {experts.map((e) => (
            <button
              key={e.id}
              type="button"
              onClick={() => setActive(e)}
              className="group flex items-center gap-4 rounded-3xl border border-teal-900/10 bg-white p-4 text-left shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-lift"
            >
              <span className="relative h-20 w-16 flex-none overflow-hidden rounded-2xl bg-teal-900">
                {e.image && (
                  <Image
                    src={e.image}
                    alt={l(e.name)}
                    fill
                    sizes="64px"
                    className="object-cover"
                    style={{ objectPosition: "top center" }}
                  />
                )}
              </span>
              <span className="min-w-0 flex-1">
                <span className="flex items-center gap-1.5">
                  <span className="font-display text-lg font-semibold text-teal-900">
                    {l(e.name)}
                  </span>
                  {e.isVerified && <BadgeCheck className="h-4 w-4 flex-none text-teal-600" />}
                </span>
                <span className="mt-0.5 block text-[0.84rem] leading-snug text-ink-soft">
                  {l(e.title)}
                </span>
                <span className="mt-1.5 inline-block text-[0.76rem] font-semibold text-gold-600 transition-transform group-hover:translate-x-0.5">
                  {t.viewProfile} →
                </span>
              </span>
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

        <div className="flex items-center gap-4">
          <span className="relative h-24 w-20 flex-none overflow-hidden rounded-2xl bg-teal-900">
            {expert.image && (
              <Image
                src={expert.image}
                alt={l(expert.name)}
                fill
                sizes="80px"
                className="object-cover"
                style={{ objectPosition: "top center" }}
              />
            )}
          </span>
          <div className="min-w-0">
            <h3 className="font-display text-xl font-semibold leading-snug text-teal-900">
              {l(expert.name)}
            </h3>
            <p className="mt-0.5 text-[0.86rem] text-ink-soft">{l(expert.title)}</p>
            {expert.isVerified && (
              <span className="mt-1.5 inline-flex items-center gap-1 text-[0.74rem] font-semibold text-teal-700">
                <BadgeCheck className="h-3.5 w-3.5" />
                {t.verified}
              </span>
            )}
          </div>
        </div>

        <p className="mt-4 rounded-2xl bg-teal-50/70 px-4 py-3 text-[0.86rem] italic leading-relaxed text-teal-800">
          “{l(expert.quote)}”
        </p>

        <p className="mt-4 text-[0.88rem] leading-relaxed text-ink">{l(expert.shortBio)}</p>

        {expert.specialties.length > 0 && (
          <div className="mt-4">
            <p className="text-[0.66rem] font-semibold uppercase tracking-[0.12em] text-gold-600">
              {t.specialties}
            </p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {expert.specialties.map((s, i) => (
                <span
                  key={i}
                  className="rounded-full bg-sage-100 px-2.5 py-1 text-[0.76rem] font-medium text-teal-800"
                >
                  {l(s)}
                </span>
              ))}
            </div>
          </div>
        )}

        {expert.credentials.length > 0 && (
          <div className="mt-4">
            <p className="text-[0.66rem] font-semibold uppercase tracking-[0.12em] text-gold-600">
              {t.credentials}
            </p>
            <ul className="mt-2 space-y-1.5">
              {expert.credentials.map((c, i) => (
                <li key={i} className="flex gap-2 text-[0.84rem] leading-relaxed text-ink-soft">
                  <span className="mt-1.5 h-1 w-1 flex-none rounded-full bg-gold-500" />
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
