import { NextResponse } from "next/server";
import type {
  AssessmentAnswer,
  AssessmentBaselineCheckin,
  AssessmentInput,
  CheckinAnswers,
  GoalId,
  LText,
  Score,
  ScoreBand,
  WellnessProfile,
} from "@/lib/types";
import { ALL_GOALS } from "@/lib/types";
import { QUIZ_QUESTIONS } from "@/data/questions";
import {
  CHECKIN_INSTRUMENT_VERSION,
  CHECKIN_QUESTIONS,
  DIAL_NAMES,
  type CheckinQuestion,
} from "@/data/checkin";
import {
  computeDials,
  validateCheckinAnswers,
} from "@/lib/checkin-core";
import { ARCHETYPES, ARCHETYPE_CODES, getArchetype } from "@/lib/archetypes";
import { GOALS } from "@/data/goals";
import { generateJson, hasGeminiKey } from "@/lib/gemini";
import { newAssessmentId, saveAssessment } from "@/lib/store";

/* ============================================================
 * POST /api/assessment
 *
 * Body: AssessmentInput. Builds a WellnessProfile from the unified
 * pre-booking compass answers.
 *
 * The anchored dial scores are always computed in code. Gemini may
 * interpret the already-computed profile into warmer summaries,
 * traits, goals and archetype language, but it never owns the
 * numeric baseline.
 * ============================================================ */

export const runtime = "nodejs";

/* ---------------- helpers ---------------- */

function bandFor(value: number): ScoreBand {
  if (value <= 33) return "low";
  if (value <= 66) return "moderate";
  return "high";
}

function clampValue(n: unknown, fallback: number): number {
  const num = typeof n === "number" ? n : Number(n);
  if (!Number.isFinite(num)) return fallback;
  return Math.max(0, Math.min(100, Math.round(num)));
}

function asLText(raw: unknown, fallback: LText): LText {
  if (raw && typeof raw === "object") {
    const obj = raw as Record<string, unknown>;
    const th = typeof obj.th === "string" ? obj.th.trim() : "";
    const en = typeof obj.en === "string" ? obj.en.trim() : "";
    if (th && en) return { th, en };
  }
  return fallback;
}

function answerMap(answers: AssessmentAnswer[]): Record<string, string | number> {
  const map: Record<string, string | number> = {};
  for (const a of answers) {
    if (a && typeof a.questionId === "string") map[a.questionId] = a.value;
  }
  return map;
}

function choice(map: Record<string, string | number>, id: string): string {
  const v = map[id];
  return typeof v === "string" ? v : "";
}

function num(
  map: Record<string, string | number>,
  id: string,
  fallback: number,
): number {
  const v = map[id];
  const n = typeof v === "number" ? v : Number(v);
  return Number.isFinite(n) ? n : fallback;
}

function checkinAnswersFromInput(input: AssessmentInput) {
  const m = answerMap(input.answers);
  return validateCheckinAnswers({
    q1: m.q1,
    q2: m.q2,
    q3: m.q3,
    q4: m.q4,
    q5: m.q5,
    q5Hours: m.q5Hours,
    q6: m.q6,
    q7: m.q7,
    q8: input.note,
  });
}

function checkinChoiceLabel(question: CheckinQuestion, value: string | number): string {
  if (question.options) {
    const opt = question.options.find((o) => o.key === value);
    if (opt) return `${opt.key} ("${opt.label.en}")`;
  }
  if (question.slider) {
    return `${value} (range ${question.slider.min}-${question.slider.max})`;
  }
  return String(value);
}

/* ---------------- deterministic fallback scoring ---------------- */

