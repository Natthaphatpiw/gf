"use client";

import { useState } from "react";
import { ArrowRight, Compass } from "lucide-react";
import type { Archetype } from "@/lib/types";
import { useL, useT } from "@/lib/i18n";
import assessment from "@/lib/i18n/dictionaries/assessment";
import { ButtonLink } from "@/components/ui/Button";
import { CodeLetters } from "@/components/assessment/CodeLetters";
import { ShareIcons } from "@/components/ui/ShareIcons";

interface ArchetypeShareClientProps {
  archetype: Archetype;
  characterSrc: string;
  shareUrl: string;
  shareImageUrl: string;
}

export function ArchetypeShareClient({
  archetype,
  characterSrc,
  shareUrl,
  shareImageUrl,
}: ArchetypeShareClientProps) {
  const t = useT(assessment);
  const l = useL();
  const publicShare = t.result.publicShare;
  const shareTitle = `${t.result.shareActionTitle} - ${l(archetype.name)}`;
  const axisLabels = archetype.code
    .slice(0, 4)
    .split("")
    .map((ch) => axisName(t.result.axisNames, ch));

  return (
    <div className="mx-auto max-w-6xl px-4 pb-12 pt-5 sm:px-6 md:pt-10">
      <section className="animate-rise overflow-hidden rounded-[2rem] border border-teal-900/10 bg-cream-50 shadow-lift">
        <div className="grid items-center gap-6 p-5 sm:p-7 md:grid-cols-[0.92fr_1.08fr] md:gap-10 md:p-10">
          <CharacterArtwork src={characterSrc} alt={l(archetype.name)} />

          <div className="min-w-0">
            <p className="eyebrow">{publicShare.eyebrow}</p>
            <h1 className="mt-3 font-display text-4xl font-semibold leading-tight text-teal-900 sm:text-5xl md:text-6xl">
              {l(archetype.name)}
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-ink-soft sm:text-base">
              {publicShare.lead}
            </p>

            <div className="mt-6">
              <CodeLetters code={archetype.code} />
            </div>

            <div className="mt-7 divide-y divide-teal-900/10 border-y border-teal-900/10">
              <ResultFact label={publicShare.codeEyebrow} value={archetype.code} mono />
              <ResultFact
                label={t.result.rhythmLabel}
                value={`${axisLabels[0]} / ${axisLabels[1]}`}
              />
              <ResultFact
                label={t.result.compassLabel}
                value={`${axisLabels[2]} / ${axisLabels[3]}`}
              />
            </div>

            <p className="mt-5 text-sm leading-relaxed text-ink-soft sm:text-base">
              {l(archetype.description)}
            </p>
          </div>
        </div>
      </section>

      <section className="animate-rise-1 mx-auto mt-8 grid max-w-3xl gap-4 rounded-3xl border border-teal-900/10 bg-white p-6 text-center shadow-soft md:p-7">
        <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-teal-50 text-teal-700">
          <Compass className="h-6 w-6" strokeWidth={1.7} />
        </div>
        <div>
          <h2 className="font-display text-xl font-semibold text-teal-900">
            {publicShare.shareTitle}
          </h2>
          <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-ink-soft">
            {publicShare.shareLead}
          </p>
        </div>
        <ShareIcons
          labels={t.result.shareActions}
          shareTitle={shareTitle}
          shareText={shareTitle}
          shareUrl={shareUrl}
          shareImageUrl={shareImageUrl}
        />
      </section>

      <section className="animate-rise-2 mx-auto mt-8 grid max-w-3xl gap-3 sm:flex sm:items-center sm:justify-center">
        <ButtonLink href="/assessment" size="lg" className="w-full sm:w-auto">
          {publicShare.cta}
          <ArrowRight className="h-5 w-5" />
        </ButtonLink>
        <ButtonLink href="/packages" variant="secondary" size="lg" className="w-full sm:w-auto">
          {publicShare.packagesCta}
        </ButtonLink>
      </section>
    </div>
  );
}

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
    <div className="grid grid-cols-[7.5rem_1fr] gap-4 py-3 text-left text-sm sm:grid-cols-[9rem_1fr]">
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
