"use client";

import Image from "next/image";
import { useEffect, type ReactNode } from "react";
import { Check, Clock, Heart, MapPin, ShoppingBag, X } from "lucide-react";
import { getHugSamuiService } from "@/data/hugSamuiServices";
import { getHugSamuiMenu } from "@/data/hugSamuiMenus";
import { getPartnerBrand } from "@/lib/catalog";
import { useAccount, type ItemType } from "@/lib/account";
import { ConsultButton } from "@/components/consult/ConsultButton";
import { lockScroll, unlockScroll } from "@/lib/scroll-lock";
import { useL, useT } from "@/lib/i18n";
import accountDict from "@/lib/i18n/dictionaries/account";
import type { LText } from "@/lib/types";

export interface OpenItem {
  itemType: ItemType;
  itemId: string;
}

export function ItemDetailModal({
  item,
  onClose,
}: {
  item: OpenItem | null;
  onClose: () => void;
}) {
  const t = useT(accountDict);
  const l = useL();
  const { addToCart, isInCart, isFavorite, toggleFavorite } = useAccount();

  useEffect(() => {
    if (!item) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    lockScroll();
    return () => {
      document.removeEventListener("keydown", onKey);
      unlockScroll();
    };
  }, [item, onClose]);

  if (!item) return null;

  const view = item.itemType === "service" ? serviceView(item.itemId) : menuView(item.itemId);
  if (!view) return null;

  const inCart = isInCart(item.itemType, item.itemId);
  const fav = isFavorite(item.itemType, item.itemId);

  return (
    <div className="fixed inset-0 z-[75] flex items-end justify-center sm:items-center">
      <button
        type="button"
        aria-label={t.cart.close}
        onClick={onClose}
        className="absolute inset-0 bg-teal-950/50 backdrop-blur-[2px]"
      />
      <div className="relative flex max-h-[92vh] w-full flex-col overflow-hidden rounded-t-[1.4rem] bg-cream-50 shadow-deep sm:max-h-[88vh] sm:max-w-md sm:rounded-[1.4rem]">
        <div className="relative aspect-[16/10] flex-none bg-teal-900">
          {view.image && (
            <Image src={view.image} alt={l(view.name)} fill sizes="(max-width:639px) 100vw, 28rem" className="object-cover" />
          )}
          {view.brand && (
            <span className="absolute bottom-3 right-3 inline-flex items-center gap-1.5 rounded-full bg-white/92 py-1 pl-1 pr-2.5 shadow-soft backdrop-blur">
              <span className="relative h-5 w-5 flex-none overflow-hidden rounded-full bg-white">
                <Image src={view.brand.logo} alt={l(view.brand.name)} fill sizes="20px" className="object-cover" />
              </span>
              <span className="text-[0.68rem] font-semibold text-ink">{l(view.brand.name)}</span>
            </span>
          )}
          <button
            type="button"
            aria-label={t.cart.close}
            onClick={onClose}
            className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-white/92 text-teal-900 shadow-soft backdrop-blur transition-colors hover:bg-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto p-5 md:p-6">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h2 className="font-display text-[1.4rem] font-semibold leading-tight text-teal-900 break-words md:text-[1.55rem]">
                {l(view.name)}
              </h2>
              {view.subtitle && (
                <p className="mt-0.5 text-[0.8rem] font-medium text-ink-faint">{l(view.subtitle)}</p>
              )}
            </div>
            {view.price && (
              <p className="shrink-0 pt-1 font-display text-[1.2rem] font-semibold text-gold-600">
                {l(view.price)}
              </p>
            )}
          </div>

          {view.description && (
            <p className="mt-3 text-[0.88rem] leading-relaxed text-ink-soft">{l(view.description)}</p>
          )}

          {view.meta.length > 0 && (
            <div className="mt-4 space-y-2.5">
              {view.meta.map((m, i) => (
                <div key={i} className="flex items-start gap-2.5 text-[0.82rem] text-ink-soft">
                  <span className="mt-0.5 text-gold-600">{m.icon}</span>
                  <span>{l(m.text)}</span>
                </div>
              ))}
            </div>
          )}

          {view.chips.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-1.5">
              {view.chips.map((c, i) => (
                <span
                  key={i}
                  className="rounded-full bg-teal-50 px-2.5 py-1 text-[0.72rem] font-semibold text-teal-800 ring-1 ring-teal-700/15"
                >
                  {l(c)}
                </span>
              ))}
            </div>
          )}

          {view.allergens && (
            <p className="mt-4 text-[0.76rem] leading-snug text-ink-soft">
              <span className="font-semibold text-ink">{view.allergensLabel}: </span>
              {view.allergens}
            </p>
          )}
        </div>

        <div className="flex-none space-y-2.5 border-t border-teal-900/10 p-4">
          <ConsultButton
            item={{
              itemType: item.itemType,
              itemId: item.itemId,
              itemName: view.name,
              itemImage: view.image,
            }}
            className="w-full"
          />
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => toggleFavorite(item.itemType, item.itemId)}
              aria-pressed={fav}
              aria-label={t.item.favorite}
              className={`grid h-12 w-12 flex-none place-items-center rounded-full border transition-colors ${
                fav ? "border-gold-400 bg-gold-100/60 text-gold-500" : "border-teal-900/15 bg-white text-teal-800 hover:bg-teal-50"
              }`}
            >
              <Heart className={`h-5 w-5 ${fav ? "fill-current" : ""}`} />
            </button>
            <button
              type="button"
              onClick={() => addToCart(item.itemType, item.itemId)}
              className={`flex flex-1 items-center justify-center gap-2 rounded-full py-3 text-[0.86rem] font-semibold shadow-soft transition-colors ${
                inCart ? "bg-teal-50 text-teal-700" : "bg-teal-700 text-cream-50 hover:bg-teal-800"
              }`}
            >
              {inCart ? <Check className="h-4 w-4" /> : <ShoppingBag className="h-4 w-4" />}
              {inCart ? t.item.inCart : t.item.addToCart}
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  /* ---- builders ---- */

  interface View {
    name: LText;
    subtitle?: LText;
    image?: string;
    price?: LText;
    description?: LText;
    meta: { icon: ReactNode; text: LText }[];
    chips: LText[];
    allergens?: string;
    allergensLabel?: string;
    brand: ReturnType<typeof getPartnerBrand>;
  }

  function serviceView(id: string): View | null {
    const s = getHugSamuiService(id);
    if (!s) return null;
    const meta: View["meta"] = [];
    if (s.schedule.timeLabel) meta.push({ icon: <Clock className="h-4 w-4" />, text: s.schedule.timeLabel });
    if (s.location?.area) meta.push({ icon: <MapPin className="h-4 w-4" />, text: s.location.area });
    return {
      name: s.name,
      subtitle: s.shortName,
      image: s.media[0]?.publicPath,
      price: s.price.label,
      description: s.description ?? s.summary,
      meta,
      chips: s.audience ?? [],
      brand: getPartnerBrand(s.partnerId),
    };
  }

  function menuView(id: string): View | null {
    const m = getHugSamuiMenu(id);
    if (!m) return null;
    return {
      name: m.name,
      subtitle: m.englishName,
      image: m.image?.publicPath,
      price: m.price.label,
      description: m.localStory,
      meta: [],
      chips: m.nutrition.highlights.slice(0, 3),
      allergens: m.safety.allergenLabels.map((a) => l(a)).join(", ") || undefined,
      allergensLabel: t.item.contains,
      brand: m.isPartnerMenu ? getPartnerBrand(m.partnerId) : null,
    };
  }
}
