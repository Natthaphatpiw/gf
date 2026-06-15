import type {
  CheckinAnalysis,
  CheckinAnswers,
  CheckinDials,
  CheckinObjective,
  CheckinRedFlag,
  CheckinRedFlagType,
  CheckinSentiment,
  CheckinT2Extras,
  CheckinTimepoint,
  DialDelta,
  DialKey,
  LText,
} from "@/lib/types";
import {
  CHECKIN_QUESTIONS,
  DELTA_DEADBAND,
  DIAL_DIRECTION,
  DIAL_KEYS,
  DIAL_NAMES,
  checkinBandFor,
  dialGoodness,
  getCheckinQuestion,
  sleepHoursScore,
} from "@/data/checkin";
import { PACKAGES, getPackage } from "@/data/packages";

/* ============================================================
 * Check-in core — every number is computed here, in code.
 *
 * The LLM's job is to READ AND INTERPRET (Q8, red flags,
 * summaries); it never produces or edits a dial score. All LLM
 * output passes through the validators below before storage,
 * and the rule-based path keeps the whole flow working with an
 * empty .env (demo mode).
 * ============================================================ */

/* ---------------- answer validation ---------------- */

function optionValue(questionId: string, key: string): number | null {
  const q = getCheckinQuestion(questionId);
  const opt = q?.options?.find((o) => o.key === key);
  return opt ? opt.value : null;
}

function clamp(n: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, n));
}

function asFiniteNumber(v: unknown): number | null {
  const n = typeof v === "number" ? v : Number(v);
  return Number.isFinite(n) ? n : null;
}

/** Parse + sanitise the submitted answers; null when malformed. */
export function validateCheckinAnswers(raw: unknown): CheckinAnswers | null {
  if (!raw || typeof raw !== "object") return null;
  const r = raw as Record<string, unknown>;

  const closed: Partial<Record<"q1" | "q2" | "q3" | "q4" | "q5" | "q6", string>> = {};
  for (const id of ["q1", "q2", "q3", "q4", "q5", "q6"] as const) {
    const key = typeof r[id] === "string" ? (r[id] as string) : "";
    if (optionValue(id, key) === null) return null;
    closed[id] = key;
  }

  const q7 = asFiniteNumber(r.q7);
  if (q7 === null) return null;

  const hours = asFiniteNumber(r.q5Hours);
  const q8 = typeof r.q8 === "string" ? r.q8.trim().slice(0, 2000) : "";

  return {
    q1: closed.q1!,
    q2: closed.q2!,
    q3: closed.q3!,
    q4: closed.q4!,
    q5: closed.q5!,
    q6: closed.q6!,
    q5Hours: hours === null ? undefined : clamp(Math.round(hours * 2) / 2, 0, 24),
    q7: clamp(Math.round(q7), 0, 100),
    q8: q8 || undefined,
  };
}

/** Sanitise staff-measured vitals; drops out-of-range values. */
export function validateObjective(raw: unknown): CheckinObjective | undefined {
  if (!raw || typeof raw !== "object") return undefined;
  const r = raw as Record<string, unknown>;
  const inRange = (v: unknown, min: number, max: number): number | undefined => {
    const n = asFiniteNumber(v);
    return n !== null && n >= min && n <= max ? Math.round(n * 10) / 10 : undefined;
  };
  const objective: CheckinObjective = {
    bpSystolic: inRange(r.bpSystolic, 60, 260),
    bpDiastolic: inRange(r.bpDiastolic, 30, 200),
    restingHr: inRange(r.restingHr, 25, 220),
    weightKg: inRange(r.weightKg, 20, 250),
    deviceSleepHours: inRange(r.deviceSleepHours, 0, 24),
  };
  const hasAny = Object.values(objective).some((v) => v !== undefined);
  return hasAny ? objective : undefined;
}

/* ---------------- dial computation (the fixed table) ---------------- */

/**
 * | Dial     | Formula                          | Better |
 * | stress   | (Q1 + Q2) / 2                    | lower  |
 * | migraine | (Q3 + Q4) / 2                    | lower  |
 * | sleep    | 0.7*Q5 + 0.3*hoursBand (else Q5) | higher |
 * | mind     | Q6                               | higher |
 * | energy   | Q7                               | higher |
 */
