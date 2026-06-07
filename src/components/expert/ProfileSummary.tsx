"use client";

import { Sparkles, Target } from "lucide-react";
import { useL, useT } from "@/lib/i18n";
import expert from "@/lib/i18n/dictionaries/expert";
import { getGoal } from "@/data/goals";
import { bandColor } from "@/components/expert/format";
import type { Score, WellnessProfile } from "@/lib/types";

/* ============================================================
 * ProfileSummary — humane rendering of one assessment profile:
 * archetype, the three wellness scores as band-coloured bars,
 * traits and recommended goals.
 * ============================================================ */

function ScoreBar({ label, score }: { label: string; score: Score }) {
  const l = useL();
  const color = bandColor(score.band);
  return (
    <div className="space-y-1.5">
      <div className="flex items-baseline justify-between gap-2">
        <span className="text-xs font-medium text-ink">{label}</span>
        <span
          className="font-display text-sm font-bold tabular-nums"
          style={{ color }}
        >
          {score.value}
        </span>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-teal-50">
        <div
          className="h-full rounded-full transition-all"
          style={{
            width: `${Math.max(0, Math.min(100, score.value))}%`,
            backgroundColor: color,
          }}
        />
      </div>
      <p className="text-[0.68rem] leading-relaxed text-ink-faint">
        {l(score.summary)}
      </p>
    </div>
  );
}

export function ProfileSummary({
  profile,
  heading,
}: {
  profile: WellnessProfile | null;
  heading?: string;
}) {
  const t = useT(expert).bench.profile;
  const l = useL();

  if (!profile) {
    return (
      <div className="rounded-2xl border border-teal-900/10 bg-cream-50 p-4">
        {heading && (
          <p className="mb-1 text-[0.65rem] font-semibold uppercase tracking-[0.12em] text-ink-faint">
            {heading}
          </p>
        )}
        <p className="text-sm italic text-ink-faint">{t.none}</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-teal-900/10 bg-white p-4 shadow-soft">
      {/* archetype */}
      <div className="mb-4 flex items-start gap-3 border-b border-teal-900/10 pb-4">
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-teal-50 text-teal-600">
          <Sparkles className="h-5 w-5" />
        </span>
        <div className="min-w-0">
          <p className="text-[0.62rem] font-semibold uppercase tracking-[0.12em] text-ink-faint">
            {heading ?? t.archetype}
            <span className="ml-2 font-mono text-teal-500">{profile.id}</span>
          </p>
          <h4 className="font-display text-lg font-semibold leading-snug text-teal-900">
            {l(profile.archetype.name)}
            <span className="ml-2 align-middle text-[0.65rem] font-medium text-gold-600">
              {profile.archetype.code}
            </span>
          </h4>
        </div>
      </div>

      {/* scores */}
      <p className="mb-3 text-[0.62rem] font-semibold uppercase tracking-[0.12em] text-ink-faint">
        {t.scores}
      </p>
      <div className="grid gap-4 sm:grid-cols-3">
        <ScoreBar label={t.stress} score={profile.stress} />
        <ScoreBar label={t.migraine} score={profile.migraine} />
        <ScoreBar label={t.mental} score={profile.mental} />
      </div>

      {/* traits */}
      {profile.traits.length > 0 && (
        <div className="mt-4 border-t border-teal-900/10 pt-4">
          <p className="mb-2 text-[0.62rem] font-semibold uppercase tracking-[0.12em] text-ink-faint">
            {t.traits}
          </p>
          <ul className="space-y-1.5">
            {profile.traits.map((trait, i) => (
              <li
                key={i}
                className="flex gap-2 text-xs leading-relaxed text-ink-soft"
              >
                <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-gold-400" />
                {l(trait)}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* goals */}
      {profile.recommendedGoals.length > 0 && (
        <div className="mt-4 border-t border-teal-900/10 pt-4">
          <p className="mb-2 flex items-center gap-1.5 text-[0.62rem] font-semibold uppercase tracking-[0.12em] text-ink-faint">
            <Target className="h-3 w-3" />
            {t.goals}
          </p>
          <div className="flex flex-wrap gap-2">
            {profile.recommendedGoals.map((g) => (
              <span
                key={g}
                className="rounded-full bg-sage-100 px-3 py-1 text-[0.68rem] font-medium text-teal-800"
              >
                {l(getGoal(g).name)}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