function fallbackProfileFromCheckin(
  answers: CheckinAnswers,
): {
  stress: number;
  migraine: number;
  mental: number;
  traits: LText[];
  archetypeCode: string;
  recommendedGoals: GoalId[];
  baselineCheckin: AssessmentBaselineCheckin;
} {
  const dials = computeDials(answers);
  const stress = dials.stress.value;
  const migraine = dials.migraine.value;
  const sleep = dials.sleep.value;
  const mind = dials.mind.value;
  const energy = dials.energy.value;
  const mental = clampValue(mind * 0.45 + energy * 0.35 + sleep * 0.2, mind);

  const q2High = answers.q2 === "slipping" || answers.q2 === "overflow";
  const axisRecharge = mind >= 60 && energy >= 55 ? "S" : "L";
  const axisPace = energy >= 65 ? "A" : "T";
  const axisStructure = q2High || stress >= 67 ? "P" : "F";
  const axisFocus = migraine >= stress ? "B" : "M";
  let archetypeCode = `${axisRecharge}${axisPace}${axisStructure}${axisFocus}`;
  if (!ARCHETYPE_CODES.includes(archetypeCode)) archetypeCode = "LTFB";

  const goalScores: { id: GoalId; weight: number }[] = [
    {
      id: "burnout_recovery",
      weight: stress * 0.62 + (100 - mind) * 0.24 + (100 - energy) * 0.14,
    },
    {
      id: "sleep_better",
      weight: (100 - sleep) * 0.72 + stress * 0.18 + migraine * 0.1,
    },
    {
      id: "detox",
      weight: migraine * 0.52 + stress * 0.16 + (answers.q4 === "severe" ? 18 : 0),
    },
    {
      id: "active_fitness",
      weight: energy * 0.52 + mind * 0.16 + (axisPace === "A" ? 24 : 0),
    },
    {
      id: "plant_based_week",
      weight: mind * 0.22 + sleep * 0.18 + (answers.q6 === "daily" ? 20 : 8),
    },
    {
      id: "anti_aging_checkup",
      weight: migraine * 0.28 + stress * 0.18 + (q2High ? 20 : 8),
    },
  ];
  goalScores.sort((a, b) => b.weight - a.weight);

  const traits: LText[] = [];
  if (stress >= 67) {
    traits.push({
      th: "ระบบประสาทกำลังรับภาระสูงและต้องการจังหวะพักที่ชัดเจน",
      en: "Your nervous system is carrying a high load and needs clear pockets of rest.",
    });
  } else if (stress <= 33) {
    traits.push({
      th: "ใจของคุณค่อนข้างนิ่ง พร้อมรับการดูแลที่ค่อยเป็นค่อยไป",
      en: "Your mind is fairly steady and ready for gentle, gradual care.",
    });
  }
  if (migraine >= 67) {
    traits.push({
      th: "ร่างกายไวต่อสัญญาณปวดหัว แสง เสียง หรือกลิ่นมากกว่าปกติ",
      en: "Your body is more sensitive than usual to headache signals, light, sound or scent.",
    });
  }
  if (sleep <= 45) {
    traits.push({
      th: "การนอนยังเป็นจุดตั้งต้นสำคัญของการฟื้นฟูรอบนี้",
      en: "Sleep is a key starting point for your restoration this time.",
    });
  }
  if (mind <= 35) {
    traits.push({
      th: "ช่วงนี้โมเมนต์ดี ๆ อาจห่างไป จึงควรเติมความเบาใจกลับมาอย่างอ่อนโยน",
      en: "Good moments may feel far apart lately, so gentle emotional refilling matters.",
    });
  } else if (mind >= 67) {
    traits.push({
      th: "คุณยังมีพื้นที่ใจที่สว่าง เป็นแรงส่งที่ดีต่อการดูแลตัวเอง",
      en: "You still carry a bright inner space, which supports your self-care beautifully.",
    });
  }
  if (energy <= 40) {
    traits.push({
      th: "พลังงานร่างกายกำลังต่ำ เหมาะกับโปรแกรมที่ไม่เร่งและให้เวลาฟื้นจริง",
      en: "Your body battery is low, so a slower program with true recovery time will fit best.",
    });
  } else if (energy >= 70) {
    traits.push({
      th: "พลังงานยังดีพอสำหรับกิจกรรมที่ช่วยปลุกความสดชื่นของร่างกาย",
      en: "Your energy is strong enough for activities that wake the body up.",
    });
  }
  if (traits.length < 3) {
    const topGoal = goalScores[0]?.id;
    const topCareDial =
      topGoal === "sleep_better"
        ? "sleep"
        : topGoal === "detox" || topGoal === "anti_aging_checkup"
          ? "migraine"
          : "stress";
    traits.push({
      th: `จุดที่ควรดูแลต่อคือ${DIAL_NAMES[topCareDial].th}`,
      en: `The next area to care for is ${DIAL_NAMES[topCareDial].en.toLowerCase()}.`,
    });
  }

  return {
    stress,
    migraine,
    mental,
    traits: traits.slice(0, 5),
    archetypeCode,
    recommendedGoals: goalScores.slice(0, 3).map((g) => g.id),
    baselineCheckin: {
      timepoint: "T1",
      instrumentVersion: CHECKIN_INSTRUMENT_VERSION,
      answers,
      dials,
      createdAt: new Date().toISOString(),
    },
  };
}

