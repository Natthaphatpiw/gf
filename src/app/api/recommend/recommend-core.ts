import type {
  GoalId,
  LText,
  Locale,
  PackageRecommendation,
  PackageTier,
  WellnessProfile,
} from "@/lib/types";
import {
  BLUEPRINT_PROGRAMS,
  type BlueprintProgram,
} from "@/data/blueprintPackages";
import { CATEGORY_GOALS } from "@/data/packages";

/* ============================================================
 * Recommendation core — matches a guest to the 7 evidence-based
 * programs and returns exactly one per tier (1 basic + 1 premium
 * + 1 deluxe). Deterministic rule-based scoring is the graceful
 * fallback when Gemini is unavailable, and also validates /
 * completes whatever the model returns.
 * ============================================================ */

export const TIERS: PackageTier[] = ["basic", "premium", "deluxe"];

const PROGRAM_BY_SLUG = new Map(BLUEPRINT_PROGRAMS.map((p) => [p.slug, p]));

/** Stable per-id variation so tied scores don't all show the same %. */
function jitter(id: string, range: number): number {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) % 9973;
  return h % range;
}

/**
 * Score a program against the guest's profile. The blueprint
 * category drives the match against stress / migraine tendency /
 * mental wellbeing; chosen goals + the archetype nudge it.
 */
export function scoreProgram(
  program: BlueprintProgram,
  primary: WellnessProfile,
  goals: GoalId[],
  family: WellnessProfile[],
): number {
  const stress = primary.stress.value;
  const migraine = primary.migraine.value;
  const lowWellbeing = 100 - primary.mental.value; // higher = needs more support

  let score = 1;
  switch (program.category) {
    case "deep_sleep":
      score += stress >= 55 ? 2 : 0;
      score += lowWellbeing >= 40 ? 1 : 0;
      break;
    case "calm_mind":
      score += stress >= 60 ? 3 : stress >= 45 ? 1.5 : 0;
      score += lowWellbeing >= 50 ? 1 : 0;
      break;
    case "clear_head":
      score += migraine >= 60 ? 3 : 0;
      score += migraine >= 75 ? 1.5 : 0;
      break;
    case "gut_reset":
      score += 1;
      score += stress < 55 && migraine < 55 ? 1 : 0;
      break;
    case "samui_reset":
      score += 1.5;
      score += stress >= 50 ? 0.5 : 0;
      break;
    case "samui_recharge":
      score += 1.5;
      score += stress >= 55 || lowWellbeing >= 45 ? 1 : 0;
      break;
    case "workmode_recovery":
      score += stress >= 55 ? 2 : 0.5;
      score += lowWellbeing >= 40 ? 1 : 0;
      break;
  }

  const catGoals = CATEGORY_GOALS[program.category] ?? [];
  score += catGoals.filter((g) => goals.includes(g)).length * 1;
  score += catGoals.filter((g) => primary.recommendedGoals.includes(g)).length * 0.75;
  if (family.length > 0) {
    const all = family.flatMap((f) => f.recommendedGoals);
    score += catGoals.filter((g) => all.includes(g)).length * 0.4;
  }

  score += jitter(program.slug, 5) / 10;
  return score;
}

/** Map a raw score to a presentable 55-99 match percentage. */
function toMatchScore(score: number, best: number): number {
  if (best <= 0) return 72;
  const ratio = Math.max(0, Math.min(1, score / best));
  return Math.round(58 + ratio * 41);
}

function presentScore(score: number, best: number, slug: string): number {
  return Math.max(55, toMatchScore(score, best) - jitter(slug, 3));
}

/** "The Mountain Stone" stays as-is; "Quiet Tide" -> "a Quiet Tide". */
function withArticle(noun: string): string {
  if (/^The\s/i.test(noun)) return noun;
  return `${/^[aeiou]/i.test(noun) ? "an" : "a"} ${noun}`;
}

