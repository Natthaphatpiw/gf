import type { DialKey, LText, ScoreBand } from "@/lib/types";

/* ============================================================
 * "เช็คอินเข็มทิศกายใจ" — the T1/T2 measurement instrument.
 *
 * Unlike the T0 Island Journey (marketing, playful, LLM-read),
 * this is a measuring device: every closed option carries a
 * fixed hidden anchor value (0-100) and all five dial scores
 * are computed in code from the table below. The LLM never
 * scores anything here — it only reads the open Q8 answer.
 *
 * Bump CHECKIN_INSTRUMENT_VERSION whenever any wording or
 * anchor changes; deltas are only compared within one version.
 * ============================================================ */

export const CHECKIN_INSTRUMENT_VERSION = "cv1.0";

/** Deadband for before/after deltas: |Δ| <= 5 counts as "steady". */
export const DELTA_DEADBAND = 5;

export type CheckinQuestionKind = "choice" | "slider" | "text";

export interface CheckinOption {
  key: string;
  label: LText;
  /** lucide-react icon name rendered next to the option. */
  icon: string;
  /** Hidden anchored score 0-100 — applied in code, never by the LLM. */
  value: number;
}

export interface CheckinQuestion {
  id: "q1" | "q2" | "q3" | "q4" | "q5" | "q6" | "q7" | "q8";
  kind: CheckinQuestionKind;
  /** Small step label above the question. */
  scene: LText;
  prompt: LText;
  /** T2 wording when the timeframe differs (q3, q8). */
  promptT2?: LText;
  /** T3 (30-day follow-up) wording when it differs (q3, q8). */
  promptT3?: LText;
  hint?: LText;
  hintT2?: LText;
  hintT3?: LText;
  options?: CheckinOption[];
  slider?: {
    min: number;
    max: number;
    step: number;
    minLabel: LText;
    maxLabel: LText;
  };
  /** q5 only: the supplementary "about how many hours" field. */
  askHours?: boolean;
  optional?: boolean;
}

