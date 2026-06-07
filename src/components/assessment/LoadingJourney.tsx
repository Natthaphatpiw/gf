"use client";

import { useEffect, useState } from "react";
import { LeafMark } from "@/components/ui/Logo";
import { useT } from "@/lib/i18n";
import assessment from "@/lib/i18n/dictionaries/assessment";

/* ============================================================
 * Full-screen calm loading state shown while the assessment
 * is being composed. Breathing leaf mark + rotating status.
 * ============================================================ */

export function LoadingJourney() {
  const t = useT(assessment);
  const lines = t.loading.lines;
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % lines.length);
    }, 2200);
    return () => clearInterval(id);
  }, [lines.length]);

  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-6 text-center">
      <div className="text-teal-600 animate-breathe">
        <LeafMark className="h-20 w-20" />
      </div>
      <h2 className="mt-8 font-display text-2xl font-semibold text-teal-900">
        {t.loading.title}
      </h2>
      <p
        key={index}
        className="mt-3 min-h-[1.5rem] animate-fade text-sm text-ink-soft"
      >
        {lines[index]}
      </p>

      <div className="ornament mt-8 w-40" aria-hidden="true" />
    </div>
  );
}
