import type { DialKey } from "@/lib/types";
import { DIAL_KEYS, DIAL_DIRECTION } from "@/data/checkin";
import { PACKAGES } from "@/data/packages";

/* ============================================================
 * Outcome samples — the anonymised pre/post (T1 → T2) record of
 * every guest who finished a program. This is MOCK data, but it
 * is generated deterministically from the *real* 5-dial model
 * (the same dials, directions and deadband the live check-in
 * uses) so the aggregate dashboard reads like real outcomes.
 *
 * Each sample carries NO PII — just a package id, an archetype
 * code, a coarse gender, a 1–5 rating, and a before/after value
 * per dial. That is exactly what the public impact dashboard
 * aggregates, so the data is safe to surface as statistics.
 *
 * The same dataset is what gets seeded into Supabase
 * (`outcome_samples`); the in-code copy here is both the seed
 * source and the demo-mode fallback, so the dashboard works with
 * an empty `.env` and reads identically once the table is seeded.
 * ============================================================ */

export interface OutcomeSample {
  /** OS-XXXXXX — stable, derived from package id + index. */
  id: string;
  packageId: string;
  archetypeCode: string;
  gender: "female" | "male" | "unspecified";
  /** 1–5 stars, correlated with how much the guest improved. */
  rating: number;
  /** Dial value (0–100) at T1, before the program. */
  before: Record<DialKey, number>;
  /** Dial value (0–100) at T2, after the program. */
  after: Record<DialKey, number>;
  /** ISO date the post check-in was completed. */
  completedAt: string;
}

/* ---------------- deterministic randomness ---------------- */

