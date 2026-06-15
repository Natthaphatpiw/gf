import type { Locale } from "@/lib/types";

/* ============================================================
 * Outcome / Program Journey strings — the consolidated pre/post
 * page, the shareable before-after card, and the 30-day plan.
 * ============================================================ */

const outcome = {
  th: {
    journey: {
      loading: "กำลังโหลดเส้นทางของคุณ...",
      notFound: "ไม่พบเส้นทางของการจองนี้",
      back: "กลับไปหน้าการจอง",
      eyebrow: "เส้นทางสุขภาพของคุณ",
      title: "ก่อน · หลัง · และ 30 วันถัดไป",
      intro:
        "นี่คือการเปลี่ยนแปลงที่จับต้องได้ของคุณ ตั้งแต่วันแรกจนถึงการติดตามผล 30 วัน",
      headlineTitle: "การเปลี่ยนแปลงที่ชัดที่สุด",
      headlineSteady: "ค่าของคุณทรงตัวในทิศทางที่ดี",
      points: "จุด",
      eased: "ลดลง",
      rose: "เพิ่มขึ้น",
      arcTitle: "เข็มทิศ 5 ด้าน ตลอดเส้นทาง",
      baseline: "ก่อนเริ่ม",
      afterProgram: "หลังจบ",
      day30: "30 วัน",
      stages: {
        assessment: "ทำแบบประเมิน",
        baseline: "เช็คอินก่อนเริ่ม",
        program: "เข้าร่วมโปรแกรม",
        after: "เช็คอินหลังจบ",
        followup: "ติดตามผล 30 วัน",
      },
      stageDone: "เสร็จแล้ว",
      stagePending: "รอดำเนินการ",
      pendingTitle: "เส้นทางของคุณกำลังเริ่มต้น",
      pendingBody:
        "เมื่อจบโปรแกรมและเช็คอินอีกครั้ง คุณจะเห็นการเปลี่ยนแปลงก่อน–หลังแบบจับต้องได้ที่นี่",
      takeT2: "เช็คอินหลังจบโปรแกรม",
      takeT3: "เช็คอินติดตามผล 30 วัน",
      t3LockedNote:
        "แนะนำให้เช็คอินติดตามผลเมื่อครบราว 30 วันหลังจบโปรแกรม เพื่อดูว่าผลยังอยู่กับคุณไหม",
      t3Ready: "ถึงเวลาติดตามผล 30 วันแล้ว",
      disclaimer:
        "ค่าทั้งหมดสะท้อน “ความรู้สึก” ของคุณเพื่อการดูแลสุขภาพ ไม่ใช่การวินิจฉัยทางการแพทย์",
    },
    share: {
      title: "แชร์ผลลัพธ์ของคุณ",
      subtitle: "บันทึกการ์ดก่อน–หลัง แล้วแบ่งปันให้กำลังใจคนอื่น",
      download: "บันทึกเป็นรูปภาพ",
      share: "แชร์",
      copyLink: "คัดลอกลิงก์",
      copied: "คัดลอกแล้ว",
      cardEyebrow: "เส้นทางเวลเนสของฉัน",
      cardBefore: "ก่อน",
      cardAfter: "หลัง",
      cardWith: "กับ",
    },
    plan: {
      title: "แผนดูแลตัวเอง 30 วัน",
      subtitle: "พาความรู้สึกดี ๆ จากเกาะกลับไปต่อที่บ้าน ทำทีละนิดทุกวัน",
      focusTitle: "โฟกัสพิเศษช่วงนี้",
      dailyTitle: "นิสัยประจำวัน",
      pillars: { food: "อาหาร", air: "อากาศ", mind: "อารมณ์" },
      weeksTitle: "เส้นทาง 4 สัปดาห์",
      progressLabel: "ทำวันนี้แล้ว",
      ofTotal: "จาก",
      allDone: "ครบทุกข้อแล้ววันนี้ เยี่ยมมาก",
      resetNote: "เช็กลิสต์รีเซ็ตได้ทุกวัน",
    },
    reEngage: {
      title: "อยากให้ผลลัพธ์อยู่กับคุณนานขึ้น?",
      subtitle: "เลือกก้าวต่อไปที่ออกแบบมาเพื่อคุณ",
      cta: "ดูแพ็กเกจต่อเนื่อง",
    },
  },
  en: {
    journey: {
      loading: "Loading your journey...",
      notFound: "We couldn't find a journey for this booking",
      back: "Back to my booking",
      eyebrow: "Your wellness journey",
      title: "Before · After · and the next 30 days",
      intro:
        "This is your change made tangible — from day one through to the 30-day follow-up.",
      headlineTitle: "Your clearest change",
      headlineSteady: "Your readings held steady in a good direction",
      points: "pts",
      eased: "eased by",
      rose: "rose by",
      arcTitle: "The five dials across your journey",
      baseline: "Before",
      afterProgram: "After",
      day30: "30 days",
      stages: {
        assessment: "Took the assessment",
        baseline: "Pre-program check-in",
        program: "Joined the program",
        after: "Post-program check-in",
        followup: "30-day follow-up",
      },
      stageDone: "Done",
      stagePending: "Pending",
      pendingTitle: "Your journey is just beginning",
      pendingBody:
        "Once the program ends and you check in again, you'll see your tangible before-and-after change right here.",
      takeT2: "Check in after the program",
      takeT3: "Take the 30-day follow-up",
      t3LockedNote:
        "Best taken around 30 days after the program ends — to see if the change held.",
      t3Ready: "It's time for your 30-day follow-up",
      disclaimer:
        "All readings reflect how you feel, for wellbeing care — they are not a medical diagnosis.",
    },
    share: {
      title: "Share your results",
      subtitle: "Save your before-after card and pass the encouragement on.",
      download: "Save as image",
      share: "Share",
      copyLink: "Copy link",
      copied: "Copied",
      cardEyebrow: "My wellness journey",
      cardBefore: "Before",
      cardAfter: "After",
      cardWith: "with",
    },
    plan: {
      title: "Your 30-day self-care plan",
      subtitle: "Carry the island feeling home — a little, every day.",
      focusTitle: "Special focus right now",
      dailyTitle: "Daily habits",
      pillars: { food: "Food", air: "Air", mind: "Mind" },
      weeksTitle: "Your 4-week path",
      progressLabel: "Done today",
      ofTotal: "of",
      allDone: "All done for today — wonderful.",
      resetNote: "The checklist resets each day",
    },
    reEngage: {
      title: "Want the results to last even longer?",
      subtitle: "Pick a next step designed around you.",
      cta: "View the follow-up package",
    },
  },
} satisfies Record<Locale, unknown>;

export default outcome;
