import type { Locale } from "@/lib/types";

/* ============================================================
 * Impact dashboard strings — the public, aggregate pre/post
 * outcomes page. Framed around how much the AVERAGE indices
 * change (in points), shown as charts. Bilingual TH / EN.
 * {pct}/{n}/{v} placeholders are filled in by the component.
 * ============================================================ */

const impact = {
  th: {
    eyebrow: "ผลลัพธ์จริงจากแขกของเรา",
    title: "ดัชนีสุขภาวะ\nเปลี่ยนไปเท่าไหร่",
    intro:
      "เรารวมแบบประเมินตัวเองก่อน (T1) และหลังจบโปรแกรม (T2) ของแขกจริงแบบไม่ระบุตัวตน แล้วดูว่าค่าดัชนีสุขภาวะทั้ง 5 ด้าน โดยเฉลี่ยขยับไปมากแค่ไหน",
    loading: "กำลังโหลดผลลัพธ์...",
    unit: "จุด",
    before: "ก่อน",
    after: "หลัง",
    decreased: "ลดลง",
    increased: "เพิ่มขึ้น",
    stats: {
      guests: "แขกที่วัดผลก่อน–หลัง",
      satisfaction: "ความพึงพอใจเฉลี่ย",
      packages: "แพ็กเกจที่มีผลวัด",
    },
    highlights: {
      title: "ดัชนีที่ขยับมากที่สุดโดยเฉลี่ย",
      avg: "เฉลี่ย",
    },
    bar: {
      title: "ค่าดัชนีเฉลี่ย ก่อน–หลังโปรแกรม",
      intro: "ค่าเฉลี่ยของแขกทุกคน รวมทุกแพ็กเกจ (เต็ม 100)",
    },
    line: {
      title: "ภาพรวมสุขภาวะยกระดับขึ้นทุกด้าน",
      intro: "ปรับให้ทุกด้านเป็นทิศทาง “ยิ่งสูงยิ่งดี” เส้นหลังจึงอยู่เหนือเส้นก่อนเสมอ",
      axis: "ดัชนีสุขภาวะ (ยิ่งสูงยิ่งดี)",
    },
    donut: {
      title: "ความพึงพอใจของแขก",
      intro: "คะแนนที่แขกให้หลังจบโปรแกรม (เต็ม 5 ดาว)",
      stars: "{n} ดาว",
      centerLabel: "เฉลี่ย",
      satisfied: "ให้ 4–5 ดาว",
    },
    heat: {
      title: "แต่ละแพ็กเกจเก่งด้านไหน",
      intro:
        "แถบที่เข้มที่สุดในแต่ละแถวคือจุดเด่นของแพ็กเกจนั้น — ตัวเลขคือค่าดัชนีที่ดีขึ้นเฉลี่ย (จุด) แตะชื่อเพื่อดูแพ็กเกจ",
      packageCol: "แพ็กเกจ",
      filterAll: "ทั้งหมด",
      legendLow: "เปลี่ยนน้อย",
      legendHigh: "เปลี่ยนมาก",
      best: "จุดเด่น",
    },
    dialShort: {
      stress: "ความเครียด",
      migraine: "ไมเกรน",
      sleep: "การนอน",
      mind: "จิตใจ",
      energy: "พลังงาน",
    },
    method: {
      title: "ที่มาของข้อมูล",
      body: "ตัวเลขทั้งหมดมาจากแบบประเมินสุขภาวะที่แขกประเมินตนเองก่อนและหลังโปรแกรม โดยใช้มาตรวัดเดียวกันทุกครั้ง และนำมาเฉลี่ยแบบไม่ระบุตัวตน เป็นค่าเฉลี่ยของกลุ่ม ไม่ใช่การรับประกันผลลัพธ์รายบุคคล",
      disclaimer:
        "โปรแกรมของเราเป็นการดูแลเชิงไลฟ์สไตล์เพื่อการพักฟื้น ไม่ใช่การวินิจฉัยหรือรักษาทางการแพทย์",
      updated: "อัปเดตล่าสุด",
    },
    cta: {
      title: "อยากรู้ว่าแพ็กเกจไหนเหมาะกับคุณที่สุด?",
      body: "ใช้เวลาเพียง 2 นาที ให้ระบบช่วยจับคู่แพ็กเกจที่ตรงกับคุณ",
      button: "เริ่มประเมินตัวเอง",
    },
  },
  en: {
    eyebrow: "Real outcomes from our guests",
    title: "How far the\nindices move",
    intro:
      "We pool real guests' own before (T1) and after (T2) self check-ins, anonymously, and look at how much the five wellness indices shift on average.",
    loading: "Loading outcomes…",
    unit: "pts",
    before: "Before",
    after: "After",
    decreased: "down",
    increased: "up",
    stats: {
      guests: "guests measured before & after",
      satisfaction: "average satisfaction",
      packages: "packages with outcomes",
    },
    highlights: {
      title: "The biggest average shifts",
      avg: "on average",
    },
    bar: {
      title: "Average index, before & after",
      intro: "Averaged across every guest, all packages combined (out of 100)",
    },
    line: {
      title: "The whole profile lifts on every dial",
      intro: "Normalised so higher is better everywhere — the after-line sits above before",
      axis: "Wellness index (higher is better)",
    },
    donut: {
      title: "How guests rated us",
      intro: "Ratings from guests after they finished a program (out of 5 stars)",
      stars: "{n} stars",
      centerLabel: "average",
      satisfied: "rated 4–5 stars",
    },
    heat: {
      title: "What each package is best at",
      intro:
        "The darkest cell in each row is that package's strength — numbers are the average index gain (points). Tap a name to view the package.",
      packageCol: "Package",
      filterAll: "All",
      legendLow: "smaller change",
      legendHigh: "bigger change",
      best: "Strength",
    },
    dialShort: {
      stress: "Stress",
      migraine: "Migraine",
      sleep: "Sleep",
      mind: "Mind",
      energy: "Energy",
    },
    method: {
      title: "How we measure",
      body: "All figures come from a self-reported wellness check-in taken before and after each program, on the same fixed instrument every time, then averaged anonymously. These are group averages, not a guarantee of individual results.",
      disclaimer:
        "Our programs are lifestyle wellness care for restoration — not medical diagnosis or treatment.",
      updated: "Last updated",
    },
    cta: {
      title: "Want to know which package fits you best?",
      body: "Take 2 minutes and let us match you with the right package.",
      button: "Take the assessment",
    },
  },
} satisfies Record<Locale, unknown>;

export default impact;
