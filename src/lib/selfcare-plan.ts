import type { CheckinDials, DialKey, LText } from "@/lib/types";
import { DIAL_DIRECTION, DIAL_NAMES, dialGoodness } from "@/data/checkin";
import { getPackage } from "@/data/packages";

/* ============================================================
 * 30-day self-care plan — generated in code from the guest's
 * post-program dials + archetype. Deterministic + bilingual, so
 * it works with an empty .env (no LLM needed). The plan keeps the
 * guest in our orbit between T2 and the T3 follow-up: daily habits
 * grouped by the 3 อ (อาหาร/อากาศ/อารมณ์ = food/air/mind), four
 * weekly milestones, and a re-engagement pick from the catalog.
 *
 * Nothing here is a medical claim — habits are gentle lifestyle
 * nudges framed around how the guest feels.
 * ============================================================ */

export type Pillar = "food" | "air" | "mind";

export interface PlanHabit {
  id: string;
  pillar: Pillar;
  text: LText;
}

export interface PlanWeek {
  week: number;
  theme: LText;
  focus: LText;
}

export interface SelfCarePlan {
  /** The 1–2 dials most worth nurturing over the next 30 days. */
  focusDials: DialKey[];
  /** Daily micro-actions (grouped by pillar in the UI). */
  habits: PlanHabit[];
  /** Four weekly milestones. */
  weeks: PlanWeek[];
  /** A next program to keep the momentum going (re-engagement). */
  reEngagement: { packageId: string; reason: LText } | null;
}

/** Per-dial daily habits, each tagged with its 3-อ pillar. */
const HABIT_LIBRARY: Record<DialKey, PlanHabit[]> = {
  stress: [
    {
      id: "stress-breath",
      pillar: "mind",
      text: {
        th: "หายใจช้า ๆ 5 นาทีในตอนเช้า ก่อนเปิดโทรศัพท์",
        en: "Five slow breaths each morning before you touch your phone",
      },
    },
    {
      id: "stress-pause",
      pillar: "mind",
      text: {
        th: "พักจากหน้าจอ 10 นาทีทุกบ่าย ออกไปรับลมหรือยืดตัว",
        en: "A 10-minute screen-free pause each afternoon — step out or stretch",
      },
    },
  ],
  mind: [
    {
      id: "mind-gratitude",
      pillar: "mind",
      text: {
        th: "จดสิ่งดี ๆ ของวันนี้ 1 อย่างก่อนนอน",
        en: "Note one good moment from the day before bed",
      },
    },
    {
      id: "mind-nature",
      pillar: "air",
      text: {
        th: "เดินในที่ที่มีต้นไม้หรือใกล้น้ำสัก 15 นาที",
        en: "A 15-minute walk somewhere green or near water",
      },
    },
  ],
  sleep: [
    {
      id: "sleep-winddown",
      pillar: "air",
      text: {
        th: "เริ่มผ่อนจังหวะลง 30 นาทีก่อนนอน หรี่ไฟให้สลัว",
        en: "Begin winding down 30 minutes before bed — dim the lights",
      },
    },
    {
      id: "sleep-nocaffeine",
      pillar: "food",
      text: {
        th: "งดคาเฟอีนหลังบ่ายสอง",
        en: "No caffeine after 2 pm",
      },
    },
  ],
  migraine: [
    {
      id: "migraine-hydrate",
      pillar: "food",
      text: {
        th: "ดื่มน้ำให้ครบทั้งวัน (ประมาณ 6–8 แก้ว)",
        en: "Stay hydrated through the day (about 6–8 glasses)",
      },
    },
    {
      id: "migraine-light",
      pillar: "air",
      text: {
        th: "พักสายตาจากแสงจ้าและหน้าจอเป็นช่วง ๆ",
        en: "Give your eyes regular breaks from bright light and screens",
      },
    },
  ],
  energy: [
    {
      id: "energy-move",
      pillar: "air",
      text: {
        th: "ขยับร่างกายเบา ๆ อย่างน้อย 20 นาทีต่อวัน",
        en: "Move your body gently for at least 20 minutes a day",
      },
    },
    {
      id: "energy-breakfast",
      pillar: "food",
      text: {
        th: "เริ่มวันด้วยมื้อเช้าที่มีโปรตีน ไม่พีคน้ำตาล",
        en: "Start the day with a protein-forward breakfast, easy on the sugar",
      },
    },
  ],
};