function hashSeed(str: string): number {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/** mulberry32 — small, fast, fully deterministic PRNG. */
function makeRng(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Approx. standard normal via averaged uniforms (bounded, no Date/Math.random). */
function gaussian(rng: () => number): number {
  return (rng() + rng() + rng() + rng() + rng() + rng() - 3) / Math.sqrt(0.5);
}

function clamp(v: number, lo = 2, hi = 98): number {
  return Math.max(lo, Math.min(hi, v));
}

/* ---------------- grounded package profiles ---------------- */

/**
 * How strongly each package tends to move each dial (0–1). Higher =
 * a bigger, more reliable shift toward "better". Dials a package
 * doesn't list still get a gentle all-round lift (BASE_FOCUS).
 */
const BASE_FOCUS = 0.28;

const PACKAGE_FOCUS: Record<string, Partial<Record<DialKey, number>>> = {
  // legacy — basic
  "basic-island-reset": { stress: 0.8, mind: 0.6, energy: 0.55, sleep: 0.45 },
  "basic-sunrise-flow": { energy: 0.8, stress: 0.6, mind: 0.5 },
  "basic-plant-discovery": { energy: 0.72, sleep: 0.5, stress: 0.45 },
  "basic-forest-calm": { stress: 0.82, mind: 0.8, sleep: 0.5 },
  "basic-sweat-sea": { energy: 0.85, stress: 0.55, mind: 0.45 },
  // legacy — premium
  "premium-burnout-reset": { stress: 0.9, mind: 0.75, energy: 0.62, sleep: 0.58 },
  "premium-deep-sleep": { sleep: 0.9, stress: 0.6, energy: 0.5 },
  "premium-detox-renew": { energy: 0.74, sleep: 0.55, stress: 0.5, migraine: 0.35 },
  "premium-island-strong": { energy: 0.85, stress: 0.5, mind: 0.5 },
  "premium-mind-balance": { mind: 0.9, stress: 0.72, sleep: 0.5 },
  // legacy — deluxe
  "deluxe-kamalaya-healing": { stress: 0.82, mind: 0.8, sleep: 0.7, energy: 0.68, migraine: 0.42 },
  "deluxe-ocean-longevity": { energy: 0.8, mind: 0.65, sleep: 0.6, stress: 0.55 },
  "deluxe-sanctuary-sleep": { sleep: 0.92, stress: 0.66, energy: 0.55, mind: 0.5 },
  "deluxe-family-shore": { stress: 0.7, mind: 0.62, energy: 0.6, sleep: 0.52 },
  "deluxe-longevity-medical": { migraine: 0.62, energy: 0.7, mind: 0.6, stress: 0.56, sleep: 0.55 },
  // blueprint programs (keyed by slug — the WellnessPackage id)
  "deep-sleep-sanctuary": { sleep: 0.92, stress: 0.6, energy: 0.55 },
  "calm-mind": { mind: 0.88, stress: 0.8, sleep: 0.5 },
  "clear-head": { migraine: 0.85, mind: 0.6, stress: 0.55 },
  "gut-reset": { energy: 0.8, sleep: 0.55, stress: 0.45 },
  "samui-reset": { stress: 0.75, mind: 0.65, energy: 0.65, sleep: 0.55, migraine: 0.35 },
  "samui-recharge": { energy: 0.85, stress: 0.6, mind: 0.55 },
  "workmode-recovery": { stress: 0.85, mind: 0.7, energy: 0.65, sleep: 0.55 },
};

function focusFor(packageId: string, dial: DialKey): number {
  return PACKAGE_FOCUS[packageId]?.[dial] ?? BASE_FOCUS;
}

/** Typical starting (T1) value per dial — wellness guests arrive worn. */
const BASELINE_MEAN: Record<DialKey, number> = {
  stress: 68,
  migraine: 46,
  sleep: 42,
  mind: 46,
  energy: 44,
};
const BASELINE_SD: Record<DialKey, number> = {
  stress: 13,
  migraine: 18,
  sleep: 14,
  mind: 14,
  energy: 14,
};

/** How many guests we report per tier (deterministic jitter per package). */
const TIER_PARTICIPANTS: Record<string, number> = {
  basic: 84,
  premium: 58,
  deluxe: 34,
};

const ARCHETYPE_CODES = ["SLPB", "SLPM", "STFB", "STFM", "LAPB", "LAPM", "LTFB", "LTFM"];
/** Fixed window anchor so completedAt is deterministic (no Date.now). */
const WINDOW_END = Date.UTC(2026, 5, 15); // 2026-06-15
const DAY = 86400000;

function buildSample(packageId: string, index: number): OutcomeSample {
  const rng = makeRng(hashSeed(`${packageId}#${index}#v1`));

  // Each guest has an overall "responsiveness": most respond well, a few barely.
  const responder = rng();
  const responseScale =
    responder < 0.06 ? 0.15 : responder < 0.2 ? 0.55 : 0.85 + rng() * 0.45; // 6% flat, 14% mild, rest strong

  const before = {} as Record<DialKey, number>;
  const after = {} as Record<DialKey, number>;
  let goodnessTotal = 0;

  for (const dial of DIAL_KEYS) {
    const b = clamp(BASELINE_MEAN[dial] + gaussian(rng) * BASELINE_SD[dial]);
    const lowerIsBetter = DIAL_DIRECTION[dial] === "lowerIsBetter";

    // headroom toward the ideal end (0 for symptoms, 100 for capacities)
    const headroom = lowerIsBetter ? b : 100 - b;
    const focus = focusFor(packageId, dial);
    // improvement is a fraction of the available headroom, scaled by focus +
    // the guest's responsiveness, with a little per-dial noise.
    const frac = focus * responseScale * (0.45 + rng() * 0.35);
    let improve = headroom * frac + gaussian(rng) * 3;
    improve = Math.max(-6, improve); // a few guests slip slightly

    const a = lowerIsBetter ? clamp(b - improve) : clamp(b + improve);
    before[dial] = Math.round(b);
    after[dial] = Math.round(a);
    goodnessTotal += lowerIsBetter ? b - a : a - b; // signed good-direction movement
  }

  // Rating tracks total improvement; mostly 4–5, occasionally lower.
  const avgGood = goodnessTotal / DIAL_KEYS.length;
  let rating = 3.4 + avgGood * 0.11 + gaussian(rng) * 0.5;
  rating = Math.max(1, Math.min(5, Math.round(rating)));

  const idNum = (hashSeed(`${packageId}:${index}`) % 1000000).toString().padStart(6, "0");
  const completedAt = new Date(WINDOW_END - Math.floor(rng() * 150) * DAY).toISOString();
  const genderRoll = rng();

  return {
    id: `OS-${idNum}`,
    packageId,
    archetypeCode: ARCHETYPE_CODES[Math.floor(rng() * ARCHETYPE_CODES.length)],
    gender: genderRoll < 0.58 ? "female" : genderRoll < 0.96 ? "male" : "unspecified",
    rating,
    before,
    after,
    completedAt,
  };
}

function participantsFor(packageId: string, tier: string): number {
  const base = TIER_PARTICIPANTS[tier] ?? 50;
  const jitter = (hashSeed(`${packageId}:count`) % 33) - 16; // ±16
  return Math.max(18, base + jitter);
}

function generateOutcomeSamples(): OutcomeSample[] {
  const out: OutcomeSample[] = [];
  for (const pkg of PACKAGES) {
    const n = participantsFor(pkg.id, pkg.tier);
    for (let i = 0; i < n; i++) out.push(buildSample(pkg.id, i));
  }
  return out;
}

/** The full dataset — generated once, deterministic across restarts. */
export const OUTCOME_SAMPLES: OutcomeSample[] = generateOutcomeSamples();
