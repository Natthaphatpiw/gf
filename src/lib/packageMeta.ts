import type { LText, WellnessPackage } from "@/lib/types";

/* ============================================================
 * Deterministic display meta for a package — a mock launch
 * discount, a star rating + review count, and the list of
 * included services/menus ("what's inside"). All derived from
 * the package id so they're stable across renders (no DB, no
 * Math.random). Marketing dressing only — not real commerce.
 * ============================================================ */

function hashId(id: string): number {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) % 100000;
  return h;
}

export interface PackageMeta {
  /** Launch discount %, 25–55. */
  discountPct: number;
  /** The struck-through "before" price. */
  originalPrice: number;
  /** Star rating 4.5–5.0. */
  rating: number;
  /** Review count. */
  reviews: number;
}

export function packageMeta(pkg: WellnessPackage): PackageMeta {
  const h = hashId(pkg.id);
  const discountPct = 25 + (h % 31); // 25..55
  const rating = (45 + (h % 6)) / 10; // 4.5..5.0
  const reviews = 6 + (h % 40); // 6..45
  const originalPrice =
    pkg.price > 0
      ? Math.round(pkg.price / (1 - discountPct / 100) / 100) * 100
      : 0;
  return { discountPct, originalPrice, rating, reviews };
}

/** The package's included services/menus, for the "what's inside" chips. */
export function packageInside(pkg: WellnessPackage): LText[] {
  const seen = new Set<string>();
  const out: LText[] = [];
  for (const day of pkg.itinerary) {
    for (const item of day.items) {
      const key = item.activity.en || item.activity.th;
      if (!key || seen.has(key)) continue;
      seen.add(key);
      out.push(item.activity);
    }
  }
  return out;
}
