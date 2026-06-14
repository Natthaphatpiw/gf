import type { Locale } from "@/lib/types";

const experts = {
  th: {
    card: {
      verified: "ยืนยันโปรไฟล์แล้ว",
      viewProfile: "ดูโปรไฟล์",
      rating: "คะแนน",
      years: "ปีประสบการณ์",
    },
    directory: {
      eyebrow: "ทีมผู้เชี่ยวชาญ",
      title: "เลือกโปรแกรมด้วยความมั่นใจมากขึ้น",
      intro:
        "Goodfill Care ใช้ทีมผู้เชี่ยวชาญหลากหลายสาขาเพื่อช่วยตรวจมุมมองสุขภาพ โภชนาการ การพักฟื้น และความเหมาะสมของแพ็กเกจ ก่อนเปลี่ยนความตั้งใจดูแลตัวเองให้เป็นทริปที่มั่นใจได้จริง",
      cta: "เริ่มประเมินเพื่อให้ระบบจับคู่",
      filterLabel: "เลือกสาขาผู้เชี่ยวชาญ",
      empty: "ยังไม่มีผู้เชี่ยวชาญในสาขานี้",
      heroStats: [
        { value: "2", label: "โปรไฟล์จริงเริ่มต้น" },
        { value: "6", label: "สาขาเวลเนสใน POC" },
        { value: "24h", label: "แนวคิดรีวิวหลังจอง" },
      ],
      filters: {
        all: "ทั้งหมด",
        medical: "การแพทย์",
        nutrition: "โภชนาการ",
        sleep: "การนอน",
        movement: "การเคลื่อนไหว",
        mind: "ดูแลใจ",
        spa: "Thai healing",
      },
      trust: {
        title: "ทำไมผู้เชี่ยวชาญถึงสำคัญกับแพ็กเกจเวลเนส",
        intro:
          "ผู้เข้าพักไม่ได้ซื้อแค่สถานที่ แต่กำลังมอบเวลา ร่างกาย และความคาดหวังให้เรา ทีมผู้เชี่ยวชาญจึงเป็นชั้นความมั่นใจที่ช่วยให้แผนดูแลเหมาะกับบริบทจริงของแต่ละคน",
        items: [
          {
            title: "ตรวจมุมมองสุขภาพก่อนเดินทาง",
            body: "ช่วยแยกสิ่งที่เหมาะ สิ่งที่ควรปรับ และสิ่งที่ควรระวังจากข้อมูลสุขภาพพื้นฐานของผู้เข้าพัก",
          },
          {
            title: "เชื่อมแพ็กเกจกับเป้าหมายจริง",
            body: "ทำให้สปา อาหาร การฝึกกาย และการพักใจไม่ใช่รายการแยกกัน แต่เป็นเส้นทางเดียวที่มีเหตุผลรองรับ",
          },
          {
            title: "เพิ่มความน่าเชื่อถือก่อนตัดสินใจ",
            body: "เมื่อเห็นทีมที่อยู่เบื้องหลัง ผู้ใช้จะเข้าใจว่าแพลตฟอร์มไม่ได้แค่ขายทริป แต่ดูแลการเลือกอย่างจริงจัง",
          },
        ],
      },
      rosterTitle: "รายชื่อผู้เชี่ยวชาญ",
    },
    detail: {
      back: "กลับไปหน้าผู้เชี่ยวชาญ",
      verified: "โปรไฟล์ผู้เชี่ยวชาญที่ตรวจสอบแล้ว",
      consult: "ใช้ผู้เชี่ยวชาญช่วยดูแผน",
      ctaAssessment: "เริ่มประเมิน",
      quickFacts: "ข้อมูลสำคัญ",
      profileSummary: "ภาพรวมโปรไฟล์",
      about: "เกี่ยวกับ",
      suitedFor: "เหมาะกับ",
      expertise: "ความเชี่ยวชาญ",
      credentials: "คุณวุฒิและประสบการณ์",
      timeline: "เส้นทางอาชีพที่เกี่ยวข้อง",
      languages: "ภาษาที่รองรับ",
      serviceModes: "รูปแบบการช่วยดูแล",
      location: "พื้นที่ให้บริการ",
      rating: "คะแนนความพึงพอใจ POC",
      yearsExperience: "ปีประสบการณ์",
      sections: {
        about: "เกี่ยวกับ",
        expertise: "ความเชี่ยวชาญ",
        credentials: "ประสบการณ์",
        fit: "เหมาะกับใคร",
      },
      note:
        "ข้อมูลบางส่วนเป็น mock data สำหรับ POC และจะถูกเติมรายละเอียดจริงเพิ่มเติมในระยะถัดไป",
    },
  },
  en: {
    card: {
      verified: "Verified profile",
      viewProfile: "View profile",
      rating: "rating",
      years: "years of experience",
    },
    directory: {
      eyebrow: "EXPERT TEAM",
      title: "Choose your programme with more confidence",
      intro:
        "Goodfill Care brings together experts across medical care, nutrition, recovery and mind-body wellbeing, so each package can be reviewed through a practical health lens before it becomes your journey.",
      cta: "Start the assessment for expert matching",
      filterLabel: "Choose an expert field",
      empty: "No experts are available in this field yet.",
      heroStats: [
        { value: "2", label: "real starter profiles" },
        { value: "6", label: "wellness fields in this POC" },
        { value: "24h", label: "review concept after booking" },
      ],
      filters: {
        all: "All",
        medical: "Medical",
        nutrition: "Nutrition",
        sleep: "Sleep",
        movement: "Movement",
        mind: "Mind care",
        spa: "Thai healing",
      },
      trust: {
        title: "Why experts matter in a wellness package",
        intro:
          "Guests are not only buying places. They are entrusting us with time, health context and personal expectations. Expert review adds a layer of confidence that makes each journey feel considered.",
        items: [
          {
            title: "Health context before travel",
            body: "Experts help identify what fits, what should be adapted and what deserves caution from a guest's basic health context.",
          },
          {
            title: "One journey, not separate services",
            body: "Spa, food, movement and mind care become one coherent path with a reason behind each recommendation.",
          },
          {
            title: "Trust before purchase",
            body: "When guests see the team behind the platform, they understand Goodfill Care is serious about guiding the choice.",
          },
        ],
      },
      rosterTitle: "Expert roster",
    },
    detail: {
      back: "Back to experts",
      verified: "Verified expert profile",
      consult: "Let an expert review my plan",
      ctaAssessment: "Start assessment",
      quickFacts: "Quick facts",
      profileSummary: "Profile summary",
      about: "About",
      suitedFor: "Best suited for",
      expertise: "Expertise",
      credentials: "Credentials and experience",
      timeline: "Relevant career path",
      languages: "Languages",
      serviceModes: "How this expert can help",
      location: "Service area",
      rating: "POC satisfaction rating",
      yearsExperience: "years of experience",
      sections: {
        about: "About",
        expertise: "Expertise",
        credentials: "Experience",
        fit: "Best fit",
      },
      note:
        "Some details are mock data for the POC and will be replaced with verified information in the next phase.",
    },
  },
} satisfies Record<Locale, unknown>;

export default experts;
