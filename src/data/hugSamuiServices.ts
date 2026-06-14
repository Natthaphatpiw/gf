import type { LText } from "@/lib/types";
import rawServiceData from "./hugSamuiServices.json";

export interface PartnerGalleryImage {
  id: string;
  partnerId: string;
  image: string;
  alt: LText;
  caption: LText;
  sortOrder: number;
}

export interface HugSamuiServiceMedia {
  id: string;
  partnerId: string;
  serviceId: string;
  assetType: "image";
  publicPath: string;
  sourceFileName: string;
  sortOrder: number;
  alt: LText;
}

export interface HugSamuiServiceGroup {
  id: string;
  partnerId: string;
  sortOrder: number;
  name: LText;
  description: LText;
}

export interface HugSamuiService {
  id: string;
  partnerId: string;
  serviceGroupId: string;
  slug: string;
  sortOrder: number;
  status: "draft" | "published";
  name: LText;
  shortName: LText;
  summary: LText;
  description: LText;
  schedule: {
    timeLabel: LText;
    startTime: string | null;
    endTime: string | null;
    durationMinutes: number | null;
    period: "morning" | "afternoon" | "evening" | "night" | "all_day";
    dateRange: {
      startDate: string;
      endDate: string;
    } | null;
  };
  price: {
    type:
      | "free"
      | "included"
      | "market"
      | "coupon"
      | "package"
      | "activity";
    currency: "THB";
    amount: number | null;
    minimumSpend: number | null;
    label: LText;
  };
  location: {
    name: LText;
    area: LText;
  };
  audience: LText[];
  businessRole: LText;
  booking: {
    required: boolean;
    intent:
      | "join_at_venue"
      | "view_at_venue"
      | "walk_in"
      | "redeem_at_venue"
      | "reservation";
    label: LText;
  };
  media: HugSamuiServiceMedia[];
  tags: string[];
}

export interface HugSamuiDailyFlow {
  id: string;
  partnerId: string;
  sortOrder: number;
  period: LText;
  serviceIds: string[];
  summary: LText;
}

export interface HugSamuiServiceDataset {
  partnerId: string;
  contentVersion: string;
  status: "draft" | "published";
  sourceNote: LText;
  positioning: {
    name: LText;
    summary: LText;
    businessModel: LText;
  };
  futureRoutes: {
    partnerDetail: string;
    services: string;
    wellnessFood: string;
  };
  serviceGroups: HugSamuiServiceGroup[];
  services: HugSamuiService[];
  dailyFlow: HugSamuiDailyFlow[];
}

export const HUG_SAMUI_SERVICE_DATA =
  rawServiceData as HugSamuiServiceDataset;

export const HUG_SAMUI_SERVICES = HUG_SAMUI_SERVICE_DATA.services;
export const HUG_SAMUI_SERVICE_GROUPS = HUG_SAMUI_SERVICE_DATA.serviceGroups;
export const HUG_SAMUI_DAILY_FLOW = HUG_SAMUI_SERVICE_DATA.dailyFlow;

export const HUG_SAMUI_SERVICE_HREF =
  HUG_SAMUI_SERVICE_DATA.futureRoutes.services;
export const HUG_SAMUI_WELLNESS_FOOD_HREF =
  HUG_SAMUI_SERVICE_DATA.futureRoutes.wellnessFood;

export function getHugSamuiServiceGroup(id: string) {
  return HUG_SAMUI_SERVICE_GROUPS.find((group) => group.id === id);
}

export function getHugSamuiService(id: string) {
  return HUG_SAMUI_SERVICES.find((service) => service.id === id);
}

export const HUG_SAMUI_GALLERY: PartnerGalleryImage[] = Array.from(
  { length: 16 },
  (_, index) => {
    const order = index + 1;
    const padded = String(order).padStart(2, "0");
    return {
      id: `hug-samui-gallery-${padded}`,
      partnerId: "hug-samui",
      image: `/partners/hug-samui/gallery/gallery-${padded}.jpg`,
      alt: {
        th: `ภาพบรรยากาศ Hug Samui ลำดับที่ ${order}`,
        en: `Hug Samui lifestyle image ${order}`,
      },
      caption: {
        th: "บรรยากาศริมทะเลและไลฟ์สไตล์ของ Hug Samui",
        en: "Beachside atmosphere and lifestyle at Hug Samui",
      },
      sortOrder: order,
    };
  },
);
