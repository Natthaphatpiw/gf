import { NextResponse } from "next/server";
import type {
  GoalId,
  PackageRecommendation,
  RecommendRequest,
  WellnessProfile,
} from "@/lib/types";
import { ALL_GOALS } from "@/lib/types";
import { getAssessment } from "@/lib/store";
import { catalogForLlm } from "@/data/packages";
import { generateJson, hasGeminiKey } from "@/lib/gemini";
import {
  SYSTEM_PROMPT,
  buildUserPrompt,
  normaliseRecommendations,
  ruleBasedRecommendations,
} from "./recommend-core";

/* ============================================================
 * POST /api/recommend
 *
 * Body: { assessmentId, goals, familyAssessmentIds?, locale }
 * Returns: { recommendations: PackageRecommendation[] } — always
 *          exactly 3 items (1 basic + 1 premium + 1 deluxe).
 *
 * Gracefully degrades to a deterministic, rule-based ranking when
 * no Gemini key is configured or the model call fails. Never 500s
 * for a missing key.
 * ============================================================ */

export const runtime = "nodejs";

function sanitiseGoals(input: unknown): GoalId[] {
  if (!Array.isArray(input)) return [];
  return input.filter((g): g is GoalId => ALL_GOALS.includes(g as GoalId));
}

function sanitiseIds(input: unknown): string[] {
  if (!Array.isArray(input)) return [];
  return input
    .filter((v): v is string => typeof v === "string")
    .map((v) => v.trim().toUpperCase())
    .filter(Boolean)
    .slice(0, 6);
}

export async function POST(req: Request) {
  let body: Partial<RecommendRequest>;
  try {
    body = (await req.json()) as Partial<RecommendRequest>;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const assessmentId =
    typeof body.assessmentId === "string" ? body.assessmentId.trim() : "";
  if (!assessmentId) {
    return NextResponse.json(
      { error: "assessmentId is required." },
      { status: 400 },
    );
  }

  let primary: WellnessProfile | null;
  try {
    primary = await getAssessment(assessmentId);
  } catch {
    return NextResponse.json(
      { error: "Could not load the assessment." },
      { status: 500 },
    );
  }
  if (!primary) {
    return NextResponse.json(
      { error: "Assessment not found." },
      { status: 404 },
    );
  }

  const goals = sanitiseGoals(body.goals);
  const familyIds = sanitiseIds(body.familyAssessmentIds).filter(
    (id) => id !== assessmentId.toUpperCase(),
  );

  // Collect whichever family profiles actually exist; silently skip
  // any that are missing (members may not all have assessments yet).
  const family: WellnessProfile[] = [];
  for (const id of familyIds) {
    try {
      const member = await getAssessment(id);
      if (member) family.push(member);
    } catch {
      /* skip unreadable member */
    }
  }

  let recommendations: PackageRecommendation[];

  if (hasGeminiKey()) {
    try {
      const raw = await generateJson<unknown>({
        system: SYSTEM_PROMPT,
        user: buildUserPrompt(goals, primary, family, catalogForLlm()),
        temperature: 0.5,
      });
      recommendations = normaliseRecommendations(raw, goals, primary, family);
    } catch {
      recommendations = ruleBasedRecommendations(goals, primary, family);
    }
  } else {
    recommendations = ruleBasedRecommendations(goals, primary, family);
  }

  return NextResponse.json({ recommendations });
}
