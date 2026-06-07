"use client";

import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";
import { useT } from "@/lib/i18n";
import landing from "@/lib/i18n/dictionaries/landing";

/* ============================================================
 * Hero — full-bleed island image with deep-teal wash,
 * content bottom-aligned, app-like on mobile.
 * ============================================================ */

export function Hero() {
  const t = useT(landing).hero;

  return (
    <section className="relative flex min-h-[88svh] flex-col justify-end overflow-hidden">
      <Image
        src="/images/well1.jpeg"
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />
      {/* Deep teal gradient wash for legibility + brand mood */}
      <div className="absolute inset-0 bg-gradient-to-t from-teal-900 via-teal-900/55 to-teal-900/25" />
      <div className="absolute inset-0 bg-teal-900/20" />

      <div className="relative z-10 mx-auto w-full max-w-6xl px-6 pb-16 pt-28 md:pb-24">
        <p className="eyebrow animate-rise text-gold-200">{t.eyebrow}</p>

        <h1 className="animate-rise-1 mt-4 max-w-3xl whitespace-pre-line font-display text-[2.85rem] font-medium leading-[1.05] text-cream-50 md:text-7xl md:leading-[1.02]">
          {t.title}
        </h1>

        <p className="animate-rise-2 mt-6 max-w-xl text-base leading-relaxed text-cream-100/90 md:text-lg">
          {t.subline}
        </p>

        <div className="animate-rise-3 mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
          <ButtonLink href="/assessment" size="lg" className="w-full sm:w-auto">
            {t.ctaPrimary}
            <ArrowRight className="h-4 w-4" />
          </ButtonLink>
          <ButtonLink
            href="/packages"
            variant="ghost"
            size="lg"
            className="w-full text-cream-50 hover:bg-cream-50/10 sm:w-auto"
          >
            {t.ctaSecondary}
          </ButtonLink>
        </div>

        <p className="animate-rise-3 mt-4 text-xs font-medium tracking-wide text-gold-200">
          {t.ctaNote}
        </p>
      </div>
    </section>
  );
}
