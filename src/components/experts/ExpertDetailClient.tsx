"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import type { ExpertProfile } from "@/data/experts";
import { ButtonLink } from "@/components/ui/Button";
import { useL, useT } from "@/lib/i18n";
import expertsDict from "@/lib/i18n/dictionaries/experts";

function initialsFromName(name: string): string {
  const parts = name.split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "";
  if (parts.length === 1) return parts[0]?.slice(0, 2) ?? "";
  return `${parts[0]?.[0] ?? ""}${parts[1]?.[0] ?? ""}`;
}

export function ExpertDetailClient({ expert }: { expert: ExpertProfile }) {
  const t = useT(expertsDict);
  const l = useL();
  const name = l(expert.name);
  const initials = initialsFromName(name);

  return (
    <article className="bg-cream-50">
      <section className="relative overflow-hidden bg-white">
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-teal-50/70" />
        <div className="relative mx-auto max-w-6xl px-4 py-8 md:px-6 md:py-14">
          <Link
            href="/experts"
            className="inline-flex items-center gap-2 text-[0.86rem] font-semibold text-teal-700 transition-colors hover:text-teal-900"
          >
            <ArrowLeft className="h-4 w-4" />
            {t.detail.back}
          </Link>

          <div className="mt-7 grid gap-8 rounded-[1.6rem] border border-teal-900/8 bg-white p-5 shadow-deep sm:p-6 md:grid-cols-[minmax(0,1fr)_22rem] md:items-center md:p-10">
            <div className="min-w-0">
              <span className="inline-flex rounded-full bg-teal-50 px-3 py-1.5 text-[0.72rem] font-semibold text-teal-700">
                {t.detail.verified}
              </span>
              <h1 className="mt-4 break-words font-display text-[1.85rem] font-semibold leading-[1.08] text-teal-900 sm:text-[2.15rem] md:text-[2.6rem]">
                {name}
              </h1>
              <p className="mt-3 text-base font-bold leading-tight text-ink md:text-lg">
                {l(expert.title)}
              </p>
              <blockquote className="mt-5 max-w-2xl border-l-2 border-gold-400 pl-4 font-display text-xl font-semibold leading-snug text-teal-700 md:text-[1.55rem]">
                {l(expert.quote)}
              </blockquote>
              <p className="mt-4 max-w-2xl text-[0.9rem] leading-relaxed text-ink-soft md:text-[0.96rem]">
                {l(expert.shortBio)}
              </p>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <ButtonLink
                  href="/assessment"
                  size="lg"
                  className="w-full whitespace-normal px-5 py-2.5 text-center text-[0.88rem] sm:w-auto md:py-3"
                >
                  {t.detail.ctaAssessment}
                </ButtonLink>
                <ButtonLink
                  href="/packages"
                  variant="secondary"
                  size="lg"
                  className="w-full whitespace-normal px-5 py-2.5 text-center text-[0.88rem] sm:w-auto md:py-3"
                >
                  {t.detail.consult}
                </ButtonLink>
              </div>
            </div>

            <div className="mx-auto w-full max-w-[20rem]">
              <div className="relative aspect-[4/5] overflow-hidden rounded-[1.4rem] bg-gradient-to-br from-teal-50 to-gold-100 shadow-lift">
                {expert.image ? (
                  <Image
                    src={expert.image}
                    alt={name}
                    fill
                    sizes="(min-width: 768px) 320px, 80vw"
                    className="object-cover"
                    priority
                  />
                ) : (
                  <div className="grid h-full w-full place-items-center text-4xl font-semibold text-teal-700">
                    <span aria-hidden="true">{initials}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <main className="mx-auto grid max-w-6xl gap-8 px-4 py-10 md:px-6 md:py-14 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <div className="space-y-10">
          <section id="about" className="rounded-[1.1rem] bg-white p-5 shadow-soft md:p-7">
            <h2 className="font-display text-2xl font-semibold text-teal-900 md:text-[2rem]">
              {t.detail.about}
            </h2>
            <div className="mt-4 space-y-3">
              {expert.about.map((paragraph) => (
                <p key={paragraph.en} className="text-[0.9rem] leading-relaxed text-ink-soft md:text-[0.96rem]">
                  {l(paragraph)}
                </p>
              ))}
            </div>
          </section>

          <section
            id="expertise"
            className="rounded-[1.1rem] bg-white p-5 shadow-soft md:p-7"
          >
            <h2 className="font-display text-2xl font-semibold text-teal-900 md:text-[2rem]">
              {t.detail.expertise}
            </h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {expert.specialties.map((item) => (
                <span
                  key={item.en}
                  className="rounded-full bg-teal-50 px-3.5 py-1.5 text-[0.8rem] font-semibold text-teal-800"
                >
                  {l(item)}
                </span>
              ))}
            </div>
            <h3 className="mt-7 text-base font-bold text-ink md:text-lg">
              {t.detail.serviceModes}
            </h3>
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              {expert.serviceModes.map((item) => (
                <div
                  key={item.en}
                  className="rounded-2xl border border-teal-900/8 px-4 py-3"
                >
                  <span className="text-[0.86rem] font-semibold text-ink">
                    {l(item)}
                  </span>
                </div>
              ))}
            </div>
          </section>

          <section
            id="credentials"
            className="rounded-[1.1rem] bg-white p-5 shadow-soft md:p-7"
          >
            <h2 className="font-display text-2xl font-semibold text-teal-900 md:text-[2rem]">
              {t.detail.credentials}
            </h2>
            <div className="mt-4 space-y-3">
              {expert.credentials.map((item) => (
                <p
                  key={item.en}
                  className="border-l border-gold-300 pl-4 text-[0.9rem] leading-relaxed text-ink-soft md:text-[0.96rem]"
                >
                  {l(item)}
                </p>
              ))}
            </div>

            {expert.timeline.length > 0 && (
              <div className="mt-9">
                <h3 className="font-display text-2xl font-semibold text-teal-900 md:text-[1.85rem]">
                  {t.detail.timeline}
                </h3>
                <div className="mt-5 space-y-4">
                  {expert.timeline.map((item) => (
                    <div
                      key={`${item.period.en}-${item.title.en}`}
                      className="border-l-2 border-teal-200 pl-4"
                    >
                      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-gold-600">
                        {l(item.period)}
                      </p>
                      <h4 className="mt-1 text-base font-bold leading-tight text-ink">
                        {l(item.title)}
                      </h4>
                      <p className="mt-1 text-[0.86rem] leading-relaxed text-ink-soft">
                        {l(item.body)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </section>

          <section id="fit" className="rounded-[1.1rem] bg-white p-5 shadow-soft md:p-7">
            <h2 className="font-display text-2xl font-semibold text-teal-900 md:text-[2rem]">
              {t.detail.suitedFor}
            </h2>
            <div className="mt-4 grid gap-3">
              {expert.suitedFor.map((item) => (
                <p
                  key={item.en}
                  className="rounded-2xl border border-gold-200 bg-gold-100/35 px-4 py-3 text-[0.86rem] leading-relaxed text-ink-soft md:text-[0.92rem]"
                >
                  {l(item)}
                </p>
              ))}
            </div>
            <p className="mt-6 rounded-2xl border border-teal-900/8 bg-teal-50 px-4 py-3 text-[0.84rem] leading-relaxed text-ink-soft">
              {t.detail.note}
            </p>
          </section>
        </div>

        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-[1.1rem] border border-teal-900/8 bg-white p-5 shadow-lift">
            <h2 className="font-display text-2xl font-semibold text-teal-900">
              {t.detail.quickFacts}
            </h2>
            <div className="mt-4 divide-y divide-teal-900/8">
              <div className="py-3 first:pt-0">
                <p className="text-[0.68rem] font-semibold uppercase tracking-[0.12em] text-ink-faint">
                  {t.detail.rating}
                </p>
                <p className="mt-1 text-[0.92rem] font-semibold text-ink">
                  {expert.rating.toFixed(1)}
                </p>
              </div>
              <div className="py-3">
                <p className="text-[0.68rem] font-semibold uppercase tracking-[0.12em] text-ink-faint">
                  {t.detail.yearsExperience}
                </p>
                <p className="mt-1 text-[0.92rem] font-semibold text-ink">
                  {expert.yearsExperience}+
                </p>
              </div>
              <div className="py-3">
                <p className="text-[0.68rem] font-semibold uppercase tracking-[0.12em] text-ink-faint">
                  {t.detail.location}
                </p>
                <p className="mt-1 text-[0.92rem] font-semibold text-ink">{l(expert.location)}</p>
              </div>
              <div className="py-3">
                <p className="text-[0.68rem] font-semibold uppercase tracking-[0.12em] text-ink-faint">
                  {t.detail.languages}
                </p>
                <p className="mt-1 text-[0.92rem] font-semibold text-ink">
                  {expert.languages.map((item) => l(item)).join(" / ")}
                </p>
              </div>
            </div>

            <div className="mt-6 border-t border-teal-900/10 pt-5">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-gold-600">
                {t.detail.profileSummary}
              </p>
              <nav className="mt-3 grid gap-2">
                <a
                  href="#about"
                  className="rounded-full px-3 py-2 text-[0.84rem] font-semibold text-teal-700 transition-colors hover:bg-teal-50"
                >
                  {t.detail.sections.about}
                </a>
                <a
                  href="#expertise"
                  className="rounded-full px-3 py-2 text-[0.84rem] font-semibold text-teal-700 transition-colors hover:bg-teal-50"
                >
                  {t.detail.sections.expertise}
                </a>
                <a
                  href="#credentials"
                  className="rounded-full px-3 py-2 text-[0.84rem] font-semibold text-teal-700 transition-colors hover:bg-teal-50"
                >
                  {t.detail.sections.credentials}
                </a>
                <a
                  href="#fit"
                  className="rounded-full px-3 py-2 text-[0.84rem] font-semibold text-teal-700 transition-colors hover:bg-teal-50"
                >
                  {t.detail.sections.fit}
                </a>
              </nav>
            </div>
          </div>
        </aside>
      </main>
    </article>
  );
}