/** A couple of universal anchors everyone gets. */
const ANCHOR_HABITS: PlanHabit[] = [
  {
    id: "anchor-sunlight",
    pillar: "air",
    text: {
      th: "ออกไปรับแสงแดดอ่อน ๆ ตอนเช้าสัก 10 นาที",
      en: "Catch 10 minutes of gentle morning sunlight",
    },
  },
  {
    id: "anchor-wholefood",
    pillar: "food",
    text: {
      th: "เพิ่มผักหรือผลไม้สดในมื้ออาหารอย่างน้อยวันละ 1 มื้อ",
      en: "Add fresh vegetables or fruit to at least one meal a day",
    },
  },
];

const PLAN_WEEKS: PlanWeek[] = [
  {
    week: 1,
    theme: { th: "สัปดาห์ที่ 1 — ตั้งหลัก", en: "Week 1 — Anchor" },
    focus: {
      th: "ค่อย ๆ วางนิสัยใหม่ให้ติด ทำให้ครบทุกวันแบบเบา ๆ",
      en: "Let the new habits settle — keep them light and daily",
    },
  },
  {
    week: 2,
    theme: { th: "สัปดาห์ที่ 2 — ต่อยอด", en: "Week 2 — Build" },
    focus: {
      th: "สังเกตว่าช่วงไหนของวันที่คุณรู้สึกดีที่สุด แล้วทำซ้ำ",
      en: "Notice when in the day you feel best — and repeat it",
    },
  },
  {
    week: 3,
    theme: { th: "สัปดาห์ที่ 3 — ลงลึก", en: "Week 3 — Deepen" },
    focus: {
      th: "เพิ่มเวลาให้กิจกรรมที่ช่วยคุณได้มากที่สุดอีกนิด",
      en: "Give a little more time to whatever is helping you most",
    },
  },
  {
    week: 4,
    theme: { th: "สัปดาห์ที่ 4 — รักษาให้ยั่งยืน", en: "Week 4 — Sustain" },
    focus: {
      th: "เตรียมเช็คอินติดตามผล 30 วัน เพื่อดูว่าผลยังอยู่กับคุณไหม",
      en: "Get ready for your 30-day check-in to see how it all held",
    },
  },
];

/** Map a dial that needs care to the best-fit continuation program. */
const DIAL_NEXT_PACKAGE: Record<DialKey, string> = {
  stress: "calm-mind",
  migraine: "clear-head",
  sleep: "deep-sleep-sanctuary",
  mind: "calm-mind",
  energy: "samui-recharge",
};

function distanceFromIdeal(dial: DialKey, value: number): number {
  return DIAL_DIRECTION[dial] === "lowerIsBetter" ? value : 100 - value;
}

export function generate30DayPlan(args: {
  latestDials: CheckinDials;
  archetypeName?: LText;
}): SelfCarePlan {
  const { latestDials } = args;
  const dials = Object.keys(latestDials) as DialKey[];

  // Rank by how far each dial is from its ideal pole — the farthest needs care.
  const ranked = [...dials].sort(
    (a, b) =>
      distanceFromIdeal(b, latestDials[b].value) -
      distanceFromIdeal(a, latestDials[a].value),
  );
  const focusDials = ranked.slice(0, 2);

  // Habits for the focus dials + universal anchors, de-duplicated.
  const picked: PlanHabit[] = [];
  const seen = new Set<string>();
  const add = (h: PlanHabit) => {
    if (seen.has(h.id)) return;
    seen.add(h.id);
    picked.push(h);
  };
  for (const dial of focusDials) HABIT_LIBRARY[dial].forEach(add);
  ANCHOR_HABITS.forEach(add);

  // Re-engagement pick from the dial most in need (only if it exists).
  const worst = ranked[0];
  const reEngagePackageId = DIAL_NEXT_PACKAGE[worst];
  const reEngagement = getPackage(reEngagePackageId)
    ? {
        packageId: reEngagePackageId,
        reason: {
          th: `ออกแบบมาเพื่อดูแล${DIAL_NAMES[worst].th}ของคุณต่อเนื่องในก้าวถัดไป`,
          en: `Designed to keep nurturing your ${DIAL_NAMES[worst].en.toLowerCase()} as your next step.`,
        },
      }
    : null;

  return { focusDials, habits: picked, weeks: PLAN_WEEKS, reEngagement };
}
