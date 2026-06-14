import type { LText } from "@/lib/types";
import {
  HUG_SAMUI_GALLERY,
  HUG_SAMUI_SERVICE_HREF,
  HUG_SAMUI_WELLNESS_FOOD_HREF,
  type PartnerGalleryImage,
} from "@/data/hugSamuiServices";
import { HUG_SAMUI_MENU_HREF } from "@/data/hugSamuiMenus";

export interface PartnerProfile {
  id: string;
  name: LText;
  category: LText;
  logo?: string;
  video?: string;
  gallery?: PartnerGalleryImage[];
  serviceHref?: string;
  menuHref?: string;
  wellnessFoodHref?: string;
  location: LText;
  summary: LText;
  story: LText;
  highlights: LText[];
  services: LText[];
  visitNotes: LText[];
}

function draftPartner(id: string, name: string, category: LText): PartnerProfile {
  return {
    id,
    name: { th: name, en: name },
    category,
    location: { th: "Koh Samui", en: "Koh Samui" },
    summary: {
      th: "partner draft สำหรับเติมรายละเอียดในระยะถัดไป",
      en: "A draft partner profile to be completed in the next phase.",
    },
    story: {
      th: "รายละเอียดจะเพิ่มในระยะถัดไป",
      en: "Details will be added in the next phase.",
    },
    highlights: [],
    services: [],
    visitNotes: [],
  };
}

