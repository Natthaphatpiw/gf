import type { Locale } from "@/lib/types";

/* ============================================================
 * Assessment namespace — the "Island Journey" experience.
 * Intro, gameplay chrome, loading states and the result page.
 * ============================================================ */

const assessment = {
  th: {
    eyebrow: "การเดินทางบนเกาะ",
    intro: {
      title: "การเดินทางหนึ่งวันบนเกาะ",
      lead: "ใช้เวลาประมาณสองนาที ผ่อนคลาย แล้วลองเดินทางผ่านหนึ่งวันในจินตนาการบนเกาะสมุย คำถาม 10 ข้อนี้ถูกคัดให้จับสัญญาณสำคัญของจังหวะชีวิต พลังงาน และสมดุลกายใจของคุณให้ชัดที่สุด",
      whatYouGet: "สิ่งที่คุณจะได้รับเมื่อจบการเดินทาง",
      benefits: [
        "ระดับความเครียดที่อ่านจากจังหวะชีวิตของคุณ",
        "แนวโน้มอาการไมเกรนและความตึงของร่างกาย",
        "สมดุลของจิตใจและพลังภายใน",
        "ข้อสังเกตที่อ่านง่ายเกี่ยวกับนิสัยและตัวตนของคุณ",
        "อาร์คีไทป์เวลเนสประจำตัวจากทั้งหมด 16 แบบ",
      ],
      reassure: "ไม่มีคำตอบถูกหรือผิด มีเพียงคำตอบที่เป็นคุณ",
      start: "เริ่มการเดินทาง",
      minutes: "ประมาณ 2 นาที",
      questions: "10 ฉาก",
      genderTitle: "เลือกคาแรกเตอร์สำหรับผลลัพธ์ของคุณ",
      genderHint: "ใช้เพื่อเลือกภาพคาแรกเตอร์ประจำอาร์คีไทป์เท่านั้น ไม่กระทบการประเมิน",
      genderFemale: "ผู้หญิง",
      genderMale: "ผู้ชาย",
    },
    progress: {
      sceneOf: "ฉากที่ {current} จาก {total}",
    },
    slider: {
      current: "ระดับของคุณตอนนี้",
    },
    mbti: {
      chooseHint: "เลือกประเภทของคุณ หรือข้ามไปก็ได้",
      takeTest: "ทำแบบทดสอบที่ 16personalities",
      cleared: "ยังไม่ได้เลือก",
    },
    text: {
      placeholder: "พิมพ์เล่าให้เราฟังได้เลย...",
    },
    loading: {
      title: "กำลังร้อยเรียงการเดินทางของคุณ",
      lines: [
        "กำลังอ่านจังหวะของคุณ...",
        "กำลังฟังเสียงทะเลในใจคุณ...",
        "กำลังเทียบกับอาร์คีไทป์ทั้ง 16 แบบ...",
        "กำลังคัดสรรการพักผ่อนที่เหมาะกับคุณ...",
      ],
    },
    error: {
      title: "การเดินทางสะดุดลงชั่วครู่",
      retry: "ลองส่งอีกครั้ง",
    },
    result: {
      heroEyebrow: "อาร์คีไทป์เวลเนสประจำตัวคุณ",
      heroLead: "นี่คือภาพรวมกายใจของคุณในภาษาที่อ่านง่าย พร้อมเข็มทิศสำหรับเลือกการพักผ่อนที่เหมาะกับจังหวะชีวิตของคุณ",
      yourCode: "รหัสประจำตัว",
      typeLabel: "ไทป์",
      rhythmLabel: "จังหวะฟื้นพลัง",
      compassLabel: "แกนเด่น",
      characterFallback: "ภาพคาแรกเตอร์จะปรากฏเมื่อมีไฟล์ภาพของไทป์นี้ในระบบ",
      axisNames: {
        S: "เติมพลังกับผู้คน",
        L: "เติมพลังกับความสงบ",
        A: "ฟื้นตัวผ่านการเคลื่อนไหว",
        T: "ฟื้นตัวผ่านความนิ่ง",
        P: "มั่นคงกับแผนที่ชัดเจน",
        F: "ลื่นไหลไปกับจังหวะของวัน",
        B: "ฟังสัญญาณร่างกายก่อน",
        M: "ใช้ความคิดนำทางก่อน",
      },
      dialEyebrow: "ภาพรวมสุขภาวะ",
      dialTitle: "เข็มทิศกายใจของคุณ",
      stress: "ระดับความเครียด",
      migraine: "แนวโน้มไมเกรน",
      mental: "สมดุลจิตใจ",
      outOf: "/ 100",
      traitsEyebrow: "บทสรุปจากคำตอบของคุณ",
      traitsTitle: "สิ่งที่เราสังเกตเห็นในตัวคุณ",
      traitsLead: "เราเรียบเรียงจากรูปแบบคำตอบของคุณ เพื่อให้เห็นจุดที่ควรดูแลและจุดแข็งที่ควรเก็บไว้",
      idTitle: "รหัสปลดล็อกของคุณ",
      idCaption:
        "เก็บรหัสนี้ไว้ใช้กับแพ็กเกจครอบครัว เพื่อให้เราออกแบบการเดินทางที่เหมาะกับทุกคนพร้อมกัน",
      shareTitle: "แชร์อาร์คีไทป์ของคุณ",
      shareLead: "ชวนคนที่คุณรักมาค้นหาตัวตนเวลเนสของพวกเขาบ้าง",
      goalsTitle: "ลองดูไหม การผ่อนคลายไหนที่เหมาะกับคุณ",
      goalsLead: "เราเลือกไว้ให้แล้วตามผลของคุณ ปรับเพิ่มหรือลดได้ตามใจ",
      suggested: "แนะนำ",
      cta: "ประมวลผลแพ็กเกจของฉัน",
      empty: {
        title: "ยังไม่มีผลการประเมิน",
        lead: "เริ่มการเดินทางบนเกาะเพื่อค้นพบอาร์คีไทป์เวลเนสของคุณ",
        cta: "เริ่มการเดินทาง",
      },
      band: {
        low: "ต่ำ",
        moderate: "ปานกลาง",
        high: "สูง",
      },
    },
  },
  en: {
    eyebrow: "The Island Journey",
    intro: {
      title: "Craft your own island day",
      lead: "Take about two minutes, settle in, and play through one imagined day on Koh Samui. These 10 scenes are selected to capture the clearest signals of your rhythm, energy and inner balance.",
      whatYouGet: "What you will receive at journey's end",
      benefits: [
        "A reading of your stress, drawn from your own words",
        "Your migraine tendency and bodily tension",
        "The balance of your mind and inner energy",
        "The habits and character that make you, you",
        "Your personal wellness archetype — one of sixteen",
      ],
      reassure: "There are no right or wrong answers — only the ones that are truly you.",
      start: "Begin the journey",
      minutes: "About 2 minutes",
      questions: "10 scenes",
      genderTitle: "Choose your result character",
      genderHint: "This only selects your archetype artwork and does not affect the assessment.",
      genderFemale: "Female",
      genderMale: "Male",
    },
    progress: {
      sceneOf: "Scene {current} of {total}",
    },
    slider: {
      current: "Where you are right now",
    },
    mbti: {
      chooseHint: "Choose your type, or simply skip",
      takeTest: "Take the test at 16personalities",
      cleared: "Nothing selected",
    },
    text: {
      placeholder: "Tell us anything you wish...",
    },
    loading: {
      title: "Composing your journey",
      lines: [
        "Reading your rhythm...",
        "Listening to the sea inside you...",
        "Matching you to the sixteen archetypes...",
        "Curating the rest that suits you...",
      ],
    },
    error: {
      title: "The journey paused for a moment",
      retry: "Send again",
    },
    result: {
      heroEyebrow: "Your Samui Wellness Archetype",
      heroLead: "Here is your body-and-mind profile in a clear visual form, with a compass for choosing the kind of rest that fits your rhythm.",
      yourCode: "Your code",
      typeLabel: "Type",
      rhythmLabel: "Recovery rhythm",
      compassLabel: "Primary compass",
      characterFallback: "Your character artwork appears when this type's image file is available.",
      axisNames: {
        S: "Recharges with people",
        L: "Recharges in solitude",
        A: "Restores through movement",
        T: "Restores through stillness",
        P: "Feels steady with a plan",
        F: "Flows with the day",
        B: "Body-led first",
        M: "Mind-led first",
      },
      dialEyebrow: "Wellness overview",
      dialTitle: "Your body-and-mind compass",
      stress: "Stress level",
      migraine: "Migraine tendency",
      mental: "Mind balance",
      outOf: "/ 100",
      traitsEyebrow: "Who you are",
      traitsTitle: "What we noticed in you",
      traitsLead: "These notes are drawn from your answer patterns, highlighting what needs care and what already supports you.",
      idTitle: "Your unlock code",
      idCaption:
        "Keep this code safe — it unlocks family packages, so we can craft a journey that fits everyone together.",
      shareTitle: "Share your archetype",
      shareLead: "Invite the people you love to discover their own wellness selves.",
      goalsTitle: "Shall we find the kind of rest that fits you?",
      goalsLead: "We have chosen a few based on your result — add or remove any as you like.",
      suggested: "Suggested",
      cta: "Craft my packages",
      empty: {
        title: "No assessment yet",
        lead: "Begin the island journey to discover your wellness archetype.",
        cta: "Begin the journey",
      },
      band: {
        low: "Low",
        moderate: "Moderate",
        high: "High",
      },
    },
  },
} satisfies Record<Locale, unknown>;

export default assessment;
