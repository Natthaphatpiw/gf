import type {
  GoalId,
  LText,
  Locale,
  PackageRecommendation,
  PackageTier,
  WellnessPackage,
  WellnessProfile,
} from "@/lib/types";
import { PACKAGES, getPackage } from "@/data/packages";

/* ============================================================
 * Recommendation core — matches a guest to the 22-package
 * catalog (15 legacy journeys + 7 programs) and returns three
 * per tier (3 basic + 3 premium + 3 deluxe = 9), with the single
 * best pick per tier flagged as the `hero`. Deterministic
 * rule-based scoring is the graceful fallback when Gemini is
 * unavailable, and also validates / completes the model output.
 * ============================================================ */

export const TIERS: PackageTier[] = ["basic", "premium", "deluxe"];

/** How many picks to surface per tier. */
const PER_TIER = 3;

/** Stable per-id variation so tied scores don't all show the same %. */
function jitter(id: string, range: number): number {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) % 9973;
  return h % range;
}

/**
 * Desire weight per goal derived from the guest's profile — high
 * stress leans toward burnout/sleep care, high migraine tendency
 * toward calmer/sleep journeys, a calm profile toward detox /
 * active / plant-based exploration.
 */
function profileGoalWeights(primary: WellnessProfile): Record<GoalId, number> {
  const stress = primary.stress.value;
  const migraine = primary.migraine.value;
  const lowWellbeing = 100 - primary.mental.value;

  const w: Record<GoalId, number> = {
    sleep_better: 0.5,
    detox: 0.5,
    burnout_recovery: 0.5,
    active_fitness: 0.5,
    plant_based_week: 0.5,
    anti_aging_checkup: 0.5,
  };

  if (stress >= 55) {
    w.burnout_recovery += 2;
    w.sleep_better += 1;
  } else if (stress >= 45) {
    w.burnout_recovery += 1;
  }
  if (migraine >= 60) {
    w.sleep_better += 1.5;
    w.anti_aging_checkup += 0.5;
  }
  if (lowWellbeing >= 45) {
    w.burnout_recovery += 1;
    w.sleep_better += 0.5;
  }
  if (stress < 50 && migraine < 50 && lowWellbeing < 40) {
    w.detox += 1;
    w.active_fitness += 0.8;
    w.plant_based_week += 0.6;
    w.anti_aging_checkup += 0.4;
  }
  return w;
}

/** Score a package against the guest's profile + chosen goals. */
export function scorePackage(
  pkg: WellnessPackage,
  primary: WellnessProfile,
  goals: GoalId[],
  family: WellnessProfile[],
): number {
  const w = profileGoalWeights(primary);

  let score = 1;
  for (const g of pkg.goals) score += w[g] ?? 0;
  score += pkg.goals.filter((g) => goals.includes(g)).length * 1.2;
  score += pkg.goals.filter((g) => primary.recommendedGoals.includes(g)).length * 0.8;
  if (family.length > 0) {
    const all = new Set(family.flatMap((f) => f.recommendedGoals));
    score += pkg.goals.filter((g) => all.has(g)).length * 0.4;
  }
  score += jitter(pkg.id, 5) / 10;
  return score;
}

/** Map a raw score to a presentable 55-99 match percentage. */
function toMatchScore(score: number, best: number): number {
  if (best <= 0) return 72;
  const ratio = Math.max(0, Math.min(1, score / best));
  return Math.round(58 + ratio * 41);
}

function presentScore(score: number, best: number, id: string): number {
  return Math.max(55, toMatchScore(score, best) - jitter(id, 3));
}

/** "The Mountain Stone" stays as-is; "Quiet Tide" -> "a Quiet Tide". */
function withArticle(noun: string): string {
  if (/^The\s/i.test(noun)) return noun;
  return `${/^[aeiou]/i.test(noun) ? "an" : "a"} ${noun}`;
}

