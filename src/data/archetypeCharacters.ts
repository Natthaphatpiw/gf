import type { GuestGender, LText } from "@/lib/types";

export interface ArchetypeCharacterSpec {
  code: string;
  identity: LText;
  visualPrompt: LText;
}

export interface ArchetypeCharacterAsset {
  src: string;
  prompt: LText;
}

const STYLE_EN =
  "Create an original full-body wellness cartoon mascot, premium tropical resort mood, gentle low-poly paper-cut geometry, soft cream background, deep teal and muted gold accents, friendly but mature, no text, no logo, no existing IP.";

const STYLE_TH =
  "สร้างคาแรกเตอร์การ์ตูนต้นฉบับแบบเต็มตัว โทนเวลเนสรีสอร์ตเขตร้อน รูปทรง low-poly/paper-cut นุ่ม ๆ ฉากหลังสีครีม ใช้สีเขียวทีลและทองหม่น ดูเป็นมิตรแต่โตพอสำหรับแบรนด์พรีเมียม ไม่มีตัวหนังสือ ไม่มีโลโก้ และไม่อ้างอิงตัวละครที่มีอยู่แล้ว";

export const CHARACTER_FOLDER = "/archetypes/characters";

export const ARCHETYPE_CHARACTER_SPECS: Record<string, ArchetypeCharacterSpec> = {
  SAPB: {
    code: "SAPB",
    identity: {
      th: "นักผจญคลื่นรุ่งอรุณ ผู้เติมพลังจากผู้คน การขยับร่างกาย และตารางที่ชัดเจน",
      en: "A sunrise mover who recharges through people, motion and clear structure.",
    },
    visualPrompt: {
      th: "ยืนริมชายหาดยามเช้าในชุด active resort ถือเสื่อโยคะและขวดน้ำ ท่าทางสดใสพร้อมชวนคนอื่นเริ่มวัน",
      en: "Standing on a sunrise beach in active resort wear, holding a yoga mat and water bottle, bright and ready to gather people into motion.",
    },
  },
  SAPM: {
    code: "SAPM",
    identity: {
      th: "ผู้นำทางสายเกลียวคลื่น นักวางแผนพลังสูงที่ชอบเป้าหมายวัดผลได้",
      en: "A high-energy planner who loves measurable goals and a guided path.",
    },
    visualPrompt: {
      th: "อยู่บนดาดฟ้าริมทะเลพร้อมแท็บเล็ต แผนฝึก และเข็มทิศ ดูนิ่ง มั่นใจ และเป็นผู้นำ",
      en: "On a sea-view deck with a tablet, training plan and compass, calm, confident and quietly leading.",
    },
  },
  SAFB: {
    code: "SAFB",
    identity: {
      th: "นักเต้นรำแห่งเกลียวลม ผู้รักการผจญภัยแบบไม่ต้องวางแผนและฟังร่างกายเป็นหลัก",
      en: "A spontaneous adventurer who follows the body first and keeps the day playful.",
    },
    visualPrompt: {
      th: "เคลื่อนไหวกลางลมทะเล เท้าเปล่าบนทราย มีเชือกกระโดดหรือกระดานแพดเดิลอยู่ข้าง ๆ ท่าทางสนุกและคล่องตัว",
      en: "Moving in the sea breeze, barefoot on sand, with a jump rope or paddle board nearby, playful and agile.",
    },
  },
  SAFM: {
    code: "SAFM",
    identity: {
      th: "นักเล่าเรื่องแสงจันทร์ ผู้ฟื้นพลังจากบทสนทนา เวิร์กช็อป และความคิดสร้างสรรค์",
      en: "A free-spirited storyteller restored by conversation, workshops and creative curiosity.",
    },
    visualPrompt: {
      th: "นั่งในวงสนทนาเล็ก ๆ ใต้แสงไฟอุ่น ถือสมุดบันทึกและสมุนไพร มีบรรยากาศคลาสทำอาหารหรือเวิร์กช็อป",
      en: "Seated in a small warm-lit circle with a notebook and herbs, surrounded by a cooking-class or workshop atmosphere.",
    },
  },
  STPB: {
    code: "STPB",
    identity: {
      th: "ผู้พิทักษ์สวนมะพร้าว ผู้รักการดูแลร่วมกับคนใกล้ตัวและกิจวัตรที่อบอุ่น",
      en: "A warm caretaker who loves shared rituals, close company and steady comfort.",
    },
    visualPrompt: {
      th: "อยู่ในสวนมะพร้าวพร้อมถาดชาสมุนไพร ผ้าคลุมไหล่นุ่ม ๆ และท่าทางอบอุ่นเหมือนเจ้าบ้าน",
      en: "In a coconut grove with a herbal tea tray, a soft wrap and a welcoming host-like posture.",
    },
  },
  STPM: {
    code: "STPM",
    identity: {
      th: "นักปราชญ์ริมหาด ผู้รักความสงบแบบมีแบบแผนและการเรียนรู้ร่วมกับกลุ่มเล็ก",
      en: "A calm shoreline learner who values structured stillness and small-group wisdom.",
    },
    visualPrompt: {
      th: "นั่งสมาธิบนศาลาริมทะเล มีหนังสือ แผนคลาส และระฆังเสียงบำบัดเล็ก ๆ ข้างตัว",
      en: "Meditating in a seaside sala with a book, class plan and small sound-healing bell nearby.",
    },
  },
  STFB: {
    code: "STFB",
    identity: {
      th: "จิตวิญญาณน้ำตก ผู้เข้าสังคมแบบสบาย ๆ และปล่อยใจตามจังหวะธรรมชาติ",
      en: "An easy social nature-lover who follows the body's rhythm and the sound of water.",
    },
    visualPrompt: {
      th: "ยืนใกล้น้ำตกและใบไม้ใหญ่ ถือผ้าขนหนูสปา ท่าทางเปิดใจ ผ่อนคลาย และเป็นธรรมชาติ",
      en: "Near a waterfall and large leaves, holding a spa towel, open-hearted, relaxed and natural.",
    },
  },
  STFM: {
    code: "STFM",
    identity: {
      th: "นักฝันใต้เงาตาล ผู้ชอบความสงบร่วมกับเพื่อนสนิทและบทสนทนานุ่มลึก",
      en: "A palm-shade dreamer who loves soft calm with close friends and reflective talks.",
    },
    visualPrompt: {
      th: "นั่งเอนใต้ต้นตาลพร้อมเบาะและเครื่องดนตรีเสียงบำบัดเล็ก ๆ แววตาฝันและอ่อนโยน",
      en: "Lounging under a palm with cushions and a small sound-healing instrument, dreamy and gentle.",
    },
  },
  LAPB: {
    code: "LAPB",
    identity: {
      th: "นักวิ่งสายหมอก ผู้ฟื้นพลังจากการฝึกเดี่ยวและวินัยที่ตัวเองเลือก",
      en: "A disciplined solo mover restored by quiet training and self-directed rhythm.",
    },
    visualPrompt: {
      th: "บนเส้นทางวิ่งเขียวชื้นยามเช้า ใส่ชุดวิ่งเรียบ มีรองเท้าเทรลและผ้าขนหนูเล็ก ท่าทางมั่นคง",
      en: "On a misty green morning trail in clean running wear, with trail shoes and a small towel, steady and focused.",
    },
  },
  LAPM: {
    code: "LAPM",
    identity: {
      th: "สถาปนิกแห่งรุ่งสาง ผู้เงียบ มีวินัย และชอบวางแผนสุขภาพจากข้อมูล",
      en: "A quiet dawn architect who plans wellbeing through discipline and data.",
    },
    visualPrompt: {
      th: "ยืนข้างโต๊ะไม้ที่มีผลตรวจสุขภาพ นาฬิกา และแผนการดูแลตัวเอง แสงเช้าเรียบสงบ",
      en: "Beside a wooden table with health reports, a watch and a self-care plan, lit by calm dawn light.",
    },
  },
  LAFB: {
    code: "LAFB",
    identity: {
      th: "นักสำรวจแนวปะการัง ผู้ผจญภัยคนเดียวและใช้ร่างกายเป็นเข็มทิศ",
      en: "A solo reef wanderer who lets the body lead the adventure.",
    },
    visualPrompt: {
      th: "ริมทะเลใสพร้อมหน้ากากดำน้ำ ครีบ และเป้ใบเล็ก ท่าทางพร้อมออกสำรวจอย่างเงียบ ๆ",
      en: "By clear water with snorkel mask, fins and a small pack, quietly ready to explore.",
    },
  },
  LAFM: {
    code: "LAFM",
    identity: {
      th: "กวีแห่งสายลม ผู้เดินทางคนเดียว สลับการเคลื่อนไหวกับการทบทวนตัวเอง",
      en: "A wind poet who travels alone, alternating movement with reflection.",
    },
    visualPrompt: {
      th: "เดินริมหน้าผาทะเลพร้อมสมุดบันทึก ผ้าพันคอบาง และสายลมรอบตัว ดูอิสระและลึกซึ้ง",
      en: "Walking a seaside cliff with a journal, light scarf and wind around them, independent and reflective.",
    },
  },
  LTPB: {
    code: "LTPB",
    identity: {
      th: "ผู้เฝ้าทะเลสงบ ผู้ต้องการความนิ่งเป็นพิธีกรรมและฟังสัญญาณร่างกายอย่างละเอียด",
      en: "A still-lagoon guardian who needs quiet ritual and listens closely to the body.",
    },
    visualPrompt: {
      th: "นั่งริมลากูนสงบพร้อมผ้าห่มบาง น้ำมันนวด และแก้วชาสมุนไพร สีหน้าพักลึก",
      en: "Sitting by a still lagoon with a light blanket, massage oil and herbal tea, deeply rested.",
    },
  },
  LTPM: {
    code: "LTPM",
    identity: {
      th: "นักสมาธิหินภูเขา ผู้รักความเงียบ มีระเบียบ และพักใจผ่านสมาธิลึก",
      en: "A mountain-stone meditator who loves silence, order and deep practice.",
    },
    visualPrompt: {
      th: "นั่งบนหินเรียบในสวนเขา มีสมุดบันทึกและเทียนเล็ก ๆ องค์ประกอบนิ่ง ลึก และมั่นคง",
      en: "Seated on a smooth stone in a hillside garden with a journal and small candle, still, deep and grounded.",
    },
  },
  LTFB: {
    code: "LTFB",
    identity: {
      th: "ดอกบัวยามเช้า ผู้ฟื้นพลังด้วยความอ่อนโยน อาหารจากพืช และเวลาริมน้ำ",
      en: "A morning lotus restored by gentleness, plant-based nourishment and water-side quiet.",
    },
    visualPrompt: {
      th: "อยู่ริมสระบัวพร้อมชามอาหารจากพืชและเสื่อโยคะ ท่าทางนุ่ม เบา และสงบ",
      en: "By a lotus pond with a plant-based bowl and yoga mat, soft, light and peaceful.",
    },
  },
  LTFM: {
    code: "LTFM",
    identity: {
      th: "ผู้ฟังเสียงดาว ผู้เงียบ ลึก และฟื้นใจด้วยคลื่นยามค่ำกับการพักไร้ตาราง",
      en: "A star listener restored by night waves, quiet imagination and schedule-free rest.",
    },
    visualPrompt: {
      th: "นั่งใต้ท้องฟ้าดาวริมทะเล มีหูฟังหรือชามเสียงบำบัดเล็ก ๆ แสงนุ่มและจินตนาการสูง",
      en: "Sitting under a starry seaside sky with headphones or a small singing bowl, soft-lit and imaginative.",
    },
  },
};

export function characterFilename(code: string, gender: GuestGender): string {
  return `${code.toUpperCase()}-${gender}.png`;
}

export function getArchetypeCharacter(
  code: string,
  gender: GuestGender | undefined,
): ArchetypeCharacterAsset | null {
  if (!gender) return null;
  const normalized = code.toUpperCase();
  const spec = ARCHETYPE_CHARACTER_SPECS[normalized];
  if (!spec) return null;
  const genderText = {
    th: gender === "female" ? "ผู้หญิง" : "ผู้ชาย",
    en: gender === "female" ? "female" : "male",
  };
  return {
    src: `${CHARACTER_FOLDER}/${characterFilename(normalized, gender)}`,
    prompt: {
      th: `${STYLE_TH}. คาแรกเตอร์${genderText.th}: ${spec.identity.th}. ${spec.visualPrompt.th}`,
      en: `${STYLE_EN} ${genderText.en} character: ${spec.identity.en} ${spec.visualPrompt.en}`,
    },
  };
}