export function computeDials(answers: CheckinAnswers): CheckinDials {
  const v = (id: string, key: string) => optionValue(id, key) ?? 50;

  const stress = (v("q1", answers.q1) + v("q2", answers.q2)) / 2;
  const migraine = (v("q3", answers.q3) + v("q4", answers.q4)) / 2;
  const q5 = v("q5", answers.q5);
  const sleep =
    answers.q5Hours !== undefined
      ? 0.7 * q5 + 0.3 * sleepHoursScore(answers.q5Hours)
      : q5;
  const mind = v("q6", answers.q6);
  const energy = answers.q7;

  const score = (value: number) => {
    const rounded = clamp(Math.round(value), 0, 100);
    return { value: rounded, band: checkinBandFor(rounded) };
  };

  return {
    stress: score(stress),
    migraine: score(migraine),
    sleep: score(sleep),
    mind: score(mind),
    energy: score(energy),
  };
}

/** T2 deltas vs T1, with the ±5 deadband and direction-aware trend. */
export function computeDeltas(t1: CheckinDials, t2: CheckinDials): DialDelta[] {
  return DIAL_KEYS.map((dial) => {
    const before = t1[dial].value;
    const after = t2[dial].value;
    const delta = after - before;
    let trend: DialDelta["trend"] = "steady";
    if (Math.abs(delta) > DELTA_DEADBAND) {
      const improvedDirection =
        DIAL_DIRECTION[dial] === "lowerIsBetter" ? delta < 0 : delta > 0;
      trend = improvedDirection ? "improved" : "declined";
    }
    return { dial, before, after, delta, trend };
  });
}

/* ---------------- shared context for analysis ---------------- */

export interface CheckinContext {
  timepoint: CheckinTimepoint;
  dials: CheckinDials;
  deltas?: DialDelta[];
  archetypeName?: LText;
  q8?: string;
  objective?: CheckinObjective;
  packageId?: string;
}

/** Code-enforced safety floor — the LLM can only add to these. */
export function ruleExpertReviewRequired(ctx: CheckinContext): boolean {
  if (ctx.dials.migraine.value >= 70) return true;
  const { bpSystolic, bpDiastolic } = ctx.objective ?? {};
  if ((bpSystolic ?? 0) >= 160 || (bpDiastolic ?? 0) >= 100) return true;
  return false;
}

/* ---------------- rule-based red flag scan (fallback) ---------------- */

interface FlagPattern {
  type: CheckinRedFlagType;
  severity: "review" | "urgent";
  detail: string; // Thai — staff-facing
  keywords: string[];
}

