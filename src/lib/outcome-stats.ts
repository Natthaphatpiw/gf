import type { DialKey } from "@/lib/types";
import { DIAL_KEYS, DIAL_DIRECTION, DELTA_DEADBAND } from "@/data/checkin";
import type { OutcomeSample } from "@/lib/outcome-samples";

/* ============================================================
 * Outcome aggregation — turns the per-guest pre/post samples into
 * the handful of honest, easy-to-read numbers the public impact
 * dashboard shows. Pure functions over an OutcomeSample[]; works
 * the same whether the samples come from Supabase or the in-code
 * fallback. Direction-aware throughout (lower stress is good,
 * higher sleep is good) and uses the same ±5 deadband as the live
 * check-in so "improved" means a real, not-noise change.
 * ============================================================ */

export interface DialOutcome {
  dial: DialKey;
  direction: "lowerIsBetter" | "higherIsBetter";
  avgBefore: number;
  avgAfter: number;
  /** signed (after − before), rounded */
  avgDelta: number;
  /** direction-aware positive % (reduction for symptoms, gain for capacities) */
  improvementPct: number;
  /** 0–1 share of guests who moved in the good direction beyond the deadband */
  improvedShare: number;
}

export interface PackageOutcome {
  packageId: string;
  tier: string;
  participants: number;
  avgRating: number;
  /** 0–1 share who rated 4★+ */
  satisfiedShare: number;
  dials: DialOutcome[];
  /** the dial that moved the most (best headline for this package) */
  headline: { dial: DialKey; improvementPct: number; improvedShare: number };
}

export interface OutcomeOverview {
  totalParticipants: number;
  packagesMeasured: number;
  avgRating: number;
  satisfiedShare: number;
  dials: DialOutcome[];
  headline: { dial: DialKey; improvementPct: number; improvedShare: number };
  byPackage: PackageOutcome[];
  window: { from: string; to: string };
}

const mean = (xs: number[]): number =>
  xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : 0;

const round1 = (n: number): number => Math.round(n * 10) / 10;

function dialOutcome(dial: DialKey, samples: OutcomeSample[]): DialOutcome {
  const lowerIsBetter = DIAL_DIRECTION[dial] === "lowerIsBetter";
  const befores = samples.map((s) => s.before[dial]);
  const afters = samples.map((s) => s.after[dial]);
  const avgBefore = mean(befores);
  const avgAfter = mean(afters);
  const goodMove = lowerIsBetter ? avgBefore - avgAfter : avgAfter - avgBefore;
  const improvementPct = avgBefore > 0 ? Math.max(0, (goodMove / avgBefore) * 100) : 0;
  const improvedCount = samples.filter((s) => {
    const move = lowerIsBetter ? s.before[dial] - s.after[dial] : s.after[dial] - s.before[dial];
    return move >= DELTA_DEADBAND;
  }).length;

  return {
    dial,
    direction: DIAL_DIRECTION[dial],
    avgBefore: Math.round(avgBefore),
    avgAfter: Math.round(avgAfter),
    avgDelta: Math.round(avgAfter - avgBefore),
    improvementPct: Math.round(improvementPct),
    improvedShare: samples.length ? improvedCount / samples.length : 0,
  };
}

/** Good-direction movement of a dial in absolute points (always ≥ 0 when it improved). */
function goodMovePoints(d: DialOutcome): number {
  return d.direction === "lowerIsBetter" ? -d.avgDelta : d.avgDelta;
}

function summarize(samples: OutcomeSample[]): {
  dials: DialOutcome[];
  headline: { dial: DialKey; improvementPct: number; improvedShare: number };
  avgRating: number;
  satisfiedShare: number;
} {
  const dials = DIAL_KEYS.map((d) => dialOutcome(d, samples));
  // Headline = the dial that moved the most in real points, so a package
  // headlines its actual focus rather than whichever dial has the lowest
  // baseline (which would inflate the relative %).
  const top = [...dials].sort((a, b) => goodMovePoints(b) - goodMovePoints(a))[0];
  return {
    dials,
    headline: top
      ? { dial: top.dial, improvementPct: top.improvementPct, improvedShare: top.improvedShare }
      : { dial: "stress", improvementPct: 0, improvedShare: 0 },
    avgRating: round1(mean(samples.map((s) => s.rating))),
    satisfiedShare: samples.length
      ? samples.filter((s) => s.rating >= 4).length / samples.length
      : 0,
  };
}

/** Aggregate the whole dataset into the dashboard payload. */
export function aggregateOutcomes(
  samples: OutcomeSample[],
  tierOf: (packageId: string) => string,
): OutcomeOverview {
  const overall = summarize(samples);

  const byId = new Map<string, OutcomeSample[]>();
  for (const s of samples) {
    const list = byId.get(s.packageId);
    if (list) list.push(s);
    else byId.set(s.packageId, [s]);
  }

  const byPackage: PackageOutcome[] = [...byId.entries()]
    .map(([packageId, list]) => {
      const sum = summarize(list);
      return {
        packageId,
        tier: tierOf(packageId),
        participants: list.length,
        avgRating: sum.avgRating,
        satisfiedShare: sum.satisfiedShare,
        dials: sum.dials,
        headline: sum.headline,
      };
    })
    .sort((a, b) => b.headline.improvementPct - a.headline.improvementPct);

  const dates = samples.map((s) => s.completedAt).sort();

  return {
    totalParticipants: samples.length,
    packagesMeasured: byId.size,
    avgRating: overall.avgRating,
    satisfiedShare: overall.satisfiedShare,
    dials: overall.dials,
    headline: overall.headline,
    byPackage,
    window: {
      from: dates[0] ?? "",
      to: dates[dates.length - 1] ?? "",
    },
  };
}
