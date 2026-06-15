"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Check,
  ChevronLeft,
  Compass,
  Loader2,
  Quote,
  Sparkles,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import type { DialDelta, DialKey, WellnessCheckin } from "@/lib/types";
import type { JourneyData } from "@/lib/journey";
import {
  DIAL_DIRECTION,
  DIAL_KEYS,
  DIAL_NAMES,
  DELTA_DEADBAND,
  dialGoodness,
} from "@/data/checkin";
import { getPackage } from "@/data/packages";
import { generate30DayPlan } from "@/lib/selfcare-plan";
import { useL, useT } from "@/lib/i18n";
import outcomeDict from "@/lib/i18n/dictionaries/outcome";
import { ButtonLink } from "@/components/ui/Button";
import { OutcomeCard, type ShareDialRow } from "@/components/outcome/OutcomeCard";
import { SelfCarePlan } from "@/components/outcome/SelfCarePlan";

/* ============================================================
 * JourneyClient — the consolidated pre/post page for one booking.
 * Pulls the whole arc (baseline → T2 → T3), shows the tangible
 * headline change, the five-dial arc, a shareable card, the
 * 30-day self-care plan and the next-step CTA.
 * ============================================================ */

const GOOD_HEX: Record<"good" | "mid" | "needs-care", string> = {
  good: "#2e8377",
  mid: "#b99355",
  "needs-care": "#bf6b4f",
};

const THIRTY_DAYS = 30 * 24 * 60 * 60 * 1000;

