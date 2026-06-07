"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { useT } from "@/lib/i18n";
import expert from "@/lib/i18n/dictionaries/expert";

/* ============================================================
 * RawDataBlock — collapsible, monospace, pretty-printed JSON on a
 * deep-teal panel. Used to surface the booking record and the
 * linked assessment profile(s) for clinical review.
 * ============================================================ */

interface RawSection {
  label: string;
  data: unknown;
}

export function RawDataBlock({ sections }: { sections: RawSection[] }) {
  const t = useT(expert).bench.raw;
  const [open, setOpen] = useState(false);

  return (
    <div className="overflow-hidden rounded-2xl border border-teal-900/10 bg-white shadow-soft">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left transition-colors hover:bg-teal-50"
      >
        <span className="text-sm font-semibold text-ink">
          {open ? t.hide : t.show}
        </span>
        <ChevronDown
          className={`h-4 w-4 shrink-0 text-teal-600 transition-transform duration-300 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {open && (
        <div className="space-y-3 border-t border-teal-900/10 p-3">
          {sections.map((s, i) => (
            <div key={i}>
              <p className="mb-1.5 px-1 text-[0.62rem] font-semibold uppercase tracking-[0.12em] text-ink-faint">
                {s.label}
              </p>
              <pre className="overflow-auto rounded-2xl bg-teal-900 p-4 font-mono text-xs leading-relaxed text-cream-100">
                {JSON.stringify(s.data, null, 2)}
              </pre>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
