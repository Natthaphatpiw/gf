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
        "เริ่มต้นเส้นทางเวลเนสที่ออกแบบ\nตามจังหวะชีวิตของคุณ ท่ามกลางทะเลสงบ\nการเยียวยาแบบไทย และความสบายใจ\nที่ได้พักบนเกาะสมุย",
      ctaPrimary: "เริ่มประเมินตัวเอง",
      ctaSecondary: "ดูแพ็กเกจทั้งหมด",
      highlights: [
        "ฟรี · ใช้เวลาเพียง 2 นาที",
        "แนะนำแพ็กเกจใน 10 ข้อ",
        "เอไอช่วยจับคู่แพ็กเกจ",
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
      eyebrow: "เกาะสมุย ดีท็อกซ์ และดูแลสุขภาพ",
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
          name: "ผู้ช่วยส่วนตัวและการดูแล",
          body: "ผู้ช่วยส่วนตัวที่คอยประสานทุกรายละเอียดตลอดการเดินทางของคุณ",
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
      title: "มีคนช่วยดูแผนอยู่เบื้องหลัง",
      intro:
        "ผู้เชี่ยวชาญของเราเข้ามาช่วยให้แพ็กเกจที่ออกแบบด้วยเอไอไม่ใช่แค่สวยบนหน้าจอ แต่มีเหตุผลด้านสุขภาพ โภชนาการ การพักฟื้น และการดูแลใจรองรับ",
      cta: "ดูผู้เชี่ยวชาญทั้งหมด",
      previous: "เลื่อนไปผู้เชี่ยวชาญก่อนหน้า",
      next: "เลื่อนไปผู้เชี่ยวชาญถัดไป",
      verified: "ยืนยันโปรไฟล์แล้ว",
      viewProfile: "ดูข้อมูล",
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
      title: "ให้สมุยดูแลคุณสักครั้ง",
      body: "ใช้เวลาประมาณสองนาที เพื่อเริ่มต้นเส้นทางเวลเนสที่ออกแบบมาเพื่อคุณคนเดียว",
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
      eyebrow: "KOH SAMUI DETOX & WELLNESS CARE",
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
      title: "Real expertise behind the plan",
      intro:
        "Our experts help ensure AI-designed packages are not only beautiful on screen, but supported by practical thinking across health, nutrition, recovery and mind care.",
      cta: "View all experts",
      previous: "Scroll to previous experts",
      next: "Scroll to next experts",
      verified: "Verified profile",
      viewProfile: "View details",
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
      title: "Let Samui care for you",
      body: "Take about two minutes to begin a wellness journey designed for you and you alone.",
      cta: "Begin your assessment",
      note: "Free · no commitment",
    },
  },
} satisfies Record<Locale, unknown>;

export default landing;