export const CHECKIN_QUESTIONS: CheckinQuestion[] = [
  {
    id: "q1",
    kind: "choice",
    scene: { th: "ข้อ 1 — ทะเลในใจตอนนี้", en: "Step 01 — The sea inside, right now" },
    prompt: {
      th: "ถ้าใจของคุณตอนนี้เป็นทะเล มันเป็นทะเลแบบไหน",
      en: "If your mind right now were the sea, what kind of sea is it?",
    },
    options: [
      {
        key: "calm",
        label: { th: "เรียบนิ่ง มองเห็นพื้นทรายชัด", en: "Still and clear — you can see the sand below" },
        icon: "Waves",
        value: 5,
      },
      {
        key: "ripples",
        label: { th: "มีระลอกเล็ก ๆ พอรู้สึกได้", en: "Small ripples, just noticeable" },
        icon: "Wind",
        value: 35,
      },
      {
        key: "waves",
        label: { th: "คลื่นชัดเจน ต้องคอยทรงตัว", en: "Clear waves — you have to keep your balance" },
        icon: "CloudRain",
        value: 65,
      },
      {
        key: "storm",
        label: { th: "พายุเข้าเต็ม ๆ", en: "A full storm has arrived" },
        icon: "CloudLightning",
        value: 90,
      },
    ],
  },
  {
    id: "q2",
    kind: "choice",
    scene: { th: "ข้อ 2 — มือที่ถือทุกอย่าง", en: "Step 02 — The hands holding it all" },
    prompt: {
      th: "เรื่องที่ต้องคิดต้องจัดการในชีวิตช่วงนี้ ความรู้สึกของคุณใกล้แบบไหนที่สุด",
      en: "With everything life is asking you to handle lately, which feels closest?",
    },
    options: [
      {
        key: "easy",
        label: { th: "เอาอยู่แบบสบาย ๆ", en: "Comfortably on top of it" },
        icon: "Smile",
        value: 10,
      },
      {
        key: "managing",
        label: { th: "เอาอยู่ แต่ต้องออกแรงพอสมควร", en: "Managing, but it takes real effort" },
        icon: "Anchor",
        value: 40,
      },
      {
        key: "slipping",
        label: { th: "เริ่มล้นมือ บางเรื่องหลุดไปบ้าง", en: "Starting to overflow — some things slip" },
        icon: "CloudFog",
        value: 70,
      },
      {
        key: "overflow",
        label: { th: "ล้นจนไม่รู้จะหยิบเรื่องไหนก่อน", en: "So full I cannot tell what to pick up first" },
        icon: "CloudLightning",
        value: 90,
      },
    ],
  },
  {
    id: "q3",
    kind: "choice",
    scene: { th: "ข้อ 3 — แขกที่ชื่อปวดหัว", en: "Step 03 — The visitor called headache" },
    prompt: {
      th: "ช่วง 7 วันที่ผ่านมา อาการปวดหัวแวะมาหาบ่อยแค่ไหน",
      en: "Over the past 7 days, how often did headaches come visiting?",
    },
    promptT2: {
      th: "ตั้งแต่เริ่มโปรแกรม อาการปวดหัวแวะมาหาบ่อยแค่ไหน",
      en: "Since the program began, how often did headaches come visiting?",
    },
    promptT3: {
      th: "ช่วง 30 วันหลังจบโปรแกรม อาการปวดหัวแวะมาหาบ่อยแค่ไหน",
      en: "Over the 30 days since the program, how often did headaches come visiting?",
    },
    options: [
      {
        key: "none",
        label: { th: "ไม่มาเลย", en: "Not once" },
        icon: "Smile",
        value: 5,
      },
      {
        key: "brief",
        label: { th: "แวะมาสั้น ๆ 1–2 ครั้ง แบบพอทนได้", en: "Briefly, once or twice — bearable" },
        icon: "Activity",
        value: 35,
      },
      {
        key: "several",
        label: { th: "มาหลายครั้ง หรือมีครั้งที่หนักจนต้องหยุดพัก", en: "Several times, or once hard enough to stop me" },
        icon: "CloudRain",
        value: 70,
      },
      {
        key: "daily",
        label: { th: "อยู่ด้วยกันแทบทุกวัน", en: "Living with me almost every day" },
        icon: "CloudLightning",
        value: 95,
      },
    ],
  },
  {
    id: "q4",
    kind: "choice",
    scene: { th: "ข้อ 4 — เซนเซอร์วันนี้", en: "Step 04 — Today's sensors" },
    prompt: {
      th: "วันนี้แสงจ้า เสียงดัง หรือกลิ่นแรง ๆ ส่งผลกับคุณแค่ไหน",
      en: "Today, how much do bright light, loud sound or strong scents affect you?",
    },
    options: [
      {
        key: "fine",
        label: { th: "เฉย ๆ ปกติดี", en: "Not at all — perfectly fine" },
        icon: "Smile",
        value: 10,
      },
      {
        key: "slight",
        label: { th: "ไวขึ้นนิดหน่อย", en: "A touch more sensitive than usual" },
        icon: "Eye",
        value: 40,
      },
      {
        key: "clear",
        label: { th: "ไวชัดเจน ต้องคอยเลี่ยงบางอย่าง", en: "Clearly sensitive — I avoid certain things" },
        icon: "EyeOff",
        value: 70,
      },
      {
        key: "severe",
        label: { th: "ไวมากจนรบกวนการใช้ชีวิต", en: "So sensitive it disrupts daily life" },
        icon: "AlertTriangle",
        value: 90,
      },
    ],
  },
  {
    id: "q5",
    kind: "choice",
    scene: { th: "ข้อ 5 — คืนที่ผ่านมา", en: "Step 05 — Last night" },
    prompt: {
      th: "เมื่อคืนการนอนของคุณเป็นแบบไหน",
      en: "How was your sleep last night?",
    },
    askHours: true,
    options: [
      {
        key: "deep",
        label: { th: "หลับลึก ตื่นมาเหมือนแบตชาร์จเต็ม", en: "Deep sleep — woke up fully recharged" },
        icon: "BatteryFull",
        value: 90,
      },
      {
        key: "woke",
        label: { th: "หลับได้ แต่ตื่นกลางดึกบ้าง", en: "Slept, with some night waking" },
        icon: "Moon",
        value: 60,
      },
      {
        key: "broken",
        label: { th: "หลับ ๆ ตื่น ๆ ไม่เต็มอิ่ม", en: "In and out — never quite full" },
        icon: "CloudMoon",
        value: 35,
      },
      {
        key: "barely",
        label: { th: "แทบไม่ได้หลับเลย", en: "Barely slept at all" },
        icon: "EyeOff",
        value: 10,
      },
    ],
  },
  {
    id: "q6",
    kind: "choice",
    scene: { th: "ข้อ 6 — โมเมนต์ดี ๆ", en: "Step 06 — The good moments" },
    prompt: {
      th: "ช่วงนี้โมเมนต์ที่รู้สึกว่า “ดีจังเลย” โผล่มาบ่อยแค่ไหน",
      en: "Lately, how often do little “this is lovely” moments appear?",
    },
    options: [
      {
        key: "daily",
        label: { th: "มีแทบทุกวัน", en: "Almost every day" },
        icon: "Sparkles",
        value: 85,
      },
      {
        key: "sometimes",
        label: { th: "มีเป็นพัก ๆ", en: "In waves, now and then" },
        icon: "Sun",
        value: 60,
      },
      {
        key: "rarely",
        label: { th: "นาน ๆ ครั้ง", en: "Only once in a long while" },
        icon: "CloudFog",
        value: 35,
      },
      {
        key: "none",
        label: { th: "นึกไม่ออกเลยว่าครั้งล่าสุดคือเมื่อไหร่", en: "I cannot recall the last one" },
        icon: "CloudRain",
        value: 10,
      },
    ],
  },
  {
    id: "q7",
    kind: "slider",
    scene: { th: "ข้อ 7 — แบตเตอรี่ร่างกาย", en: "Step 07 — The body battery" },
    prompt: {
      th: "ถ้าร่างกายคุณเป็นแบตเตอรี่ ตอนนี้เหลือกี่เปอร์เซ็นต์",
      en: "If your body were a battery, what percentage is left right now?",
    },
    hint: {
      th: "ลากตามความรู้สึกจริง ไม่ต้องพยายามให้ดูดี",
      en: "Drag by feel — no need to make it look better than it is",
    },
    slider: {
      min: 0,
      max: 100,
      step: 1,
      minLabel: { th: "ใกล้หมด ต้องชาร์จด่วน", en: "Nearly flat — urgent recharge" },
      maxLabel: { th: "เต็มและพร้อมใช้ชีวิต", en: "Full and ready for life" },
    },
  },
  {
    id: "q8",
    kind: "text",
    scene: { th: "ข้อสุดท้าย — บอกทีมที่ดูแลคุณ", en: "Last step — Tell the team caring for you" },
    prompt: {
      th: "ก่อนเริ่ม มีอะไรอยากให้ทีมที่ดูแลรู้ไหม เช่น โรคประจำตัว ยาที่ทานอยู่ อาการที่กังวล หรือสิ่งที่อยากได้กลับไปจากทริปนี้",
      en: "Before we begin, is there anything the team should know — health conditions, medication, worries, or what you hope to take home from this trip?",
    },
    promptT2: {
      th: "จบโปรแกรมแล้วรู้สึกยังไงบ้าง ช่วงไหนชอบที่สุด และมีอะไรที่เราควรทำให้ดีขึ้น",
      en: "Now that the program has ended, how do you feel? Which moment did you love most, and what should we do better?",
    },
    promptT3: {
      th: "ผ่านมา 30 วันแล้ว ผลลัพธ์ยังอยู่กับคุณไหม มีอะไรที่ทำต่อได้ หรืออยากให้เราช่วยดูแลเพิ่ม",
      en: "It has been 30 days — did the benefits stick? What have you kept up, and how can we help you keep going?",
    },
    hint: {
      th: "เขียนภาษาไหนก็ได้ ข้ามได้ถ้าไม่มี",
      en: "Any language is welcome — skip if there is nothing",
    },
    optional: true,
  },
];