const FLAG_PATTERNS: FlagPattern[] = [
  {
    type: "mood_risk",
    severity: "urgent",
    detail: "ข้อความสื่อถึงความเสี่ยงต่อการทำร้ายตัวเอง — ส่งต่อทีมงานมนุษย์ทันที",
    keywords: [
      "ทำร้ายตัวเอง",
      "อยากตาย",
      "ไม่อยากมีชีวิต",
      "ไม่อยากอยู่แล้ว",
      "ฆ่าตัวตาย",
      "จบชีวิต",
      "suicid",
      "self-harm",
      "self harm",
      "hurt myself",
      "kill myself",
      "end my life",
      "don't want to live",
    ],
  },
  {
    type: "severe_symptom",
    severity: "urgent",
    detail: "อาการเข้าข่ายฉุกเฉิน ควรพบแพทย์ทันที",
    keywords: [
      "ปวดหัวรุนแรงที่สุด",
      "ปวดหัวที่สุดในชีวิต",
      "ปวดหัวเฉียบพลัน",
      "แขนขาอ่อนแรง",
      "ชาครึ่งซีก",
      "หน้าเบี้ยว",
      "พูดไม่ชัด",
      "ตามัว",
      "เจ็บหน้าอก",
      "แน่นหน้าอก",
      "worst headache",
      "thunderclap",
      "chest pain",
      "chest tightness",
      "slurred speech",
      "arm weakness",
      "leg weakness",
      "face drooping",
      "vision loss",
      "blurred vision",
    ],
  },
  {
    type: "medication",
    severity: "review",
    detail: "ทานยาที่อาจกระทบการนวดหรือสมุนไพร",
    keywords: [
      "ยาละลายลิ่มเลือด",
      "วาร์ฟาริน",
      "warfarin",
      "blood thinner",
      "anticoagulant",
      "aspirin",
      "แอสไพริน",
      "ยาความดัน",
      "insulin",
      "อินซูลิน",
    ],
  },
  {
    type: "condition",
    severity: "review",
    detail: "มีโรคประจำตัวที่ควรให้ผู้เชี่ยวชาญรีวิวก่อน",
    keywords: [
      "ความดันสูง",
      "ความดันโลหิตสูง",
      "hypertension",
      "high blood pressure",
      "เบาหวาน",
      "diabetes",
      "โรคหัวใจ",
      "heart disease",
      "heart condition",
      "ลมชัก",
      "epilep",
      "หมอนรองกระดูก",
      "กระดูกทับเส้น",
    ],
  },
  {
    type: "pregnancy",
    severity: "review",
    detail: "ตั้งครรภ์หรือให้นมบุตร — ปรับโปรแกรมก่อนเริ่ม",
    keywords: [
      "ตั้งครรภ์",
      "มีครรภ์",
      "ท้องอ่อน",
      "ให้นมบุตร",
      "ให้นมลูก",
      "pregnan",
      "breastfeed",
      "nursing a baby",
    ],
  },
  {
    type: "recent_surgery",
    severity: "review",
    detail: "เพิ่งผ่านการผ่าตัด — เลี่ยงการนวดหนักจนกว่าจะรีวิว",
    keywords: ["ผ่าตัด", "ผ่าคลอด", "surgery", "operation", "post-op", "c-section"],
  },
];

/** Pull the line containing the keyword as the supporting quote. */
function quoteAround(text: string, keyword: string): string {
  const lower = text.toLowerCase();
  const idx = lower.indexOf(keyword.toLowerCase());
  if (idx < 0) return text.slice(0, 140);
  const lineStart = Math.max(text.lastIndexOf("\n", idx) + 1, 0);
  const lineEndRaw = text.indexOf("\n", idx);
  const lineEnd = lineEndRaw < 0 ? text.length : lineEndRaw;
  return text.slice(lineStart, lineEnd).trim().slice(0, 140);
}

export function scanRedFlags(q8: string | undefined): CheckinRedFlag[] {
  const text = (q8 ?? "").trim();
  if (!text) return [];
  const lower = text.toLowerCase();
  const flags: CheckinRedFlag[] = [];
  for (const pattern of FLAG_PATTERNS) {
    const hit = pattern.keywords.find((k) => lower.includes(k.toLowerCase()));
    if (!hit) continue;
    flags.push({
      type: pattern.type,
      severity: pattern.severity,
      detail: pattern.detail,
      quote: quoteAround(text, hit),
    });
  }
  return flags;
}

/* ---------------- rule-based open-text heuristics ---------------- */

const PREFERENCE_HINTS = [
  "ไม่ชอบ",
  "ไม่อยากให้",
  "ไม่ถนัด",
  "แพ้",
  "เลี่ยง",
  "ขอไม่",
  "avoid",
  "don't like",
  "dont like",
  "dislike",
  "allerg",
  "please no",
  "prefer not",
];

const GOAL_HINTS = [
  "อยาก",
  "หวังว่า",
  "เป้าหมาย",
  "ตั้งใจ",
  "want to",
  "hope",
  "goal",
  "wish",
  "would love",
];

function extractLines(text: string, hints: string[]): string[] {
  const lines = text
    .split(/\n|(?<=[.!?])\s+/)
    .map((l) => l.trim())
    .filter(Boolean);
  const out: string[] = [];
  for (const line of lines) {
    const lower = line.toLowerCase();
    if (hints.some((h) => lower.includes(h))) out.push(line.slice(0, 140));
    if (out.length >= 3) break;
  }
  return out;
}