export const PARTNERS: PartnerProfile[] = [
  {
    id: "hug-samui",
    name: { th: "Hug Samui", en: "Hug Samui" },
    category: {
      th: "Wellness lifestyle partner",
      en: "Wellness lifestyle partner",
    },
    logo: "/partners/hug-samui/logo.png",
    video: "/partners/hug-samui/intro.mp4",
    gallery: HUG_SAMUI_GALLERY,
    serviceHref: HUG_SAMUI_SERVICE_HREF,
    menuHref: HUG_SAMUI_MENU_HREF,
    wellnessFoodHref: HUG_SAMUI_WELLNESS_FOOD_HREF,
    location: {
      th: "Koh Samui, Surat Thani",
      en: "Koh Samui, Surat Thani",
    },
    summary: {
      th: "พื้นที่เวลเนสบนเกาะสมุยที่ให้ความรู้สึกอบอุ่น เป็นกันเอง และเหมาะกับการเริ่มต้นดูแลตัวเองแบบไม่กดดัน",
      en: "A warm, easygoing wellness space on Koh Samui for guests who want to begin caring for themselves without pressure.",
    },
    story: {
      th: "Hug Samui เป็น partner รายแรกที่เราเริ่มเปิดหน้าแนะนำในแพลตฟอร์ม Goodfill Care โดยโทนของร้านเหมาะกับผู้เดินทางที่อยากสัมผัสสมุยในมุมที่นุ่มนวล เป็นธรรมชาติ และเข้าถึงง่าย",
      en: "Hug Samui is the first partner profile we are opening inside Goodfill Care. Its tone suits travellers who want to meet Koh Samui through a softer, natural and approachable wellness lens.",
    },
    highlights: [
      {
        th: "เหมาะกับผู้ที่อยากเริ่มต้นทริปด้วยบรรยากาศสบาย ๆ",
        en: "Ideal for guests who want to start their trip in a relaxed atmosphere.",
      },
      {
        th: "เข้ากับแพ็กเกจแนวพักใจ ฟื้นพลัง และใช้ชีวิตช้าลง",
        en: "Fits journeys focused on emotional rest, recovery and slowing down.",
      },
      {
        th: "สามารถต่อยอดเป็นจุดแวะในแพ็กเกจ wellness lifestyle ได้",
        en: "Can grow into a lifestyle wellness stop within curated journeys.",
      },
    ],
    services: [
      { th: "Wellness lifestyle", en: "Wellness lifestyle" },
      { th: "Island slow living", en: "Island slow living" },
      { th: "Gentle recovery", en: "Gentle recovery" },
    ],
    visitNotes: [
      {
        th: "รายละเอียดบริการ ราคา และช่วงเวลาให้บริการจะเติมหลังจากยืนยันข้อมูลร้าน",
        en: "Service details, pricing and opening times will be completed after partner confirmation.",
      },
      {
        th: "หน้านี้เป็น draft แรกเพื่อทดสอบประสบการณ์วิดีโอและการนำเสนอ partner",
        en: "This is a first draft for testing the video experience and partner presentation.",
      },
    ],
  },
  {
    id: "sila-spa-samui",
    name: { th: "Sila Spa Samui", en: "Sila Spa Samui" },
    category: { th: "Spa & Thai healing", en: "Spa & Thai healing" },
    location: { th: "Koh Samui", en: "Koh Samui" },
    summary: {
      th: "สปาเงียบสงบสำหรับการคลายร่างกายและคืนสมดุล",
      en: "A quiet spa concept for body release and restoration.",
    },
    story: {
      th: "รายละเอียดจะเพิ่มในระยะถัดไป",
      en: "Details will be added in the next phase.",
    },
    highlights: [],
    services: [],
    visitNotes: [],
  },
  {
    id: "coconut-grove-wellness",
    name: {
      th: "Coconut Grove Wellness",
      en: "Coconut Grove Wellness",
    },
    category: { th: "Healthy food", en: "Healthy food" },
    location: { th: "Koh Samui", en: "Koh Samui" },
    summary: {
      th: "ครัวสุขภาพและพื้นที่พักเบา ๆ ในจังหวะเกาะ",
      en: "A health kitchen and gentle island pause concept.",
    },
    story: {
      th: "รายละเอียดจะเพิ่มในระยะถัดไป",
      en: "Details will be added in the next phase.",
    },
    highlights: [],
    services: [],
    visitNotes: [],
  },
  {
    id: "mali-mind-studio",
    name: { th: "Mali Mind Studio", en: "Mali Mind Studio" },
    category: { th: "Mind & breathwork", en: "Mind & breathwork" },
    location: { th: "Koh Samui", en: "Koh Samui" },
    summary: {
      th: "สตูดิโอสำหรับลมหายใจ สมาธิ และการพักใจ",
      en: "A studio concept for breathwork, mindfulness and mental rest.",
    },
    story: {
      th: "รายละเอียดจะเพิ่มในระยะถัดไป",
      en: "Details will be added in the next phase.",
    },
    highlights: [],
    services: [],
    visitNotes: [],
  },
  {
    id: "tala-sea-retreat",
    name: { th: "Tala Sea Retreat", en: "Tala Sea Retreat" },
    category: { th: "Retreat stay", en: "Retreat stay" },
    location: { th: "Koh Samui", en: "Koh Samui" },
    summary: {
      th: "รีทรีตใกล้ทะเลสำหรับการพักอย่างลึกซึ้ง",
      en: "A seaside retreat concept for deeper rest.",
    },
    story: {
      th: "รายละเอียดจะเพิ่มในระยะถัดไป",
      en: "Details will be added in the next phase.",
    },
    highlights: [],
    services: [],
    visitNotes: [],
  },
  {
    id: "baan-herb-samui",
    name: { th: "Baan Herb Samui", en: "Baan Herb Samui" },
    category: { th: "Herbal care", en: "Herbal care" },
    location: { th: "Koh Samui", en: "Koh Samui" },
    summary: {
      th: "บ้านสมุนไพรสำหรับการดูแลแบบอ่อนโยน",
      en: "A herbal care concept for gentle wellbeing.",
    },
    story: {
      th: "รายละเอียดจะเพิ่มในระยะถัดไป",
      en: "Details will be added in the next phase.",
    },
    highlights: [],
    services: [],
    visitNotes: [],
  },
  draftPartner("serene-lotus-spa", "Serene Lotus Spa", {
    th: "Spa & Thai healing",
    en: "Spa & Thai healing",
  }),
  draftPartner("island-breath-house", "Island Breath House", {
    th: "Mind & breathwork",
    en: "Mind & breathwork",
  }),
  draftPartner("ava-wellness-lab", "Ava Wellness Lab", {
    th: "Medical & preventive",
    en: "Medical & preventive",
  }),
  draftPartner("blue-palm-retreat", "Blue Palm Retreat", {
    th: "Retreat stay",
    en: "Retreat stay",
  }),
  draftPartner("samui-glow-kitchen", "Samui Glow Kitchen", {
    th: "Healthy food",
    en: "Healthy food",
  }),
  draftPartner("nomad-recovery-club", "Nomad Recovery Club", {
    th: "Recovery & movement",
    en: "Recovery & movement",
  }),
];

export function getPartner(id: string): PartnerProfile | undefined {
  return PARTNERS.find((partner) => partner.id === id);
}

export const TOP_BRAND_PARTNERS = PARTNERS;
