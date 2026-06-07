import type { Locale } from "@/lib/types";

/* ============================================================
 * Landing page strings — Goodfill Care, Samui Wellness.
 * Premium hospitality tone. Bilingual TH / EN.
 * ============================================================ */

const landing = {
  th: {
    hero: {
      eyebrow: "เกาะสมุย · ประเทศไทย",
      title: "ให้เกาะ\nได้ดูแลคุณ",
      subline:
        "เส้นทางเวลเนสที่ออกแบบเฉพาะคุณ ท่ามกลางอ่าวสีเทอร์ควอยซ์ มือของหมอนวดสมุนไพร และความเงียบที่หาไม่ได้ที่ไหน",
      ctaPrimary: "เริ่มประเมินตัวเอง",
      ctaNote: "ฟรี · ใช้เวลาเพียง 2 นาที",
      ctaSecondary: "ดูแพ็กเกจทั้งหมด",
    },
    trust: {
      eyebrow: "ได้รับความไว้วางใจจาก",
      title: "บ้านแห่งการดูแลที่ดีที่สุดของเกาะ",
    },
    how: {
      eyebrow: "เพียงสามขั้นตอน",
      title: "เส้นทางของคุณ เริ่มต้นง่ายเพียงนี้",
      intro:
        "ไม่มีแบบฟอร์มยืดยาว ไม่มีศัพท์ทางการแพทย์ที่ชวนงง มีเพียงการดูแลที่เข้าใจคุณตั้งแต่ลมหายใจแรก",
      steps: [
        {
          title: "เล่นแบบประเมินสั้น ๆ",
          body: "ตอบคำถามเบา ๆ 10 ข้อ ในเวลาประมาณสองนาที เพื่อให้เราเข้าใจร่างกาย จิตใจ และจังหวะชีวิตของคุณ",
        },
        {
          title: "เอไอออกแบบเส้นทางเฉพาะคุณ",
          body: "ระบบของเราถักทอแพ็กเกจที่เหมาะกับคุณที่สุด จากสปา อาหาร การฝึกกาย และการดูแลใจทั่วทั้งเกาะ",
        },
        {
          title: "ผู้เชี่ยวชาญปรับและยืนยัน",
          body: "ทีมผู้เชี่ยวชาญด้านเวลเนสตรวจทาน ปรับให้ละเอียด และยืนยันทุกรายละเอียดก่อนการเดินทางของคุณ",
        },
      ],
    },
    pillars: {
      eyebrow: "ครบทุกมิติของการดูแล",
      title: "เวลเนสที่โอบรับคุณทั้งกายและใจ",
      intro:
        "เราเชื่อมโยงทุกบ้านแห่งการดูแลของเกาะสมุยไว้ในที่เดียว แปดมิติที่ทำงานประสานกันเพื่อความเป็นอยู่ที่ดีของคุณอย่างแท้จริง",
      items: [
        {
          name: "ที่พักเพื่อเวลเนส",
          body: "รีสอร์ตและรีทรีตริมทะเลที่ออกแบบมาเพื่อการพักผ่อนอย่างลึกซึ้ง",
        },
        {
          name: "สปาและการนวดไทย",
          body: "ศาสตร์การเยียวยาด้วยสมุนไพรและสัมผัสอันอ่อนโยนสืบทอดมาแต่โบราณ",
        },
        {
          name: "จิตใจและสมาธิ",
          body: "การเจริญสติ ฝึกหายใจ และเซสชันคืนสมดุลให้จิตใจสงบนิ่ง",
        },
        {
          name: "การฝึกกายและฟิตเนส",
          body: "โยคะริมหาด มวยไทย และการฝึกความแข็งแรงกับครูผู้เชี่ยวชาญ",
        },
        {
          name: "อาหารเพื่อสุขภาพ",
          body: "ครัวจากพืชและเมนูบำบัดที่ปรุงจากวัตถุดิบสดใหม่ของเกาะ",
        },
        {
          name: "การแพทย์เชิงป้องกัน",
          body: "การตรวจสุขภาพและคำปรึกษาจากแพทย์ เพื่อความอุ่นใจในทุกย่างก้าว",
        },
        {
          name: "ธรรมชาติและวัฒนธรรม",
          body: "ป่าเขา ทะเล และมรดกทางวัฒนธรรมที่เติมเต็มจิตวิญญาณ",
        },
        {
          name: "คอนเซียจและการดูแล",
          body: "ผู้ช่วยส่วนตัวที่คอยประสานทุกรายละเอียดตลอดการเดินทางของคุณ",
        },
      ],
    },
    featured: {
      eyebrow: "เส้นทางคัดสรร",
      title: "สามเส้นทางที่ผู้คนหลงรัก",
      intro:
        "จากหนึ่งวันแห่งการรีเซ็ต สู่ห้าวันแห่งการเยียวยาอันลึกซึ้ง เลือกจังหวะที่ใช่สำหรับคุณ",
      cta: "ดูแพ็กเกจทั้งหมด",
    },
    quote: {
      text: "ความสงบไม่ใช่สถานที่ที่คุณไปถึง แต่คือสิ่งที่คุณค้นพบ เมื่อโลกทั้งใบเงียบลงพอที่จะได้ยินตัวเอง",
      attribution: "ปรัชญาแห่งการดูแลของเรา",
    },
    teaser: {
      eyebrow: "ค้นพบตัวตนของคุณ",
      title: "คุณคือนักเดินทางเวลเนสแบบใด",
      body: "แบบประเมินของเราจะเผยอาร์คีไทป์เวลเนสประจำตัวคุณ จากแปดมิติของความเป็นอยู่ที่ดี พร้อมเส้นทางที่ออกแบบมาเพื่อคุณโดยเฉพาะ ทั้งหมดนี้ในเวลาประมาณสองนาที",
      points: [
        "อาร์คีไทป์เวลเนสเฉพาะตัว 1 ใน 16 แบบ",
        "ข้อสังเกตเรื่องความเครียด การนอน และจิตใจ",
        "แพ็กเกจที่คัดมาให้ตรงกับคุณที่สุด",
      ],
      cta: "เริ่มประเมินตัวเอง",
    },
    closing: {
      eyebrow: "การเดินทางของคุณรออยู่",
      title: "ให้เกาะได้ดูแลคุณสักครั้ง",
      body: "ใช้เวลาประมาณสองนาที เพื่อเริ่มต้นเส้นทางเวลเนสที่ออกแบบมาเพื่อคุณคนเดียว",
      cta: "เริ่มประเมินตัวเอง",
      note: "ฟรี · ไม่มีข้อผูกมัด",
    },
  },
  en: {
    hero: {
      eyebrow: "KOH SAMUI · THAILAND",
      title: "Let the island\ntake care of you",
      subline:
        "A wellness journey shaped around you alone, set between a turquoise bay, the hands of herbal healers and a stillness you will find nowhere else.",
      ctaPrimary: "Begin your assessment",
      ctaNote: "Free · takes about 2 minutes",
      ctaSecondary: "Explore all packages",
    },
    trust: {
      eyebrow: "TRUSTED ALONGSIDE",
      title: "The island's most respected houses of care",
    },
    how: {
      eyebrow: "JUST THREE STEPS",
      title: "Your journey begins this simply",
      intro:
        "No long forms, no clinical jargon. Only care that understands you from the very first breath.",
      steps: [
        {
          title: "Play a short assessment",
          body: "Answer 10 gentle questions in about two minutes, so we understand your body, your mind and the rhythm of your days.",
        },
        {
          title: "AI crafts your personal journey",
          body: "Our system weaves the package that fits you best, drawn from spa, cuisine, movement and mind care across the whole island.",
        },
        {
          title: "Experts refine and confirm",
          body: "Our wellness specialists review, fine-tune every detail and confirm your itinerary before you ever set foot on the island.",
        },
      ],
    },
    pillars: {
      eyebrow: "EVERY DIMENSION OF CARE",
      title: "Wellness that holds all of you",
      intro:
        "We bring every house of care on Koh Samui into one place — eight dimensions working in concert for your genuine wellbeing.",
      items: [
        {
          name: "Wellness Stay",
          body: "Seaside resorts and retreats designed for deep, unhurried rest.",
        },
        {
          name: "Spa & Thai Healing",
          body: "Ancient herbal rituals and the gentlest healing touch, passed down through generations.",
        },
        {
          name: "Mind & Mental",
          body: "Mindfulness, breathwork and sessions that return the mind to stillness.",
        },
        {
          name: "Physical",
          body: "Beach yoga, Muay Thai and strength training with seasoned teachers.",
        },
        {
          name: "Healthy Food",
          body: "Plant-based kitchens and healing menus built from the island's freshest produce.",
        },
        {
          name: "Medical & Preventive",
          body: "Health screening and physician consultations for quiet peace of mind.",
        },
        {
          name: "Nature & Culture",
          body: "Forest, sea and living heritage that nourish the spirit.",
        },
        {
          name: "Concierge & Care",
          body: "A personal host who orchestrates every detail throughout your journey.",
        },
      ],
    },
    featured: {
      eyebrow: "CURATED JOURNEYS",
      title: "Three journeys our guests adore",
      intro:
        "From a single day of reset to five days of profound healing, choose the pace that is right for you.",
      cta: "Explore all packages",
    },
    quote: {
      text: "Stillness is not a place you arrive at. It is what you discover once the world grows quiet enough to hear yourself again.",
      attribution: "Our philosophy of care",
    },
    teaser: {
      eyebrow: "DISCOVER YOURSELF",
      title: "What kind of wellness traveller are you?",
      body: "Our assessment reveals your personal Samui Wellness Archetype across eight dimensions of wellbeing, along with a journey shaped for you alone — all in about two minutes.",
      points: [
        "One of 16 personal wellness archetypes",
        "Insights on your stress, sleep and mind",
        "Packages matched precisely to you",
      ],
      cta: "Begin your assessment",
    },
    closing: {
      eyebrow: "YOUR JOURNEY AWAITS",
      title: "Let the island take care of you",
      body: "Take about two minutes to begin a wellness journey designed for you and you alone.",
      cta: "Begin your assessment",
      note: "Free · no commitment",
    },
  },
} satisfies Record<Locale, unknown>;

export default landing;
