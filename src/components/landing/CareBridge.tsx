"use client";

import { useT } from "@/lib/i18n";
import landing from "@/lib/i18n/dictionaries/landing";

export function CareBridge() {
  const t = useT(landing).careBridge;

  return (
    <section className="bg-cream-50">
      <div className="mx-auto max-w-6xl px-4 py-8 md:px-6 md:py-12">
        <div className="grid gap-6 border-y border-teal-900/10 py-7 md:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)] md:items-center md:gap-12">
          <div>
            <h2 className="font-display text-2xl font-semibold leading-tight text-teal-900 md:text-[2rem]">
              {t.title}
            </h2>
            <p className="mt-3 max-w-2xl text-[0.88rem] leading-relaxed text-ink-soft md:text-[0.95rem]">
              {t.body}
            </p>
          </div>
          <div className="grid gap-0 rounded-[1rem] border border-teal-900/8 bg-white/75">
            {t.points.map((point) => (
              <div
                key={point}
                className="border-b border-teal-900/8 px-4 py-3 last:border-b-0"
              >
                <span className="text-[0.86rem] font-semibold leading-snug text-ink">
                  {point}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
