"use client";

import { ArrowRight, MapPin } from "lucide-react";
import Image from "next/image";
import { ButtonLink } from "@/components/ui/Button";
import { useLocale, useT } from "@/lib/i18n";
import landing from "@/lib/i18n/dictionaries/landing";

/* ============================================================
 * Hero - single wide image band, matching the supplied reference.
 * ============================================================ */

export function Hero() {
  const { locale } = useLocale();
  const t = useT(landing).hero;
  const th = locale === "th";

  return (
    <section className="bg-cream-50 pb-10">
      <div className="relative min-h-[620px] w-full overflow-hidden bg-teal-950 shadow-deep sm:min-h-[660px] md:min-h-[520px] lg:min-h-[560px]">
        <Image
          src="/images/opt/hero.jpg"
          alt=""
          fill
          priority
          quality={100}
          unoptimized
          sizes="(min-width: 1280px) 1280px, 100vw"
          className="object-cover object-[24%_center] md:object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-teal-950/84 via-teal-900/44 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-teal-950/34 via-transparent to-transparent" />

        <div className="relative z-10 mx-auto flex min-h-[620px] w-full max-w-6xl items-center px-6 py-12 sm:min-h-[660px] sm:px-8 md:min-h-[520px] md:py-10 lg:min-h-[560px] lg:px-6">
          <div className="min-w-0 w-full max-w-[calc(100vw-3rem)] md:max-w-[35rem]">
            <div
              className={`animate-rise inline-flex w-fit items-center gap-2 rounded-full border border-gold-400/30 bg-teal-950/34 px-3.5 py-2 text-[0.72rem] font-semibold text-gold-100 shadow-soft backdrop-blur-md ${
                th ? "th-type" : "uppercase tracking-[0.18em]"
              }`}
            >
              <MapPin className="h-3.5 w-3.5 text-gold-400" />
              <span>{t.eyebrow}</span>
            </div>

            <h1 className="animate-rise-1 landing-heading mt-5 whitespace-pre-line font-display text-[2.65rem] font-semibold leading-[1.12] text-teal-900 drop-shadow-md sm:text-[3.5rem] sm:leading-[1.06] md:text-[4.65rem] md:leading-[0.98]">
              {t.title}
            </h1>

            <p className="animate-rise-2 landing-copy mt-5 whitespace-pre-line text-[0.98rem] font-medium text-cream-50/90 drop-shadow-sm md:text-base">
              {t.subline}
            </p>

            <div className="animate-rise-3 mt-6 grid w-full max-w-sm gap-3 sm:inline-flex sm:max-w-none sm:items-center">
              <ButtonLink
                href="/assessment"
                variant="gold"
                size="lg"
                className="min-w-0 w-full justify-center px-7 py-3.5 text-sm font-semibold shadow-lift ring-1 ring-cream-50/25 transition-transform hover:scale-[1.02] sm:w-auto"
              >
                {t.ctaPrimary}
                <ArrowRight className="h-5 w-5" />
              </ButtonLink>
              <ButtonLink
                href="/packages"
                variant="ghost"
                size="lg"
                className="min-w-0 w-full border border-cream-50/28 bg-transparent px-7 py-3.5 text-sm !text-cream-50 hover:bg-cream-50/10 sm:w-auto"
              >
                {t.ctaSecondary}
              </ButtonLink>
            </div>

            <div className="animate-rise-3 mt-6 grid gap-2 text-[0.78rem] font-medium text-cream-50/82 sm:grid-cols-2 md:flex md:w-[48rem] md:flex-wrap md:gap-x-5 md:gap-y-2 md:text-[0.72rem]">
              {t.highlights.map((item) => (
                <span key={item} className="inline-flex min-w-0 items-center gap-2">
                  <span className="h-1.5 w-1.5 flex-none rounded-full bg-gold-400" />
                  <span className="min-w-0 landing-copy">{item}</span>
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
