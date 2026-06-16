import type {
  GoalId,
  ItineraryDay,
  ItineraryItem,
  LText,
  PackageCareDetails,
  PackageMeal,
  WellnessPackage,
} from "@/lib/types";
import {
  BLUEPRINT_PROGRAMS,
  type BlueprintProgram,
  type ProgramCategory,
  type ProgramSlot,
} from "@/data/blueprintPackages";
import { getHugSamuiService } from "@/data/hugSamuiServices";
import { getHugSamuiMenu } from "@/data/hugSamuiMenus";
import { getPartner } from "@/data/partners";
import { LEGACY_PACKAGES, LEGACY_CARE_DETAILS } from "@/data/legacyPackages";

/* ============================================================
 * Package catalog — 22 signature journeys across three tiers:
 *   • 15 legacy curated packages (the island's trusted houses)
 *   • 7 Goodfill evidence-based programs (Hug Samui-anchored)
 *
 * The rest of the app (recommender, booking, check-in, expert)
 * works with the WellnessPackage shape, so each program is
 * adapted to it here. The 7 programs' rich detail lives at
 * /programs/[slug]; this catalog powers the booking flow.
 * ============================================================ */

/** category -> the closest legacy GoalId(s), for goal-overlap + display. */
export const CATEGORY_GOALS: Record<ProgramCategory, GoalId[]> = {
  deep_sleep: ["sleep_better"],
  calm_mind: ["burnout_recovery"],
  clear_head: ["burnout_recovery"],
  gut_reset: ["detox", "plant_based_week"],
  samui_reset: ["burnout_recovery", "sleep_better"],
  samui_recharge: ["burnout_recovery", "active_fitness"],
  workmode_recovery: ["burnout_recovery", "sleep_better"],
};

function partnerName(partnerId?: string | null): string {
  const p = partnerId ? getPartner(partnerId) : undefined;
  return p ? p.name.en : "";
}

/** Which shop fills a slot (English brand name), or "" if unassigned. */
function slotPartner(slot: ProgramSlot): string {
  if (slot.fill.type === "service" && slot.fill.serviceId) {
    const s = getHugSamuiService(slot.fill.serviceId);
    return s ? partnerName(s.partnerId) || "Hug Samui" : "Goodfill";
  }
  if (slot.fill.type === "menu" && slot.fill.menuId) {
    const m = getHugSamuiMenu(slot.fill.menuId);
    return m && m.isPartnerMenu ? partnerName(m.partnerId) || "Hug Samui" : "Goodfill";
  }
  if (slot.fill.type === "guidance") return "Goodfill";
  return "";
}

function toPackage(program: BlueprintProgram): WellnessPackage {
  const partners = Array.from(
    new Set(program.slots.map(slotPartner).filter(Boolean)),
  );
  const itinerary: ItineraryDay[] = [
    {
      day: 1,
      title: program.subtitle,
      items: program.slots.map(
        (slot): ItineraryItem => ({
          time: slot.duration,
          activity: slot.name,
          partner: slotPartner(slot),
        }),
      ),
    },
  ];

  return {
    id: program.slug,
    tier: program.tier,
    name: program.name,
    tagline: program.tagline,
    days: 1,
    nights: 0,
    price: program.priceFrom ?? 0,
    image: program.image,
    partners: partners.length > 0 ? partners : ["Goodfill"],
    highlights: program.coreMechanisms.map((m) => m.title),
    itinerary,
    suitableFor: program.suitableFor,
    goals: CATEGORY_GOALS[program.category] ?? [],
  };
}

const num = (v: number | null, unit: string) => (v == null ? "—" : `${v} ${unit}`);

function toCareDetails(program: BlueprintProgram): PackageCareDetails {
  const meals: PackageMeal[] = program.slots
    .map((slot): PackageMeal | null => {
      if (slot.fill.type !== "menu" || !slot.fill.menuId) return null;
      const m = getHugSamuiMenu(slot.fill.menuId);
      if (!m) return null;
      return {
        id: `${program.slug}-${m.id}`,
        name: m.name,
        partner: m.isPartnerMenu ? partnerName(m.partnerId) || "Hug Samui" : "Goodfill",
        portion: m.serving,
        nutrition: {
          calories: num(m.nutrition.caloriesKcal, "kcal"),
          protein: num(m.nutrition.proteinG, "g"),
          carbs: num(m.nutrition.carbG, "g"),
          fiber: num(m.nutrition.fiberG, "g"),
          sodium:
            m.nutrition.sodium.amountMg == null
              ? undefined
              : `${m.nutrition.sodium.amountMg} mg`,
        },
        wellnessNote: m.localStory,
      };
    })
    .filter((x): x is PackageMeal => x !== null);

  const notes: LText[] = program.coreMechanisms.map((mech) => mech.detail).slice(0, 2);
  return { meals, notes };
}

/** The 7 evidence-based programs adapted to the package shape. */
export const PROGRAM_PACKAGES: WellnessPackage[] = BLUEPRINT_PROGRAMS.map(toPackage);

/** Slugs of the 7 program-derived packages (rich detail at /programs/[slug]). */
export const PROGRAM_PACKAGE_IDS = new Set(BLUEPRINT_PROGRAMS.map((p) => p.slug));

/** 15 legacy curated journeys + 7 Goodfill programs = 22, across 3 tiers. */
export const PACKAGES: WellnessPackage[] = [...LEGACY_PACKAGES, ...PROGRAM_PACKAGES];

export const PACKAGE_CARE_DETAILS: Record<string, PackageCareDetails> = {
  ...LEGACY_CARE_DETAILS,
  ...Object.fromEntries(BLUEPRINT_PROGRAMS.map((p) => [p.slug, toCareDetails(p)])),
};

export function getPackageCareDetails(id: string): PackageCareDetails | undefined {
  return PACKAGE_CARE_DETAILS[id];
}

export function getPackage(id: string): WellnessPackage | undefined {
  return PACKAGES.find((p) => p.id === id);
}

/** Whether a package id is one of the 7 evidence-based programs. */
export function isProgramPackage(id: string): boolean {
  return PROGRAM_PACKAGE_IDS.has(id);
}

/** Compact catalog (tier + goals) the recommender LLM picks from — all 22. */
export function catalogForLlm(): string {
  return PACKAGES.map(
    (p) =>
      `- id: ${p.id} | tier: ${p.tier} | name: ${p.name.en} | ${p.tagline.en} | goals: ${p.goals.join(",")}`,
  ).join("\n");
}
