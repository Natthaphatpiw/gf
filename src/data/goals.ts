import type { GoalId, LText } from "@/lib/types";

/* ============================================================
 * Wellness goals the system can recommend or the guest can pick.
 * ============================================================ */

export interface GoalInfo {
  id: GoalId;
  name: LText;
  description: LText;
  /** lucide-react icon name. */
  icon: string;
}

export const GOALS: Record<GoalId, GoalInfo> = {
  sleep_better: {
    id: "sleep_better",
    name: { th: "นอนหลับดีขึ้น", en: "Sleep Better" },
    description: {
      th: "คืนความลึกให้การนอน ด้วยจังหวะชีวิตที่ช้าลงและการบำบัดที่ช่วยให้กายใจพร้อมพัก",
      en: "Restore depth to your nights with a slower rhythm and therapies that ready body and mind for rest.",
    },
    icon: "Moon",
  },
  detox: {
    id: "detox",
    name: { th: "ดีท็อกซ์ ฟื้นฟูร่างกาย", en: "Detox" },
    description: {
      th: "ล้างความล้าสะสมด้วยอาหารสะอาด สปา และโปรแกรมฟื้นฟูจากธรรมชาติของเกาะ",
      en: "Clear accumulated fatigue with clean food, spa rituals and nature-led renewal.",
    },
    icon: "Droplets",
  },
  burnout_recovery: {
    id: "burnout_recovery",
    name: { th: "ฟื้นจากภาวะหมดไฟ", en: "Burnout Recovery" },
    description: {
      th: "วางทุกอย่างลงชั่วคราว แล้วให้เกาะช่วยเติมพลังกลับทีละน้อยอย่างเป็นระบบ",
      en: "Set everything down for a while and let the island refill you, gently and deliberately.",
    },
    icon: "Flame",
  },
  active_fitness: {
    id: "active_fitness",
    name: { th: "แอคทีฟ ฟิตเนส", en: "Active Fitness" },
    description: {
      th: "ขยับร่างกายให้สุดกับชายหาด ป่าเขา และคลาสที่ออกแบบมาให้สนุกจนลืมว่ากำลังออกกำลังกาย",
      en: "Move hard with beaches, hills and classes so enjoyable you forget you are training.",
    },
    icon: "Zap",
  },
  plant_based_week: {
    id: "plant_based_week",
    name: { th: "สัปดาห์อาหารจากพืช", en: "Plant-Based Week" },
    description: {
      th: "ลองใช้ชีวิตด้วยอาหารจากพืชเต็มรูปแบบ กับร้านออร์แกนิกที่ดีที่สุดของสมุย",
      en: "Live fully plant-based for a while with Samui's finest organic kitchens.",
    },
    icon: "Sprout",
  },
  anti_aging_checkup: {
    id: "anti_aging_checkup",
    name: { th: "ตรวจสุขภาพชะลอวัย", en: "Anti-Aging Checkup" },
    description: {
      th: "รู้จักร่างกายตัวเองให้ลึกขึ้น ด้วยการตรวจเชิงป้องกันและคำแนะนำเฉพาะบุคคล",
      en: "Know your body more deeply through preventive screening and personal guidance.",
    },
    icon: "ShieldCheck",
  },
};

export function getGoal(id: GoalId): GoalInfo {
  return GOALS[id];
}