/** Template "why this fits you" copy in both languages, rotated per package. */
export function buildReason(
  pkg: WellnessPackage,
  primary: WellnessProfile,
): LText {
  const a = primary.archetype.name;
  const benefit = pkg.tagline;
  const variant = jitter(pkg.id, 3);

  if (variant === 0) {
    return {
      th: `ในฐานะ "${a.th}" แพ็กเกจ ${pkg.name.th} — "${benefit.th}" — ตอบโจทย์คุณได้พอดี`,
      en: `As ${withArticle(a.en)}, ${pkg.name.en} — "${benefit.en}" — fits you beautifully.`,
    };
  }
  if (variant === 1) {
    return {
      th: `จากคะแนนของคุณ เราเลือก ${pkg.name.th} ที่เน้น "${benefit.th}" มาให้โดยเฉพาะ`,
      en: `Reading your scores, we picked ${pkg.name.en}, leaning into "${benefit.en}".`,
    };
  }
  return {
    th: `${pkg.name.th} เข้ากับจังหวะแบบ "${a.th}" ของคุณ และเน้นเรื่อง "${benefit.th}"`,
    en: `${pkg.name.en} suits the ${a.en} in you and leans into "${benefit.en}".`,
  };
}

/**
 * Deterministic recommendation: the top three packages in each
 * tier (9 total), with the highest-scoring pick per tier flagged
 * as the hero.
 */
export function ruleBasedRecommendations(
  goals: GoalId[],
  primary: WellnessProfile,
  family: WellnessProfile[],
): PackageRecommendation[] {
  const scored = PACKAGES.map((p) => ({
    p,
    score: scorePackage(p, primary, goals, family),
  }));
  const best = Math.max(...scored.map((s) => s.score), 1);

  const out: PackageRecommendation[] = [];
  for (const tier of TIERS) {
    const top = scored
      .filter((s) => s.p.tier === tier)
      .sort((a, b) => b.score - a.score)
      .slice(0, PER_TIER);
    top.forEach((s, i) => {
      out.push({
        packageId: s.p.id,
        tier,
        reason: buildReason(s.p, primary),
        matchScore: presentScore(s.score, best, s.p.id),
        hero: i === 0,
      });
    });
  }
  return out;
}

/* ---------------- LLM output validation / repair ---------------- */

interface RawRec {
  packageId?: unknown;
  tier?: unknown;
  reason?: { th?: unknown; en?: unknown } | unknown;
  matchScore?: unknown;
}

function clampScore(value: unknown): number {
  const n = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(n)) return 72;
  return Math.max(55, Math.min(99, Math.round(n)));
}

function coerceReason(reason: RawRec["reason"], fallback: LText): LText {
  if (
    reason &&
    typeof reason === "object" &&
    typeof (reason as { th?: unknown }).th === "string" &&
    typeof (reason as { en?: unknown }).en === "string"
  ) {
    return {
      th: (reason as { th: string }).th,
      en: (reason as { en: string }).en,
    };
  }
  return fallback;
}

/**
 * Keep only valid picks (trusting the catalog's real tier, never
 * the model's claimed tier), then top up each tier from the
 * rule-based ranking so the result is always 3 / 3 / 3 = 9, with
 * the highest-scoring pick per tier flagged as the hero.
 */
export function normaliseRecommendations(
  raw: unknown,
  goals: GoalId[],
  primary: WellnessProfile,
  family: WellnessProfile[],
): PackageRecommendation[] {
  const items: RawRec[] = Array.isArray(
    (raw as { recommendations?: unknown })?.recommendations,
  )
    ? ((raw as { recommendations: RawRec[] }).recommendations ?? [])
    : [];

  const byTier: Record<PackageTier, PackageRecommendation[]> = {
    basic: [],
    premium: [],
    deluxe: [],
  };
  const used = new Set<string>();

  for (const item of items) {
    const id = typeof item.packageId === "string" ? item.packageId : "";
    const pkg = getPackage(id);
    if (!pkg || used.has(pkg.id) || byTier[pkg.tier].length >= PER_TIER) continue;
    used.add(pkg.id);
    byTier[pkg.tier].push({
      packageId: pkg.id,
      tier: pkg.tier, // trust the catalog, never the model's claimed tier
      reason: coerceReason(item.reason, buildReason(pkg, primary)),
      matchScore: clampScore(item.matchScore),
    });
  }

  const scored = PACKAGES.map((p) => ({
    p,
    score: scorePackage(p, primary, goals, family),
  })).sort((a, b) => b.score - a.score);
  const best = Math.max(...scored.map((s) => s.score), 1);

  const out: PackageRecommendation[] = [];
  for (const tier of TIERS) {
    const picks = byTier[tier];
    // top up to PER_TIER from the rule-based ranking
    for (const s of scored) {
      if (picks.length >= PER_TIER) break;
      if (s.p.tier !== tier || used.has(s.p.id)) continue;
      used.add(s.p.id);
      picks.push({
        packageId: s.p.id,
        tier,
        reason: buildReason(s.p, primary),
        matchScore: presentScore(s.score, best, s.p.id),
      });
    }
    // highest match in the tier becomes the hero
    picks.sort((a, b) => b.matchScore - a.matchScore);
    picks.forEach((p, i) => out.push({ ...p, hero: i === 0 }));
  }
  return out;
}

