"use client";

import {
  BedDouble,
  Flower2,
  Brain,
  Activity,
  Salad,
  Stethoscope,
  Mountain,
  ConciergeBell,
  type LucideIcon,
} from "lucide-react";
import Image from "next/image";
import { useT } from "@/lib/i18n";
import landing from "@/lib/i18n/dictionaries/landing";

/* ============================================================
 * Pillars — the 8 ecosystem dimensions of Samui wellness.
 * 2-col mobile / 4-col desktop. Cards feature background images.
 * ============================================================ */

const ICONS: LucideIcon[] = [
  BedDouble,
  Flower2,
  Brain,
  Activity,
  Salad,
  Stethoscope,
  Mountain,
  ConciergeBell,
];

const IMAGES: string[] = [
  "/images/pe/b1.png",
  "/images/pillar/Spa%20%26%20Thai%20Healing.jpg",
  "/images/pillar/mind.jpg",
  "/images/pillar/fitness.jpg",
  "/images/pillar/food.jpg",
  "/images/pillar/physician.jpg",
  "/images/pillar/nature.jpg",
  "/images/pillar/assistant.jpg",
];

export function Pillars() {
  const t = useT(landing).pillars;

  return (
    <section className="bg-cream-100 py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="eyebrow">{t.eyebrow}</p>
          <h2 className="mt-3 font-display text-3xl font-medium leading-tight text-gold-500 md:text-4xl">
            {t.title}
          </h2>
          <div className="ornament my-6" />
          <p className="text-sm leading-relaxed text-ink-soft md:text-base">
            {t.intro}
          </p>
        </div>

        <div className="mt-14 grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-5">
          {t.items.map((item, i) => {
            const Icon = ICONS[i];
            const bgImage = IMAGES[i];
            return (
              <div
                key={item.name}
                className="group relative overflow-hidden rounded-3xl aspect-[3/4] w-full shadow-soft transition-all duration-500 hover:-translate-y-1 hover:shadow-lift"
              >
                {/* Background image */}
                <Image
                  src={bgImage}
                  alt={item.name}
                  fill
                  sizes="(min-width: 768px) 25vw, 50vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  priority={i < 4}
                />
                
                {/* Dark gradient overlay to ensure text contrast */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/45 to-black/20" />

                {/* Card Content */}
                <div className="absolute inset-0 flex flex-col justify-between p-4 sm:p-5 z-10">
                  {/* Top: Icon Badge */}
                  <span className="grid h-9 w-9 place-items-center rounded-full bg-white/15 text-white backdrop-blur-sm border border-white/10 shadow-soft">
                    <Icon className="h-[18px] w-[18px]" strokeWidth={1.8} />
                  </span>

                  {/* Bottom: Text details */}
                  <div className="text-left">
                    <h3 className="font-display text-sm font-semibold leading-snug text-white sm:text-base md:text-lg">
                      {item.name}
                    </h3>
                    <p className="mt-1 text-[10px] leading-relaxed text-white/80 line-clamp-3 sm:text-xs">
                      {item.body}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
