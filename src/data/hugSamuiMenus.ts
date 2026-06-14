import type { LText } from "@/lib/types";
import rawMenuData from "./hugSamuiMenus.json";

export type HugSamuiMenuStatus = "draft" | "published";
export type HugSamuiMenuCategory =
  | "main"
  | "starter"
  | "seafood"
  | "drink"
  | "soup";
export type HugSamuiMenuGrade =
  | "wellness"
  | "near_wellness"
  | "optimize"
  | "safety_gate";
export type HugSamuiMenuRiskLevel = "low" | "moderate" | "high";
export type HugSamuiNutritionLevel =
  | "low"
  | "moderate"
  | "high"
  | "very_high";
export type HugSamuiOptimizationStatus = "none" | "recommended" | "required";
export type HugSamuiWellnessPillar = "food" | "air" | "mind";

export interface HugSamuiMenuImage {
  publicPath: string;
  sourceFileName: string;
  alt: LText;
}

export interface HugSamuiMenuNutrition {
  caloriesKcal: number | null;
  proteinG: number | null;
  fatG: number | null;
  carbG: number | null;
  fiberG: number | null;
  saturatedFat: {
    amountG: number | null;
    dailyPercent: number | null;
    level: HugSamuiNutritionLevel;
  };
  sodium: {
    amountMg: number | null;
    dailyPercent: number | null;
    level: Exclude<HugSamuiNutritionLevel, "very_high">;
  };
  highlights: LText[];
}

export interface HugSamuiMenuSafety {
  riskLevel: HugSamuiMenuRiskLevel;
  allergenLabels: LText[];
  warnings: LText[];
  intakeFlags: string[];
}

export interface HugSamuiMenuItem {
  id: string;
  partnerId: string;
  isPartnerMenu: boolean;
  sourcePartner: LText;
  slug: string;
  sortOrder: number;
  status: HugSamuiMenuStatus;
  name: LText;
  englishName: LText;
  summary: LText;
  category: HugSamuiMenuCategory;
  course: LText;
  price: {
    currency: "THB";
    amount: number | null;
    label: LText;
  };
  serving: LText;
  image: HugSamuiMenuImage;
  localStory: LText;
  heroIngredients: LText[];
  wellnessGoals: string[];
  wellnessPillars: HugSamuiWellnessPillar[];
  wellnessTags: LText[];
  grade: HugSamuiMenuGrade;
  nutrition: HugSamuiMenuNutrition;
  safety: HugSamuiMenuSafety;
  optimization: {
    status: HugSamuiOptimizationStatus;
    note: LText;
  };
  match: {
    journeys: string[];
    packageRole: LText;
    outcomes: LText[];
  };
  expertReview: {
    status: "pending" | "approved" | "rejected";
    reviewerExpertId: string;
    label: LText;
  };
}

export interface HugSamuiMenuDataset {
  partnerId: string;
  contentVersion: string;
  status: HugSamuiMenuStatus;
  sourceNote: LText;
  positioning: {
    name: LText;
    summary: LText;
    databaseScope: LText;
  };
  futureRoutes: {
    partnerDetail: string;
    services: string;
    menus: string;
    wellnessFood: string;
  };
  menus: HugSamuiMenuItem[];
}

export const HUG_SAMUI_MENU_DATA = rawMenuData as HugSamuiMenuDataset;

export const HUG_SAMUI_MENU_HREF = HUG_SAMUI_MENU_DATA.futureRoutes.menus;
export const HUG_SAMUI_MENUS = HUG_SAMUI_MENU_DATA.menus;
export const HUG_SAMUI_PARTNER_MENUS = HUG_SAMUI_MENUS.filter(
  (menu) => menu.isPartnerMenu,
);
export const HUG_SAMUI_REFERENCE_MENUS = HUG_SAMUI_MENUS.filter(
  (menu) => !menu.isPartnerMenu,
);

export function getHugSamuiMenu(id: string) {
  return HUG_SAMUI_MENUS.find((menu) => menu.id === id);
}
