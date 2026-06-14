import type { Locale } from "@/lib/types";

const programs = {
  th: {
    back: "กลับไปหน้าแรก",
    backToPrograms: "กลับไปหน้าโปรแกรม",
    page: {
      eyebrow: "Goodfill Wellness Programs",
      title: "โปรแกรมสุขภาพสำหรับทริปสมุยของคุณ",
      intro:
        "โปรแกรมที่ออกแบบจากกลไกสุขภาพที่มีหลักฐานรองรับ แล้วเติมแต่ละช่วงด้วยบริการและเมนูจริงบนเกาะ เลือกโปรแกรมที่ใช่ แล้วเสริมด้วยบริการและอาหารที่คุณอยากลอง",
    },
    landing: {
      eyebrow: "Goodfill Wellness Programs",
      title: "เลือกโปรแกรม บริการ และอาหารของคุณ",
      intro:
        "ทำแบบประเมินด้วย AI เพื่อรับโปรแกรมที่เหมาะกับคุณ หรือจะเลือกโปรแกรม บริการ และเมนูอาหารเองก็ได้",
      assessCta: "ทำแบบประเมินด้วย AI",
    },
    programsSection: {
      title: "โปรแกรมแนะนำ",
      subtitle: "แตะที่โปรแกรมเพื่อดูว่าประกอบด้วยอะไร เหมาะกับใคร และช่วยเรื่องอะไร",
    },
    servicesSection: {
      title: "บริการให้คุณเลือกเสริม",
      subtitle: "กิจกรรมและประสบการณ์บนเกาะที่นำมาเสริมในโปรแกรมของคุณได้",
    },
    menusSection: {
      title: "เมนูอาหารให้คุณเลือก",
      subtitle: "อาหารท้องถิ่นพร้อมแนวทางโภชนาการ เลือกจานที่อยากให้อยู่ในโปรแกรม",
    },
    card: {
      from: "เริ่มต้น",
      baht: "บาท",
      viewDetails: "ดูรายละเอียด",
      doctorScreen: "ต้องผ่านการคัดกรองโดยแพทย์",
      onRequest: "สอบถามราคา",
    },
    detail: {
      heroFrom: "เริ่มต้น",
      perProgram: "ต่อโปรแกรม",
      interestedCta: "สนใจโปรแกรมนี้",
      assessmentCta: "ทำแบบประเมินเพื่อจับคู่โปรแกรม",
      suitableFor: "เหมาะกับใคร",
      whyItWorks: "ทำไมโปรแกรมนี้ถึงช่วยได้",
      coreMechanisms: "กลไกหลักที่อยู่เบื้องหลัง",
      inside: "ในโปรแกรมนี้ประกอบด้วย",
      insideNote:
        "แต่ละช่วงคือ slot ที่มีกลไกและระดับหลักฐานกำกับ ร้านพาร์ตเนอร์นำบริการและเมนูของตัวเองมาเสียบในแต่ละช่วงได้",
      triggers: "เหมาะกับคุณเป็นพิเศษเมื่อ",
      outcomes: "เราวัดผลอย่างไร",
      safety: "ความปลอดภัยและการคัดกรอง",
      expertLayer: "ผู้เชี่ยวชาญดูแลอย่างไร",
      claims: "สิ่งที่เราพูดได้ และไม่พูด",
      allowedClaim: "สิ่งที่โปรแกรมนี้ช่วยได้",
      forbiddenClaim: "สิ่งที่เราไม่เคลม",
      pillars: "สมดุล 3 อ",
      duration: "ระยะเวลา",
      tripPhase: "ช่วงของทริป",
    },
    fillType: {
      service: "บริการบนเกาะ",
      menu: "เมนูอาหาร",
      guidance: "Goodfill ดูแลให้",
      unassigned: "รอจับคู่ร้านพาร์ตเนอร์",
    },
    evidence: {
      label: "ระดับหลักฐาน",
      A: "หลักฐานแข็ง",
      B: "หลักฐานสนับสนุน",
      C: "ชั้นประสบการณ์",
    },
    pillar: {
      food: "อาหาร",
      air: "อากาศ",
      mind: "อารมณ์",
    },
    tripPhase: {
      arrival: "ขามาถึง",
      during: "ระหว่างทริป",
      departure: "ก่อนเดินทางกลับ",
      anytime: "ได้ทุกช่วงของทริป",
    },
    metricColumn: {
      timepoint: "จุดวัด",
      measures: "วัดอะไร",
    },
    a11y: {
      scrollLeft: "เลื่อนไปทางซ้าย",
      scrollRight: "เลื่อนไปทางขวา",
      remove: "นำออก",
    },
  },
  en: {
    back: "Back to home",
    backToPrograms: "Back to programs",
    page: {
      eyebrow: "Goodfill Wellness Programs",
      title: "Wellness programs for your Samui trip",
      intro:
        "Programs built from evidence-grounded health mechanisms, then filled with real island services and dishes. Choose the program that fits, then add the services and food you want to try.",
    },
    landing: {
      eyebrow: "Goodfill Wellness Programs",
      title: "Choose your program, services and food",
      intro:
        "Take the AI assessment for a program tailored to you, or pick the programs, services and dishes yourself.",
      assessCta: "Take the AI assessment",
    },
    programsSection: {
      title: "Featured programs",
      subtitle: "Tap a program to see what it includes, who it is for, and what it helps with.",
    },
    servicesSection: {
      title: "Services to add",
      subtitle: "Island activities and experiences you can layer into your program.",
    },
    menusSection: {
      title: "Dishes to add",
      subtitle: "Local food with nutrition guidance — pick the dishes you want in your program.",
    },
    card: {
      from: "From",
      baht: "THB",
      viewDetails: "View details",
      doctorScreen: "Doctor screen required",
      onRequest: "Price on request",
    },
    detail: {
      heroFrom: "From",
      perProgram: "per program",
      interestedCta: "I'm interested",
      assessmentCta: "Take the assessment to match a program",
      suitableFor: "Who it's for",
      whyItWorks: "Why this program helps",
      coreMechanisms: "The mechanisms behind it",
      inside: "What's inside this program",
      insideNote:
        "Each step is a slot with a documented mechanism and evidence level. Partner shops plug their own services and dishes into each slot.",
      triggers: "Especially right for you when",
      outcomes: "How we measure it",
      safety: "Safety & screening",
      expertLayer: "How experts oversee it",
      claims: "What we can and can't say",
      allowedClaim: "What this program supports",
      forbiddenClaim: "What we never claim",
      pillars: "The three balance pillars",
      duration: "Duration",
      tripPhase: "Trip moment",
    },
    fillType: {
      service: "Island service",
      menu: "Dish",
      guidance: "Goodfill-guided",
      unassigned: "Partner to be matched",
    },
    evidence: {
      label: "Evidence level",
      A: "Strong evidence",
      B: "Supporting evidence",
      C: "Experience layer",
    },
    pillar: {
      food: "Food",
      air: "Air",
      mind: "Mind",
    },
    tripPhase: {
      arrival: "On arrival",
      during: "During your trip",
      departure: "Before you fly home",
      anytime: "Anytime in your trip",
    },
    metricColumn: {
      timepoint: "Checkpoint",
      measures: "What we measure",
    },
    a11y: {
      scrollLeft: "Scroll left",
      scrollRight: "Scroll right",
      remove: "Remove",
    },
  },
} satisfies Record<Locale, unknown>;

export default programs;