const POSITIVE_HINTS = [
  "ชอบ",
  "ดีมาก",
  "ประทับใจ",
  "สุดยอด",
  "ผ่อนคลาย",
  "มีความสุข",
  "love",
  "great",
  "amazing",
  "wonderful",
  "relax",
  "happy",
];
const NEGATIVE_HINTS = [
  "แย่",
  "ผิดหวัง",
  "ไม่โอเค",
  "เสียดาย",
  "ช้า",
  "disappoint",
  "bad",
  "terrible",
  "worse",
  "not okay",
];

function detectSentiment(text: string): CheckinSentiment {
  let lower = text.toLowerCase();
  // Strip negated likes so "ไม่ชอบ" / "don't like" never reads as positive.
  for (const negated of ["ไม่ชอบ", "ไม่ค่อยชอบ", "don't like", "dont like", "do not like"]) {
    lower = lower.split(negated).join(" ");
  }
  const pos = POSITIVE_HINTS.some((h) => lower.includes(h));
  const neg = NEGATIVE_HINTS.some((h) => lower.includes(h));
  if (pos && neg) return "mixed";
  if (pos) return "positive";
  if (neg) return "negative";
  return "neutral";
}

function detectLanguage(text: string): string {
  if (!text) return "th";
  return /[฀-๿]/.test(text) ? "th" : "en";
}

/* ---------------- rule-based summaries ---------------- */

/** Distance from the dial's ideal pole — used to rank "notable" dials. */
function distanceFromIdeal(dial: DialKey, value: number): number {
  return DIAL_DIRECTION[dial] === "lowerIsBetter" ? value : 100 - value;
}

const GOODNESS_PHRASES: Record<"good" | "mid" | "needs-care", LText> = {
  good: { th: "อยู่ในเกณฑ์ที่ดีน่าชื่นใจ", en: "is in a genuinely healthy place" },
  mid: {
    th: "ทรงตัวพอไปได้ แต่ยังเติมให้เต็มกว่านี้ได้อีก",
    en: "is holding steady, with room to refill",
  },
  "needs-care": {
    th: "กำลังส่งสัญญาณขอการดูแลเป็นพิเศษ",
    en: "is quietly asking for extra care",
  },
};

function customerSummaryRules(ctx: CheckinContext): LText {
  const ranked = [...DIAL_KEYS].sort(
    (a, b) =>
      distanceFromIdeal(b, ctx.dials[b].value) -
      distanceFromIdeal(a, ctx.dials[a].value),
  );
  const [a, b] = ranked;
  const pa = GOODNESS_PHRASES[dialGoodness(a, ctx.dials[a].value)];
  const pb = GOODNESS_PHRASES[dialGoodness(b, ctx.dials[b].value)];
  const who = ctx.archetypeName;

  if (ctx.timepoint === "T1") {
    return {
      th: `ขอบคุณที่เล่าให้เราฟัง ตอนนี้${DIAL_NAMES[a].th}ของคุณ${pa.th} ส่วน${DIAL_NAMES[b].th}${pb.th} ทีมที่ดูแลจะใช้เข็มทิศนี้ปรับทุกจังหวะของโปรแกรมให้พอดีกับ${who ? who.th : "คุณ"}`,
      en: `Thank you for sharing. Right now your ${DIAL_NAMES[a].en.toLowerCase()} ${pa.en}, while your ${DIAL_NAMES[b].en.toLowerCase()} ${pb.en}. Your care team will use this compass to tune every step of the program${who ? ` for ${who.en}` : " for you"}.`,
    };
  }
  if (ctx.timepoint === "T3") {
    return {
      th: `ผ่านมา 30 วันแล้ว ${DIAL_NAMES[a].th}ของคุณ${pa.th} และ${DIAL_NAMES[b].th}${pb.th} การดูแลตัวเองต่อที่บ้านกำลังได้ผล รักษาจังหวะนี้ไว้นะ`,
      en: `Thirty days on, your ${DIAL_NAMES[a].en.toLowerCase()} ${pa.en} and your ${DIAL_NAMES[b].en.toLowerCase()} ${pb.en}. Your self-care at home is paying off — keep this rhythm going.`,
    };
  }
  return {
    th: `จบโปรแกรมแล้ว ${DIAL_NAMES[a].th}ของคุณ${pa.th} และ${DIAL_NAMES[b].th}${pb.th} ขอให้พาความรู้สึกนี้กลับไปดูแลตัวเองต่อที่บ้านนะ`,
    en: `As the program closes, your ${DIAL_NAMES[a].en.toLowerCase()} ${pa.en} and your ${DIAL_NAMES[b].en.toLowerCase()} ${pb.en}. Carry this feeling home with you.`,
  };
}

