import type { Locale } from "@/lib/types";

/* ============================================================
 * Package discovery namespace — family gate, AI curation,
 * package detail, favourites.
 * ============================================================ */

const packages = {
  th: {
    /* ---- /packages page shell ---- */
    page: {
      eyebrow: "เส้นทางเฉพาะคุณ",
      title: "แพ็กเกจที่ออกแบบเพื่อคุณ",
      intro:
        "เราคัดสรรประสบการณ์เวลเนสบนเกาะสมุยให้สอดคล้องกับผลประเมินและเป้าหมายของคุณ ทุกเส้นทางพร้อมปรับให้เหมาะกับจังหวะชีวิตของคุณ",
    },

    /* ---- Stage A: family gate ---- */
    family: {
      eyebrow: "เดินทางเป็นครอบครัว",
      title: "สนใจแพ็กเกจครอบครัวไหม",
      body:
        "หากเดินทางพร้อมคนที่คุณรัก เราจะออกแบบเส้นทางให้สมดุลกับทุกคนในกลุ่ม โดยอ้างอิงผลประเมินของแต่ละท่าน",
      yes: "ใช่ เดินทางเป็นครอบครัว",
      no: "ไม่ เดินทางคนเดียว",
      countLabel: "จำนวนสมาชิกเพิ่มเติม",
      memberTitle: "ผลประเมินของสมาชิก",
      memberHint: "กรอกรหัสผลประเมิน (SW-XXXXXX) ของสมาชิกแต่ละท่าน",
      memberLabel: "สมาชิกคนที่",
      placeholder: "SW-XXXXXX",
      add: "เพิ่มสมาชิก",
      remove: "ลบ",
      checking: "กำลังตรวจสอบ...",
      invalid: "ไม่พบรหัสนี้ กรุณาตรวจสอบอีกครั้ง",
      optional: "เว้นว่างได้หากยังไม่มีรหัส",
      continue: "ดำเนินการต่อ",
      max: "เพิ่มได้สูงสุด 6 ท่าน",
    },

    /* ---- Stage B: curating + results ---- */
    curate: {
      loadingTitle: "กำลังออกแบบแพ็กเกจของคุณ",
      loadingBody:
        "ผู้เชี่ยวชาญด้านเวลเนสของเรากำลังจับคู่เส้นทางที่เหมาะกับคุณที่สุด",
      resultsEyebrow: "คัดสรรเพื่อคุณ",
      resultsTitle: "เก้าเส้นทางที่เหมาะกับคุณ",
      resultsBody:
        "สามตัวเลือกในแต่ละระดับ คัดจากผลประเมินและเป้าหมายของคุณ พร้อมหนึ่งตัวที่ AI แนะนำเป็นพิเศษในแต่ละระดับ",
      again: "ประมวลผลใหม่",
      tierBasic: "ระดับเบสิก",
      tierPremium: "ระดับพรีเมียม",
      tierDeluxe: "ระดับดีลักซ์",
      heroBadge: "AI แนะนำพิเศษ",
      discountBadge: "ส่วนลด {n}%",
      inside: "ในแพ็กเกจนี้",
      more: "+{n} อย่าง",
      perPerson: "/ ต่อท่าน",
      error:
        "ขออภัย ไม่สามารถออกแบบแพ็กเกจได้ในขณะนี้ คุณยังสำรวจแพ็กเกจทั้งหมดได้ด้านล่าง",
    },

    /* ---- Invitation banner (no profile yet) ---- */
    invite: {
      eyebrow: "เริ่มต้นที่นี่",
      title: "ทำแบบประเมินเพื่อรับคำแนะนำเฉพาะคุณ",
      body:
        "ใช้เวลาเพียงไม่กี่นาที เพื่อให้เราคัดสรรเส้นทางเวลเนสที่ใช่สำหรับคุณโดยเฉพาะ",
      cta: "เริ่มทำแบบประเมิน",
    },

    /* ---- Stage C: explore all ---- */
    explore: {
      eyebrow: "ทุกเส้นทาง",
      title: "สำรวจแพ็กเกจทั้งหมด",
      all: "ทั้งหมด",
      empty: "ไม่พบแพ็กเกจในระดับนี้",
    },

    /* ---- /packages/[id] detail ---- */
    detail: {
      back: "ย้อนกลับ",
      highlights: "ไฮไลต์ของเส้นทางนี้",
      partners: "พันธมิตรที่ร่วมดูแลคุณ",
      itinerary: "กำหนดการแต่ละวัน",
      dayLabel: "วันที่",
      nutrition: "เมนูอาหารและช่วงโภชนาการ",
      nutritionIntro:
        "ตัวเลขด้านล่างเป็นช่วงประมาณการสำหรับการวางแผนกับร้านอาหารจริง ไม่ใช่ค่าตายตัว เพราะวัตถุดิบและการปรุงแต่ละวันอาจเปลี่ยนได้",
      fromPartner: "จาก",
      portion: "ปริมาณที่วางแผน",
      calories: "พลังงาน",
      protein: "โปรตีน",
      carbs: "คาร์โบไฮเดรต",
      fiber: "ใยอาหาร",
      sodium: "โซเดียม",
      wellnessNote: "ผลต่อสุขภาวะ",
      careDetails: "รายละเอียดการดูแลเพิ่มเติม",
      madeForTitle: "เหมาะสำหรับ",
      consultTitle: "ปรึกษานักโภชนาการและแพทย์ก่อนจอง",
      consultBody:
        "หลังจอง ทีมแพทย์และนักโภชนาการจะช่วยปรับมื้อ สถานที่ และที่พักให้เหมาะกับคุณก่อนยืนยัน",
      consultOn: "เปิดใช้งานแล้ว",
      consultOff: "ยังไม่ได้เปิด — แต่เปิดได้เมื่ออยากให้ผู้เชี่ยวชาญช่วยดู",
      notFoundTitle: "ไม่พบแพ็กเกจที่คุณค้นหา",
      notFoundBody: "แพ็กเกจนี้อาจถูกย้ายหรือไม่มีอยู่แล้ว",
      notFoundCta: "กลับไปดูแพ็กเกจทั้งหมด",
    },

    /* ---- /favorites ---- */
    favorites: {
      eyebrow: "รายการของคุณ",
      title: "แพ็กเกจที่ถูกใจ",
      intro: "เส้นทางที่คุณบันทึกไว้เพื่อกลับมาพิจารณาอีกครั้ง",
      emptyTitle: "ยังไม่มีแพ็กเกจที่ถูกใจ",
      emptyBody:
        "แตะรูปหัวใจบนแพ็กเกจที่คุณสนใจ เพื่อบันทึกไว้ดูภายหลัง",
      emptyCta: "สำรวจแพ็กเกจ",
    },
  },

  en: {
    page: {
      eyebrow: "Crafted for you",
      title: "Journeys shaped around you",
      intro:
        "We curate Koh Samui's finest wellness experiences to align with your assessment and your goals — every journey ready to adapt to the rhythm of your life.",
    },

    family: {
      eyebrow: "Travelling together",
      title: "Travelling as a family?",
      body:
        "If you are arriving with the people you love, we will balance the journey across the whole group, drawing on each guest's own assessment.",
      yes: "Yes, as a family",
      no: "No, just me",
      countLabel: "Additional members",
      memberTitle: "Member assessments",
      memberHint: "Enter each member's assessment code (SW-XXXXXX).",
      memberLabel: "Member",
      placeholder: "SW-XXXXXX",
      add: "Add member",
      remove: "Remove",
      checking: "Checking...",
      invalid: "We could not find this code. Please check it again.",
      optional: "Leave blank if you do not have a code yet.",
      continue: "Continue",
      max: "Up to six members.",
    },

    curate: {
      loadingTitle: "Curating your journeys",
      loadingBody:
        "Our wellness curators are matching the journeys that suit you best.",
      resultsEyebrow: "Curated for you",
      resultsTitle: "Nine journeys made for you",
      resultsBody:
        "Three picks at each level from your assessment and goals — with one AI top pick highlighted per level.",
      again: "Curate again",
      tierBasic: "Basic",
      tierPremium: "Premium",
      tierDeluxe: "Deluxe",
      heroBadge: "AI top pick",
      discountBadge: "{n}% OFF",
      inside: "What's inside",
      more: "+{n} more",
      perPerson: "/ person",
      error:
        "We could not curate your journeys just now. You can still explore every package below.",
    },

    invite: {
      eyebrow: "Start here",
      title: "Take the assessment for journeys made for you",
      body:
        "It takes only a few minutes for us to curate the wellness path that is truly yours.",
      cta: "Begin the assessment",
    },

    explore: {
      eyebrow: "All journeys",
      title: "Explore all journeys",
      all: "All",
      empty: "No journeys at this level.",
    },

    detail: {
      back: "Back",
      highlights: "Journey highlights",
      partners: "The partners caring for you",
      itinerary: "Day by day",
      dayLabel: "Day",
      nutrition: "Menus and nutrition ranges",
      nutritionIntro:
        "These are planning ranges for real restaurant coordination, not fixed values. Ingredients and preparation can vary from day to day.",
      fromPartner: "From",
      portion: "Planned portion",
      calories: "Energy",
      protein: "Protein",
      carbs: "Carbs",
      fiber: "Fiber",
      sodium: "Sodium",
      wellnessNote: "Wellness effect",
      careDetails: "Additional care details",
      madeForTitle: "Made for",
      consultTitle: "Consult a nutritionist and doctor before booking",
      consultBody:
        "When enabled, our medical and nutrition team fine-tunes meals, venues and accommodation to suit you before confirming your booking.",
      consultOn: "Enabled",
      consultOff: "Not enabled yet — turn it on when you want expert review",
      notFoundTitle: "We could not find this journey",
      notFoundBody: "This package may have moved or no longer exists.",
      notFoundCta: "Back to all journeys",
    },

    favorites: {
      eyebrow: "Your shortlist",
      title: "Saved journeys",
      intro: "The journeys you have set aside to revisit.",
      emptyTitle: "No saved journeys yet",
      emptyBody:
        "Tap the heart on any journey you like to keep it here for later.",
      emptyCta: "Explore journeys",
    },
  },
} satisfies Record<Locale, unknown>;

export default packages;
