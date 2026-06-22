import type { Locale } from "@/lib/types";

/* ============================================================
 * Impact dashboard strings — the public, aggregate pre/post
 * outcomes page. Bilingual TH / EN. Templates use {pct}/{n}
 * placeholders the component fills in.
 * ============================================================ */

const impact = {
  th: {
    eyebrow: "ผลลัพธ์จริงจากแขกของเรา",
    title: "สิ่งที่เปลี่ยนไป\nหลังการดูแล",
    intro:
      "ทุกตัวเลขด้านล่างมาจากการประเมินตัวเองก่อนเริ่ม (T1) และหลังจบโปรแกรม (T2) ของแขกจริง นำมารวมแบบไม่ระบุตัวตน เพื่อให้คุณเห็นว่าโปรแกรมของเราสร้างความเปลี่ยนแปลงได้จริงแค่ไหน",
    loading: "กำลังโหลดผลลัพธ์...",
    stats: {
      guests: "แขกที่วัดผลก่อน–หลัง",
      satisfaction: "ความพึงพอใจเฉลี่ย",
      packages: "แพ็กเกจที่มีผลวัด",
    },
    highlights: {
      title: "สิ่งที่แขกของเราบอกเล่า",
      lessStress: "รู้สึกเครียดน้อยลง",
      betterSleep: "นอนหลับได้ดีขึ้น",
      moreEnergy: "มีพลังงานมากขึ้น",
      ofGuests: "ของแขก",
    },
    dials: {
      title: "ภาพรวมการเปลี่ยนแปลงทั้ง 5 ด้าน",
      intro: "ค่าเฉลี่ยก่อนและหลังของแขกทุกคน รวมทุกแพ็กเกจ",
      before: "ก่อน",
      after: "หลัง",
      reduced: "ลดลง",
      improved: "ดีขึ้น",
      guestsImproved: "{pct}% ของแขกดีขึ้นอย่างชัดเจน",
    },
    packages: {
      title: "ผลลัพธ์รายแพ็กเกจ",
      intro: "เรียงตามด้านที่เปลี่ยนแปลงมากที่สุดของแต่ละแพ็กเกจ",
      filterAll: "ทั้งหมด",
      participants: "แขก {n} คน",
      rating: "ความพึงพอใจ",
      topChange: "เปลี่ยนแปลงเด่น",
      view: "ดูแพ็กเกจนี้",
      empty: "ยังไม่มีผลลัพธ์ในหมวดนี้",
    },
    method: {
      title: "ที่มาของข้อมูล",
      body: "ตัวเลขทั้งหมดมาจากแบบประเมินสุขภาวะที่แขกประเมินตนเองก่อนและหลังโปรแกรม โดยใช้มาตรวัดเดียวกันทุกครั้ง และนำมารวมแบบไม่ระบุตัวตน ตัวเลขเป็นค่าเฉลี่ยของกลุ่ม ไม่ใช่การรับประกันผลลัพธ์รายบุคคล",
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
    title: "What changes\nafter the care",
    intro:
      "Every number below comes from real guests' own before (T1) and after (T2) wellness check-ins, pooled anonymously — so you can see how much our programs actually move the needle.",
    loading: "Loading outcomes…",
    stats: {
      guests: "guests measured before & after",
      satisfaction: "average satisfaction",
      packages: "packages with outcomes",
    },
    highlights: {
      title: "What our guests tell us",
      lessStress: "felt less stressed",
      betterSleep: "slept better",
      moreEnergy: "had more energy",
      ofGuests: "of guests",
    },
    dials: {
      title: "The five dials, before and after",
      intro: "Average start and finish across every guest, all packages combined",
      before: "Before",
      after: "After",
      reduced: "lower",
      improved: "better",
      guestsImproved: "{pct}% of guests clearly improved",
    },
    packages: {
      title: "Outcomes by package",
      intro: "Sorted by each package's biggest shift",
      filterAll: "All",
      participants: "{n} guests",
      rating: "satisfaction",
      topChange: "Biggest change",
      view: "View this package",
      empty: "No outcomes in this group yet",
    },
    method: {
      title: "How we measure",
      body: "All figures come from a self-reported wellness check-in taken before and after each program, on the same fixed instrument every time, then pooled anonymously. Numbers are group averages, not a guarantee of individual results.",
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
