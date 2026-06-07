import type { Locale } from "@/lib/types";

/* ============================================================
 * Privacy policy strings — Goodfill Care, Samui Wellness.
 * PDPA (Thailand, B.E. 2562) aligned. Bilingual TH / EN.
 * ============================================================ */

const privacy = {
  th: {
    eyebrow: "ความเป็นส่วนตัวของคุณ",
    title: "นโยบายความเป็นส่วนตัว",
    updated: "ปรับปรุงล่าสุด · 6 มิถุนายน 2569",
    intro:
      "Goodfill Care ให้ความสำคัญสูงสุดกับความเป็นส่วนตัวของคุณ นโยบายฉบับนี้อธิบายว่าเราเก็บ ใช้ และคุ้มครองข้อมูลส่วนบุคคลของคุณอย่างไร ภายใต้พระราชบัญญัติคุ้มครองข้อมูลส่วนบุคคล พ.ศ. 2562 (PDPA) ของประเทศไทย",
    sections: [
      {
        heading: "ข้อมูลที่เราเก็บรวบรวม",
        body: "เราเก็บเฉพาะข้อมูลเท่าที่จำเป็นต่อการดูแลคุณ ได้แก่ คำตอบจากแบบประเมินเวลเนสของคุณ (เช่น ระดับความเครียด การนอน และเป้าหมายด้านสุขภาพ) และข้อมูลติดต่อที่คุณให้ไว้เมื่อทำการจอง ได้แก่ ชื่อ นามสกุล อีเมล และหมายเลขโทรศัพท์",
      },
      {
        heading: "วัตถุประสงค์ในการใช้ข้อมูล",
        body: "เราใช้ข้อมูลของคุณเพื่อสามจุดมุ่งหมายเท่านั้น คือ การแนะนำเส้นทางเวลเนสที่เหมาะกับคุณเป็นการเฉพาะ การประสานงานการจองกับพันธมิตรของเรา และการปรึกษากับผู้เชี่ยวชาญด้านสุขภาพเมื่อจำเป็นต่อแพ็กเกจที่คุณเลือก",
      },
      {
        heading: "ฐานทางกฎหมาย",
        body: "เราประมวลผลข้อมูลส่วนบุคคลของคุณบนฐานความยินยอมที่คุณให้ไว้ก่อนทุกครั้ง ก่อนส่งแบบประเมินหรือทำการจอง คุณจะต้องยืนยันความยินยอมผ่านช่องทำเครื่องหมายเสมอ และคุณสามารถถอนความยินยอมได้ทุกเมื่อ",
      },
      {
        heading: "ระยะเวลาการเก็บรักษา",
        body: "เราเก็บรักษาข้อมูลของคุณเพียงเท่าที่จำเป็นต่อการให้บริการตามวัตถุประสงค์ข้างต้น โดยทั่วไปไม่เกินยี่สิบสี่เดือนหลังการติดต่อครั้งล่าสุด หลังจากนั้นข้อมูลจะถูกลบหรือทำให้ไม่สามารถระบุตัวตนได้ คุณสามารถขอให้ลบข้อมูลก่อนกำหนดได้ทุกเมื่อ",
      },
      {
        heading: "การเปิดเผยและการแบ่งปันข้อมูล",
        body: "เราจะแบ่งปันข้อมูลของคุณเฉพาะกับพันธมิตรด้านเวลเนสและผู้เชี่ยวชาญทางการแพทย์ที่ระบุไว้ในแพ็กเกจที่คุณจองเท่านั้น และเพียงเท่าที่จำเป็นต่อการให้บริการแก่คุณ เราไม่ขาย ไม่แลกเปลี่ยน และไม่เปิดเผยข้อมูลของคุณเพื่อการตลาดแก่บุคคลภายนอกใด ๆ",
      },
      {
        heading: "สิทธิของคุณ",
        body: "ภายใต้ PDPA คุณมีสิทธิเข้าถึงข้อมูลของคุณ ขอแก้ไขข้อมูลให้ถูกต้อง ขอให้ลบข้อมูล และถอนความยินยอมได้ทุกเมื่อ การถอนความยินยอมจะไม่กระทบต่อการประมวลผลที่ได้ดำเนินการไปก่อนหน้าโดยชอบด้วยกฎหมาย",
      },
      {
        heading: "ความปลอดภัยของข้อมูล",
        body: "เราปกป้องข้อมูลของคุณด้วยมาตรการทางเทคนิคและการบริหารจัดการที่เหมาะสม และจำกัดการเข้าถึงเฉพาะผู้ที่จำเป็นต้องใช้ข้อมูลเพื่อดูแลคุณเท่านั้น",
      },
      {
        heading: "ติดต่อเรา",
        body: "หากมีคำถามเกี่ยวกับนโยบายฉบับนี้ หรือต้องการใช้สิทธิของคุณ กรุณาติดต่อทีมดูแลข้อมูลส่วนบุคคลของเราได้ที่",
      },
    ],
    contactLabel: "อีเมล",
    contactEmail: "care@goodfillcare.com",
    back: "กลับสู่หน้าแรก",
  },
  en: {
    eyebrow: "YOUR PRIVACY",
    title: "Privacy Policy",
    updated: "Last updated · 6 June 2026",
    intro:
      "Goodfill Care holds your privacy in the highest regard. This policy explains how we collect, use and protect your personal data under Thailand's Personal Data Protection Act, B.E. 2562 (PDPA).",
    sections: [
      {
        heading: "What we collect",
        body: "We collect only what is needed to care for you: your wellness assessment answers (such as stress levels, sleep and health goals), and the contact details you provide when you book — your first and last name, email address and phone number.",
      },
      {
        heading: "How we use your data",
        body: "Your data serves three purposes only: to recommend a wellness journey tailored personally to you, to coordinate your booking with our partners, and to arrange expert consultation where it is required by the package you have chosen.",
      },
      {
        heading: "Legal basis",
        body: "We process your personal data on the basis of the consent you give in advance. Before you submit an assessment or make a booking, you confirm your consent through a checkbox, and you may withdraw that consent at any time.",
      },
      {
        heading: "Data retention",
        body: "We keep your data only as long as needed to fulfil the purposes above — generally no more than twenty-four months after our last contact with you — after which it is deleted or anonymised. You may request earlier deletion at any time.",
      },
      {
        heading: "Disclosure and sharing",
        body: "We share your data only with the named wellness partners and medical experts included in the package you book, and only as far as necessary to serve you. We never sell, trade or disclose your data for the marketing purposes of any third party.",
      },
      {
        heading: "Your rights",
        body: "Under the PDPA you have the right to access your data, request its correction, request its erasure, and withdraw your consent at any time. Withdrawing consent does not affect processing already carried out lawfully beforehand.",
      },
      {
        heading: "Data security",
        body: "We protect your data with appropriate technical and organisational measures, and limit access to those who genuinely need it to care for you.",
      },
      {
        heading: "Contact us",
        body: "For any question about this policy, or to exercise your rights, please reach our data protection team at",
      },
    ],
    contactLabel: "Email",
    contactEmail: "care@goodfillcare.com",
    back: "Back to home",
  },
} satisfies Record<Locale, unknown>;

export default privacy;
