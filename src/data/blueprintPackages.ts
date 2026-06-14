import type { LText, PackageTier } from "@/lib/types";
import rawProgramData from "./blueprintPackages.json";

/* ============================================================
 * Goodfill Evidence-Based Blueprint System v1
 * ------------------------------------------------------------
 * Wellness programs are NOT bundles of shop services. Each
 * program is an evidence-grounded "blueprint": a fixed sequence
 * of slots (with a documented mechanism + evidence level) that
 * partner shops plug their own services/menus into.
 *
 * Slots reference real Hug Samui services / menus by id where a
 * fit exists; otherwise the slot is "unassigned" (partner TBD)
 * or "guidance" (delivered by the Goodfill app / expert team).
 * Nothing here is a medical claim — see `allowedClaim` /
 * `forbiddenClaims` per program and the dataset disclaimer.
 * ============================================================ */

export type ProgramCategory =
  | "deep_sleep"
  | "calm_mind"
  | "clear_head"
  | "gut_reset"
  | "samui_reset"
  | "samui_recharge"
  | "workmode_recovery";

/** Where in the trip the program is meant to land. */
export type ProgramTripPhase = "arrival" | "during" | "departure" | "anytime";

/** A=strong/guideline, B=context-dependent, C=experience layer only. */
export type EvidenceLevel = "A" | "B" | "C";

export type SlotFillType = "service" | "menu" | "guidance" | "unassigned";

export type WellnessPillar = "food" | "air" | "mind";

export interface ProgramTrigger {
  label: LText;
  criterion: LText;
}

export interface ProgramMechanism {
  title: LText;
  detail: LText;
}

export interface ProgramOutcomeMetric {
  timepoint: LText;
  measures: LText;
}

export interface ProgramSlotFill {
  type: SlotFillType;
  /** Hug Samui service id when type === "service". */
  serviceId: string | null;
  /** Hug Samui menu id when type === "menu". */
  menuId: string | null;
  /** false = a partner still needs to be matched to this slot. */
  partnerAssigned: boolean;
  /** What kind of partner plugs in here (or "Goodfill team"). */
  partnerType: LText;
  /** Plug-in rule / what this slot delivers. */
  note: LText;
}

export interface ProgramSlot {
  order: number;
  /** Shared slot-library code, e.g. "B01" — null for bespoke slots. */
  slotCode: string | null;
  name: LText;
  /** Human duration label, e.g. "60–90 min". */
  duration: LText;
  evidenceLevel: EvidenceLevel;
  /** Why this slot is here / the mechanism it supports. */
  mechanism: LText;
  fill: ProgramSlotFill;
}

export interface BlueprintProgram {
  id: string;
  blueprintNumber: number;
  sortOrder: number;
  slug: string;
  status: "draft" | "published";
  /** Catalog tier — basic / premium / deluxe. */
  tier: PackageTier;
  category: ProgramCategory;
  tripPhase: ProgramTripPhase;
  name: LText;
  /** Short Thai nickname / EN descriptor under the name. */
  subtitle: LText;
  image: string;
  durationLabel: LText;
  /** Indicative starting price in THB (estimate). null = on request. */
  priceFrom: number | null;
  tagline: LText;
  programIntent: LText;
  /** Immersive "imagine your day" narrative used on the detail page. */
  scenarioClaim: LText;
  /** Who this program is for (paragraph). */
  suitableFor: LText;
  /** Why this program can help (paragraph). */
  whyItWorks: LText;
  coreMechanisms: ProgramMechanism[];
  triggers: ProgramTrigger[];
  safetyGate: LText;
  /** Clear Head etc. — must pass a medical screen before booking. */
  safetyGateRequired: boolean;
  slots: ProgramSlot[];
  outcomeMetrics: ProgramOutcomeMetric[];
  expertLayer: LText;
  allowedClaim: LText;
  forbiddenClaims: LText[];
  goals: string[];
  pillars: WellnessPillar[];
}

export interface BlueprintProgramDataset {
  version: string;
  status: "draft" | "published";
  sourceNote: LText;
  positioning: {
    name: LText;
    summary: LText;
    disclaimer: LText;
  };
  programs: BlueprintProgram[];
}

export const BLUEPRINT_PROGRAM_DATA =
  rawProgramData as BlueprintProgramDataset;

export const BLUEPRINT_PROGRAMS = [...BLUEPRINT_PROGRAM_DATA.programs].sort(
  (a, b) => a.sortOrder - b.sortOrder,
);

export function getBlueprintProgram(slug: string) {
  return BLUEPRINT_PROGRAMS.find((program) => program.slug === slug);
}

export const BLUEPRINT_PROGRAM_SLUGS = BLUEPRINT_PROGRAMS.map((p) => p.slug);
