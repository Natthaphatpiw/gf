import type { LText, Score, GoalId } from "@/lib/types";
import type {
  ConsultStatus,
  ConsultType,
  ChatThreadView,
  ProposalView,
  ProposalSlotView,
} from "@/lib/consultation";
import type { ItemType } from "@/lib/account";
import type { PlanCatalogItem } from "@/lib/plan";

/* Shape returned by GET /api/line/expert/[id] — consumed by the LIFF pages. */

export interface GuestProfile {
  id: string;
  archetype: { code: string; name: LText; description: LText };
  scores: { stress: Score; migraine: Score; mental: Score };
  traits: LText[];
  recommendedGoals: GoalId[];
}

export interface ExpertConsultContext {
  consultation: {
    id: string;
    itemType: ItemType;
    itemId: string;
    itemName: LText;
    itemImage?: string;
    consultType: ConsultType;
    status: ConsultStatus;
    note?: string;
  };
  expert: { id: string; name: LText } | null;
  guest: { firstName: string } | null;
  profile: GuestProfile | null;
  // chat consultations
  thread?: ChatThreadView | null;
  // managed-plan consultations
  original?: ProposalSlotView[];
  proposal?: ProposalView | null;
  catalog?: { services: PlanCatalogItem[]; menus: PlanCatalogItem[] };
}