/**
 * Rule-based computation used when no Gemini key is configured or
 * the LLM call fails. Mirrors the `measures` intent of each scene.
 */
function fallbackProfile(input: AssessmentInput): {
  stress: number;
  migraine: number;
  mental: number;
  traits: LText[];
  archetypeCode: string;
  recommendedGoals: GoalId[];
  baselineCheckin?: AssessmentBaselineCheckin;
} {
  const checkinAnswers = checkinAnswersFromInput(input);
  if (checkinAnswers) return fallbackProfileFromCheckin(checkinAnswers);

  const m = answerMap(input.answers);

  /* ----- Stress: sea_mind (primary) + battery (inverse) + sleep + body tension ----- */
  const seaStress: Record<string, number> = {
    glassy: 8,
    gentle_waves: 30,
    choppy: 65,
    storm: 92,
  };
  const battery = num(m, "battery", 60); // 0-100, higher = more energy
  const lastNight = choice(m, "last_night");
  const sleepStress: Record<string, number> = {
    log: 0,
    cat_nap: 14,
    owl: 18,
    jellyfish: 24,
  };
  const bodySignal: Record<string, number> = {
    throbbing_head: 70,
    tight_shoulders: 48,
    heavy_eyes: 42,
    restless_sleep: 38,
    all_quiet: 6,
  };
  let stress =
    (seaStress[choice(m, "sea_mind")] ?? 45) * 0.58 +
    (100 - battery) * 0.24 +
    (sleepStress[lastNight] ?? 12) +
    (bodySignal[choice(m, "body_signal")] ?? 35) * 0.12;
  stress = clampValue(stress, 45);

  /* ----- Migraine: body_signal + sensitivity + first_drink + last_night ----- */
  const sensitivity = num(m, "sensitivity", 5); // 0-10
  const drink = choice(m, "first_drink");
  const drinkMig: Record<string, number> = {
    double_espresso: 16,
    herbal_tea: 0,
    green_smoothie: 2,
    coconut: 0,
  };
  let migraine =
    (bodySignal[choice(m, "body_signal")] ?? 35) * 0.6 +
    sensitivity * 3 +
    (drinkMig[drink] ?? 6) +
    (sleepStress[lastNight] ?? 12) * 0.6;
  migraine = clampValue(migraine, 40);

  /* ----- Mental (HIGH = flourishing): battery + last_laugh + last_night ----- */
  const laugh = choice(m, "last_laugh");
  const laughScore: Record<string, number> = {
    today: 26,
    right_now: 28,
    this_week: 14,
    cant_recall: -18,
  };
  const sleepMental: Record<string, number> = {
    log: 16,
    cat_nap: 2,
    owl: -2,
    jellyfish: -12,
  };
  let mental =
    battery * 0.6 + (laughScore[laugh] ?? 6) + (sleepMental[lastNight] ?? 0) + 22;
  mental = clampValue(mental, 60);

  /* ----- Archetype: derive 4 axis letters -----
     Recharge  S(social)/L(solitary) <- company
     Pace      A(active)/T(tranquil) <- recharge
     Structure P(planned)/F(flowing) <- crossroads
     Focus     B(body)/M(mind)       <- recharge */
  const company = choice(m, "company");
  const recharge = choice(m, "recharge");
  const crossroads = choice(m, "crossroads");

  // Recharge: small_circle / whole_family -> Social; solo / one_person -> Solitary.
  const axisRecharge =
    company === "small_circle" || company === "whole_family" ? "S" : "L";

  // Pace: a real sweat -> Active; otherwise the guest restores through slower regulation.
  const axisPace = recharge === "sweat" ? "A" : "T";

  // Structure: stopping to check the map -> Planned; otherwise Flowing.
  const axisStructure = crossroads === "open_map" ? "P" : "F";

  // Focus: feels through the body vs thinks first. Default to Body-led on ties.
  const bodyLed = recharge === "sweat" || recharge === "float";
  const mindLed = recharge === "quiet_read" || recharge === "long_talk";
  const axisFocus = mindLed && !bodyLed ? "M" : "B";

  let code = `${axisRecharge}${axisPace}${axisStructure}${axisFocus}`;
  if (!ARCHETYPE_CODES.includes(code)) code = "LTFB";

  /* ----- Goals: worst scores drive recommendations ----- */
  const goalScores: { id: GoalId; weight: number }[] = [
    { id: "burnout_recovery", weight: stress * 0.7 + (100 - mental) * 0.3 },
    { id: "sleep_better", weight: (sleepStress[lastNight] ?? 12) * 2 + migraine * 0.3 },
    { id: "detox", weight: migraine * 0.5 + (drink === "double_espresso" ? 30 : 0) },
    { id: "active_fitness", weight: battery * 0.5 + (axisPace === "A" ? 30 : 0) },
    { id: "plant_based_week", weight: (drink === "green_smoothie" || drink === "herbal_tea" ? 30 : 8) + migraine * 0.2 },
    { id: "anti_aging_checkup", weight: (axisStructure === "P" ? 24 : 8) + migraine * 0.25 },
  ];
  goalScores.sort((a, b) => b.weight - a.weight);
  const recommendedGoals = goalScores.slice(0, 3).map((g) => g.id);

  /* ----- Traits ----- */
  const traits: LText[] = [];
  if (drink === "double_espresso")
    traits.push({
      th: "พึ่งพาคาเฟอีนเป็นเชื้อเพลิงหลักของวัน",
      en: "Leans on caffeine as the day's main fuel",
    });
  if (battery < 40)
    traits.push({
      th: "พลังภายในกำลังร่อยหรอ ถึงเวลาเติมอย่างจริงจัง",
      en: "Inner reserves are running low and genuinely need refilling",
    });
  else if (battery >= 70)
    traits.push({
      th: "ยังมีพลังใจที่ดี พร้อมเปิดรับสิ่งใหม่",
      en: "Carries good energy and an openness to new things",
    });
  if (sensitivity >= 7)
    traits.push({
      th: "ประสาทสัมผัสไวต่อแสง เสียง และกลิ่นเป็นพิเศษ",
      en: "Unusually sensitive to light, sound and scent",
    });
  if (lastNight === "owl" || lastNight === "jellyfish")
    traits.push({
      th: "การนอนยังไม่ลึกพอที่จะฟื้นกายใจได้เต็มที่",
      en: "Sleep is not yet deep enough to fully restore",
    });
  if (axisStructure === "F")
    traits.push({
      th: "ไหลไปกับจังหวะของวันมากกว่ายึดติดกับแผน",
      en: "Flows with the day rather than clinging to a plan",
    });
  else
    traits.push({
      th: "รู้สึกมั่นคงเมื่อมีแบบแผนและจังหวะที่ชัดเจน",
      en: "Feels steadiest with clear structure and rhythm",
    });
  // ensure 3-5
  if (traits.length < 3)
    traits.push({
      th: "ให้คุณค่ากับช่วงเวลาเงียบ ๆ ที่ได้อยู่กับตัวเอง",
      en: "Values quiet moments alone with yourself",
    });
  const trimmedTraits = traits.slice(0, 5);

  return {
    stress,
    migraine,
    mental,
    traits: trimmedTraits,
    archetypeCode: code,
    recommendedGoals,
  };
}

