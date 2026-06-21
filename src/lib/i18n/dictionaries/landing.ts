import type { Locale } from "@/lib/types";

/* ============================================================
 * Landing page strings — Goodfill Care, Samui Wellness.
 * Premium hospitality tone. Bilingual TH / EN.
 * ============================================================ */

const landing = {
  th: {
    hero: {
      eyebrow: "เกาะสมุย · ประเทศไทย",
      title: "ความสุข\nเริ่มต้นได้ที่นี่",
      subline:
        "เริ่มต้นเส้นทางเวลเนสตามจังหวะชีวิตของคุณ\nท่ามกลางทะเลสงบ การเยียวยาแบบไทย และความสบายใจบนเกาะสมุย",
      ctaPrimary: "เริ่มประเมินตัวเอง",
      ctaSecondary: "ดูแพ็กเกจทั้งหมด",
      highlights: [
        "ฟรี · ใช้เวลาเพียง 2 นาที",
        "แนะนำแพ็กเกจใน 10 ข้อ",
        "คัดแพ็กเกจให้ตรงใจคุณ",
        "ผู้เชี่ยวชาญช่วยดูแลแผน",
      ],
    },
    trust: {
      eyebrow: "ได้รับความไว้วางใจจาก",
      title: "บ้านแห่งการดูแลที่ดีที่สุดของเกาะ",
      intro:
        "รีสอร์ต รีทรีต และศูนย์เวลเนสที่สะท้อนมาตรฐานการดูแลของเกาะ",
      listLabel: "รีสอร์ต รีทรีต และศูนย์เวลเนสบนเกาะสมุย",
      partners: [
        "Kamalaya",
        "Six Senses Samui",
        "Banyan Tree Samui",
        "Four Seasons",
        "Absolute Sanctuary",
        "Samahita Retreat",
        "Vikasa",
        "Bangkok Hospital Samui",
      ],
    },
    how: {
      eyebrow: "เพียงสามขั้นตอน",
      title: "เส้นทางของคุณ เริ่มต้นง่ายเพียงนี้",
      intro:
        "ไม่มีแบบฟอร์มยืดยาว ไม่มีศัพท์ที่ชวนงง\nมีแค่การดูแลที่เข้าใจคุณตั้งแต่เริ่มต้น",
      steps: [
        {
          title: "เริ่มด้วยแบบประเมินสั้น ๆ",
          body: "ตอบคำถามเบา ๆ 10 ข้อ\nใช้เวลาแค่สองนาที — เพื่อให้เรารู้จักคุณมากขึ้น",
        },
        {
          title: "เราคัดแพ็กเกจให้ตรงใจคุณ",
          body: "จากสปา อาหาร การฝึกกาย และการดูแลใจ\nเราคัดแพ็กเกจที่เหมาะกับคุณ",
        },
        {
          title: "ผู้เชี่ยวชาญช่วยตรวจทานให้อุ่นใจ",
          body: "ทีมผู้เชี่ยวชาญช่วยพิจารณา\nปรับรายละเอียดก่อนเริ่มเดินทาง",
        },
      ],
    },
    pillars: {
      eyebrow: "เกาะสมุย ดีท็อกซ์ และดูแลสุขภาพ",
      title: "เวลเนสที่โอบรับคุณทั้งกายและใจ",
      intro:
        "เราเชื่อมโยงบ้านแห่งการดูแลของเกาะสมุยไว้ในที่เดียว\nแปดมิติที่ดูแลคุณทั้งกายและใจ",
      items: [
        {
          name: "ที่พักเพื่อเวลเนส",
          body: "รีสอร์ตริมทะเล\nออกแบบมาเพื่อให้คุณพักจริง ๆ",
        },
        {
          name: "สปาและการนวดไทย",
          body: "นวดไทยและสมุนไพรท้องถิ่น\nสัมผัสอ่อนโยนเหมือนถูกดูแล",
        },
        {
          name: "จิตใจและสมาธิ",
          body: "สติ ลมหายใจ และเซสชัน\nที่ช่วยให้ใจสงบลง",
        },
        {
          name: "การฝึกกายและฟิตเนส",
          body: "โยคะริมหาด มวยไทย\nฝึกกายกับครูที่เข้าใจจังหวะ",
        },
        {
          name: "อาหารเพื่อสุขภาพ",
          body: "ครัวสุขภาพและเมนูบำบัด\nจากวัตถุดิบสดของเกาะ",
        },
        {
          name: "การแพทย์เชิงป้องกัน",
          body: "ตรวจสุขภาพและปรึกษาแพทย์\nเพื่อให้คุณเริ่มต้นอย่างอุ่นใจ",
        },
        {
          name: "ธรรมชาติและวัฒนธรรม",
          body: "ทะเล ป่าเขา และวัฒนธรรม\nที่เติมความสงบให้หัวใจ",
        },
        {
          name: "ผู้ช่วยส่วนตัว",
          body: "มีคนช่วยประสานทุกรายละเอียด\nตลอดการเดินทางของคุณ",
        },
      ],
    },
    wellnessTypes: {
      title: "ประเภทเวลเนส",
      items: [
        "สปาและการนวดไทย",
        "ฟื้นฟูการนอน",
        "อาหารเพื่อสุขภาพ",
        "ฟิตเนส",
        "ตรวจสุขภาพ",
        "รีทรีตธรรมชาติ",
      ],
    },
    topBrands: {
      title: "แบรนด์เด่น",
      intro:
        "พาร์ตเนอร์ที่เราคัดเข้ามาเพื่อช่วยออกแบบเส้นทางเวลเนสบนเกาะสมุยให้เป็นรูปธรรมมากขึ้น",
      open: "ดูรายละเอียดพาร์ตเนอร์",
      previous: "เลื่อนไปแบรนด์ก่อนหน้า",
      next: "เลื่อนไปแบรนด์ถัดไป",
    },
    careBridge: {
      title: "จากพาร์ตเนอร์สู่แผนดูแลที่มั่นใจขึ้น",
      body: "เราไม่ได้แค่รวมสถานที่ดี ๆ บนเกาะ แต่ให้ผู้เชี่ยวชาญช่วยมองภาพรวม เพื่อให้ทุกบริการที่เลือกมาเข้ากับร่างกาย เป้าหมาย และจังหวะชีวิตของคุณจริง ๆ",
      points: [
        "พาร์ตเนอร์คือประสบการณ์จริงบนเกาะ",
        "ผู้เชี่ยวชาญคือชั้นความมั่นใจ",
        "เอไอช่วยจับคู่ให้เร็วขึ้น",
      ],
    },
    expertShowcase: {
      eyebrow: "ทีมผู้เชี่ยวชาญ",
      title: "ช่วยดูแลแผนของคุณอยู่เบื้องหลัง",
      intro:
        "ทีมแพทย์และนักโภชนาการ\nช่วยตรวจทานแผนอย่างใส่ใจ",
      cta: "ดูผู้เชี่ยวชาญทั้งหมด",
      previous: "เลื่อนไปผู้เชี่ยวชาญก่อนหน้า",
      next: "เลื่อนไปผู้เชี่ยวชาญถัดไป",
      verified: "ยืนยันโปรไฟล์แล้ว",
      viewProfile: "ทำความรู้จัก",
      rating: "คะแนน",
      years: "ปีประสบการณ์",
      specialties: "ความเชี่ยวชาญ",
      credentials: "คุณวุฒิและประสบการณ์",
      close: "ปิด",
    },
    featured: {
      eyebrow: "เส้นทางคัดสรร",
      title: "สามเส้นทางที่ผู้คนหลงรัก",
      intro:
        "จากหนึ่งวันแห่งการรีเซ็ต\nสู่ห้าวันแห่งการเยียวยาที่ลึกซึ้ง",
      cta: "ดูแพ็กเกจทั้งหมด",
    },
    quote: {
      text: "ทะเลสงบ ลมอ่อน และคนที่เข้าใจจังหวะของคุณ\nนี่คือการเดินทางที่คุณไม่ต้องไปคนเดียว",
      attribution: "เกาะสมุยรอคุณอยู่",
    },
    teaser: {
      eyebrow: "ค้นพบตัวตนของคุณ",
      title: "คุณคือนักเดินทางเวลเนสแบบใด",
      body:
        "แบบประเมินของเราจะเผยอาร์คีไทป์เวลเนสของคุณ\nจากแปดมิติของความเป็นอยู่ที่ดี — ใช้เวลาแค่สองนาที",
      points: [
        "อาร์คีไทป์เวลเนสเฉพาะตัว 1 ใน 16 แบบ",
        "ข้อสังเกตเรื่องความเครียด การนอน และจิตใจ",
        "แพ็กเกจที่คัดมาให้ตรงกับคุณที่สุด",
      ],
      cta: "เริ่มประเมินตัวเอง",
    },
    closing: {
      eyebrow: "การเดินทางของคุณรออยู่",
      title: "ให้สมุยดูแลคุณสักครั้ง",
      body: "ใช้เวลาแค่สองนาที\nเพื่อเริ่มต้นเส้นทางที่ออกแบบมาเพื่อคุณ",
      cta: "เริ่มประเมินตัวเอง",
      note: "ฟรี · ไม่มีข้อผูกมัด",
    },
  },
  en: {
    hero: {
      eyebrow: "KOH SAMUI · THAILAND",
      title: "Happiness\nbegins here",
      subline:
        "Begin a wellness journey shaped around your rhythm, with quiet sea air, Thai healing traditions and the ease of being cared for on Koh Samui.",
      ctaPrimary: "Begin your assessment",
      ctaSecondary: "Explore all packages",
      highlights: [
        "Free · takes about 2 minutes",
        "Package guidance in 10 scenes",
        "AI-assisted matching",
        "Expert-reviewed care plans",
      ],
    },
    trust: {
      eyebrow: "SAMUI HOTELS & WELLNESS PLACES",
      title: "Curated hotels and care places on the island",
      intro:
        "Hotel, resort and wellness place names within the Samui care context.",
      listLabel: "Samui hotel, resort and wellness place names",
      partners: [
        "Kamalaya",
        "Six Senses Samui",
        "Banyan Tree Samui",
        "Four Seasons",
        "Absolute Sanctuary",
        "Samahita Retreat",
        "Vikasa",
        "Bangkok Hospital Samui",
      ],
    },
    how: {
      eyebrow: "JUST THREE STEPS",
      title: "Your journey begins this simply",
      intro:
        "No long forms, no clinical jargon. Only care that understands you from the very first breath.",
      steps: [
        {
          title: "Begin with a gentle assessment",
          body: "Answer 10 unhurried questions in about two minutes — so we can understand your body, mind and the rhythm of your days.",
        },
        {
          title: "We curate what fits you",
          body: "From spa, cuisine, movement and mind care across Koh Samui — we bring forward the packages that suit you best.",
        },
        {
          title: "Experts review with care",
          body: "Our specialists help review, refine every detail and confirm each step before your journey begins.",
        },
      ],
    },
    pillars: {
      eyebrow: "KOH SAMUI DETOX & WELLNESS CARE",
      title: "Wellness that holds all of you",
      intro:
        "We bring every house of care on Koh Samui into one place — eight dimensions working in concert for your genuine wellbeing.",
      items: [
        {
          name: "Wellness Stay",
          body: "Seaside resorts — made for rest that feels truly deep.",
        },
        {
          name: "Spa & Thai Healing",
          body: "Local herbs and Thai massage — a touch that feels cared for.",
        },
        {
          name: "Mind & Mental",
          body: "Mindfulness, breathwork and sessions that gently settle the mind.",
        },
        {
          name: "Physical",
          body: "Beach yoga, Muay Thai — movement with teachers who read your pace.",
        },
        {
          name: "Healthy Food",
          body: "Healing kitchens and menus from the island's freshest produce.",
        },
        {
          name: "Medical & Preventive",
          body: "Health screening and physician guidance — so you begin with confidence.",
        },
        {
          name: "Nature & Culture",
          body: "Sea, forest and local heritage — quiet nourishment for the heart.",
        },
        {
          name: "Concierge & Care",
          body: "Someone to coordinate every detail — throughout your journey.",
        },
      ],
    },
    wellnessTypes: {
      title: "Wellness Types",
      items: [
        "Spa & Thai Healing",
        "Sleep Recovery",
        "Healthy Food",
        "Fitness",
        "Medical Checkup",
        "Nature Retreat",
      ],
    },
    topBrands: {
      title: "Top Brands",
      intro:
        "Partners we are bringing into Goodfill Care so each Koh Samui wellness journey can become more concrete and locally grounded.",
      open: "View partner details",
      previous: "Scroll to previous brands",
      next: "Scroll to next brands",
    },
    careBridge: {
      title: "From trusted partners to a more confident care plan",
      body: "We do more than gather beautiful places on the island. Expert review helps each selected service fit your body, goals and real-life rhythm.",
      points: [
        "Partners create the island experience",
        "Experts add a layer of confidence",
        "AI makes matching faster",
      ],
    },
    expertShowcase: {
      eyebrow: "EXPERT TEAM",
      title: "Real people caring for you behind the scenes",
      intro:
        "Our physicians and dietitians review your plan with care — so you can begin with confidence.",
      cta: "View all experts",
      previous: "Scroll to previous experts",
      next: "Scroll to next experts",
      verified: "Verified profile",
      viewProfile: "Get to know them",
      rating: "rating",
      years: "years of experience",
      specialties: "Specialties",
      credentials: "Credentials and experience",
      close: "Close",
    },
    featured: {
      eyebrow: "CURATED JOURNEYS",
      title: "Three journeys our guests adore",
      intro:
        "From a single day of reset to five days of profound healing, choose the pace that is right for you.",
      cta: "Explore all packages",
    },
    quote: {
      text: "Quiet sea, gentle air and people who understand your rhythm.\nThis is a journey you do not have to take alone.",
      attribution: "Koh Samui is waiting for you",
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
      title: "Let Samui care for you",
      body: "Take about two minutes to begin a wellness journey designed for you and you alone.",
      cta: "Begin your assessment",
      note: "Free · no commitment",
    },
  },
} satisfies Record<Locale, unknown>;

export default landing;
