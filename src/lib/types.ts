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
  /** Unified pre-booking baseline used as T1 for later T2 comparison. */
  baselineCheckin?: AssessmentBaselineCheckin;
  createdAt: string;
}

export interface AssessmentBaselineCheckin {
  timepoint: "T1";
  instrumentVersion: string;
  answers: CheckinAnswers;
  dials: CheckinDials;
  createdAt: string;
}

/* ---------------- Packages ---------------- */

export type PackageTier = "basic" | "premium" | "deluxe";

export interface ItineraryItem {
  /** A clock time ("09:30") or a bilingual duration label. */
  time: string | LText;
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
    carbs: string;
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
  /** The single AI-highlighted pick within its tier (the ribboned hero). */
  hero?: boolean;
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

/* ---------------- Check-in (T1 / T2 / T3 body-mind compass) ---------------- */

/**
 * T1 = before the program starts, T2 = right after it ends,
 * T3 = the 30-day follow-up (does the change hold?).
 */
export type CheckinTimepoint = "T1" | "T2" | "T3";

/** The five dials shown on the before/after card. */
export type DialKey = "stress" | "migraine" | "sleep" | "mind" | "energy";

/**
 * Raw answers as submitted. Closed questions store the option key;
 * every anchored score is derived in code (never by the LLM).
 */
export interface CheckinAnswers {
  /** Q1 sea-state mood. */
  q1: string;
  /** Q2 perceived control (PSS-4 flavour). */
  q2: string;
  /** Q3 headache frequency (timeframe differs T1/T2). */
  q3: string;
  /** Q4 sensory sensitivity today. */
  q4: string;
  /** Q5 last night's sleep quality. */
  q5: string;
  /** Q5 supplement — approximate hours slept. */
  q5Hours?: number;
  /** Q6 wellbeing moments (WHO-5 flavour). */
  q6: string;
  /** Q7 vitality VAS slider, 0-100 used directly. */
  q7: number;
  /** Q8 open text — the LLM's only scoring-free territory. */
  q8?: string;
}

/** Staff-measured vitals — kept separate from dial scores. */
export interface CheckinObjective {
  bpSystolic?: number;
  bpDiastolic?: number;
  restingHr?: number;
  weightKg?: number;
  /** Sleep hours from the guest's wearable, if any. */
  deviceSleepHours?: number;
}

export interface DialScore {
  /** 0 - 100 */
  value: number;
  band: ScoreBand;
}

export type CheckinDials = Record<DialKey, DialScore>;

export type DialTrend = "improved" | "steady" | "declined";

/** T2-only before/after delta for one dial (deadband ±5 = steady). */
export interface DialDelta {
  dial: DialKey;
  before: number;
  after: number;
  /** after - before */
  delta: number;
  /** Direction-aware: "improved" follows the dial's good direction. */
  trend: DialTrend;
}

export type CheckinRedFlagType =
  | "medication"
  | "condition"
  | "pregnancy"
  | "recent_surgery"
  | "severe_symptom"
  | "mood_risk";

export interface CheckinRedFlag {
  type: CheckinRedFlagType;
  detail: string;
  /** Original wording from the guest's open answer. */
  quote: string;
  severity: "review" | "urgent";
}

export type CheckinSentiment = "neutral" | "positive" | "negative" | "mixed";

/** LLM (validated) or rule-based interpretation layered over the scores. */
export interface CheckinAnalysis {
  languageDetected: string;
  redFlags: CheckinRedFlag[];
  preferences: string[];
  goals: string[];
  sentiment: CheckinSentiment;
  testimonialCandidate: boolean;
  expertReviewRequired: boolean;
  urgent: boolean;
  urgentMessage: LText | null;
  summaryForCustomer: LText;
  /** Staff brief bullets — always Thai (clinic-facing). */
  summaryForStaff: string[];
  source: "llm" | "rules";
}

export interface CheckinNextRecommendation {
  packageId: string;
  reason: LText;
}

/** T2/T3 narrative + next-step pick from the real catalog. */
export interface CheckinT2Extras {
  changeNarrative: LText;
  highlightDial: DialKey;
  nextRecommendation: CheckinNextRecommendation | null;
}

export interface WellnessCheckin {
  /** Public check-in id, e.g. "CI-7F3K2A". */
  id: string;
  bookingId: string;
  /** Linked T0 assessment, when the booking carries one. */
  assessmentId?: string;
  timepoint: CheckinTimepoint;
  /** Deltas are only comparable within the same version. */
  instrumentVersion: string;
  locale: Locale;
  answers: CheckinAnswers;
  objective?: CheckinObjective;
  dials: CheckinDials;
  /** T2 & T3 — vs the booking's baseline (T1 or the T0 assessment). */
  deltas?: DialDelta[];
  /** False when the baseline was answered on a different instrument version. */
  deltasComparable?: boolean;
  analysis: CheckinAnalysis;
  /** T2 only — change narrative + next pick. */
  t2?: CheckinT2Extras;
  /** T3 only — 30-day durability narrative + next pick. */
  t3?: CheckinT2Extras;
  /** Explicit health-data (sensitive) consent — PDPA. */
  consent: boolean;
  /** Separate opt-in to reuse the open answer as a testimonial. */
  testimonialConsent?: boolean;
  createdAt: string;
}

/** Minimal listing shape — no health data. */
export interface CheckinSummary {
  id: string;
  timepoint: CheckinTimepoint;
  instrumentVersion: string;
  createdAt: string;
}

export interface CheckinSubmitBody {
  bookingId: string;
  timepoint: CheckinTimepoint;
  locale: Locale;
  consent: boolean;
  answers: CheckinAnswers;
  objective?: CheckinObjective;
}
