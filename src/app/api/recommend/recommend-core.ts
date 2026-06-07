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
import { GOALS } from "@/data/goals";

/* ============================================================
 * Recommendation core — deterministic scoring used as the
 * graceful fallback whenever Gemini is unavailable, and to
 * validate / complete whatever the model returns so the
 * response ALWAYS contains exactly 2 basic + 2 premium + 2
 * deluxe packages.
 * ============================================================ */

export const TIERS: PackageTier[] = ["basic", "premium", "deluxe"];

const FAMILY_PACKAGE_ID = "deluxe-family-shore";

/** Goals that benefit most when stress / burnout is running high. */
const STRESS_GOALS: GoalId[] = ["burnout_recovery", "sleep_better"];

/**
 * Score a single package against a guest (and, when present, the
 * collected family profiles). Higher is better.
 */
export function scorePackage(
  pkg: WellnessPackage,
  goals: GoalId[],
  primary: WellnessProfile,
  family: WellnessProfile[],
): number {
  let score = 0;

  // Goal overlap is the strongest signal.
  const overlap = pkg.goals.filter((g) => goals.includes(g)).length;
  score += overlap * 2;

  // High stress or migraine load lifts restorative journeys.
  const stressHigh =
    primary.stress.band === "high" || primary.migraine.band === "high";
  if (stressHigh && pkg.goals.some((g) => STRESS_GOALS.includes(g))) {
    score += 1;
  }

  // Archetype-recommended goals give a gentle nudge.
  const recOverlap = pkg.goals.filter((g) =>
    primary.recommendedGoals.includes(g),
  ).length;
  score += recOverlap;

  // Family groups: strongly favour the dedicated family journey,
  // and lean towards deluxe stays that suit a whole group.
  if (family.length > 0) {
    if (pkg.id === FAMILY_PACKAGE_ID) score += 2;
    if (pkg.tier === "deluxe") score += 0.5;
    // Reward goals shared across the whole travelling party.
    const allGoals = [primary, ...family].flatMap((p) => p.recommendedGoals);
    const familyOverlap = pkg.goals.filter((g) => allGoals.includes(g)).length;
    score += familyOverlap * 0.5;
  }

  return score;
}

/** Map a raw score to a presentable 55-99 match percentage. */
function toMatchScore(score: number, best: number): number {
  if (best <= 0) return 72;
  const ratio = Math.max(0, Math.min(1, score / best));
  return Math.round(55 + ratio * 44);
}

/**
 * Small stable per-package variation. Many packages share identical
 * goal sets, so raw scores tie constantly — without this every card
 * would show the same percentage and the grid looks fake.
 */
function jitter(id: string, range: number): number {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) % 9973;
  return h % range;
}

/**
 * Final presentable score: base match minus tier-rank decay and a
 * stable per-package offset (0-3). Decay (4) >= max jitter, so the
 * first pick in a tier never displays below the second.
 */
function presentScore(
  score: number,
  best: number,
  rankInTier: number,
  packageId: string,
): number {
  return Math.max(
    55,
    toMatchScore(score, best) - rankInTier * 4 - jitter(packageId, 4),
  );
}

function topGoalFor(
  pkg: WellnessPackage,
  goals: GoalId[],
  primary: WellnessProfile,
): GoalId {
  const preferred = pkg.goals.find((g) => goals.includes(g));
  if (preferred) return preferred;
  const recommended = pkg.goals.find((g) =>
    primary.recommendedGoals.includes(g),
  );
  return recommended ?? pkg.goals[0];
}

/** Template "why this fits you" copy in both languages — rotated per
 *  package so the six cards never read identically. */
export function buildReason(
  pkg: WellnessPackage,
  goals: GoalId[],
  primary: WellnessProfile,
  isFamily: boolean,
): LText {
  const archetype = primary.archetype.name;
  const goalId = topGoalFor(pkg, goals, primary);
  const goal = GOALS[goalId].name;
  const partner = pkg.partners[0] ?? "our island partners";
  const variant = jitter(pkg.id, 3);

  if (isFamily) {
    if (variant === 0) {
      return {
        th: `เส้นทางนี้ออกแบบให้ลงตัวกับทั้งครอบครัว และตอบโจทย์เป้าหมาย "${goal.th}" ที่พวกคุณให้ความสำคัญร่วมกัน`,
        en: `This journey is shaped to suit your whole family while honouring the "${goal.en}" goal you care about together.`,
      };
    }
    return {
      th: `จังหวะที่ ${partner} เผื่อพื้นที่ให้ทุกวัยได้พักไปด้วยกัน โดยไม่ทิ้งเป้าหมาย "${goal.th}" ของครอบครัวคุณ`,
      en: `The pace at ${partner} leaves room for every generation to rest together, without losing your family's "${goal.en}" goal.`,
    };
  }

  if (variant === 0) {
    return {
      th: `ในฐานะ "${archetype.th}" เส้นทางนี้ขับเน้นเป้าหมาย "${goal.th}" ของคุณได้อย่างพอดี`,
      en: `As ${withArticle(archetype.en)}, this journey leans into your "${goal.en}" goal beautifully.`,
    };
  }
  if (variant === 1) {
    return {
      th: `จังหวะการดูแลของ ${partner} ตอบรับเป้าหมาย "${goal.th}" และเข้ากับธรรมชาติแบบ "${archetype.th}" ของคุณอย่างลงตัว`,
      en: `The rhythm of care at ${partner} answers your "${goal.en}" goal and sits naturally with the ${archetype.en} in you.`,
    };
  }
  return {
    th: `เราเลือกเส้นทางนี้ให้คุณโดยเฉพาะ เพราะ "${goal.th}" คือสิ่งที่โปรไฟล์ของคุณกำลังเรียกหาเงียบ ๆ`,
    en: `We picked this one for you because "${goal.en}" is what your profile is quietly asking for.`,
  };
}

