import { NextResponse } from "next/server";
import type {
  CheckinSummary,
  CheckinTimepoint,
  Locale,
  WellnessCheckin,
} from "@/lib/types";
import { CHECKIN_INSTRUMENT_VERSION } from "@/data/checkin";
import {
  computeDeltas,
  computeDials,
  mergeLlmAnalysis,
  ruleBasedAnalysis,
  validateCheckinAnswers,
  validateObjective,
  type CheckinContext,
} from "@/lib/checkin-core";
import { runCheckinLlm } from "@/lib/checkin-llm";
import { hasGeminiKey } from "@/lib/gemini";
import {
  getAssessment,
  getBooking,
  getCheckinsByBooking,
  newCheckinId,
  saveCheckin,
} from "@/lib/store";
import { getPackage } from "@/data/packages";

/* ============================================================
 * POST /api/checkin — submit a T1 (before) or T2 (after) check-in.
 *
 * Dial scores are computed here from the fixed anchor table —
 * the LLM only reads and interprets (Q8, red flags, summaries)
 * and its output is validated/clamped before storage. Without a
 * Gemini key, or on any LLM failure, the rule-based analysis is
 * used instead — this endpoint never 500s because of the LLM.
 *
 * GET /api/checkin?bookingId=BK-XXXXXX — minimal listing (no
 * health data) used to gate the flow and render entry buttons.
 * ============================================================ */

export const runtime = "nodejs";

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "invalid_body" }, { status: 400 });
  }

  // PDPA gate — health data needs explicit consent.
  if (body?.consent !== true) {
    return NextResponse.json({ error: "consent_required" }, { status: 400 });
  }

  const timepoint = body.timepoint as CheckinTimepoint;
  if (timepoint !== "T1" && timepoint !== "T2") {
    return NextResponse.json({ error: "invalid_timepoint" }, { status: 400 });
  }

  const bookingId =
    typeof body.bookingId === "string" ? body.bookingId.trim().toUpperCase() : "";
  if (!bookingId) {
    return NextResponse.json({ error: "booking_required" }, { status: 400 });
  }

  const answers = validateCheckinAnswers(body.answers);
  if (!answers) {
    return NextResponse.json({ error: "invalid_answers" }, { status: 400 });
  }

  const locale: Locale = body.locale === "en" ? "en" : "th";
  const objective = validateObjective(body.objective);

  let booking;
  try {
    booking = await getBooking(bookingId);
  } catch {
    booking = null;
  }
  if (!booking) {
    return NextResponse.json({ error: "booking_not_found" }, { status: 404 });
  }

  // One measurement per timepoint — re-submitting routes to the original.
  let existing: WellnessCheckin[] = [];
  try {
    existing = await getCheckinsByBooking(bookingId);
  } catch {
    existing = [];
  }
  const duplicate = existing.find((c) => c.timepoint === timepoint);
  if (duplicate) {
    return NextResponse.json(
      { error: "already_done", checkinId: duplicate.id },
      { status: 409 },
    );
  }

  const dials = computeDials(answers);

  // T2 needs the same booking's T1 to tell the before/after story.
  let deltas;
  let deltasComparable: boolean | undefined;
  let linkedProfile;
  if (booking.assessmentId) {
    try {
      linkedProfile = await getAssessment(booking.assessmentId);
    } catch {
      linkedProfile = null;
    }
  }
  if (timepoint === "T2") {
    const t1 = existing.find((c) => c.timepoint === "T1");
    const baseline = t1
      ? {
          instrumentVersion: t1.instrumentVersion,
          dials: t1.dials,
        }
      : linkedProfile?.baselineCheckin;
    if (!baseline) {
      return NextResponse.json({ error: "t1_required" }, { status: 400 });
    }
    // Deltas are only trustworthy within one instrument version.
    deltasComparable = baseline.instrumentVersion === CHECKIN_INSTRUMENT_VERSION;
    deltas = deltasComparable ? computeDeltas(baseline.dials, dials) : undefined;
  }

  // Archetype from the linked T0 assessment, when the booking has one.
  let archetypeName;
  archetypeName = linkedProfile?.archetype.name;

  const ctx: CheckinContext = {
    timepoint,
    dials,
    deltas,
    archetypeName,
    q8: answers.q8,
    objective,
    packageId: booking.packageId,
  };

  // Rule-based baseline always; LLM refines when available.
  const rules = ruleBasedAnalysis(ctx);
  let { analysis, t2 } = rules;
  if (hasGeminiKey()) {
    try {
      const llm = await runCheckinLlm(ctx, getPackage(booking.packageId));
      ({ analysis, t2 } = mergeLlmAnalysis(llm, rules, ctx));
    } catch {
      ({ analysis, t2 } = rules); // graceful degrade
    }
  }

  const checkin: WellnessCheckin = {
    id: newCheckinId(),
    bookingId,
    assessmentId: booking.assessmentId,
    timepoint,
    instrumentVersion: CHECKIN_INSTRUMENT_VERSION,
    locale,
    answers,
    objective,
    dials,
    deltas,
    deltasComparable,
    analysis,
    t2,
    consent: true,
    createdAt: new Date().toISOString(),
  };

  try {
    await saveCheckin(checkin);
  } catch {
    // Unlike assessments, the result page reads this back by id —
    // a silent save failure would strand the guest on a dead link.
    return NextResponse.json({ error: "store_failed" }, { status: 500 });
  }

  return NextResponse.json({ checkin });
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const bookingId = (searchParams.get("bookingId") ?? "").trim().toUpperCase();
  if (!bookingId) {
    return NextResponse.json({ error: "booking_required" }, { status: 400 });
  }

  try {
    const checkins = await getCheckinsByBooking(bookingId);
    // Data minimisation: ids and timepoints only — no health data.
    const summaries: CheckinSummary[] = checkins.map((c) => ({
      id: c.id,
      timepoint: c.timepoint,
      instrumentVersion: c.instrumentVersion,
      createdAt: c.createdAt,
    }));
    return NextResponse.json({ checkins: summaries });
  } catch {
    return NextResponse.json({ checkins: [] });
  }
}
