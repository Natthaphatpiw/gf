"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Loader2, Sparkles } from "lucide-react";
import type {
  PackageRecommendation,
  RecommendResponse,
  WellnessProfile,
} from "@/lib/types";
import { useLocale, useT } from "@/lib/i18n";
import packagesDict from "@/lib/i18n/dictionaries/packages";
import { ButtonLink } from "@/components/ui/Button";
import { FamilyGate } from "@/components/packages/FamilyGate";
import { RecommendationResults } from "@/components/packages/RecommendationResults";
import { ExploreGrid } from "@/components/packages/ExploreGrid";
import {
  getStoredProfile,
  getStoredGoals,
  getFamilyIds,
} from "@/lib/session";

/* ============================================================
 * /packages — guided discovery flow (client state machine).
 *
 *   Stage A  Family gate         (only when a profile exists)
 *   Stage B  Curating + 6 recs   (cached in sessionStorage)
 *   Stage C  Explore all 15      (always at the bottom)
 *
 * When no profile exists we skip A/B and show an invitation to
 * take the assessment, plus the full Explore grid.
 * ============================================================ */

const RECS_KEY = "gc-recs";

type Stage = "loading" | "gate" | "curating" | "results" | "no-profile";

interface CachedRecs {
  assessmentId: string;
  recommendations: PackageRecommendation[];
}

export default function PackagesPage() {
  const t = useT(packagesDict);
  const { locale } = useLocale();

  const [stage, setStage] = useState<Stage>("loading");
  const [profile, setProfile] = useState<WellnessProfile | null>(null);
  const [recommendations, setRecommendations] = useState<
    PackageRecommendation[]
  >([]);
  const [recurating, setRecurating] = useState(false);
  const [error, setError] = useState(false);
  const localeRef = useRef(locale);
  localeRef.current = locale;

  /* ----- Initial mount: read session, restore cached recs ----- */
  useEffect(() => {
    const p = getStoredProfile();
    if (!p) {
      setStage("no-profile");
      return;
    }
    setProfile(p);

    try {
      const cached = sessionStorage.getItem(RECS_KEY);
      if (cached) {
        const parsed = JSON.parse(cached) as CachedRecs;
        if (
          parsed.assessmentId === p.id &&
          Array.isArray(parsed.recommendations) &&
          parsed.recommendations.length > 0
        ) {
          setRecommendations(parsed.recommendations);
          setStage("results");
          return;
        }
      }
    } catch {
      /* ignore corrupt cache */
    }
    setStage("gate");
  }, []);

  /* ----- Call the recommender ----- */
  const fetchRecs = useCallback(
    async (assessmentId: string, familyIds: string[]) => {
      setError(false);
      try {
        const res = await fetch("/api/recommend", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            assessmentId,
            goals: getStoredGoals(),
            familyAssessmentIds: familyIds,
            locale: localeRef.current,
          }),
        });
        if (!res.ok) throw new Error("recommend failed");
        const data = (await res.json()) as RecommendResponse;
        const recs = data.recommendations ?? [];
        if (recs.length === 0) throw new Error("empty recommendations");
        setRecommendations(recs);
        try {
          sessionStorage.setItem(
            RECS_KEY,
            JSON.stringify({ assessmentId, recommendations: recs }),
          );
        } catch {
          /* sessionStorage full / unavailable — non-fatal */
        }
        return true;
      } catch {
        setError(true);
        return false;
      }
    },
    [],
  );

  /* ----- Stage A complete -> curate ----- */
  const handleGateComplete = useCallback(
    async (familyIds: string[]) => {
      if (!profile) return;
      setStage("curating");
      const ok = await fetchRecs(profile.id, familyIds);
      setStage(ok ? "results" : "results");
    },
    [profile, fetchRecs],
  );

  /* ----- Re-curate from the results view ----- */
  const handleRecurate = useCallback(async () => {
    if (!profile || recurating) return;
    setRecurating(true);
    await fetchRecs(profile.id, getFamilyIds());
    setRecurating(false);
  }, [profile, recurating, fetchRecs]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 md:px-6 md:py-12">
      {/* Page header */}
      <header className="animate-rise mb-8 text-center md:mb-12">
        <p className="eyebrow">{t.page.eyebrow}</p>
        <h1 className="mt-2 font-display text-4xl font-semibold text-teal-900 md:text-5xl">
          {t.page.title}
        </h1>
        <div className="ornament mt-4" />
        <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-ink-soft md:text-base">
          {t.page.intro}
        </p>
      </header>

      <div className="space-y-14 md:space-y-20">
        {/* ---- No-profile invitation ---- */}
        {stage === "no-profile" && (
          <section className="animate-rise overflow-hidden rounded-3xl border border-teal-900/10 bg-gradient-to-br from-teal-700 to-teal-900 p-8 text-center text-cream-50 shadow-lift md:p-12">
            <span className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-cream-50/10">
              <Sparkles className="h-6 w-6 text-gold-200" />
            </span>
            <p className="eyebrow mt-4 text-gold-200">{t.invite.eyebrow}</p>
            <h2 className="mt-2 font-display text-2xl font-semibold md:text-3xl">
              {t.invite.title}
            </h2>
            <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-cream-100/90">
              {t.invite.body}
            </p>
            <div className="mt-6">
              <ButtonLink href="/assessment" variant="gold" size="lg">
                {t.invite.cta}
              </ButtonLink>
            </div>
          </section>
        )}

        {/* ---- Stage A: family gate ---- */}
        {stage === "gate" && <FamilyGate onComplete={handleGateComplete} />}

        {/* ---- Stage B: curating loading ---- */}
        {stage === "curating" && (
          <section className="animate-fade flex flex-col items-center justify-center rounded-3xl border border-teal-900/10 bg-white py-20 text-center shadow-soft">
            <span className="relative grid h-16 w-16 place-items-center">
              <span className="animate-breathe absolute inset-0 rounded-full bg-teal-100" />
              <Loader2 className="relative h-7 w-7 animate-spin text-teal-700" />
            </span>
            <h2 className="mt-5 font-display text-2xl font-semibold text-teal-900">
              {t.curate.loadingTitle}
            </h2>
            <p className="mt-2 max-w-xs text-sm leading-relaxed text-ink-soft">
              {t.curate.loadingBody}
            </p>
          </section>
        )}

        {/* ---- Stage B: results ---- */}
        {stage === "results" && (
          <>
            {error && recommendations.length === 0 ? (
              <p className="rounded-2xl border border-gold-200 bg-gold-100/50 px-4 py-3 text-center text-sm text-gold-600">
                {t.curate.error}
              </p>
            ) : (
              <RecommendationResults
                recommendations={recommendations}
                onRecurate={handleRecurate}
                recurating={recurating}
              />
            )}
          </>
        )}

        {/* ---- Stage C: explore all (always) ---- */}
        <ExploreGrid />
      </div>
    </div>
  );
}
