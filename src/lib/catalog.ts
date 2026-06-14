import { getBlueprintProgram } from "@/data/blueprintPackages";
import { getHugSamuiService } from "@/data/hugSamuiServices";
import { getHugSamuiMenu } from "@/data/hugSamuiMenus";
import { getPartner } from "@/data/partners";
import type { LText } from "@/lib/types";
import type { ItemType } from "@/lib/account";

/* ============================================================
 * Client-safe catalog helpers — resolve a {type,id} cart /
 * favourite item to its display data, and look up the owning
 * shop (logo + name) for the badge on each card.
 * ============================================================ */

export interface PartnerBrand {
  id: string;
  name: LText;
  logo: string;
}

export function getPartnerBrand(partnerId?: string | null): PartnerBrand | null {
  if (!partnerId) return null;
  const p = getPartner(partnerId);
  if (!p || !p.logo) return null;
  return { id: p.id, name: p.name, logo: p.logo };
}

function bahtFrom(amount: number | null | undefined): LText | undefined {
  if (amount == null) return undefined;
  const n = amount.toLocaleString("en-US");
  return { th: `฿${n}`, en: `THB ${n}` };
}

export interface ResolvedItem {
  itemType: ItemType;
  itemId: string;
  name: LText;
  image?: string;
  href?: string;
  price?: LText;
  brand: PartnerBrand | null;
}

export function resolveItem(itemType: ItemType, itemId: string): ResolvedItem | null {
  if (itemType === "program") {
    const p = getBlueprintProgram(itemId);
    if (!p) return null;
    return {
      itemType,
      itemId,
      name: p.name,
      image: p.image,
      href: `/programs/${p.slug}`,
      price: bahtFrom(p.priceFrom),
      brand: null,
    };
  }
  if (itemType === "service") {
    const s = getHugSamuiService(itemId);
    if (!s) return null;
    return {
      itemType,
      itemId,
      name: s.name,
      image: s.media[0]?.publicPath,
      brand: getPartnerBrand(s.partnerId),
    };
  }
  if (itemType === "menu") {
    const m = getHugSamuiMenu(itemId);
    if (!m) return null;
    return {
      itemType,
      itemId,
      name: m.name,
      image: m.image?.publicPath,
      price: m.price.label,
      brand: m.isPartnerMenu ? getPartnerBrand(m.partnerId) : null,
    };
  }
  return null;
}
