"use client";

import { Check } from "lucide-react";
import type { GoalId } from "@/lib/types";
import { ALL_GOALS } from "@/lib/types";
import { GOALS } from "@/data/goals";
import { useL, useT } from "@/lib/i18n";
import assessment from "@/lib/i18n/dictionaries/assessment";
import { iconFor } from "./icons";

/* ============================================================
 * GoalSelector — all six wellness goals as multi-select cards.
 * Recommended goals carry a small "Suggested" tag.
 * ============================================================ */

export function GoalSelector({
  selected,
  recommended,
  onToggle,
}: {
  selected: GoalId[];
  recommended: GoalId[];
  onToggle: (id: GoalId) => void;
}) {
  const l = useL();
  const t = useT(assessment);

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {ALL_GOALS.map((id) => {
        const goal = GOALS[id];
        const active = selected.includes(id);
        const suggested = recommended.includes(id);
        const Icon = iconFor(goal.icon);
        return (
          <button
            key={id}
            type="button"
            onClick={() => onToggle(id)}
            aria-pressed={active}
            className={`relative flex items-start gap-3.5 rounded-2xl border p-4 text-left transition-all duration-300 ${
              active
                ? "border-teal-700 bg-teal-700 text-cream-50 shadow-lift"
                : "border-teal-900/10 bg-white text-ink hover:border-teal-300 hover:shadow-soft"
            }`}
          >
            <span
              className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl transition-colors duration-300 ${
                active ? "bg-cream-50/15 text-cream-50" : "bg-teal-50 text-teal-700"
              }`}
            >
              <Icon className="h-5 w-5" strokeWidth={1.6} />
            </span>

            <span className="min-w-0 flex-1">
              <span className="flex items-center gap-2">
                <span className="font-display text-base font-semibold leading-snug">
                  {l(goal.name)}
                </span>
                {suggested && (
                  <span
                    className={`shrink-0 rounded-full px-2 py-0.5 text-[0.6rem] font-semibold uppercase tracking-wide ${
                      active
                        ? "bg-cream-50/20 text-cream-50"
                        : "bg-gold-100 text-gold-600"
                    }`}
                  >
                    {t.result.suggested}
                  </span>
                )}
              </span>
              <span
                className={`mt-1 block text-xs leading-relaxed ${
                  active ? "text-cream-50/85" : "text-ink-soft"
                }`}
              >
                {l(goal.description)}
              </span>
            </span>

            {active && (
              <Check className="absolute right-3 top-3 h-4 w-4 text-cream-50" />
            )}
          </button>
        );
      })}
    </div>
  );
}