/** "The Mountain Stone" stays as-is; "Quiet Tide" becomes "a Quiet Tide". */
function withArticle(noun: string): string {
  if (/^The\s/i.test(noun)) return noun;
  return `${/^[aeiou]/i.test(noun) ? "an" : "a"} ${noun}`;
}

/**
 * Deterministic recommendation: top 2 packages per tier by score.
 * Always returns exactly 6 (2 / 2 / 2).
 */
export function ruleBasedRecommendations(
  goals: GoalId[],
  primary: WellnessProfile,
  family: WellnessProfile[],
): PackageRecommendation[] {
  const isFamily = family.length > 0;
  const scored = PACKAGES.map((pkg) => ({
    pkg,
    score: scorePackage(pkg, goals, primary, family),
  }));
  const best = Math.max(...scored.map((s) => s.score), 1);

  const out: PackageRecommendation[] = [];
  for (const tier of TIERS) {
    const inTier = scored
      .filter((s) => s.pkg.tier === tier)
      .sort((a, b) => b.score - a.score)
      .slice(0, 2);
    inTier.forEach(({ pkg, score }, rank) => {
      out.push({
        packageId: pkg.id,
        tier,
        reason: buildReason(pkg, goals, primary, isFamily),
        matchScore: presentScore(score, best, rank, pkg.id),
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
 * Take whatever the model returned, keep only valid packages with
 * correct tiers, then top up each tier from the rule-based ranking
 * so the result is always exactly 2 / 2 / 2.
 */
export function normaliseRecommendations(
  raw: unknown,
  goals: GoalId[],
  primary: WellnessProfile,
  family: WellnessProfile[],
): PackageRecommendation[] {
  const isFamily = family.length > 0;
  const items: RawRec[] = Array.isArray(
    (raw as { recommendations?: unknown })?.recommendations,
  )
    ? ((raw as { recommendations: RawRec[] }).recommendations ?? [])
    : [];

  // Bucket valid model picks by their real tier.
  const byTier: Record<PackageTier, PackageRecommendation[]> = {
    basic: [],
    premium: [],
    deluxe: [],
  };
  const used = new Set<string>();

  for (const item of items) {
    const id = typeof item.packageId === "string" ? item.packageId : "";
    const pkg = getPackage(id);
    if (!pkg || used.has(pkg.id)) continue;
    used.add(pkg.id);
    byTier[pkg.tier].push({
      packageId: pkg.id,
      tier: pkg.tier, // trust the catalog, never the model's claimed tier
      reason: coerceReason(
        item.reason,
        buildReason(pkg, goals, primary, isFamily),
      ),
      matchScore: clampScore(item.matchScore),
    });
  }

  // Pre-rank everything once for gap filling.
  const ranked = PACKAGES.map((pkg) => ({
    pkg,
    score: scorePackage(pkg, goals, primary, family),
  })).sort((a, b) => b.score - a.score);
  const best = Math.max(...ranked.map((r) => r.score), 1);

  const out: PackageRecommendation[] = [];
  for (const tier of TIERS) {
    const picks = byTier[tier].slice(0, 2);
    if (picks.length < 2) {
      for (const { pkg, score } of ranked) {
        if (picks.length >= 2) break;
        if (pkg.tier !== tier || used.has(pkg.id)) continue;
        used.add(pkg.id);
        picks.push({
          packageId: pkg.id,
          tier,
          reason: buildReason(pkg, goals, primary, isFamily),
          matchScore: presentScore(score, best, picks.length, pkg.id),
        });
      }
    }
    out.push(...picks);
  }
  return out;
}

/* ---------------- Prompt builders ---------------- */

function profileSummary(p: WellnessProfile, label: string): string {
  return [
    `${label}:`,
    `  archetype: ${p.archetype.name.en} (${p.archetype.code})`,
    `  stress: ${p.stress.value}/100 (${p.stress.band})`,
    `  migraine load: ${p.migraine.value}/100 (${p.migraine.band})`,
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
  "Your task: from the supplied catalog, recommend exactly 6 packages for the guest (or family): exactly 2 of tier 'basic', exactly 2 of tier 'premium', and exactly 2 of tier 'deluxe'.",
  "Match each pick to the guest's stress, archetype, traits and chosen goals. For a family, balance the whole group.",
  "Write each 'reason' as 1-2 warm, premium-hospitality sentences addressed personally to the guest, in BOTH Thai (natural, polished) and English (natural, polished). No emoji.",
  "matchScore is an integer 55-99 reflecting fit.",
  'Respond with STRICT JSON ONLY, no prose, in this exact shape: {"recommendations":[{"packageId":"<id from catalog>","tier":"<that package\'s tier>","reason":{"th":"...","en":"..."},"matchScore":<int 55-99>}]} with exactly 6 items (2 basic + 2 premium + 2 deluxe) and no duplicate packageId.',
].join("\n");

export function isValidLocale(value: unknown): value is Locale {
  return value === "th" || value === "en";
}
