"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Activity,
  ArrowRight,
  Brain,
  Compass,
  HeartPulse,
  type LucideIcon,
} from "lucide-react";
import type { GoalId, Score, WellnessProfile } from "@/lib/types";
import { useL, useT } from "@/lib/i18n";
import assessment from "@/lib/i18n/dictionaries/assessment";
import { Button, ButtonLink } from "@/components/ui/Button";
import { ShareIcons } from "@/components/ui/ShareIcons";
import { getStoredProfile, storeGoals } from "@/lib/session";
import { CodeLetters } from "@/components/assessment/CodeLetters";
import { UnlockCode } from "@/components/assessment/UnlockCode";
import { GoalSelector } from "@/components/assessment/GoalSelector";
import { getArchetypeCharacter } from "@/data/archetypeCharacters";

/* ============================================================
 * Assessment result — the shareable payoff of the journey.
 * Archetype hero, three wellness gauges, traits, unlock code,
 * share row, goal selection, sticky CTA to packages.
 * ============================================================ */

export default function ResultPage() {
  const router = useRouter();
  const t = useT(assessment);
  const l = useL();

  const [profile, setProfile] = useState<WellnessProfile | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [selected, setSelected] = useState<GoalId[]>([]);

  useEffect(() => {
    const p = getStoredProfile();
    setProfile(p);
    if (p) setSelected(p.recommendedGoals);
    setLoaded(true);
  }, []);

  if (!loaded) return null;

  if (!profile) {
    return (
      <div className="mx-auto flex min-h-[70vh] max-w-md flex-col items-center justify-center px-6 text-center">
        <div className="mb-5 grid h-16 w-16 place-items-center rounded-full bg-teal-50 text-teal-600">
          <Compass className="h-8 w-8" strokeWidth={1.5} />
        </div>
        <h1 className="font-display text-2xl font-semibold text-teal-900">
          {t.result.empty.title}
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-ink-soft">
          {t.result.empty.lead}
        </p>
        <div className="mt-7">
          <ButtonLink href="/assessment">
            {t.result.empty.cta}
            <ArrowRight className="h-4 w-4" />
          </ButtonLink>
        </div>
      </div>
    );
  }

  const toggleGoal = (id: GoalId) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((g) => g !== id) : [...prev, id],
    );
  };

  const onCraft = () => {
    storeGoals(selected.length ? selected : profile.recommendedGoals);
    router.push("/packages");
  };

  const character = getArchetypeCharacter(profile.archetype.code, profile.gender);
  const axisLabels = profile.archetype.code
    .slice(0, 4)
    .split("")
    .map((ch) => axisName(t.result.axisNames, ch));

  return (
    <div className="mx-auto max-w-6xl px-4 pb-8 pt-5 sm:px-6 md:pt-10">
      {/* ---------- archetype hero ---------- */}
      <section className="animate-rise overflow-hidden rounded-[2rem] border border-teal-900/10 bg-cream-50 shadow-lift">
        <div className="grid items-center gap-6 p-5 sm:p-7 md:grid-cols-[0.9fr_1.1fr] md:gap-10 md:p-10">
          {character && (
            <CharacterArtwork
              src={character.src}
              alt={l(profile.archetype.name)}
            />
          )}

          <div className="min-w-0">
            <p className="eyebrow">{t.result.heroEyebrow}</p>
            <h1 className="mt-3 font-display text-4xl font-semibold leading-tight text-teal-900 sm:text-5xl md:text-6xl">
              {l(profile.archetype.name)}
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-ink-soft sm:text-base">
              {t.result.heroLead}
            </p>

            <div className="mt-6">
              <CodeLetters code={profile.archetype.code} />
            </div>

            <div className="mt-7 divide-y divide-teal-900/10 border-y border-teal-900/10">
              <ResultFact label={t.result.typeLabel} value={l(profile.archetype.name)} />
              <ResultFact label={t.result.yourCode} value={profile.archetype.code} mono />
              <ResultFact
                label={t.result.rhythmLabel}
                value={`${axisLabels[0]} · ${axisLabels[1]}`}
              />
              <ResultFact
                label={t.result.compassLabel}
                value={`${axisLabels[2]} · ${axisLabels[3]}`}
              />
            </div>
            <p className="mt-5 text-sm leading-relaxed text-ink-soft sm:text-base">
              {l(profile.archetype.description)}
            </p>
          </div>
        </div>
      </section>

      {/* ---------- wellness dials ---------- */}
      <section className="animate-rise-1 mt-10">
        <div className="text-center">
          <p className="eyebrow">{t.result.dialEyebrow}</p>
          <h2 className="mt-2 font-display text-3xl font-semibold text-teal-900 md:text-4xl">
            {t.result.dialTitle}
          </h2>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <MetricCard
            label={t.result.stress}
            score={profile.stress}
            accent="#2e8377"
            icon={Activity}
            outOf={t.result.outOf}
          />
          <MetricCard
            label={t.result.migraine}
            score={profile.migraine}
            accent="#c8a86e"
            icon={HeartPulse}
            outOf={t.result.outOf}
          />
          <MetricCard
            label={t.result.mental}
            score={profile.mental}
            accent="#5a8f7b"
            icon={Brain}
            outOf={t.result.outOf}
          />
        </div>
      </section>

      {/* ---------- traits ---------- */}
      {profile.traits.length > 0 && (
        <section className="animate-rise-2 mt-10 rounded-[2rem] border border-teal-900/10 bg-white p-5 shadow-soft sm:p-7 md:p-8">
          <div className="grid gap-6 md:grid-cols-[0.7fr_1fr] md:gap-10">
            <div>
              <p className="eyebrow">{t.result.traitsEyebrow}</p>
              <h2 className="mt-2 font-display text-3xl font-semibold leading-tight text-teal-900">
                {t.result.traitsTitle}
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-ink-soft">
                {t.result.traitsLead}
              </p>
            </div>
            <ol className="space-y-3">
              {profile.traits.map((trait, i) => (
                <li
                  key={i}
                  className="flex gap-3 rounded-2xl border border-teal-900/10 bg-cream-50 px-4 py-3.5"
                >
                  <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-teal-700 text-xs font-bold text-cream-50">
                    {i + 1}
                  </span>
                  <span className="text-sm leading-relaxed text-ink">
                    {l(trait)}
                  </span>
                </li>
              ))}
            </ol>
          </div>
        </section>
      )}

      {/* ---------- unlock code ---------- */}
      <section className="animate-rise mx-auto mt-8 max-w-3xl">
        <UnlockCode id={profile.id} />
      </section>

      {/* ---------- share ---------- */}
      <section className="animate-rise mx-auto mt-8 max-w-3xl rounded-3xl border border-teal-900/10 bg-white p-6 text-center shadow-soft md:p-7">
        <h2 className="font-display text-xl font-semibold text-teal-900">
          {t.result.shareTitle}
        </h2>
        <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-ink-soft">
          {t.result.shareLead}
        </p>
        <div className="mt-5 flex justify-center">
          <ShareIcons
            labels={t.result.shareActions}
            shareTitle={t.result.shareActionTitle}
          />
        </div>
      </section>

      {/* ---------- goals ---------- */}
      <section className="animate-rise mx-auto mt-10 max-w-3xl">
        <div className="text-center">
          <div className="ornament mx-auto mb-4 w-40" aria-hidden="true" />
          <h2 className="font-display text-2xl font-semibold leading-snug text-teal-900 md:text-3xl">
            {t.result.goalsTitle}
          </h2>
          <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-ink-soft">
            {t.result.goalsLead}
          </p>
        </div>

        <div className="mt-6">
          <GoalSelector
            selected={selected}
            recommended={profile.recommendedGoals}
            onToggle={toggleGoal}
          />
        </div>
      </section>

      {/* ---------- sticky CTA (clears mobile tab bar) ---------- */}
      <div className="sticky bottom-20 z-20 mx-auto mt-8 max-w-3xl md:bottom-4">
        <div className="rounded-full border border-teal-900/10 bg-cream-50/85 p-2 shadow-lift backdrop-blur">
          <Button
            size="lg"
            onClick={onCraft}
            disabled={selected.length === 0}
            className="w-full"
          >
            {t.result.cta}
            <ArrowRight className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}