export function JourneyClient({ bookingId }: { bookingId: string }) {
  const o = useT(outcomeDict);
  const t = o.journey;
  const tShare = o.share;
  const l = useL();
  const [data, setData] = useState<JourneyData | null>(null);
  const [state, setState] = useState<"loading" | "ready" | "notfound">("loading");

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const res = await fetch(`/api/journey/${encodeURIComponent(bookingId)}`);
        if (!res.ok) {
          if (active) setState("notfound");
          return;
        }
        const json = (await res.json()) as JourneyData;
        if (active) {
          setData(json);
          setState("ready");
        }
      } catch {
        if (active) setState("notfound");
      }
    })();
    return () => {
      active = false;
    };
  }, [bookingId]);

  const derived = useMemo(() => {
    if (!data) return null;
    const t1 = data.checkins.find((c) => c.timepoint === "T1");
    const t2 = data.checkins.find((c) => c.timepoint === "T2");
    const t3 = data.checkins.find((c) => c.timepoint === "T3");
    const latest: WellnessCheckin | undefined = t3 ?? t2;
    const baselineDials = data.baseline?.dials;
    const deltas =
      latest && latest.deltasComparable !== false ? latest.deltas : undefined;
    return { t1, t2, t3, latest, baselineDials, deltas };
  }, [data]);

  if (state === "loading") {
    return (
      <div className="grid place-items-center px-5 py-28">
        <Loader2 className="h-7 w-7 animate-spin text-teal-500" />
      </div>
    );
  }

  if (state === "notfound" || !data || !derived) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-lg flex-col items-center justify-center px-6 text-center">
        <h2 className="font-display text-2xl font-semibold text-teal-900">{t.notFound}</h2>
        <div className="mt-7">
          <ButtonLink href="/bookings">{t.back}</ButtonLink>
        </div>
      </div>
    );
  }

  const { t2, t3, latest, baselineDials, deltas } = derived;
  const pkg = getPackage(data.booking.packageId);
  const hasOutcome = Boolean(latest);
  // Only show a before→after comparison when the baseline used the same
  // instrument version (the engine suppresses deltas otherwise).
  const comparable = Boolean(baselineDials) && latest?.deltasComparable !== false;

  // Headline: biggest improved delta vs baseline.
  const headline = (() => {
    if (!deltas) return null;
    const improved = deltas
      .filter((d) => d.trend === "improved")
      .sort((a, b) => Math.abs(b.delta) - Math.abs(a.delta));
    if (improved.length === 0) return null;
    const top = improved[0];
    return {
      dial: top.dial,
      magnitude: Math.abs(top.delta),
      direction: (DIAL_DIRECTION[top.dial] === "lowerIsBetter" ? "down" : "up") as
        | "down"
        | "up",
    };
  })();

  const deltaFor = (dial: DialKey): DialDelta | undefined =>
    deltas?.find((d) => d.dial === dial);

  // Share-card rows (baseline → latest) — only when comparable.
  const shareRows: ShareDialRow[] =
    comparable && baselineDials && latest
      ? DIAL_KEYS.map((dial) => ({
          name: l(DIAL_NAMES[dial]),
          before: baselineDials[dial].value,
          after: latest.dials[dial].value,
          color: GOOD_HEX[dialGoodness(dial, latest.dials[dial].value)],
        }))
      : [];

  const plan = latest
    ? generate30DayPlan({ latestDials: latest.dials, archetypeName: data.archetypeName })
    : null;

  const shareUrl =
    typeof window !== "undefined" ? `${window.location.origin}/journey/${data.booking.id}` : "";

  // Stage timeline.
  const hasBaseline = Boolean(baselineDials);
  const stages = [
    { key: "baseline", label: t.stages.baseline, done: hasBaseline },
    { key: "program", label: t.stages.program, done: true },
    { key: "after", label: t.stages.after, done: Boolean(t2) },
    { key: "followup", label: t.stages.followup, done: Boolean(t3) },
  ];

  // 30-day follow-up readiness.
  const t3Ready =
    t2 != null && Date.parse(t2.createdAt) + THIRTY_DAYS <= Date.now();

  return (
    <div className="mx-auto max-w-2xl px-5 pb-14 pt-6 md:pt-10">
      <Link
        href={`/bookings/${data.booking.id}`}
        className="animate-fade inline-flex items-center gap-1 text-xs font-medium text-teal-700 transition-colors hover:text-teal-900"
      >
        <ChevronLeft className="h-4 w-4" />
        {t.back}
      </Link>

      <header className="animate-rise mt-4">
        <p className="eyebrow">{t.eyebrow}</p>
        <h1 className="font-display mt-1.5 text-3xl font-semibold leading-tight text-teal-900 md:text-4xl">
          {t.title}
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-ink-soft">{t.intro}</p>
        {pkg && (
          <p className="mt-1 text-[0.78rem] text-ink-faint">
            {data.booking.guestFirstName ? `${data.booking.guestFirstName} · ` : ""}
            {l(pkg.name)} · {data.booking.id}
          </p>
        )}
      </header>

      {/* Stage timeline */}
      <ol className="animate-rise-1 mt-6 flex items-center gap-1.5">
        {stages.map((s, i) => (
          <li key={s.key} className="flex flex-1 flex-col items-center text-center">
            <span
              className={`grid h-8 w-8 place-items-center rounded-full text-[0.7rem] font-bold ${
                s.done ? "bg-teal-600 text-cream-50" : "bg-cream-200 text-ink-faint"
              }`}
            >
              {s.done ? <Check className="h-4 w-4" /> : i + 1}
            </span>
            <span
              className={`mt-1.5 text-[0.64rem] leading-tight ${
                s.done ? "font-semibold text-teal-800" : "text-ink-faint"
              }`}
            >
              {s.label}
            </span>
          </li>
        ))}
      </ol>

      {!hasOutcome ? (
        /* Before any post-program check-in. */
        <div className="animate-rise-2 mt-7 rounded-3xl border border-teal-900/10 bg-white p-7 text-center shadow-soft">
          <Sparkles className="mx-auto h-7 w-7 text-gold-500" />
          <h2 className="font-display mt-3 text-xl font-semibold text-teal-900">
            {t.pendingTitle}
          </h2>
          <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-ink-soft">
            {t.pendingBody}
          </p>
          <div className="mt-5">
            <ButtonLink href={`/checkin/${data.booking.id}`}>{t.takeT2}</ButtonLink>
          </div>
        </div>
      ) : (
        <>
          {/* Headline change */}
          <div className="animate-rise-2 mt-7 rounded-3xl border border-teal-900/10 bg-teal-50/60 p-6 shadow-soft">
            <p className="eyebrow">{t.headlineTitle}</p>
            {headline ? (
              <div className="mt-2 flex items-end gap-3">
                <span className="font-display text-5xl font-bold text-teal-700 md:text-6xl">
                  {headline.direction === "down" ? "−" : "+"}
                  {headline.magnitude}
                </span>
                <span className="pb-1.5 text-sm text-ink-soft">
                  {l(DIAL_NAMES[headline.dial])}
                  <span className="mx-1">·</span>
                  {headline.direction === "down" ? t.eased : t.rose} {headline.magnitude}{" "}
                  {t.points}
                </span>
              </div>
            ) : (
              <p className="mt-2 text-base font-semibold text-teal-900">{t.headlineSteady}</p>
            )}
            {latest && (latest.t2 || latest.t3) && (
              <p className="mt-3 flex items-start gap-2 text-sm leading-relaxed text-ink">
                <Quote className="mt-0.5 h-4 w-4 shrink-0 text-gold-500" />
                {l((latest.t3 ?? latest.t2)!.changeNarrative)}
              </p>
            )}
          </div>

          {/* The five-dial arc */}
          <div className="animate-rise-2 mt-6 rounded-3xl border border-teal-900/10 bg-white p-6 shadow-soft">
            <p className="eyebrow flex items-center gap-2">
              <Compass className="h-3.5 w-3.5 text-gold-500" />
              {t.arcTitle}
            </p>
            <div className="mt-4 flex items-center justify-end gap-4 text-[0.66rem] font-medium text-ink-faint">
              {comparable && (
                <span className="flex items-center gap-1.5">
                  <span className="h-2.5 w-4 rounded-full bg-teal-100" />
                  {t.baseline}
                </span>
              )}
              <span className="flex items-center gap-1.5">
                <span className="h-2.5 w-4 rounded-full bg-teal-600" />
                {t3 ? t.day30 : t.afterProgram}
              </span>
            </div>
            <div className="mt-3 space-y-4">
              {DIAL_KEYS.map((dial) => (
                <ArcRow
                  key={dial}
                  name={l(DIAL_NAMES[dial])}
                  before={comparable ? baselineDials?.[dial].value : undefined}
                  after={latest!.dials[dial].value}
                  color={GOOD_HEX[dialGoodness(dial, latest!.dials[dial].value)]}
                  delta={deltaFor(dial)}
                  pointsLabel={t.points}
                />
              ))}
            </div>
          </div>

          {/* Shareable before/after card */}
          {shareRows.length > 0 && (
            <div className="animate-rise-3 mt-8">
              <p className="eyebrow">{tShare.title}</p>
              <p className="mt-1 mb-3 text-sm text-ink-soft">{tShare.subtitle}</p>
              <OutcomeCard
                guestName={data.booking.guestFirstName}
                programName={pkg ? l(pkg.name) : data.booking.id}
                rows={shareRows}
                headline={
                  headline
                    ? {
                        dialName: l(DIAL_NAMES[headline.dial]),
                        magnitude: headline.magnitude,
                        direction: headline.direction,
                      }
                    : null
                }
                refId={(t3 ?? t2)!.id}
                shareUrl={shareUrl}
              />
            </div>
          )}

          {/* 30-day self-care plan */}
          {plan && (
            <div className="animate-rise-3 mt-8">
              <SelfCarePlan bookingId={data.booking.id} plan={plan} />
            </div>
          )}

          {/* 30-day follow-up CTA (until T3 is done) */}
          {!t3 && (
            <div className="animate-rise-3 mt-8 rounded-3xl border border-teal-900/10 bg-cream-100 p-6 text-center">
              <p className="text-sm font-semibold text-teal-900">
                {t3Ready ? t.t3Ready : t.t3LockedNote}
              </p>
              <div className="mt-4">
                <ButtonLink href={`/checkin/${data.booking.id}`} variant={t3Ready ? "primary" : "secondary"}>
                  {t.takeT3}
                  <ArrowRight className="h-4 w-4" />
                </ButtonLink>
              </div>
            </div>
          )}
        </>
      )}

      <p className="mt-8 text-center text-[0.72rem] leading-relaxed text-ink-faint">
        {t.disclaimer}
      </p>
    </div>
  );
}

