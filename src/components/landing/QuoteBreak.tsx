"use client";

import Image from "next/image";
import { useT } from "@/lib/i18n";
import landing from "@/lib/i18n/dictionaries/landing";

/* ============================================================
 * QuoteBreak — immersive full-width image with an italic
 * serif pull-quote about stillness.
 * ============================================================ */

export function QuoteBreak() {
  const t = useT(landing).quote;

  return (
    <section className="relative flex min-h-[70svh] items-center overflow-hidden">
      <Image
        src="/images/well2.jpeg"
        alt=""
        fill
        sizes="100vw"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-teal-900/65" />

      <div className="relative z-10 mx-auto max-w-3xl px-6 text-center">
        <div className="ornament mb-8" />
        <blockquote className="font-display text-2xl font-medium italic leading-snug text-cream-50 md:text-4xl md:leading-tight">
          “{t.text}”
        </blockquote>
        <p className="mt-8 text-xs font-semibold uppercase tracking-[0.22em] text-gold-200">
          {t.attribution}
        </p>
      </div>
    </section>
  );
}