/* ---------------- LLM path ---------------- */

interface LlmScore {
  value?: number;
  band?: string;
  summary?: { th?: string; en?: string };
}
interface LlmResult {
  stress?: LlmScore;
  migraine?: LlmScore;
  mental?: LlmScore;
  traits?: { th?: string; en?: string }[];
  archetypeCode?: string;
  recommendedGoals?: string[];
}

function buildSystemPrompt(): string {
  return [
    "You are the wellness intelligence of Goodfill Care, a premium bilingual wellness platform on Koh Samui, Thailand.",
    "A guest has completed the unified pre-booking body-mind compass: seven anchored questions plus one optional open note.",
    "The numeric dial scores are already computed in code from fixed anchors. Do not recalculate, override or invent numeric scores.",
    "Your job is to read and interpret: warm summaries, traits, archetype and goal fit, with the calm voice of a luxury wellness host (Six Senses / Kamalaya tone).",
    "Return STRICT JSON ONLY, no prose, no markdown, matching exactly this shape:",
    '{ "stress": {"value":0-100,"band":"low|moderate|high","summary":{"th":"...","en":"..."}}, "migraine": {...same}, "mental": {...same}, "traits": [3-5 of {"th":"...","en":"..."}], "archetypeCode":"ONE_OF_THE_16", "recommendedGoals":["goalId", ...] }',
    "Rules:",
    "- You may echo the provided values, but the server will ignore any numeric changes and keep its computed values.",
    "- band MUST be consistent with the provided value: 0-33 low, 34-66 moderate, 67-100 high.",
    "- For stress and migraine, HIGHER value = MORE difficulty. For mental, HIGHER value = MORE flourishing (a flourishing mind is good).",
    "- summary.th must be natural, polished Thai; summary.en natural, polished English. Each summary is one warm sentence. NEVER mix languages within a field.",
    "- traits: 3 to 5 short, specific, wellness-relevant observations about the guest's habits or character, each bilingual.",
    "- archetypeCode MUST be exactly one of the 16 provided codes.",
    "- recommendedGoals: 2 or 3 goal ids from the provided list, ordered by best fit first.",
    "- Do not diagnose medical conditions; use tendency, signal, or what the guest described.",
  ].join("\n");
}

