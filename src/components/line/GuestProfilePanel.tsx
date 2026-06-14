"use client";

import { useL, useT } from "@/lib/i18n";
import lineDict from "@/lib/i18n/dictionaries/line";
import { GOALS } from "@/data/goals";
import type { Score } from "@/lib/types";
import type { GuestProfile } from "@/lib/line-context";

/* The "who is this guest" card shown to the expert in both LIFF apps. */

export function GuestProfilePanel({
  profile,
  guestName,
  itemName,
  note,
}: {
  profile: GuestProfile | null;
  guestName?: string;
  itemName: string;
  note?: string;
}) {
  const t = useT(lineDict);
  const l = useL();

  return (
    <section className="rounded-[1rem] border border-teal-900/10 bg-white p-4 shadow-soft">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[0.66rem] font-semibold uppercase tracking-[0.12em] text-gold-600">
            {t.guest.title}
          </p>
          {guestName && (
            <p className="mt-0.5 font-display text-lg font-semibold text-teal-900">{guestName}</p>
          )}
        </div>
        {profile && (
          <span className="flex-none rounded-full bg-teal-50 px-2.5 py-1 text-[0.7rem] font-semibold text-teal-700">
            {profile.archetype.code}
          </span>
        )}
      </div>

      <div className="mt-3 rounded-[0.7rem] bg-cream-100 px-3 py-2">
        <p className="text-[0.66rem] font-semibold uppercase tracking-[0.1em] text-ink-faint">
          {t.guest.forItem}
        </p>
        <p className="text-[0.86rem] font-semibold text-teal-900">{itemName}</p>
        {note && <p className="mt-1 text-[0.82rem] text-ink-soft">“{note}”</p>}
      </div>

      {!profile ? (
        <p className="mt-3 rounded-[0.7rem] bg-cream-100 px-3 py-2 text-[0.82rem] text-ink-soft">
          {t.guest.noProfile}
        </p>
      ) : (
        <>
          <div className="mt-3">
            <p className="text-[0.84rem] font-semibold text-teal-900">{l(profile.archetype.name)}</p>
            <p className="mt-0.5 text-[0.8rem] leading-relaxed text-ink-soft">
              {l(profile.archetype.description)}
            </p>
          </div>

          <div className="mt-3 space-y-2">
            <ScoreRow label={t.guest.stress} score={profile.scores.stress} />
            <ScoreRow label={t.guest.migraine} score={profile.scores.migraine} />
            <ScoreRow label={t.guest.mental} score={profile.scores.mental} />
          </div>

          {profile.traits.length > 0 && (
            <div className="mt-3">
              <p className="text-[0.66rem] font-semibold uppercase tracking-[0.1em] text-ink-faint">
                {t.guest.traits}
              </p>
              <ul className="mt-1 space-y-1">
                {profile.traits.map((trait, i) => (
                  <li key={i} className="flex gap-1.5 text-[0.82rem] text-ink-soft">
                    <span className="mt-1.5 h-1 w-1 flex-none rounded-full bg-gold-500" />
                    <span>{l(trait)}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {profile.recommendedGoals.length > 0 && (
            <div className="mt-3">
              <p className="text-[0.66rem] font-semibold uppercase tracking-[0.1em] text-ink-faint">
                {t.guest.goals}
              </p>
              <div className="mt-1.5 flex flex-wrap gap-1.5">
                {profile.recommendedGoals.map((g) => (
                  <span
                    key={g}
                    className="rounded-full bg-sage-100 px-2.5 py-0.5 text-[0.74rem] font-medium text-teal-800"
                  >
                    {l(GOALS[g]?.name)}
                  </span>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </section>
  );

  function ScoreRow({ label, score }: { label: string; score: Score }) {
    const band =
      score.band === "high"
        ? t.guest.bandHigh
        : score.band === "moderate"
          ? t.guest.bandModerate
          : t.guest.bandLow;
    return (
      <div>
        <div className="flex items-center justify-between text-[0.78rem]">
          <span className="text-ink-soft">{label}</span>
          <span className="font-semibold text-teal-900">
            {score.value} · {band}
          </span>
        </div>
        <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-cream-200">
          <div
            className="h-full rounded-full bg-teal-600"
            style={{ width: `${Math.max(0, Math.min(100, score.value))}%` }}
          />
        </div>
      </div>
    );
  }
}
