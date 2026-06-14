"use client";

import {
  Apple,
  Dumbbell,
  Flower2,
  Moon,
  Stethoscope,
  Trees,
  type LucideIcon,
} from "lucide-react";
import { useT } from "@/lib/i18n";
import landing from "@/lib/i18n/dictionaries/landing";

const ICONS: LucideIcon[] = [
  Flower2,
  Moon,
  Apple,
  Dumbbell,
  Stethoscope,
  Trees,
];

export function WellnessTypes() {
  const t = useT(landing).wellnessTypes;

  return (
    <section className="bg-white">
      <div className="mx-auto max-w-6xl px-4 py-7 md:px-6 md:py-8">
        <h2 className="sr-only">{t.title}</h2>
        <div className="-mx-4 overflow-x-auto px-4 pb-1 no-scrollbar md:mx-0 md:overflow-visible md:px-0 md:pb-0">
          <div className="flex snap-x snap-mandatory gap-4 md:grid md:grid-cols-6 md:gap-5">
            {t.items.map((label, index) => {
              const Icon = ICONS[index] ?? Flower2;
              return (
                <div
                  key={label}
                  className="flex basis-[calc((100vw-4rem)/3)] shrink-0 snap-start flex-col items-center text-center md:min-w-0 md:basis-auto"
                >
                  <span className="grid h-12 w-12 place-items-center rounded-full bg-teal-50 text-teal-700 shadow-soft md:h-[3.25rem] md:w-[3.25rem]">
                    <Icon className="h-6 w-6 md:h-7 md:w-7" strokeWidth={1.8} />
                  </span>
                  <span className="mt-2.5 max-w-28 text-balance text-sm font-semibold leading-snug text-ink md:max-w-[8.5rem] md:text-[0.95rem]">
                    {label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