function buildUserPrompt(input: AssessmentInput): string {
  const checkinAnswers = checkinAnswersFromInput(input);
  if (checkinAnswers) {
    const dials = computeDials(checkinAnswers);
    const mental = clampValue(
      dials.mind.value * 0.45 + dials.energy.value * 0.35 + dials.sleep.value * 0.2,
      dials.mind.value,
    );
    const answerValues = {
      ...checkinAnswers,
      q5Hours: checkinAnswers.q5Hours,
    } as Record<string, string | number | undefined>;
    const lines: string[] = [];
    lines.push(`Guest locale: ${input.locale}`);
    if (input.note) lines.push(`Open note from guest: ${input.note}`);
    lines.push("");
    lines.push("COMPUTED SCORES (do not change these values):");
    lines.push(`- stress: ${dials.stress.value} (${dials.stress.band})`);
    lines.push(`- migraine: ${dials.migraine.value} (${dials.migraine.band})`);
    lines.push(`- sleep: ${dials.sleep.value} (${dials.sleep.band})`);
    lines.push(`- mind: ${dials.mind.value} (${dials.mind.band})`);
    lines.push(`- energy: ${dials.energy.value} (${dials.energy.band})`);
    lines.push(`- mental profile score shown to guest: ${mental} (${bandFor(mental)})`);
    lines.push("");
    lines.push("ANSWERS:");
    for (const q of CHECKIN_QUESTIONS) {
      const value = answerValues[q.id];
      if (value === undefined || value === "") continue;
      lines.push(`- ${q.id}: ${checkinChoiceLabel(q, value)}`);
      if (q.id === "q5" && checkinAnswers.q5Hours !== undefined) {
        lines.push(`- q5Hours: ${checkinAnswers.q5Hours}`);
      }
    }
    lines.push("");
    lines.push("THE 16 ARCHETYPE CODES (code: one-line essence):");
    for (const code of ARCHETYPE_CODES) {
      const a = ARCHETYPES[code];
      lines.push(`- ${code}: ${a.name.en} — ${a.description.en}`);
    }
    lines.push("");
    lines.push(`THE 6 GOAL IDS: ${ALL_GOALS.join(", ")}`);
    for (const id of ALL_GOALS) {
      lines.push(`- ${id}: ${GOALS[id].name.en} — ${GOALS[id].description.en}`);
    }
    return lines.join("\n");
  }

  const lines: string[] = [];
  lines.push(`Guest locale: ${input.locale}`);
  if (input.mbti) lines.push(`Self-reported 16-type: ${input.mbti}`);
  if (input.note) lines.push(`Free-form note from guest: ${input.note}`);

  lines.push("");
  lines.push("ANSWERS (scene id, what it measures, the guest's choice):");
  const map = answerMap(input.answers);
  for (const q of QUIZ_QUESTIONS) {
    if (q.kind === "mbti" || q.kind === "text") continue;
    const v = map[q.id];
    if (v === undefined || v === "") continue;
    let chosen = String(v);
    if (q.options) {
      const opt = q.options.find((o) => o.key === v);
      if (opt) chosen = `${opt.key} ("${opt.label.en}")`;
    } else if (q.slider) {
      chosen = `${v} (range ${q.slider.min}-${q.slider.max}; ${q.slider.minLabel.en} -> ${q.slider.maxLabel.en})`;
    }
    lines.push(`- ${q.id} [measures: ${q.measures}]: ${chosen}`);
  }

  lines.push("");
  lines.push("THE 16 ARCHETYPE CODES (code: one-line essence):");
  for (const code of ARCHETYPE_CODES) {
    const a = ARCHETYPES[code];
    lines.push(`- ${code}: ${a.name.en} — ${a.description.en}`);
  }

  lines.push("");
  lines.push(`THE 6 GOAL IDS: ${ALL_GOALS.join(", ")}`);
  for (const id of ALL_GOALS) {
    lines.push(`- ${id}: ${GOALS[id].name.en} — ${GOALS[id].description.en}`);
  }

  return lines.join("\n");
}

