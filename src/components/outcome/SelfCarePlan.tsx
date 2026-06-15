"use client";

import { useEffect, useState } from "react";
import { Check, Salad, Wind, HeartPulse, ArrowRight } from "lucide-react";
import { useL, useT } from "@/lib/i18n";
import outcomeDict from "@/lib/i18n/dictionaries/outcome";
import { DIAL_NAMES } from "@/data/checkin";
import { getPackage } from "@/data/packages";
import { ButtonLink } from "@/components/ui/Button";
import { getPlanProgress, togglePlanHabit } from "@/lib/session";
import type { Pillar, SelfCarePlan as SelfCarePlanData } from "@/lib/selfcare-plan";

/* The 30-day self-care plan: daily habits grouped by 3 อ with a
 * per-day check-off (localStorage), four weekly milestones, and a
 * re-engagement pick — the retention loop between T2 and T3. */

const PILLAR_ICON: Record<Pillar, typeof Salad> = {
  food: Salad,
  air: Wind,
  mind: HeartPulse,
};
const PILLAR_ORDER: Pillar[] = ["food", "air", "mind"];

export function SelfCarePlan({
  bookingId,
  plan,
}: {
  bookingId: string;
  plan: SelfCarePlanData;
}) {
  const t = useT(outcomeDict);
  const l = useL();
  const [done, setDone] = useState<string[]>([]);

  useEffect(() => {
    setDone(getPlanProgress(bookingId));
  }, [bookingId]);

  const toggle = (habitId: string) => setDone(togglePlanHabit(bookingId, habitId));

  const total = plan.habits.length;
  const completed = plan.habits.filter((h) => done.includes(h.id)).length;
  const allDone = total > 0 && completed === total;

  const byPillar = PILLAR_ORDER.map((pillar) => ({
    pillar,
    habits: plan.habits.filter((h) => h.pillar === pillar),
  })).filter((g) => g.habits.length > 0);

  const reEngagePkg = plan.reEngagement ? getPackage(plan.reEngagement.packageId) : undefined;

  return (
    <section className="rounded-3xl border border-teal-900/10 bg-white p-6 shadow-soft md:p-7">
      <p className="eyebrow">{t.plan.title}</p>
      <p className="mt-2 text-sm leading-relaxed text-ink-soft">{t.plan.subtitle}</p>

      {/* focus dials */}
      {plan.focusDials.length > 0 && (
        <div className="mt-4">
          <p className="text-[0.7rem] font-semibold uppercase tracking-[0.1em] text-gold-600">
            {t.plan.focusTitle}
          </p>
          <div className="mt-1.5 flex flex-wrap gap-1.5">
            {plan.focusDials.map((d) => (
              <span
                key={d}
                className="rounded-full bg-sage-100 px-3 py-0.5 text-[0.78rem] font-medium text-teal-800"
              >
                {l(DIAL_NAMES[d])}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* daily habits with check-off */}
      <div className="mt-5">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold text-teal-900">{t.plan.dailyTitle}</p>
          <span className="text-[0.78rem] font-semibold text-teal-700">
            {t.plan.progressLabel} {completed} {t.plan.ofTotal} {total}
          </span>
        </div>
        <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-cream-200">
          <div
            className="h-full rounded-full bg-teal-600 transition-all duration-500"
            style={{ width: `${total ? (completed / total) * 100 : 0}%` }}
          />
        </div>

        <div className="mt-4 space-y-4">
          {byPillar.map(({ pillar, habits }) => {
            const Icon = PILLAR_ICON[pillar];
            return (
              <div key={pillar}>
                <p className="flex items-center gap-1.5 text-[0.72rem] font-semibold uppercase tracking-[0.1em] text-ink-faint">
                  <Icon className="h-3.5 w-3.5 text-teal-600" />
                  {t.plan.pillars[pillar]}
                </p>
                <ul className="mt-1.5 space-y-1.5">
                  {habits.map((h) => {
                    const checked = done.includes(h.id);
                    return (
                      <li key={h.id}>
                        <button
                          type="button"
                          onClick={() => toggle(h.id)}
                          aria-pressed={checked}
                          className={`flex w-full items-start gap-2.5 rounded-[0.8rem] border px-3 py-2.5 text-left transition-colors ${
                            checked
                              ? "border-teal-600/40 bg-teal-50"
                              : "border-teal-900/10 bg-cream-50 hover:bg-teal-50/50"
                          }`}
                        >
                          <span
                            className={`mt-0.5 grid h-5 w-5 flex-none place-items-center rounded-full border ${
                              checked
                                ? "border-teal-600 bg-teal-600 text-cream-50"
                                : "border-teal-900/20 bg-white"
                            }`}
                          >
                            {checked && <Check className="h-3.5 w-3.5" />}
                          </span>
                          <span
                            className={`text-[0.86rem] leading-snug ${
                              checked ? "text-teal-800" : "text-ink"
                            }`}
                          >
                            {l(h.text)}
                          </span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            );
          })}
        </div>

        <p className="mt-3 text-[0.74rem] text-ink-faint">
          {allDone ? t.plan.allDone : t.plan.resetNote}
        </p>
      </div>

      {/* four-week path */}
      <div className="mt-6 border-t border-teal-900/10 pt-5">
        <p className="text-sm font-semibold text-teal-900">{t.plan.weeksTitle}</p>
        <ol className="mt-3 space-y-2.5">
          {plan.weeks.map((w) => (
            <li key={w.week} className="flex gap-3">
              <span className="grid h-7 w-7 flex-none place-items-center rounded-full bg-teal-50 text-[0.78rem] font-bold text-teal-700">
                {w.week}
              </span>
              <div className="min-w-0">
                <p className="text-[0.86rem] font-semibold text-teal-900">{l(w.theme)}</p>
                <p className="text-[0.8rem] leading-relaxed text-ink-soft">{l(w.focus)}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>

      {/* re-engagement */}
      {plan.reEngagement && reEngagePkg && (
        <div className="mt-6 rounded-[1rem] border border-gold-400/40 bg-gold-100/30 p-4">
          <p className="text-[0.92rem] font-semibold text-teal-900">{t.reEngage.title}</p>
          <p className="mt-1 text-[0.82rem] leading-relaxed text-ink-soft">{t.reEngage.subtitle}</p>
          <div className="mt-3 rounded-[0.8rem] bg-white/70 px-3.5 py-2.5">
            <p className="text-[0.86rem] font-semibold text-teal-900">{l(reEngagePkg.name)}</p>
            <p className="mt-0.5 text-[0.8rem] leading-relaxed text-ink-soft">
              {l(plan.reEngagement.reason)}
            </p>
          </div>
          <div className="mt-3">
            <ButtonLink href={`/packages/${reEngagePkg.id}`} size="sm">
              {t.reEngage.cta}
              <ArrowRight className="h-4 w-4" />
            </ButtonLink>
          </div>
        </div>
      )}
    </section>
  );
}
