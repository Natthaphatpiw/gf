"use client";

import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { PartnerGalleryImage } from "@/data/hugSamuiServices";
import { useL, useT } from "@/lib/i18n";
import partnersDict from "@/lib/i18n/dictionaries/partners";
import { useRef } from "react";

interface PartnerGalleryRailProps {
  images: PartnerGalleryImage[];
}

export function PartnerGalleryRail({ images }: PartnerGalleryRailProps) {
  const t = useT(partnersDict);
  const l = useL();
  const railRef = useRef<HTMLDivElement>(null);

  if (images.length === 0) return null;

  const scroll = (direction: "previous" | "next") => {
    const rail = railRef.current;
    if (!rail) return;
    const distance = Math.min(rail.clientWidth * 0.86, 760);
    rail.scrollBy({
      left: direction === "previous" ? -distance : distance,
      behavior: "smooth",
    });
  };

  return (
    <section className="mt-10 border-y border-teal-900/10 py-8 md:mt-12 md:py-10">
      <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="eyebrow">{t.galleryEyebrow}</p>
          <h2 className="mt-2 font-display text-3xl font-semibold leading-tight text-teal-900 md:text-[2.15rem]">
            {t.galleryTitle}
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-ink-soft md:text-[0.96rem]">
            {t.galleryDescription}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => scroll("previous")}
            aria-label={t.galleryPrevious}
            className="grid h-10 w-10 place-items-center rounded-full border border-teal-900/10 bg-white text-teal-800 shadow-soft transition-colors hover:bg-teal-50"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => scroll("next")}
            aria-label={t.galleryNext}
            className="grid h-10 w-10 place-items-center rounded-full border border-teal-900/10 bg-white text-teal-800 shadow-soft transition-colors hover:bg-teal-50"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div
        ref={railRef}
        className="no-scrollbar -mx-4 mt-6 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-2 md:mx-0 md:gap-4 md:px-0"
      >
        {images.map((image) => (
          <figure
            key={image.id}
            className="group relative aspect-[4/5] w-[72vw] flex-none snap-start overflow-hidden rounded-[1.4rem] bg-white shadow-soft ring-1 ring-teal-900/10 md:w-[18rem]"
          >
            <Image
              src={image.image}
              alt={l(image.alt)}
              fill
              sizes="(max-width: 767px) 72vw, 18rem"
              className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
            />
            <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-teal-950/70 via-teal-950/20 to-transparent px-4 pb-4 pt-14 text-xs font-medium leading-snug text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100 md:text-sm">
              {l(image.caption)}
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