function staffSummaryRules(
  ctx: CheckinContext,
  flags: CheckinRedFlag[],
  preferences: string[],
  goals: string[],
): string[] {
  const d = ctx.dials;
  const bullets: string[] = [
    `คะแนน — ความเครียด ${d.stress.value} · ไมเกรน ${d.migraine.value} · การนอน ${d.sleep.value} · จิตใจ ${d.mind.value} · พลังงาน ${d.energy.value}`,
  ];
  if (d.migraine.value >= 70) {
    bullets.push("แนวโน้มไมเกรนระดับสูง — รอผู้เชี่ยวชาญรีวิวก่อนเริ่มทรีตเมนต์หนัก");
  }
  const o = ctx.objective;
  if (o && (o.bpSystolic !== undefined || o.restingHr !== undefined)) {
    const bp =
      o.bpSystolic !== undefined && o.bpDiastolic !== undefined
        ? `ความดัน ${o.bpSystolic}/${o.bpDiastolic}`
        : "";
    const hr = o.restingHr !== undefined ? `ชีพจรพัก ${o.restingHr}` : "";
    bullets.push(["ค่าที่วัดหน้าร้าน:", bp, hr].filter(Boolean).join(" "));
    if ((o.bpSystolic ?? 0) >= 160 || (o.bpDiastolic ?? 0) >= 100) {
      bullets.push("ความดันถึงเกณฑ์ส่งต่อ (>=160/100) — ให้ผู้เชี่ยวชาญรีวิวก่อนเริ่ม");
    }
  }
  for (const f of flags) {
    bullets.push(`เฝ้าระวัง (${f.severity === "urgent" ? "ด่วน" : "รีวิว"}): ${f.detail} — “${f.quote}”`);
  }
  for (const p of preferences) bullets.push(`ลูกค้าขอเลี่ยง: ${p}`);
  for (const g of goals) bullets.push(`สิ่งที่ลูกค้าอยากได้: ${g}`);
  if (bullets.length === 1) bullets.push("ไม่มีข้อควรระวังพิเศษจากคำตอบรอบนี้");
  return bullets;
}

const URGENT_MESSAGE_FALLBACK: LText = {
  th: "จากข้อมูลที่คุณเล่ามา มีอาการที่ควรได้รับการตรวจจากแพทย์โดยเร็วที่สุด กรุณาพบแพทย์หรือโรงพยาบาลใกล้คุณก่อนเริ่มกิจกรรมใด ๆ ทีมงานของเรากำลังติดต่อกลับเพื่อช่วยประสานงานและเลื่อนโปรแกรมให้โดยไม่มีค่าใช้จ่าย",
  en: "From what you shared, some symptoms deserve a doctor's attention as soon as possible. Please see a doctor or the nearest hospital before starting any activity — our team is reaching out to help coordinate and will reschedule your program at no cost.",
};

/* ---------------- rule-based T2 extras ---------------- */

// Maps the weakest dial to the best-fit program in the live catalog.
const DIAL_NEXT_PACKAGE: Record<DialKey, string> = {
  stress: "calm-mind",
  migraine: "clear-head",
  sleep: "deep-sleep-sanctuary",
  mind: "calm-mind",
  energy: "samui-recharge",
};

function improvementMagnitude(d: DialDelta): number {
  if (d.trend !== "improved") return 0;
  return Math.abs(d.delta);
}

function deltaPhrase(d: DialDelta): { th: string; en: string } {
  const n = Math.abs(d.delta);
  const name = DIAL_NAMES[d.dial];
  if (DIAL_DIRECTION[d.dial] === "lowerIsBetter") {
    return {
      th: `${name.th}ของคุณลดลง ${n} จุด`,
      en: `your ${name.en.toLowerCase()} eased by ${n} points`,
    };
  }
  return {
    th: `${name.th}ของคุณเพิ่มขึ้น ${n} จุด`,
    en: `your ${name.en.toLowerCase()} rose by ${n} points`,
  };
}