/** Template "why this fits you" copy in both languages, rotated per program. */
export function buildReason(
  program: BlueprintProgram,
  primary: WellnessProfile,
): LText {
  const a = primary.archetype.name;
  const benefit = program.subtitle;
  const variant = jitter(program.slug, 3);

  if (variant === 0) {
    return {
      th: `ในฐานะ "${a.th}" โปรแกรม ${program.name.th} ที่เน้น "${benefit.th}" ตอบโจทย์คุณได้พอดี`,
      en: `As ${withArticle(a.en)}, ${program.name.en} — focused on "${benefit.en}" — fits you beautifully.`,
    };
  }
  if (variant === 1) {
    return {
      th: `จากคะแนนของคุณ เราเลือก ${program.name.th} ที่ช่วยเรื่อง "${benefit.th}" มาให้โดยเฉพาะ`,
      en: `Reading your scores, we picked ${program.name.en}, built to support "${benefit.en}".`,
    };
  }
  return {
    th: `${program.name.th} เข้ากับจังหวะแบบ "${a.th}" ของคุณ และเน้นเรื่อง "${benefit.th}"`,
    en: `${program.name.en} suits the ${a.en} in you and leans into "${benefit.en}".`,
  };
}

/**
 * Deterministic recommendation: the best-scoring program in each
 * tier. Always returns exactly one per tier (3 total).
 */
export function ruleBasedRecommendations(
  goals: GoalId[],
  primary: WellnessProfile,
  family: WellnessProfile[],
): PackageRecommendation[] {
  const scored = BLUEPRINT_PROGRAMS.map((p) => ({
    p,
    score: scoreProgram(p, primary, goals, family),
  }));
  const best = Math.max(...scored.map((s) => s.score), 1);

  const out: PackageRecommendation[] = [];
  for (const tier of TIERS) {
    const top = scored
      .filter((s) => s.p.tier === tier)
      .sort((a, b) => b.score - a.score)[0];
    if (!top) continue;
    out.push({
      packageId: top.p.slug,
      tier,
      reason: buildReason(top.p, primary),
      matchScore: presentScore(top.score, best, top.p.slug),
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
 * Keep only valid program picks (trusting the catalog's real tier,
 * never the model's claimed tier), then top up each tier from the
 * rule-based ranking so the result is always exactly 1 / 1 / 1.
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

  const byTier: Record<PackageTier, PackageRecommendation | undefined> = {
    basic: undefined,
    premium: undefined,
    deluxe: undefined,
  };
  const used = new Set<string>();

  for (const item of items) {
    const id = typeof item.packageId === "string" ? item.packageId : "";
    const program = PROGRAM_BY_SLUG.get(id);
    if (!program || used.has(program.slug) || byTier[program.tier]) continue;
    used.add(program.slug);
    byTier[program.tier] = {
      packageId: program.slug,
      tier: program.tier, // trust the catalog, never the model's claimed tier
      reason: coerceReason(item.reason, buildReason(program, primary)),
      matchScore: clampScore(item.matchScore),
    };
  }

  const scored = BLUEPRINT_PROGRAMS.map((p) => ({
    p,
    score: scoreProgram(p, primary, goals, family),
  })).sort((a, b) => b.score - a.score);
  const best = Math.max(...scored.map((s) => s.score), 1);

  const out: PackageRecommendation[] = [];
  for (const tier of TIERS) {
    let pick = byTier[tier];
    if (!pick) {
      const top = scored.find((s) => s.p.tier === tier && !used.has(s.p.slug));
      if (top) {
        used.add(top.p.slug);
        pick = {
          packageId: top.p.slug,
          tier,
          reason: buildReason(top.p, primary),
          matchScore: presentScore(top.score, best, top.p.slug),
        };
      }
    }
    if (pick) out.push(pick);
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
  "Your task: from the supplied catalog, recommend exactly 3 programs for the guest (or family): exactly 1 of tier 'basic', exactly 1 of tier 'premium', and exactly 1 of tier 'deluxe'.",
  "Match each pick to the guest's stress, migraine tendency, mental wellbeing, archetype, traits and chosen goals (e.g. high stress -> calm/sleep programs; high migraine tendency -> the headache-comfort program). For a family, balance the whole group.",
  "Write each 'reason' as 1-2 warm, premium-hospitality sentences addressed personally to the guest, in BOTH Thai (natural, polished) and English (natural, polished). No emoji. Never a medical-treatment claim.",
  "matchScore is an integer 55-99 reflecting fit.",
  'Respond with STRICT JSON ONLY, no prose, in this exact shape: {"recommendations":[{"packageId":"<id from catalog>","tier":"<that program\'s tier>","reason":{"th":"...","en":"..."},"matchScore":<int 55-99>}]} with exactly 3 items (1 basic + 1 premium + 1 deluxe) and no duplicate packageId.',
].join("\n");

export function isValidLocale(value: unknown): value is Locale {
  return value === "th" || value === "en";
}