/* ---------------- Prompt builders ---------------- */

function profileSummary(p: WellnessProfile, label: string): string {
  return [
    `${label}:`,
    `  archetype: ${p.archetype.name.en} (${p.archetype.code})`,
    `  stress: ${p.stress.value}/100 (${p.stress.band})`,
    `  migraine tendency: ${p.migraine.value}/100 (${p.migraine.band})`,
    `  mental wellbeing: ${p.mental.value}/100 (${p.mental.band})`,
    `  traits: ${p.traits.map((t) => t.en).join("; ") || "n/a"}`,
    `  recommended goals: ${p.recommendedGoals.join(", ") || "n/a"}`,
  ].join("\n");
}

export function buildUserPrompt(
  goals: GoalId[],
  primary: WellnessProfile,
  family: WellnessProfile[],
  catalog: string,
): string {
  const lines: string[] = [];
  lines.push("CATALOG (choose only ids from here):");
  lines.push(catalog);
  lines.push("");
  lines.push(profileSummary(primary, "PRIMARY GUEST"));
  if (family.length > 0) {
    lines.push("");
    lines.push(`TRAVELLING AS A FAMILY of ${family.length + 1} guests.`);
    family.forEach((f, i) => {
      lines.push("");
      lines.push(profileSummary(f, `FAMILY MEMBER ${i + 1}`));
    });
    lines.push("");
    lines.push(
      "Balance the recommendations so they suit the whole travelling party, not only the primary guest.",
    );
  }
  lines.push("");
  lines.push(
    `CHOSEN GOALS: ${goals.length ? goals.join(", ") : "none specified — use the guest's profile"}`,
  );
  return lines.join("\n");
}

export const SYSTEM_PROMPT = [
  "You are a wellness travel curator for Koh Samui, Thailand, working for Goodfill Care — a premium bilingual wellness booking platform.",
  "Your task: from the supplied catalog, recommend exactly 9 packages for the guest (or family): exactly 3 of tier 'basic', exactly 3 of tier 'premium', and exactly 3 of tier 'deluxe'.",
  "Order each tier from best fit to least, so the FIRST pick you list in each tier is your single strongest recommendation for that tier (it will be highlighted).",
  "Match each pick to the guest's stress, migraine tendency, mental wellbeing, archetype, traits and chosen goals (e.g. high stress -> calm/sleep journeys; high migraine tendency -> the headache-comfort journey). For a family, balance the whole group.",
  "Write each 'reason' as 1-2 warm, premium-hospitality sentences addressed personally to the guest, in BOTH Thai (natural, polished) and English (natural, polished). No emoji. Never a medical-treatment claim.",
  "matchScore is an integer 55-99 reflecting fit; the first pick in each tier should have the highest score in that tier.",
  'Respond with STRICT JSON ONLY, no prose, in this exact shape: {"recommendations":[{"packageId":"<id from catalog>","tier":"<that package\'s tier>","reason":{"th":"...","en":"..."},"matchScore":<int 55-99>}]} with exactly 9 items (3 basic + 3 premium + 3 deluxe) and no duplicate packageId.',
].join("\n");

export function isValidLocale(value: unknown): value is Locale {
  return value === "th" || value === "en";
}
