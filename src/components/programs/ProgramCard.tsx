"use client";

import Image from "next/image";
import Link from "next/link";
import { Check, Heart, ShieldCheck, Clock, ShoppingBag } from "lucide-react";
import type { BlueprintProgram } from "@/data/blueprintPackages";
import { useAccount } from "@/lib/account";
import { useL, useT } from "@/lib/i18n";
import programsDict from "@/lib/i18n/dictionaries/programs";

export function ProgramCard({ program }: { program: BlueprintProgram }) {
  const t = useT(programsDict);
  const l = useL();
  const { isFavorite, toggleFavorite, isInCart, addToCart } = useAccount();
  const fav = isFavorite("program", program.slug);
  const inCart = isInCart("program", program.slug);

  const stop = (fn: () => void) => (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    fn();
  };

  return (
    <Link
      href={`/programs/${program.slug}`}
      className="group flex w-[78vw] flex-none snap-start flex-col overflow-hidden rounded-[1.4rem] bg-white shadow-soft ring-1 ring-teal-900/8 transition-all duration-500 hover:-translate-y-1 hover:shadow-lift sm:w-[20rem]"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-teal-900">
        <Image
          src={program.image}
          alt={l(program.name)}
          fill
          sizes="(max-width: 639px) 78vw, 20rem"
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-black/55 to-transparent" />
        <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-[0.66rem] font-semibold text-teal-800 backdrop-blur">
          {t.tripPhase[program.tripPhase]}
        </span>
        <div className="absolute right-2.5 top-2.5 flex gap-1.5">
          <span
            role="button"
            tabIndex={0}
            aria-pressed={fav}
            onClick={stop(() => toggleFavorite("program", program.slug))}
            className="grid h-8 w-8 cursor-pointer place-items-center rounded-full bg-white/90 shadow-soft backdrop-blur transition-colors hover:bg-white"
          >
            <Heart className={`h-4 w-4 ${fav ? "fill-gold-500 text-gold-500" : "text-teal-800"}`} />
          </span>
          <span
            role="button"
            tabIndex={0}
            onClick={stop(() => addToCart("program", program.slug))}
            className={`grid h-8 w-8 cursor-pointer place-items-center rounded-full shadow-soft backdrop-blur transition-colors ${
              inCart ? "bg-teal-600 text-white" : "bg-white/90 text-teal-800 hover:bg-white"
            }`}
          >
            {inCart ? <Check className="h-4 w-4" /> : <ShoppingBag className="h-4 w-4" />}
          </span>
        </div>
        <div className="absolute inset-x-4 bottom-3 text-cream-50">
          <p className="text-[0.7rem] font-medium uppercase tracking-[0.14em] text-cream-100/90">
            {l(program.subtitle)}
          </p>
          <h3 className="font-display text-[1.45rem] font-semibold leading-tight">
            {l(program.name)}
          </h3>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <p className="line-clamp-2 text-[0.84rem] leading-relaxed text-ink-soft">
          {l(program.tagline)}
        </p>

        <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-[0.72rem] font-medium text-ink-faint">
          <span className="inline-flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5" />
            {l(program.durationLabel)}
          </span>
          {program.safetyGateRequired && (
            <span className="inline-flex items-center gap-1 rounded-full bg-gold-100 px-2 py-0.5 text-[0.62rem] font-semibold text-gold-600">
              <ShieldCheck className="h-3 w-3" />
              {t.card.doctorScreen}
            </span>
          )}
        </div>

        <div className="mt-auto flex items-baseline justify-between pt-3">
          <p className="text-ink">
            {program.priceFrom !== null ? (
              <>
                <span className="text-[0.66rem] text-ink-faint">{t.card.from} </span>
                <span className="font-display text-lg font-bold text-teal-800">
                  {program.priceFrom.toLocaleString("en-US")}
                </span>{" "}
                <span className="text-[0.64rem] text-ink-faint">{t.card.baht}</span>
              </>
            ) : (
              <span className="text-[0.74rem] font-medium text-ink-faint">
                {t.card.onRequest}
              </span>
            )}
          </p>
          <span className="text-[0.72rem] font-semibold text-gold-600 transition-transform duration-300 group-hover:translate-x-0.5">
            {t.card.viewDetails} →
          </span>
        </div>
      </div>
    </Link>
  );
}