function reconcileBand(value: number, band: unknown): ScoreBand {
  const b = typeof band === "string" ? band.toLowerCase() : "";
  const computed = bandFor(value);
  if (b === "low" || b === "moderate" || b === "high") {
    // Keep model band only if it agrees with the value; otherwise trust value.
    return b === computed ? (b as ScoreBand) : computed;
  }
  return computed;
}

function buildScore(
  raw: LlmScore | undefined,
  fallbackValue: number,
  fallbackSummary: LText,
): Score {
  const value = clampValue(raw?.value, fallbackValue);
  return {
    value,
    band: reconcileBand(value, raw?.band),
    summary: asLText(raw?.summary, fallbackSummary),
  };
}

function buildFixedScore(
  raw: LlmScore | undefined,
  value: number,
  fallbackSummary: LText,
): Score {
  return {
    value,
    band: bandFor(value),
    summary: asLText(raw?.summary, fallbackSummary),
  };
}

/* ---------------- fallback summaries ---------------- */

function summaryStress(v: number): LText {
  const b = bandFor(v);
  if (b === "low")
    return {
      th: "ทะเลในใจของคุณค่อนข้างสงบ ความเครียดอยู่ในระดับที่ดูแลได้ดี",
      en: "The sea inside you is calm — your stress sits at a level you carry well.",
    };
  if (b === "moderate")
    return {
      th: "มีคลื่นความเครียดเข้ามาเป็นช่วง ๆ การพักที่ตั้งใจจะช่วยให้ใจกลับมานิ่งได้",
      en: "Waves of stress come and go — intentional rest will return you to stillness.",
    };
  return {
    th: "ใจของคุณกำลังเจอพายุ ถึงเวลาขึ้นฝั่งมาพักอย่างจริงจัง",
    en: "Your mind is weathering a storm — it is time to come ashore and truly rest.",
  };
}

function summaryMigraine(v: number): LText {
  const b = bandFor(v);
  if (b === "low")
    return {
      th: "ร่างกายของคุณส่งสัญญาณตึงเครียดน้อย แนวโน้มไมเกรนอยู่ในเกณฑ์ดี",
      en: "Your body sends few tension signals — your migraine tendency is reassuringly low.",
    };
  if (b === "moderate")
    return {
      th: "มีสัญญาณตึงและความไวต่อสิ่งเร้าอยู่บ้าง ดูแลแสง เสียง และการนอนจะช่วยได้มาก",
      en: "Some tension and sensitivity are present — minding light, sound and sleep will help.",
    };
  return {
    th: "ร่างกายส่งสัญญาณไมเกรนชัดเจน การบำบัดคลายตึงและลดสิ่งกระตุ้นจะช่วยคุณได้",
    en: "Your body shows clear migraine signals — tension-release therapy and fewer triggers will ease you.",
  };
}