function t2ExtrasRules(ctx: CheckinContext, urgent: boolean): CheckinT2Extras {
  const isT3 = ctx.timepoint === "T3";
  const deltas = ctx.deltas ?? [];
  const improved = deltas
    .filter((d) => d.trend === "improved")
    .sort((a, b) => improvementMagnitude(b) - improvementMagnitude(a));

  let highlightDial: DialKey;
  let changeNarrative: LText;

  if (improved.length > 0) {
    highlightDial = improved[0].dial;
    const main = deltaPhrase(improved[0]);
    const second = improved[1] ? deltaPhrase(improved[1]) : null;
    changeNarrative = isT3
      ? {
          th: `ผ่านมา 30 วันแล้วผลลัพธ์ยังอยู่กับคุณ — ${main.th}${second ? ` และ${second.th}` : ""} เมื่อเทียบกับก่อนเริ่มโปรแกรม นี่คือสัญญาณว่าการดูแลตัวเองต่อที่บ้านได้ผลจริง`,
          en: `Thirty days on, the change has stayed with you — ${main.en}${second ? `, and ${second.en}` : ""} compared with before the program. That is real proof your self-care at home is working.`,
        }
      : {
          th: `ช่วงเวลาบนเกาะทำงานของมันแล้ว — ${main.th}${second ? ` และ${second.th}` : ""} ส่วนค่าอื่น ๆ ทรงตัวอยู่ในทิศทางที่ดี ให้ร่างกายค่อย ๆ เก็บผลลัพธ์นี้ต่อที่บ้าน`,
          en: `Your time on the island has done its quiet work — ${main.en}${second ? `, and ${second.en}` : ""}, while the rest held steady in a good direction. Let your body keep collecting these gains at home.`,
        };
  } else {
    // Nothing moved past the deadband — honest "steady" story.
    const ranked = [...DIAL_KEYS].sort(
      (a, b) =>
        distanceFromIdeal(a, ctx.dials[a].value) -
        distanceFromIdeal(b, ctx.dials[b].value),
    );
    highlightDial = ranked[0];
    changeNarrative = isT3
      ? {
          th: "ค่าของคุณยังใกล้เคียงกับตอนเริ่มต้น — การรักษาระดับไว้ได้ตลอด 30 วันก็ถือเป็นชัยชนะ ลองทำตามแผนดูแลตัวเองต่ออีกสักระยะ แล้วสังเกตการนอนกับพลังงานของตัวเอง",
          en: "Your readings are close to where you started — and holding the line for a full 30 days is itself a win. Keep following your self-care plan a little longer and watch your sleep and energy.",
        }
      : {
          th: "ค่าส่วนใหญ่ของคุณทรงตัวจากก่อนเริ่มโปรแกรม ซึ่งเป็นเรื่องปกติ — การฟื้นฟูที่แท้จริงมักค่อย ๆ ปรากฏในสัปดาห์ถัดไป ลองสังเกตการนอนและพลังงานของตัวเองต่ออีกสักระยะ",
          en: "Most of your readings held steady from before the program — and that is normal. Real restoration often surfaces over the following weeks; keep noticing your sleep and energy a little longer.",
        };
  }

  let nextRecommendation: CheckinT2Extras["nextRecommendation"] = null;
  if (!urgent) {
    const worst = [...DIAL_KEYS].sort(
      (a, b) =>
        distanceFromIdeal(b, ctx.dials[b].value) -
        distanceFromIdeal(a, ctx.dials[a].value),
    )[0];
    const packageId = DIAL_NEXT_PACKAGE[worst];
    if (getPackage(packageId)) {
      nextRecommendation = {
        packageId,
        reason: {
          th: `เลือกให้เพื่อดูแล${DIAL_NAMES[worst].th}ของคุณต่อเนื่องหลังจบโปรแกรมนี้`,
          en: `Chosen to keep caring for your ${DIAL_NAMES[worst].en.toLowerCase()} after this program ends.`,
        },
      };
    }
  }

  return { changeNarrative, highlightDial, nextRecommendation };
}

