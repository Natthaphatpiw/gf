import type { LText } from "@/lib/types";
import type { ItemType } from "@/lib/account";
import type { ProposalSlotKind, ProposalSlotView } from "@/lib/consultation";
import { getBlueprintProgram } from "@/data/blueprintPackages";
import { HUG_SAMUI_SERVICES, getHugSamuiService } from "@/data/hugSamuiServices";
import { HUG_SAMUI_MENUS, getHugSamuiMenu } from "@/data/hugSamuiMenus";

/* ============================================================
 * Plan helpers — turn a program into editable proposal slots and
 * expose the pool of services/menus an expert can drag in.
 * Pure data; safe on both client (LIFF editor) and server (APIs).
 * ============================================================ */

export interface PlanCatalogItem {
  kind: "service" | "menu";
  id: string;
  label: LText;
  image?: string;
}

/** Everything an expert can drop into a slot. */
export function getPlanCatalog(): {
  services: PlanCatalogItem[];
  menus: PlanCatalogItem[];
} {
  const services: PlanCatalogItem[] = HUG_SAMUI_SERVICES.filter(
    (s) => s.status === "published",
  ).map((s) => ({
    kind: "service",
    id: s.id,
    label: s.name,
    image: s.media[0]?.publicPath,
  }));
  const menus: PlanCatalogItem[] = HUG_SAMUI_MENUS.filter(
    (m) => m.status === "published",
  ).map((m) => ({
    kind: "menu",
    id: m.id,
    label: m.name,
    image: m.image?.publicPath,
  }));
  return { services, menus };
}

/** Resolve a catalog item's label by kind + id (when an expert drops one in). */
export function planItemLabel(kind: ProposalSlotKind, id?: string): LText | null {
  if (kind === "service" && id) return getHugSamuiService(id)?.name ?? null;
  if (kind === "menu" && id) return getHugSamuiMenu(id)?.name ?? null;
  return null;
}

/** The program's stock plan as proposal slots (every slot fromOriginal=true). */
export function getOriginalPlanSlots(
  itemType: ItemType,
  itemId: string,
): ProposalSlotView[] {
  if (itemType === "program" || itemType === "package") {
    const program = getBlueprintProgram(itemId);
    if (program) {
      return [...program.slots]
        .sort((a, b) => a.order - b.order)
        .map((slot, i) => {
          const fill = slot.fill;
          const kind: ProposalSlotKind = fill.type;
          let id: string | undefined;
          let label: LText = slot.name;
          if (fill.type === "service" && fill.serviceId) {
            id = fill.serviceId;
            label = getHugSamuiService(fill.serviceId)?.name ?? slot.name;
          } else if (fill.type === "menu" && fill.menuId) {
            id = fill.menuId;
            label = getHugSamuiMenu(fill.menuId)?.name ?? slot.name;
          }
          return { position: i, itemType: kind, itemId: id, label, fromOriginal: true };
        });
    }
  }
  if (itemType === "service") {
    const s = getHugSamuiService(itemId);
    if (s) return [{ position: 0, itemType: "service", itemId, label: s.name, fromOriginal: true }];
  }
  if (itemType === "menu") {
    const m = getHugSamuiMenu(itemId);
    if (m) return [{ position: 0, itemType: "menu", itemId, label: m.name, fromOriginal: true }];
  }
  return [];
}