/* ---------------- result hero helpers ---------------- */

function CharacterArtwork({ src, alt }: { src: string; alt: string }) {
  const [visible, setVisible] = useState(true);
  if (!visible) return null;
  return (
    <div className="mx-auto w-full max-w-sm">
      <div className="relative aspect-square overflow-hidden rounded-[2rem] bg-gradient-to-br from-teal-50 to-gold-100/60">
        <img
          src={src}
          alt={alt}
          className="h-full w-full object-contain p-4"
          onError={() => setVisible(false)}
        />
      </div>
    </div>
  );
}

function ResultFact({
  label,
  value,
  mono = false,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="grid grid-cols-[7.5rem_1fr] gap-4 py-3 text-sm sm:grid-cols-[9rem_1fr]">
      <span className="font-semibold uppercase tracking-wide text-ink-faint">
        {label}
      </span>
      <span
        className={`font-medium text-teal-800 ${
          mono ? "font-mono tracking-[0.16em]" : ""
        }`}
      >
        {value}
      </span>
    </div>
  );
}

function axisName(map: Record<string, string>, letter: string): string {
  return map[letter] ?? letter;
}

/* ---------------- metric card ---------------- */

function MetricCard({
  label,
  score,
  accent,
  icon: Icon,
  outOf,
}: {
  label: string;
  score: Score;
  accent: string;
  icon: LucideIcon;
  outOf: string;
}) {
  const l = useL();
  const t = useT(assessment);
  const value = Math.round(score.value);
  return (
    <div className="overflow-hidden rounded-[1.75rem] border border-teal-900/10 bg-white shadow-soft">
      <div className="p-5">
        <div className="flex items-center justify-between gap-3">
          <span
            className="grid h-10 w-10 place-items-center rounded-2xl text-white"
            style={{ backgroundColor: accent }}
          >
            <Icon className="h-5 w-5" strokeWidth={1.8} />
          </span>
          <span className="rounded-full bg-cream-100 px-3 py-1 text-xs font-semibold text-ink-soft">
            {t.result.band[score.band]}
          </span>
        </div>

        <div className="mt-5 flex items-center gap-4">
          <div
            className="grid h-24 w-24 shrink-0 place-items-center rounded-full"
            style={{
              background: `conic-gradient(${accent} ${value * 3.6}deg, var(--color-cream-200) 0deg)`,
            }}
          >
            <div className="grid h-[4.5rem] w-[4.5rem] place-items-center rounded-full bg-white">
              <span className="font-display text-3xl font-bold text-teal-900">
                {value}
              </span>
            </div>
          </div>
          <div className="min-w-0">
            <h3 className="font-display text-xl font-semibold leading-snug text-teal-900">
              {label}
            </h3>
            <p className="mt-1 text-xs font-medium text-ink-faint">{outOf}</p>
          </div>
        </div>
      </div>
      <div className="border-t border-teal-900/10 bg-cream-50 px-5 py-4">
        <p className="text-sm leading-relaxed text-ink-soft">
          {l(score.summary)}
        </p>
      </div>
    </div>
  );
}