/* ---------------- the full rule-based analysis ---------------- */

export function ruleBasedAnalysis(ctx: CheckinContext): {
  analysis: CheckinAnalysis;
  t2?: CheckinT2Extras;
  t3?: CheckinT2Extras;
} {
  const text = (ctx.q8 ?? "").trim();
  const redFlags = scanRedFlags(text);
  const urgent = redFlags.some((f) => f.severity === "urgent");
  const preferences = text ? extractLines(text, PREFERENCE_HINTS) : [];
  const goals = text ? extractLines(text, GOAL_HINTS) : [];
  const sentiment = text ? detectSentiment(text) : "neutral";
  const expertReviewRequired =
    urgent || redFlags.length > 0 || ruleExpertReviewRequired(ctx);

  const analysis: CheckinAnalysis = {
    languageDetected: detectLanguage(text),
    redFlags,
    preferences,
    goals,
    sentiment,
    testimonialCandidate:
      ctx.timepoint !== "T1" && sentiment === "positive" && text.length >= 40,
    expertReviewRequired,
    urgent,
    urgentMessage: urgent ? URGENT_MESSAGE_FALLBACK : null,
    summaryForCustomer: customerSummaryRules(ctx),
    summaryForStaff: staffSummaryRules(ctx, redFlags, preferences, goals),
    source: "rules",
  };

  const extras = ctx.timepoint !== "T1" ? t2ExtrasRules(ctx, urgent) : undefined;
  return {
    analysis,
    t2: ctx.timepoint === "T2" ? extras : undefined,
    t3: ctx.timepoint === "T3" ? extras : undefined,
  };
}

/* ---------------- LLM output validation & merge ---------------- */

/** Loose shape of what the model may return — everything optional. */
export interface LlmCheckinResult {
  open_text_analysis?: {
    language_detected?: unknown;
    red_flags?: unknown;
    preferences?: unknown;
    goals?: unknown;
    sentiment?: unknown;
    testimonial_candidate?: unknown;
  };
  expert_review_required?: unknown;
  urgent?: unknown;
  urgent_message?: unknown;
  summary_for_customer?: unknown;
  summary_for_staff?: unknown;
  t2_extras?: {
    change_narrative?: unknown;
    highlight_dial?: unknown;
    next_recommendation?: unknown;
  };
}

const RED_FLAG_TYPES: CheckinRedFlagType[] = [
  "medication",
  "condition",
  "pregnancy",
  "recent_surgery",
  "severe_symptom",
  "mood_risk",
];

const SENTIMENTS: CheckinSentiment[] = ["neutral", "positive", "negative", "mixed"];

function asLText(raw: unknown, fallback: LText): LText {
  if (raw && typeof raw === "object") {
    const obj = raw as Record<string, unknown>;
    const th = typeof obj.th === "string" ? obj.th.trim() : "";
    const en = typeof obj.en === "string" ? obj.en.trim() : "";
    if (th && en) return { th: th.slice(0, 600), en: en.slice(0, 600) };
  }
  return fallback;
}

function asStringArray(raw: unknown, cap: number): string[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .filter((s): s is string => typeof s === "string" && s.trim().length > 0)
    .map((s) => s.trim().slice(0, 200))
    .slice(0, cap);
}

function validateRedFlags(raw: unknown): CheckinRedFlag[] {
  if (!Array.isArray(raw)) return [];
  const out: CheckinRedFlag[] = [];
  for (const item of raw) {
    if (!item || typeof item !== "object") continue;
    const f = item as Record<string, unknown>;
    const type = typeof f.type === "string" ? f.type.trim() : "";
    if (!(RED_FLAG_TYPES as string[]).includes(type)) continue;
    const severity = f.severity === "urgent" ? "urgent" : "review";
    const detail = typeof f.detail === "string" ? f.detail.trim().slice(0, 300) : "";
    const quote = typeof f.quote === "string" ? f.quote.trim().slice(0, 300) : "";
    if (!detail) continue;
    out.push({ type: type as CheckinRedFlagType, severity, detail, quote });
    if (out.length >= 8) break;
  }
  return out;
}

