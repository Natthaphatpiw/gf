"use client";

import Image from "next/image";
import { Heart } from "lucide-react";
import type { LText } from "@/lib/types";
import { useAccount, type ItemType } from "@/lib/account";
import type { PartnerBrand } from "@/lib/catalog";
import { useL } from "@/lib/i18n";

export function BrowseCard({
  itemType,
  itemId,
  image,
  alt,
  title,
  subtitle,
  meta,
  brand,
  onOpen,
}: {
  itemType: ItemType;
  itemId: string;
  image?: string;
  alt: LText;
  title: LText;
  subtitle: LText;
  meta?: LText;
  brand: PartnerBrand | null;
  onOpen: () => void;
}) {
  const l = useL();
  const { isFavorite, toggleFavorite } = useAccount();
  const fav = isFavorite(itemType, itemId);

  return (
    <button
      type="button"
      onClick={onOpen}
      className="group flex w-[64vw] flex-none snap-start flex-col overflow-hidden rounded-[1.2rem] bg-white text-left shadow-soft ring-1 ring-teal-900/8 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lift focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600/40 sm:w-[16rem]"
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-teal-900">
        {image && (
          <Image
            src={image}
            alt={l(alt)}
            fill
            sizes="(max-width: 639px) 64vw, 16rem"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        )}
        <span
          role="button"
          tabIndex={0}
          aria-pressed={fav}
          onClick={(e) => {
            e.stopPropagation();
            toggleFavorite(itemType, itemId);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              e.stopPropagation();
              toggleFavorite(itemType, itemId);
            }
          }}
          className="absolute right-2.5 top-2.5 grid h-8 w-8 cursor-pointer place-items-center rounded-full bg-white/90 shadow-soft backdrop-blur transition-colors hover:bg-white"
        >
          <Heart
            className={`h-4 w-4 transition-colors ${
              fav ? "fill-gold-500 text-gold-500" : "text-teal-800"
            }`}
          />
        </span>
      </div>

      <div className="flex flex-1 flex-col p-3.5">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-display text-[1.02rem] font-semibold leading-tight text-teal-900 break-words">
            {l(title)}
          </h3>
          {meta && (
            <span className="shrink-0 pt-0.5 text-[0.82rem] font-semibold text-gold-600">
              {l(meta)}
            </span>
          )}
        </div>
        <p className="mt-1 line-clamp-2 text-[0.76rem] leading-relaxed text-ink-soft">
          {l(subtitle)}
        </p>

        {/* shop brand — bottom-right, only when a shop owns this item */}
        <div className="mt-3 flex min-h-[1.5rem] items-end justify-end">
          {brand && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-cream-100 py-1 pl-1 pr-2.5">
              <span className="relative h-5 w-5 flex-none overflow-hidden rounded-full bg-white ring-1 ring-teal-900/10">
                <Image src={brand.logo} alt={l(brand.name)} fill sizes="20px" className="object-cover" />
              </span>
              <span className="text-[0.66rem] font-semibold text-ink-soft">{l(brand.name)}</span>
            </span>
          )}
        </div>
      </div>
    </button>
  );
}
