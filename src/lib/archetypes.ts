import type { Archetype } from "@/lib/types";

/* ============================================================
 * Samui Wellness Archetypes — our own 16-type system.
 *
 * Four axes, two poles each (first letter wins the code):
 *   1. Recharge   S (Social — energised with people)   / L (Solitary — energised alone)
 *   2. Pace       A (Active — moves to restore)        / T (Tranquil — stills to restore)
 *   3. Structure  P (Planned — thrives on routine)     / F (Flowing — thrives on spontaneity)
 *   4. Focus      B (Body-led — feels first)           / M (Mind-led — thinks first)
 *
 * 2^4 = 16 clearly distinguishable archetypes, in the spirit of
 * 16personalities but tuned for wellness journeys on Koh Samui.
 * ============================================================ */

export const ARCHETYPES: Record<string, Archetype> = {
  SAPB: {
    code: "SAPB",
    name: { th: "นักผจญคลื่นรุ่งอรุณ", en: "The Sunrise Voyager" },
    description: {
      th: "คุณได้พลังจากผู้คนและการเคลื่อนไหว ชอบตารางที่ชัดเจน และฟังสัญญาณร่างกายเก่ง คลาสออกกำลังกายริมทะเลตอนเช้าคือพื้นที่ของคุณ",
      en: "You draw energy from people and movement, love a clear schedule, and read your body well. A sunrise beach workout with others is exactly your element.",
    },
  },
  SAPM: {
    code: "SAPM",
    name: { th: "ผู้นำทางสายเกลียวคลื่น", en: "The Tide Captain" },
    description: {
      th: "มีพลังสูง รักการวางแผน และคิดวิเคราะห์ก่อนเสมอ คุณเหมาะกับโปรแกรมฟิตเนสแบบมีโค้ชและเป้าหมายวัดผลได้",
      en: "High-energy, social and analytical, you thrive on structured programs with a coach and measurable goals.",
    },
  },
  SAFB: {
    code: "SAFB",
    name: { th: "นักเต้นรำแห่งเกลียวลม", en: "The Breeze Dancer" },
    description: {
      th: "คุณรักความสนุกแบบไม่ต้องวางแผน ขอแค่ได้ขยับร่างกายกับเพื่อนใหม่ กิจกรรมกลางแจ้งแบบไม่ซ้ำวันคือยาชูกำลังของคุณ",
      en: "Spontaneous and physical, you recharge through unplanned adventures with new friends — no two island days should look the same.",
    },
  },
  SAFM: {
    code: "SAFM",
    name: { th: "นักเล่าเรื่องแสงจันทร์", en: "The Firefly Storyteller" },
    description: {
      th: "ช่างคุย ช่างคิด และรักอิสระ คุณชอบเวิร์กช็อปกลุ่มเล็ก คลาสทำอาหาร และบทสนทนาลึก ๆ ใต้แสงดาว",
      en: "Talkative, curious and free-spirited, you love small-group workshops, cooking classes and deep conversations under the stars.",
    },
  },
  STPB: {
    code: "STPB",
    name: { th: "ผู้พิทักษ์สวนมะพร้าว", en: "The Grove Keeper" },
    description: {
      th: "อบอุ่น มั่นคง และใส่ใจร่างกาย คุณชอบกิจวัตรสงบ ๆ ร่วมกับคนใกล้ชิด สปาคู่และมื้ออาหารสุขภาพพร้อมหน้าคือความสุขของคุณ",
      en: "Warm, steady and body-aware, you favour calm routines shared with loved ones — couple spa rituals and healthy meals together.",
    },
  },
  STPM: {
    code: "STPM",
    name: { th: "นักปราชญ์ริมหาด", en: "The Shoreline Sage" },
    description: {
      th: "คุณชอบความสงบที่มีแบบแผน รักการเรียนรู้ และแบ่งปันกับกลุ่มเล็ก ๆ คลาสสมาธิและเวิร์กช็อปสุขภาพคือสิ่งที่เติมเต็มคุณ",
      en: "You seek structured calm, love learning and sharing in small circles — guided meditation courses and wellness workshops fulfil you.",
    },
  },
  STFB: {
    code: "STFB",
    name: { th: "จิตวิญญาณน้ำตก", en: "The Waterfall Spirit" },
    description: {
      th: "เข้าสังคมแบบสบาย ๆ รักธรรมชาติ และปล่อยใจไปกับจังหวะของร่างกาย ทริปน้ำตก โยคะกลางป่า และสปาธรรมชาติเหมาะกับคุณ",
      en: "Easy-going and nature-loving, you follow your body's rhythm — waterfall trips, jungle yoga and forest spas suit you perfectly.",
    },
  },
  STFM: {
    code: "STFM",
    name: { th: "นักฝันใต้เงาตาล", en: "The Palm Shade Dreamer" },
    description: {
      th: "คุณชอบบรรยากาศผ่อนคลายกับเพื่อนสนิท ปล่อยความคิดล่องลอยอย่างอิสระ ซาวด์ฮีลลิ่งและบทสนทนาสบาย ๆ ริมทะเลคือพื้นที่ของคุณ",
      en: "You drift best among close friends, letting thoughts wander — sound healing and slow seaside conversations are your space.",
    },
  },
  LAPB: {
    code: "LAPB",
    name: { th: "นักวิ่งสายหมอก", en: "The Mist Runner" },
    description: {
      th: "คุณชอบออกกำลังกายคนเดียวตามตารางที่ตัวเองคุม วิ่งเทรลเช้ามืด ว่ายน้ำ และเวทเทรนนิ่งเงียบ ๆ คือสมาธิแบบของคุณ",
      en: "You train alone on your own disciplined schedule — dawn trail runs, swims and quiet strength sessions are your meditation.",
    },
  },
  LAPM: {
    code: "LAPM",
    name: { th: "สถาปนิกแห่งรุ่งสาง", en: "The Dawn Architect" },
    description: {
      th: "มีวินัย ชอบความเงียบ และวางแผนทุกอย่างล่วงหน้า โปรแกรมสุขภาพเชิงข้อมูล เช่น ตรวจสุขภาพเชิงป้องกัน เหมาะกับคุณที่สุด",
      en: "Disciplined, quiet and forward-planning, you respond best to data-driven wellness — preventive checkups and structured recovery.",
    },
  },
  LAFB: {
    code: "LAFB",
    name: { th: "นักสำรวจแนวปะการัง", en: "The Reef Wanderer" },
    description: {
      th: "คุณรักการผจญภัยเงียบ ๆ คนเดียว ดำน้ำ พายเรือ เดินป่าแบบไม่กำหนดเส้นทาง ร่างกายคือเข็มทิศของคุณ",
      en: "A solo adventurer at heart — freediving, paddling and unplanned hikes. Your body is your compass.",
    },
  },
  LAFM: {
    code: "LAFM",
    name: { th: "กวีแห่งสายลม", en: "The Wind Poet" },
    description: {
      th: "อิสระ ช่างคิด และรักการเดินทางคนเดียว คุณชอบสลับระหว่างกิจกรรมและการนั่งคิดทบทวน เกาะสมุยคือสมุดบันทึกของคุณ",
      en: "Independent and reflective, you alternate movement with contemplation — the island becomes your journal.",
    },
  },
  LTPB: {
    code: "LTPB",
    name: { th: "ผู้เฝ้าทะเลสงบ", en: "The Still Lagoon" },
    description: {
      th: "คุณต้องการความสงบเป็นกิจวัตร นวดบำบัด สปาเงียบ ๆ และการนอนหลับลึกคือสิ่งที่ร่างกายคุณเรียกหา",
      en: "You need stillness as a ritual — therapeutic massage, silent spas and deep sleep are what your body calls for.",
    },
  },
  LTPM: {
    code: "LTPM",
    name: { th: "นักสมาธิหินภูเขา", en: "The Mountain Stone" },
    description: {
      th: "ลึกซึ้ง มีระเบียบ และรักความเงียบ คอร์สสมาธิแบบเข้ม ดีท็อกซ์ดิจิทัล และการเขียนบันทึกคือเส้นทางของคุณ",
      en: "Deep, ordered and silence-loving — structured meditation retreats, digital detox and journaling are your path.",
    },
  },
  LTFB: {
    code: "LTFB",
    name: { th: "ดอกบัวยามเช้า", en: "The Morning Lotus" },
    description: {
      th: "อ่อนโยนและไหลตามความรู้สึก คุณฟื้นพลังด้วยโยคะเบา ๆ อาหารจากพืช และเวลาเงียบ ๆ ริมน้ำโดยไม่ต้องมีแผน",
      en: "Gentle and feeling-led, you restore with soft yoga, plant-based food and unhurried time by the water.",
    },
  },
  LTFM: {
    code: "LTFM",
    name: { th: "ผู้ฟังเสียงดาว", en: "The Star Listener" },
    description: {
      th: "เงียบ ลึก และจินตนาการสูง คุณชอบปล่อยความคิดไปกับเสียงคลื่นยามค่ำ ซาวด์ฮีลลิ่งเดี่ยวและการพักผ่อนไร้กำหนดการคือคำตอบ",
      en: "Quiet, deep and imaginative — night waves, solo sound healing and schedule-free rest restore you completely.",
    },
  },
};

/** Codes the LLM is allowed to return (the 16 archetypes). */
export const ARCHETYPE_CODES = Object.keys(ARCHETYPES);

export function getArchetype(code: string): Archetype {
  return ARCHETYPES[code] ?? ARCHETYPES.LTFB;
}