/**
 * Merge the LLM's interpretation over the rule-based baseline.
 * Safety rules are a floor the model can raise but never lower:
 * urgent/expert flags are OR-ed, urgent kills the recommendation,
 * and the next pick must exist in the real catalog.
 */
export function mergeLlmAnalysis(
  raw: LlmCheckinResult,
  rules: { analysis: CheckinAnalysis; t2?: CheckinT2Extras; t3?: CheckinT2Extras },
  ctx: CheckinContext,
): { analysis: CheckinAnalysis; t2?: CheckinT2Extras; t3?: CheckinT2Extras } {
  const open = raw.open_text_analysis ?? {};
  const base = rules.analysis;

  const llmFlags = validateRedFlags(open.red_flags);
  // Keep every rule-detected safety flag if the model missed it.
  const missingRuleFlags = base.redFlags.filter(
    (f) =>
      !llmFlags.some(
        (lf) => lf.type === f.type && (lf.quote === f.quote || lf.detail === f.detail),
      ),
  );
  const redFlags = [...llmFlags, ...missingRuleFlags].slice(0, 8);

  const sentimentRaw =
    typeof open.sentiment === "string" ? open.sentiment.trim() : "";
  const sentiment = (SENTIMENTS as string[]).includes(sentimentRaw)
    ? (sentimentRaw as CheckinSentiment)
    : base.sentiment;

  const langRaw =
    typeof open.language_detected === "string"
      ? open.language_detected.trim().toLowerCase().slice(0, 8)
      : "";

  const urgent =
    raw.urgent === true ||
    base.urgent ||
    redFlags.some((f) => f.severity === "urgent");

  const expertReviewRequired =
    raw.expert_review_required === true ||
    base.expertReviewRequired ||
    urgent ||
    redFlags.length > 0 ||
    ruleExpertReviewRequired(ctx);

  const staff = asStringArray(raw.summary_for_staff, 10);

  const analysis: CheckinAnalysis = {
    languageDetected: langRaw || base.languageDetected,
    redFlags,
    preferences: asStringArray(open.preferences, 6),
    goals: asStringArray(open.goals, 6),
    sentiment,
    testimonialCandidate:
      ctx.timepoint !== "T1" && open.testimonial_candidate === true,
    expertReviewRequired,
    urgent,
    urgentMessage: urgent
      ? asLText(raw.urgent_message, URGENT_MESSAGE_FALLBACK)
      : null,
    summaryForCustomer: asLText(raw.summary_for_customer, base.summaryForCustomer),
    summaryForStaff: staff.length > 0 ? staff : base.summaryForStaff,
    source: "llm",
  };

  let extras: CheckinT2Extras | undefined;
  if (ctx.timepoint !== "T1") {
    const ruleExtras = rules.t2 ?? rules.t3 ?? t2ExtrasRules(ctx, urgent);
    const ex = raw.t2_extras ?? {};

    const highlightRaw =
      typeof ex.highlight_dial === "string" ? ex.highlight_dial.trim() : "";
    const highlightDial = (DIAL_KEYS as string[]).includes(highlightRaw)
      ? (highlightRaw as DialKey)
      : ruleExtras.highlightDial;

    let nextRecommendation = urgent ? null : ruleExtras.nextRecommendation;
    if (!urgent && ex.next_recommendation && typeof ex.next_recommendation === "object") {
      const rec = ex.next_recommendation as Record<string, unknown>;
      const itemId = typeof rec.item_id === "string" ? rec.item_id.trim() : "";
      if (PACKAGES.some((p) => p.id === itemId)) {
        nextRecommendation = {
          packageId: itemId,
          reason: asLText(
            rec.reason_one_liner,
            ruleExtras.nextRecommendation?.reason ?? {
              th: "ก้าวต่อไปที่เหมาะกับผลเช็คอินของคุณ",
              en: "A next step matched to your check-in results.",
            },
          ),
        };
      }
    }

    extras = {
      changeNarrative: asLText(ex.change_narrative, ruleExtras.changeNarrative),
      highlightDial,
      nextRecommendation,
    };
  }

  return {
    analysis,
    t2: ctx.timepoint === "T2" ? extras : undefined,
    t3: ctx.timepoint === "T3" ? extras : undefined,
  };
}
