import type { Locale } from "@/lib/types";

/* ============================================================
 * Booking namespace — registration, booking, tracking copy.
 * ============================================================ */

const booking = {
  th: {
    register: {
      eyebrow: "สมัครและจอง",
      title: "สมัครสมาชิกและจอง",
      subtitle:
        "กรอกรายละเอียดของท่าน ทีมดูแลของเราจะติดต่อกลับเพื่อยืนยันทุกขั้นตอนด้วยความใส่ใจ",
      summaryTitle: "แพ็กเกจที่ท่านเลือก",
      consultPill: "ปรึกษาผู้เชี่ยวชาญก่อนยืนยัน",
      consultHint:
        "ผู้เชี่ยวชาญด้านเวลเนสจะทบทวนและปรับแพ็กเกจให้เหมาะกับท่านก่อนการยืนยันขั้นสุดท้าย",
      sectionContact: "ข้อมูลผู้จอง",
      firstName: "ชื่อ",
      lastName: "นามสกุล",
      phone: "เบอร์โทรศัพท์",
      email: "อีเมล",
      firstNamePlaceholder: "ชื่อจริงของท่าน",
      lastNamePlaceholder: "นามสกุลของท่าน",
      phonePlaceholder: "08X-XXX-XXXX",
      emailPlaceholder: "you@example.com",
      linkedAssessment: "เชื่อมกับผลประเมิน",
      sectionFamily: "การจองแบบครอบครัว",
      familyToggle: "จองแบบแพ็กเกจครอบครัว",
      familyHint:
        "เดินทางพร้อมคนที่ท่านรัก เราจะออกแบบประสบการณ์ให้สอดคล้องกันทั้งกลุ่ม",
      familySize: "จำนวนผู้เข้าร่วม",
      familySizeNote: "นับรวมตัวท่านเองด้วย",
      memberHeading: "สมาชิกเพิ่มเติม",
      memberLabel: "ชื่อเรียก",
      memberLabelPlaceholder: "เช่น คุณแม่ หรือ น้องมินต์",
      memberAssessmentId: "รหัสผลประเมิน",
      memberIdPlaceholder: "SW-XXXXXX",
      memberIdOptional: "ใส่หรือไม่ใส่ก็ได้",
      memberIdValid: "เชื่อมแล้ว",
      submit: "ยืนยันการจอง",
      submitting: "กำลังดำเนินการ...",
    },
    success: {
      eyebrow: "การจองเสร็จสมบูรณ์",
      title: "ขอบคุณสำหรับการจอง",
      refLabel: "หมายเลขการจองของท่าน",
      message:
        "การจองเสร็จสมบูรณ์ ทีมงานจะติดต่อกลับทางอีเมลหรือโทรศัพท์ของคุณ",
      consultNote:
        "เนื่องจากท่านเลือกปรึกษาผู้เชี่ยวชาญ การทบทวนและปรับแพ็กเกจจะเกิดขึ้นก่อนเป็นลำดับแรก",
      track: "ติดตามสถานะ",
      home: "กลับสู่หน้าแรก",
    },
    list: {
      eyebrow: "การเดินทางของคุณ",
      title: "การจองของฉัน",
      subtitle: "ติดตามทุกการจองและสถานะการดูแลของท่านได้ที่นี่",
      lookupTitle: "ค้นหาการจองของท่าน",
      lookupHint:
        "การจองของเราเป็นบริการแบบผู้ช่วยส่วนตัว ไม่ต้องใช้รหัสผ่าน เพียงกรอกอีเมลที่ท่านใช้จอง เราจะดึงการจองทั้งหมดมาให้",
      lookupPlaceholder: "อีเมลที่ใช้จอง",
      lookupSubmit: "ค้นหาการจอง",
      lookupSearching: "กำลังค้นหา...",
      bookedOn: "จองเมื่อ",
      emptyTitle: "ยังไม่มีการจอง",
      emptyHint:
        "เริ่มต้นการเดินทางสู่สมดุลของท่านด้วยแพ็กเกจที่คัดสรรมาเป็นพิเศษ",
      browse: "ดูแพ็กเกจทั้งหมด",
      ref: "หมายเลข",
    },
    track: {
      eyebrow: "ขั้นตอนการดูแล",
      title: "สถานะการจอง",
      backToList: "กลับไปการจองทั้งหมด",
      timelineTitle: "เส้นทางการดูแลของท่าน",
      stepDesc: {
        booked: "เราได้รับการจองของท่านเรียบร้อยแล้ว",
        expert_review:
          "ผู้เชี่ยวชาญกำลังทบทวนและปรับแพ็กเกจให้เหมาะกับท่าน",
        processing: "ทีมงานกำลังจัดเตรียมรายละเอียดการเดินทางของท่าน",
        contacted: "เราได้ติดต่อท่านเพื่อยืนยันรายละเอียดทั้งหมด",
        completed: "ทุกอย่างพร้อมแล้ว ขอให้ท่านมีประสบการณ์ที่งดงาม",
      },
      expertTitle: "คำแนะนำจากผู้เชี่ยวชาญ",
      expertRole: "ผู้เชี่ยวชาญด้านเวลเนส",
      changesTitle: "รายการที่แนะนำให้ปรับ",
      original: "เดิม",
      replacement: "ปรับเป็น",
      reason: "เหตุผล",
      accept: "ตกลงเปลี่ยนตามคำแนะนำ",
      accepting: "กำลังบันทึก...",
      acceptedNote:
        "แพทย์จะอนุมัติแพ็กเกจฉบับปรับแล้วของคุณเป็นขั้นตอนสุดท้าย",
      approvedTitle: "ยืนยันแพ็กเกจฉบับปรับแล้ว",
      approvedNote:
        "แพทย์อนุมัติแพ็กเกจฉบับปรับของท่านเรียบร้อยแล้ว ทุกอย่างพร้อมต้อนรับท่าน",
    },
    errors: {
      firstName: "กรุณากรอกชื่อ",
      lastName: "กรุณากรอกนามสกุล",
      phone: "กรุณากรอกเบอร์โทรศัพท์ให้ถูกต้อง (9-10 หลัก)",
      email: "กรุณากรอกอีเมลให้ถูกต้อง",
      memberId: "รูปแบบรหัสไม่ถูกต้อง (เช่น SW-XXXXXX)",
      memberNotFound: "ไม่พบผลประเมินนี้",
      notFound: "ไม่พบการจองที่ท่านค้นหา",
      submit: "ขออภัย ไม่สามารถบันทึกการจองได้ กรุณาลองใหม่อีกครั้ง",
    },
  },
  en: {
    register: {
      eyebrow: "Register and book",
      title: "Create your account and book",
      subtitle:
        "Share a few details and our care team will personally reach out to confirm every step of your journey.",
      summaryTitle: "Your chosen package",
      consultPill: "Expert review before confirmation",
      consultHint:
        "A wellness expert will review and tailor your package before the final confirmation.",
      sectionContact: "Your details",
      firstName: "First name",
      lastName: "Last name",
      phone: "Phone number",
      email: "Email",
      firstNamePlaceholder: "Your first name",
      lastNamePlaceholder: "Your last name",
      phonePlaceholder: "08X-XXX-XXXX",
      emailPlaceholder: "you@example.com",
      linkedAssessment: "Linked to assessment",
      sectionFamily: "Family booking",
      familyToggle: "Book as a family package",
      familyHint:
        "Travel with those you love — we will shape a shared experience for the whole group.",
      familySize: "Number of guests",
      familySizeNote: "Including yourself",
      memberHeading: "Additional guests",
      memberLabel: "Name or label",
      memberLabelPlaceholder: "e.g. Mum, or Mint",
      memberAssessmentId: "Assessment ID",
      memberIdPlaceholder: "SW-XXXXXX",
      memberIdOptional: "Optional",
      memberIdValid: "Linked",
      submit: "Confirm booking",
      submitting: "Processing...",
    },
    success: {
      eyebrow: "Booking complete",
      title: "Thank you for booking",
      refLabel: "Your booking reference",
      message:
        "Your booking is complete. Our team will contact you by email or phone.",
      consultNote:
        "As you requested an expert consultation, your package review and tailoring will take place first.",
      track: "Track status",
      home: "Back to home",
    },
    list: {
      eyebrow: "Your journeys",
      title: "My bookings",
      subtitle: "Follow every booking and its care status in one calm place.",
      lookupTitle: "Find your bookings",
      lookupHint:
        "Ours is a concierge service — no password needed. Simply enter the email you booked with and we will gather all your bookings.",
      lookupPlaceholder: "Email used to book",
      lookupSubmit: "Find bookings",
      lookupSearching: "Searching...",
      bookedOn: "Booked on",
      emptyTitle: "No bookings yet",
      emptyHint:
        "Begin your journey to balance with a package curated just for you.",
      browse: "Browse all packages",
      ref: "Reference",
    },
    track: {
      eyebrow: "Care process",
      title: "Booking status",
      backToList: "Back to all bookings",
      timelineTitle: "Your care journey",
      stepDesc: {
        booked: "We have received your booking.",
        expert_review:
          "Our expert is reviewing and tailoring your package for you.",
        processing: "Our team is arranging the details of your journey.",
        contacted: "We have reached out to confirm every detail with you.",
        completed: "Everything is ready — we wish you a beautiful experience.",
      },
      expertTitle: "Guidance from our experts",
      expertRole: "Wellness expert",
      changesTitle: "Recommended adjustments",
      original: "Originally",
      replacement: "Now",
      reason: "Why",
      accept: "Accept the recommended changes",
      accepting: "Saving...",
      acceptedNote:
        "Our doctor will give final approval to your adjusted package.",
      approvedTitle: "Adjusted package confirmed",
      approvedNote:
        "Our doctor has approved your adjusted package — everything is ready to welcome you.",
    },
    errors: {
      firstName: "Please enter your first name.",
      lastName: "Please enter your last name.",
      phone: "Please enter a valid phone number (9-10 digits).",
      email: "Please enter a valid email address.",
      memberId: "Invalid format (e.g. SW-XXXXXX).",
      memberNotFound: "We could not find this assessment.",
      notFound: "We could not find the booking you are looking for.",
      submit: "Sorry, we could not save your booking. Please try again.",
    },
  },
} satisfies Record<Locale, unknown>;

export default booking;
