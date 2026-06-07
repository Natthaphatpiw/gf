/* ============================================================
 * Shared domain types — Goodfill Care, Samui Wellness platform
 * ============================================================ */

export type Locale = "th" | "en";
export type GuestGender = "female" | "male";

/** Bilingual text — every user-facing string lives in both languages. */
export interface LText {
  th: string;
  en: string;
}

/* ---------------- Wellness goals ---------------- */

export type GoalId =
  | "sleep_better"
  | "detox"
  | "burnout_recovery"
  | "active_fitness"
  | "plant_based_week"
  | "anti_aging_checkup";

export const ALL_GOALS: GoalId[] = [
  "sleep_better",
  "detox",
  "burnout_recovery",
  "active_fitness",
  "plant_based_week",
  "anti_aging_checkup",
];

/* ---------------- Assessment ---------------- */

/** A single answer captured from the journey quiz. */
export interface AssessmentAnswer {
  questionId: string;
  /** Option key chosen, or numeric value for sliders, or free text. */
  value: string | number;
}

export interface AssessmentInput {
  locale: Locale;
  answers: AssessmentAnswer[];
  /** Used only to select the optional archetype character artwork. */
  gender?: GuestGender;
  /** Optional self-reported 16personalities type, e.g. "INFJ". Empty if skipped. */
  mbti?: string;
  /** Optional free-form note from the guest. */
  note?: string;
  /** PDPA consent must be true before the API accepts the submission. */
  consent: boolean;
}

export type ScoreBand = "low" | "moderate" | "high";

export interface Score {
  /** 0 - 100 */
  value: number;
  band: ScoreBand;
  /** Short bilingual interpretation, e.g. "Calm sea — your stress is low". */
  summary: LText;
}

/** One of our 16 Samui Wellness Archetypes (4 axes x 2 poles). */
export interface Archetype {
  /** 4-letter code, e.g. "SLTP" — see lib/archetypes.ts */
  code: string;
  name: LText;
  description: LText;
}

export interface WellnessProfile {
  /** Public assessment id, e.g. "SW-7F3K2A" — used for family packages. */
  id: string;
  stress: Score;
  migraine: Score;
  mental: Score;
  /** 3-5 personal habit / character observations relevant to wellness. */
  traits: LText[];
  archetype: Archetype;
  /** Optional display preference for archetype character artwork. */
  gender?: GuestGender;
  /** Goals the system recommends, ordered by fit. */
  recommendedGoals: GoalId[];
  createdAt: string;
}

/* ---------------- Packages ---------------- */

export type PackageTier = "basic" | "premium" | "deluxe";

export interface ItineraryItem {
  time: string;
  activity: LText;
  partner: string;
}

export interface ItineraryDay {
  day: number;
  title: LText;
  items: ItineraryItem[];
}

export interface WellnessPackage {
  id: string;
  tier: PackageTier;
  name: LText;
  tagline: LText;
  days: number;
  nights: number;
  /** THB per person */
  price: number;
  image: string;
  /** Real Samui businesses included in this package. */
  partners: string[];
  highlights: LText[];
  itinerary: ItineraryDay[];
  suitableFor: LText;
  goals: GoalId[];
}

export interface PackageMeal {
  id: string;
  name: LText;
  partner: string;
  portion: LText;
  nutrition: {
    calories: string;
    protein: string;
    sugar: string;
    fiber: string;
    sodium?: string;
  };
  wellnessNote: LText;
}

export interface PackageCareDetails {
  meals: PackageMeal[];
  notes: LText[];
}

/** What the recommender returns for each of the 6 suggested packages. */
export interface PackageRecommendation {
  packageId: string;
  tier: PackageTier;
  /** Why this package fits this guest (or family), in both languages. */
  reason: LText;
  /** 0-100 match score for display. */
  matchScore: number;
}

/* ---------------- Booking ---------------- */

export type BookingStatus =
  | "booked" // จองเสร็จสิ้น
  | "expert_review" // ปรึกษาผู้เชี่ยวชาญ (only when consult was requested)
  | "processing" // กำลังดำเนินการ
  | "contacted" // ติดต่อกลับ
  | "completed"; // เสร็จสิ้น

export interface FamilyMember {
  assessmentId: string;
  label?: string;
}

export interface CustomerInfo {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
}

/** An adjustment the expert proposes to one part of the package. */
export interface ExpertAdjustment {
  /** Where in the itinerary, e.g. "Day 1 - Dinner". */
  target: string;
  original: string;
  replacement: string;
  reason: string;
}

export interface ExpertReview {
  expertName: string;
  comment: string;
  adjustments: ExpertAdjustment[];
  approved: boolean;
  reviewedAt: string;
  /** Guest accepted the adjusted plan. */
  customerAccepted?: boolean;
}

export interface Booking {
  id: string;
  packageId: string;
  customer: CustomerInfo;
  assessmentId?: string;
  isFamily: boolean;
  familySize?: number;
  familyMembers?: FamilyMember[];
  consultRequested: boolean;
  status: BookingStatus;
  statusHistory: { status: BookingStatus; at: string; note?: string }[];
  expertReview?: ExpertReview;
  /** PDPA */
  consent: boolean;
  createdAt: string;
  updatedAt: string;
}

/* ---------------- API payloads ---------------- */

export interface RecommendRequest {
  /** Primary guest profile id. */
  assessmentId: string;
  /** Selected goals (user-picked or system-recommended). */
  goals: GoalId[];
  /** Additional family member assessment ids (family flow). */
  familyAssessmentIds?: string[];
  locale: Locale;
}

export interface RecommendResponse {
  recommendations: PackageRecommendation[];
}
