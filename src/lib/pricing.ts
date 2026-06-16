import type { LText, WellnessPackage } from "@/lib/types";
import { getBlueprintProgram } from "@/data/blueprintPackages";
import { HUG_SAMUI_SERVICES, getHugSamuiService } from "@/data/hugSamuiServices";
import { HUG_SAMUI_MENUS, getHugSamuiMenu } from "@/data/hugSamuiMenus";

/* ============================================================
 * Package pricing — a package's price is COMPOSED of its line
 * items (services + menus + activities) plus a platform fee, a
 * consult fee and a transaction fee. The customer only ever sees
 * the grand total; when they add/remove/swap a service or menu in
 * the customiser, the total recomputes from these parts.
 *
 * The default plan for a package is calibrated so its composed
 * total equals the package's listed price — so nothing jumps when
 * the customiser first opens; only edits move the number.
 * All deterministic (no Math.random): demo-safe.
 * ============================================================ */

export const PRICING = {
  /** Platform fee as a fraction of the items subtotal. */
  platformPct: 0.1,
  /** Flat expert-consult fee included in every package. */
  consultFee: 500,
  /** Payment processing fee on the pre-tax subtotal. */
  transactionPct: 0.03,
};

function hashId(id: string): number {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) % 100000;
  return h;
}
function roundTo(n: number, step: number): number {
  return Math.max(step, Math.round(n / step) * step);
}

/** Price of one Hug Samui service (data price, or a sensible fallback). */
export function servicePrice(id: string): number {
  const amt = getHugSamuiService(id)?.price.amount;
  if (typeof amt === "number" && amt > 0) return amt;
  return 1500 + (hashId(id) % 41) * 50; // 1,500–3,500
}

/** Price of one Hug Samui menu (data price, or a sensible fallback). */
export function menuPrice(id: string): number {
  const amt = getHugSamuiMenu(id)?.price.amount;
  if (typeof amt === "number" && amt > 0) return amt;
  return 250 + (hashId(id) % 41) * 10; // 250–650
}

export type PlanItemKind = "service" | "menu" | "activity";

export interface PlanLineItem {
  /** Stable per-row id (for React keys + drag). */
  uid: string;
  kind: PlanItemKind;
  /** Catalog id for service/menu rows; undefined for free activities. */
  refId?: string;
  label: LText;
  price: number;
  image?: string;
}

export interface PriceBreakdown {
  itemsSubtotal: number;
  platformFee: number;
  consultFee: number;
  transactionFee: number;
  total: number;
}

export function priceBreakdown(items: PlanLineItem[]): PriceBreakdown {
  const itemsSubtotal = items.reduce((s, i) => s + i.price, 0);
  const platformFee = Math.round(itemsSubtotal * PRICING.platformPct);
  const consultFee = PRICING.consultFee;
  const base = itemsSubtotal + platformFee + consultFee;
  const transactionFee = Math.round(base * PRICING.transactionPct);
  return { itemsSubtotal, platformFee, consultFee, transactionFee, total: base + transactionFee };
}

/** Items subtotal that yields ~targetTotal once fees are applied. */
function subtotalForTotal(target: number): number {
  const denom = (1 + PRICING.platformPct) * (1 + PRICING.transactionPct);
  const sub = (target - PRICING.consultFee * (1 + PRICING.transactionPct)) / denom;
  return Math.max(0, sub);
}

/**
 * The package's default plan as priced line items, calibrated so
 * the composed total equals the package's listed price.
 */
export function packageDefaultPlan(pkg: WellnessPackage): PlanLineItem[] {
  const program = getBlueprintProgram(pkg.id);
  const raw: {
    kind: PlanItemKind;
    refId?: string;
    label: LText;
    image?: string;
    weight: number;
  }[] = [];

  if (program) {
    for (const slot of program.slots) {
      const f = slot.fill;
      if (f.type === "service" && f.serviceId) {
        const s = getHugSamuiService(f.serviceId);
        raw.push({
          kind: "service",
          refId: f.serviceId,
          label: s?.name ?? slot.name,
          image: s?.media[0]?.publicPath,
          weight: servicePrice(f.serviceId),
        });
      } else if (f.type === "menu" && f.menuId) {
        const m = getHugSamuiMenu(f.menuId);
        raw.push({
          kind: "menu",
          refId: f.menuId,
          label: m?.name ?? slot.name,
          image: m?.image?.publicPath,
          weight: menuPrice(f.menuId),
        });
      } else {
        raw.push({ kind: "activity", label: slot.name, weight: 1200 });
      }
    }
  } else {
    for (const day of pkg.itinerary) {
      for (const item of day.items) {
        raw.push({ kind: "activity", label: item.activity, weight: 1000 });
      }
    }
  }

  if (raw.length === 0) return [];
  const rawSubtotal = raw.reduce((s, r) => s + r.weight, 0) || 1;
  const target = subtotalForTotal(pkg.price);
  return raw.map((r, i) => ({
    uid: `${r.kind}-${r.refId ?? "a"}-${i}`,
    kind: r.kind,
    refId: r.refId,
    label: r.label,
    image: r.image,
    price: roundTo((r.weight / rawSubtotal) * target, 50),
  }));
}

export interface CatalogEntry {
  kind: "service" | "menu";
  refId: string;
  label: LText;
  price: number;
  image?: string;
}

/** Everything a customer can add to their plan, with prices.
 *  (The POC catalog is all "draft" status, so we surface all of it.) */
export function addableCatalog(): { services: CatalogEntry[]; menus: CatalogEntry[] } {
  const services: CatalogEntry[] = HUG_SAMUI_SERVICES.map((s) => ({
    kind: "service",
    refId: s.id,
    label: s.name,
    price: servicePrice(s.id),
    image: s.media[0]?.publicPath,
  }));
  const menus: CatalogEntry[] = HUG_SAMUI_MENUS.map((m) => ({
    kind: "menu",
    refId: m.id,
    label: m.name,
    price: menuPrice(m.id),
    image: m.image?.publicPath,
  }));
  return { services, menus };
}

/** The composed total for a package's default plan (= its listed price). */
export function packageComposedTotal(pkg: WellnessPackage): number {
  return priceBreakdown(packageDefaultPlan(pkg)).total;
}