function summaryMental(v: number): LText {
  // high = flourishing
  const b = bandFor(v);
  if (b === "high")
    return {
      th: "จิตใจของคุณเบิกบานและมีพลัง เป็นช่วงเวลาที่งดงามในการเติมเต็มตัวเองให้ลึกขึ้น",
      en: "Your mind is bright and energised — a beautiful season to deepen what already nourishes you.",
    };
  if (b === "moderate")
    return {
      th: "จิตใจของคุณยังทรงตัวได้ดี แต่เริ่มเรียกหาการเติมพลังและความสุขเล็ก ๆ",
      en: "Your mind holds steady, yet quietly asks for more energy and small daily joys.",
    };
  return {
    th: "พลังใจของคุณกำลังต้องการการดูแลอย่างอ่อนโยน ค่อย ๆ เติมกลับทีละน้อย",
    en: "Your spirit needs gentle care right now — let us refill it, little by little.",
  };
}

/* ---------------- route ---------------- */

export async function POST(request: Request) {
  let input: AssessmentInput;
  try {
    input = (await request.json()) as AssessmentInput;
  } catch {
    return NextResponse.json({ error: "invalid_body" }, { status: 400 });
  }

  // PDPA gate.
  if (input?.consent !== true) {
    return NextResponse.json({ error: "consent_required" }, { status: 400 });
  }
  if (!Array.isArray(input.answers)) {
    return NextResponse.json({ error: "invalid_answers" }, { status: 400 });
  }
  if (input.locale !== "th" && input.locale !== "en") {
    input.locale = "th";
  }

  // Always compute the deterministic baseline; it powers fallback values.
  const fb = fallbackProfile(input);
  const usesUnifiedCompass = Boolean(fb.baselineCheckin);

  let result: LlmResult | null = null;
  if (hasGeminiKey()) {
    try {
      result = await generateJson<LlmResult>({
        system: buildSystemPrompt(),
        user: buildUserPrompt(input),
        temperature: 0.5,
        timeoutMs: 12000,
      });
    } catch {
      result = null; // graceful degrade
    }
  }

  // Compose scores. In the unified compass path, numbers are fixed by code;
  // the model may only improve the bilingual wording.
  const stress = usesUnifiedCompass
    ? buildFixedScore(result?.stress, fb.stress, summaryStress(fb.stress))
    : buildScore(result?.stress, fb.stress, summaryStress(fb.stress));
  const migraine = usesUnifiedCompass
    ? buildFixedScore(result?.migraine, fb.migraine, summaryMigraine(fb.migraine))
    : buildScore(result?.migraine, fb.migraine, summaryMigraine(fb.migraine));
  const mental = usesUnifiedCompass
    ? buildFixedScore(result?.mental, fb.mental, summaryMental(fb.mental))
    : buildScore(result?.mental, fb.mental, summaryMental(fb.mental));

  // Traits.
  let traits: LText[] = fb.traits;
  if (Array.isArray(result?.traits)) {
    const cleaned = result.traits
      .map((t) =>
        t && typeof t.th === "string" && typeof t.en === "string"
          ? { th: t.th.trim(), en: t.en.trim() }
          : null,
      )
      .filter((t): t is LText => !!t && !!t.th && !!t.en);
    if (cleaned.length >= 3) traits = cleaned.slice(0, 5);
  }

  // Archetype code.
  let archetypeCode = fb.archetypeCode;
  if (
    typeof result?.archetypeCode === "string" &&
    ARCHETYPE_CODES.includes(result.archetypeCode.toUpperCase().trim())
  ) {
    archetypeCode = result.archetypeCode.toUpperCase().trim();
  }

  // Recommended goals.
  let recommendedGoals: GoalId[] = fb.recommendedGoals;
  if (Array.isArray(result?.recommendedGoals)) {
    const valid = result.recommendedGoals
      .map((g) => (typeof g === "string" ? g.trim() : ""))
      .filter((g): g is GoalId => (ALL_GOALS as string[]).includes(g));
    const unique = [...new Set(valid)];
    if (unique.length >= 2) recommendedGoals = unique.slice(0, 3);
  }

  const profile: WellnessProfile = {
    id: newAssessmentId(),
    stress,
    migraine,
    mental,
    traits,
    archetype: getArchetype(archetypeCode),
    gender:
      input.gender === "female" || input.gender === "male"
        ? input.gender
        : undefined,
    recommendedGoals,
    baselineCheckin: fb.baselineCheckin,
    createdAt: new Date().toISOString(),
  };

  try {
    await saveAssessment(profile, input);
  } catch {
    // Persistence is best-effort for the demo; never fail the response.
  }

  return NextResponse.json({ profile });
}
