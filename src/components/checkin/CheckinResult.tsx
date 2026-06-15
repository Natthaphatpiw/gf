"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  ArrowRight,
  Check,
  ChevronLeft,
  Compass,
  HeartHandshake,
  Loader2,
  Minus,
  Quote,
  ShieldCheck,
  Sparkles,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import type { DialDelta, DialKey, WellnessCheckin } from "@/lib/types";
import {
  DELTA_DEADBAND,
  DIAL_KEYS,
  DIAL_NAMES,
  dialGoodness,
} from "@/data/checkin";
import { useL, useT } from "@/lib/i18n";
import checkin from "@/lib/i18n/dictionaries/checkin";
import { getPackage } from "@/data/packages";
import { Button, ButtonLink } from "@/components/ui/Button";
import { GAUGE_COLORS } from "@/components/assessment/WellnessGauge";

/* ============================================================
 * CheckinResult — the before/after compass card.
 *
 * T1: five dials with band labels. T2: before/after bars per
 * dial with the direction-aware trend chip (±5 deadband =
 * "steady"; green means improved along the dial's good
 * direction, never just "the number went up").
 * ============================================================ */

const NEEDS_CARE = "#bf6b4f"; // warm terracotta, same as the gauges

const GOODNESS_COLOR: Record<"good" | "mid" | "needs-care", string> = {
  good: GAUGE_COLORS.calm,
  mid: GAUGE_COLORS.moderate,
  "needs-care": NEEDS_CARE,
};