/* ---------------- one dial arc row ---------------- */

function ArcRow({
  name,
  before,
  after,
  color,
  delta,
  pointsLabel,
}: {
  name: string;
  before?: number;
  after: number;
  color: string;
  delta?: DialDelta;
  pointsLabel: string;
}) {
  const moved = delta ? Math.abs(delta.delta) > DELTA_DEADBAND : false;
  const Icon = !delta || !moved ? null : delta.delta > 0 ? TrendingUp : TrendingDown;
  const trendColor =
    delta?.trend === "improved"
      ? "#1a6b60"
      : delta?.trend === "declined"
        ? "#bf6b4f"
        : "#9a7740";

  return (
    <div>
      <div className="flex items-baseline justify-between gap-3">
        <p className="text-sm font-medium text-teal-900">{name}</p>
        {delta && moved && Icon && (
          <span
            className="inline-flex items-center gap-1 text-[0.72rem] font-semibold"
            style={{ color: trendColor }}
          >
            <Icon className="h-3.5 w-3.5" />
            {delta.delta > 0 ? "+" : "−"}
            {Math.abs(delta.delta)} {pointsLabel}
          </span>
        )}
      </div>
      <div className="mt-2 space-y-1.5">
        {before !== undefined && (
          <div className="flex items-center gap-2.5">
            <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-cream-200/70">
              <div
                className="h-full rounded-full bg-teal-100"
                style={{ width: `${Math.max(2, before)}%` }}
              />
            </div>
            <span className="w-7 shrink-0 text-right text-[0.7rem] font-semibold text-ink-faint">
              {before}
            </span>
          </div>
        )}
        <div className="flex items-center gap-2.5">
          <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-cream-200/70">
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{ width: `${Math.max(2, after)}%`, backgroundColor: color }}
            />
          </div>
          <span className="w-7 shrink-0 text-right text-[0.7rem] font-semibold text-teal-900">
            {after}
          </span>
        </div>
      </div>
    </div>
  );
}