export function getCheckinQuestion(id: string): CheckinQuestion | undefined {
  return CHECKIN_QUESTIONS.find((q) => q.id === id);
}

/* ---------------- dial metadata (shared by UI + scoring) ---------------- */

export const DIAL_KEYS: DialKey[] = [
  "stress",
  "migraine",
  "sleep",
  "mind",
  "energy",
];

/** Which way is "better" for each dial. */
export const DIAL_DIRECTION: Record<DialKey, "lowerIsBetter" | "higherIsBetter"> = {
  stress: "lowerIsBetter",
  migraine: "lowerIsBetter",
  sleep: "higherIsBetter",
  mind: "higherIsBetter",
  energy: "higherIsBetter",
};

export const DIAL_NAMES: Record<DialKey, LText> = {
  stress: { th: "ความเครียด", en: "Stress" },
  migraine: { th: "แนวโน้มไมเกรน", en: "Migraine tendency" },
  sleep: { th: "คุณภาพการนอน", en: "Sleep quality" },
  mind: { th: "สมดุลจิตใจ", en: "Mind balance" },
  energy: { th: "พลังงาน", en: "Energy" },
};

/** 0-33 low / 34-66 moderate / 67-100 high — same bands as the rest of the UI. */
export function checkinBandFor(value: number): ScoreBand {
  if (value <= 33) return "low";
  if (value <= 66) return "moderate";
  return "high";
}

/**
 * How "good" a dial value is, regardless of direction —
 * drives display colours so green always means well.
 */
export function dialGoodness(
  dial: DialKey,
  value: number,
): "good" | "mid" | "needs-care" {
  const band = checkinBandFor(value);
  if (DIAL_DIRECTION[dial] === "lowerIsBetter") {
    return band === "low" ? "good" : band === "moderate" ? "mid" : "needs-care";
  }
  return band === "high" ? "good" : band === "moderate" ? "mid" : "needs-care";
}

/** Q5 supplement: hours slept -> anchored band score. */
export function sleepHoursScore(hours: number): number {
  if (hours >= 7) return 90;
  if (hours >= 6) return 70;
  if (hours >= 5) return 45;
  return 15;
}