export function CheckinResult({ checkinId }: { checkinId: string }) {
  const t = useT(checkin);
  const l = useL();

  const [data, setData] = useState<WellnessCheckin | null>(null);
  const [state, setState] = useState<"loading" | "ready" | "notfound">(
    "loading",
  );
  const [testimonialState, setTestimonialState] = useState<
    "idle" | "saving" | "saved"
  >("idle");

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const res = await fetch(`/api/checkin/${encodeURIComponent(checkinId)}`);
        if (!res.ok) {
          if (active) setState("notfound");
          return;
        }
        const result = (await res.json()) as { checkin: WellnessCheckin };
        if (active) {
          setData(result.checkin);
          setTestimonialState(
            result.checkin.testimonialConsent ? "saved" : "idle",
          );
          setState("ready");
        }
      } catch {
        if (active) setState("notfound");
      }
    })();
    return () => {
      active = false;
    };
  }, [checkinId]);

  const grantTestimonial = async () => {
    setTestimonialState("saving");
    try {
      const res = await fetch(`/api/checkin/${encodeURIComponent(checkinId)}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "testimonial_consent", granted: true }),
      });
      if (!res.ok) throw new Error("patch_failed");
      setTestimonialState("saved");
    } catch {
      setTestimonialState("idle");
    }
  };

  if (state === "loading") {
    return (
      <div className="grid place-items-center px-5 py-28">
        <Loader2 className="h-7 w-7 animate-spin text-teal-500" />
      </div>
    );
  }

  if (state === "notfound" || !data) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-lg flex-col items-center justify-center px-6 text-center">
        <h2 className="font-display text-2xl font-semibold text-teal-900">
          {t.notFound.title}
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-ink-soft">
          {t.notFound.body}
        </p>
        <div className="mt-7">
          <ButtonLink href="/bookings">{t.notFound.back}</ButtonLink>
        </div>
      </div>
    );
  }

  // T2 and T3 both carry before/after extras (vs the baseline).
  const isOutcome = data.timepoint !== "T1";
  const extras = data.t2 ?? data.t3;
  const deltas =
    isOutcome && data.deltasComparable !== false ? data.deltas : undefined;
  const deltaFor = (dial: DialKey): DialDelta | undefined =>
    deltas?.find((d) => d.dial === dial);
  const analysis = data.analysis;
  const eyebrow =
    data.timepoint === "T3"
      ? t.result.eyebrowT3
      : data.timepoint === "T2"
        ? t.result.eyebrowT2
        : t.result.eyebrowT1;
  const title =
    data.timepoint === "T3"
      ? t.result.titleT3
      : data.timepoint === "T2"
        ? t.result.titleT2
        : t.result.titleT1;
  const nextPkg = extras?.nextRecommendation
    ? getPackage(extras.nextRecommendation.packageId)
    : undefined;

  return (
    <div className="mx-auto max-w-2xl px-5 pb-12 pt-6 md:pt-10">
      <Link
        href={`/bookings/${data.bookingId}`}
        className="animate-fade inline-flex items-center gap-1 text-xs font-medium text-teal-700 transition-colors hover:text-teal-900"
      >
        <ChevronLeft className="h-4 w-4" />
        {t.result.backToBooking}
      </Link>

      <header className="animate-rise mt-4">
        <p className="eyebrow">{eyebrow}</p>
        <h1 className="font-display mt-1.5 text-3xl font-semibold text-teal-900 md:text-4xl">
          {title}
        </h1>
        <p className="mt-1.5 text-[0.72rem] tracking-wide text-ink-faint">
          {t.result.refLabel}{" "}
          <span className="font-semibold text-teal-700">{data.id}</span>
        </p>
      </header>

      {/* urgent — see a doctor first */}
      {analysis.urgent && analysis.urgentMessage && (
        <div
          className="animate-rise-1 mt-6 flex items-start gap-3 rounded-3xl border p-5"
          style={{
            borderColor: `${NEEDS_CARE}55`,
            backgroundColor: `${NEEDS_CARE}14`,
          }}
        >
          <AlertTriangle
            className="mt-0.5 h-5 w-5 shrink-0"
            style={{ color: NEEDS_CARE }}
          />
          <div>
            <p className="text-sm font-semibold" style={{ color: NEEDS_CARE }}>
              {t.result.urgentTitle}
            </p>
            <p className="mt-1 text-sm leading-relaxed text-ink">
              {l(analysis.urgentMessage)}
            </p>
          </div>
        </div>
      )}

      {/* warm summary */}
      <div className="animate-rise-1 mt-6 rounded-3xl border border-teal-900/10 bg-white p-6 shadow-soft">
        <p className="eyebrow flex items-center gap-2">
          <Sparkles className="h-3.5 w-3.5 text-gold-500" />
          {t.result.summaryTitle}
        </p>
        <p className="mt-3 text-sm leading-relaxed text-ink md:text-base">
          {l(analysis.summaryForCustomer)}
        </p>
      </div>

      {/* the five dials */}
      <div className="animate-rise-2 mt-6 rounded-3xl border border-teal-900/10 bg-white p-6 shadow-soft">
        <p className="eyebrow flex items-center gap-2">
          <Compass className="h-3.5 w-3.5 text-gold-500" />
          {t.result.dialsTitle}
        </p>

        <div className="mt-5 space-y-5">
          {DIAL_KEYS.map((dial) => (
            <DialRow
              key={dial}
              dial={dial}
              value={data.dials[dial].value}
              band={t.result.band[data.dials[dial].band]}
              delta={deltaFor(dial)}
            />
          ))}
        </div>

        {isOutcome && data.deltasComparable === false && (
          <p className="mt-5 border-t border-teal-900/10 pt-4 text-xs leading-relaxed text-ink-faint">
            {t.result.versionNote}
          </p>
        )}
        {deltas && (
          <p className="mt-5 border-t border-teal-900/10 pt-4 text-xs leading-relaxed text-ink-faint">
            {t.result.q3Note}
          </p>
        )}
      </div>

      {/* T2 / T3 — change narrative */}
      {extras && (
        <div className="animate-rise-2 mt-6 rounded-3xl border border-teal-900/10 bg-teal-50/60 p-6 shadow-soft">
          <p className="eyebrow flex items-center gap-2">
            <Quote className="h-3.5 w-3.5 text-gold-500" />
            {t.result.narrativeTitle}
          </p>
          <p className="mt-3 text-sm leading-relaxed text-ink md:text-base">
            {l(extras.changeNarrative)}
          </p>
        </div>
      )}

      {/* expert review notice */}
      {analysis.expertReviewRequired && !analysis.urgent && (
        <div className="animate-rise-3 mt-6 flex items-start gap-3 rounded-3xl border border-teal-500/25 bg-white p-5 shadow-soft">
          <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-teal-600" />
          <div>
            <p className="text-sm font-semibold text-teal-900">
              {t.result.expertNotice.title}
            </p>
            <p className="mt-1 text-xs leading-relaxed text-ink-soft">
              {t.result.expertNotice.body}
            </p>
          </div>
        </div>
      )}

      {/* T2 / T3 — next step from the catalog */}
      {extras?.nextRecommendation && nextPkg && (
        <div className="animate-rise-3 mt-6 rounded-3xl border border-teal-900/10 bg-white p-6 shadow-soft">
          <p className="eyebrow">{t.result.nextTitle}</p>
          <h3 className="font-display mt-2 text-xl font-semibold text-teal-900">
            {l(nextPkg.name)}
          </h3>
          <p className="mt-1 text-sm text-ink-soft">{l(nextPkg.tagline)}</p>
          <p className="mt-3 text-sm leading-relaxed text-ink">
            {l(extras.nextRecommendation.reason)}
          </p>
          <div className="mt-5">
            <ButtonLink href={`/packages/${nextPkg.id}`} size="sm">
              {t.result.nextCta}
              <ArrowRight className="h-4 w-4" />
            </ButtonLink>
          </div>
        </div>
      )}

      {/* See the full before/after journey */}
      {isOutcome && (
        <div className="animate-rise-3 mt-6 flex justify-center">
          <ButtonLink href={`/journey/${data.bookingId}`} variant="secondary" size="sm">
            <Compass className="h-4 w-4" />
            {t.result.viewJourney}
          </ButtonLink>
        </div>
      )}

      {/* T2 / T3 — testimonial consent (separate PDPA opt-in) */}
      {isOutcome && analysis.testimonialCandidate && (
        <div className="animate-rise-3 mt-6 flex items-start gap-3 rounded-3xl border border-gold-500/30 bg-cream-50 p-5 shadow-soft">
          <HeartHandshake className="mt-0.5 h-5 w-5 shrink-0 text-gold-500" />
          <div className="flex-1">
            <p className="text-sm font-semibold text-teal-900">
              {t.result.testimonial.title}
            </p>
            <p className="mt-1 text-xs leading-relaxed text-ink-soft">
              {t.result.testimonial.body}
            </p>
            <div className="mt-3">
              {testimonialState === "saved" ? (
                <p className="inline-flex items-center gap-1.5 text-xs font-semibold text-teal-700">
                  <Check className="h-4 w-4" />
                  {t.result.testimonial.submitted}
                </p>
              ) : (
                <Button
                  size="sm"
                  variant="secondary"
                  disabled={testimonialState === "saving"}
                  onClick={() => void grantTestimonial()}
                >
                  {testimonialState === "saving" ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Check className="h-4 w-4" />
                  )}
                  {t.result.testimonial.agree}
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ---------------- one dial row ---------------- */

function DialRow({
  dial,
  value,
  band,
  delta,
}: {
  dial: DialKey;
  value: number;
  band: string;
  delta?: DialDelta;
}) {
  const t = useT(checkin);
  const l = useL();
  const color = GOODNESS_COLOR[dialGoodness(dial, value)];

  return (
    <div>
      <div className="flex items-baseline justify-between gap-3">
        <p className="text-sm font-medium text-teal-900">
          {l(DIAL_NAMES[dial])}
        </p>
        <p className="text-xs text-ink-faint">
          <span className="font-display text-base font-bold text-teal-900">
            {value}
          </span>
          <span className="mx-1">·</span>
          {band}
        </p>
      </div>

      {delta ? (
        <div className="mt-2 space-y-1.5">
          <Bar
            label={t.result.before}
            value={delta.before}
            color="var(--color-teal-100)"
            valueColor="text-ink-faint"
          />
          <Bar
            label={t.result.after}
            value={delta.after}
            color={color}
            valueColor="text-teal-900"
          />
          <TrendChip delta={delta} />
        </div>
      ) : (
        <div className="mt-2">
          <Bar value={value} color={color} />
        </div>
      )}
    </div>
  );
}

function Bar({
  label,
  value,
  color,
  valueColor = "text-teal-900",
}: {
  label?: string;
  value: number;
  color: string;
  valueColor?: string;
}) {
  return (
    <div className="flex items-center gap-2.5">
      {label && (
        <span className="w-9 shrink-0 text-[0.65rem] font-medium tracking-wide text-ink-faint">
          {label}
        </span>
      )}
      <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-cream-200/70">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${Math.max(2, value)}%`, backgroundColor: color }}
        />
      </div>
      {label && (
        <span className={`w-7 shrink-0 text-right text-[0.7rem] font-semibold ${valueColor}`}>
          {value}
        </span>
      )}
    </div>
  );
}

function TrendChip({ delta }: { delta: DialDelta }) {
  const t = useT(checkin);

  const moved = Math.abs(delta.delta) > DELTA_DEADBAND;
  const Icon = !moved ? Minus : delta.delta > 0 ? TrendingUp : TrendingDown;
  const styles: Record<DialDelta["trend"], { color: string; bg: string }> = {
    improved: { color: "var(--color-teal-700)", bg: "var(--color-teal-50)" },
    steady: { color: "var(--color-gold-600)", bg: "rgba(193, 154, 73, 0.12)" },
    declined: { color: NEEDS_CARE, bg: `${NEEDS_CARE}14` },
  };
  const s = styles[delta.trend];

  return (
    <div className="flex justify-end">
      <span
        className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[0.68rem] font-semibold"
        style={{ color: s.color, backgroundColor: s.bg }}
      >
        <Icon className="h-3.5 w-3.5" />
        {t.result.trend[delta.trend]}
        {moved && (
          <span>
            {delta.delta > 0 ? "+" : "−"}
            {Math.abs(delta.delta)} {t.result.points}
          </span>
        )}
      </span>
    </div>
  );
}
