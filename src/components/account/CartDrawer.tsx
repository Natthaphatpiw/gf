"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, type ReactNode } from "react";
import { Heart, ShoppingBag, Trash2, X } from "lucide-react";
import { useAccount, type ItemType } from "@/lib/account";
import { resolveItem } from "@/lib/catalog";
import { lockScroll, unlockScroll } from "@/lib/scroll-lock";
import { useL, useT } from "@/lib/i18n";
import accountDict from "@/lib/i18n/dictionaries/account";
import consultDict from "@/lib/i18n/dictionaries/consult";

export function CartDrawer() {
  const { cartOpen, closeCart, cart, favorites, removeFromCart, toggleFavorite, user, logout } =
    useAccount();
  const t = useT(accountDict);
  const tc = useT(consultDict);
  const l = useL();

  useEffect(() => {
    if (!cartOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && closeCart();
    document.addEventListener("keydown", onKey);
    lockScroll();
    return () => {
      document.removeEventListener("keydown", onKey);
      unlockScroll();
    };
  }, [cartOpen, closeCart]);

  if (!cartOpen) return null;

  const cartCount = cart.length;

  return (
    <div className="fixed inset-0 z-[70] flex justify-end">
      <button
        type="button"
        aria-label={t.cart.close}
        onClick={closeCart}
        className="absolute inset-0 bg-teal-950/45 backdrop-blur-[2px]"
      />
      <aside className="relative flex h-full w-full max-w-md flex-col bg-cream-50 shadow-deep">
        <header className="flex items-center justify-between border-b border-teal-900/10 px-5 py-4">
          <div className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5 text-teal-700" />
            <h2 className="font-display text-xl font-semibold text-teal-900">{t.cart.title}</h2>
            {cartCount > 0 && (
              <span className="rounded-full bg-teal-50 px-2 py-0.5 text-[0.7rem] font-semibold text-teal-700">
                {cartCount === 1 ? t.cart.itemsOne : t.cart.itemsOther.replace("{n}", String(cartCount))}
              </span>
            )}
          </div>
          <button
            type="button"
            aria-label={t.cart.close}
            onClick={closeCart}
            className="grid h-8 w-8 place-items-center rounded-full text-teal-800 transition-colors hover:bg-teal-50"
          >
            <X className="h-5 w-5" />
          </button>
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5">
          {user && (
            <div className="mb-4 flex items-center justify-between rounded-[0.8rem] bg-cream-100 px-3.5 py-2.5">
              <p className="text-[0.82rem] text-ink-soft">
                {t.account.greeting},{" "}
                <span className="font-semibold text-teal-900">{user.firstName}</span>
              </p>
              <button
                type="button"
                onClick={logout}
                className="text-[0.78rem] font-semibold text-teal-700 hover:text-teal-900"
              >
                {t.account.logout}
              </button>
            </div>
          )}

          {user && (
            <Link
              href="/orders"
              onClick={closeCart}
              className="mb-4 flex items-center justify-between rounded-[0.8rem] border border-teal-900/10 bg-white px-3.5 py-2.5 text-[0.84rem] font-semibold text-teal-800 transition-colors hover:bg-teal-50"
            >
              {tc.orders.navTitle}
              <span aria-hidden>›</span>
            </Link>
          )}

          {/* Cart */}
          {cartCount === 0 ? (
            <div className="rounded-[1rem] border border-dashed border-teal-900/15 bg-white px-4 py-8 text-center">
              <ShoppingBag className="mx-auto h-7 w-7 text-ink-faint" />
              <p className="mt-2 text-[0.86rem] font-semibold text-teal-900">{t.cart.empty}</p>
              <p className="mt-1 text-[0.78rem] text-ink-faint">{t.cart.emptyHint}</p>
            </div>
          ) : (
            <ul className="space-y-2.5">
              {cart.map((line) => (
                <ItemRow
                  key={`${line.itemType}:${line.itemId}`}
                  itemType={line.itemType}
                  itemId={line.itemId}
                  onClose={closeCart}
                  action={
                    <button
                      type="button"
                      aria-label={t.cart.remove}
                      onClick={() => removeFromCart(line.itemType, line.itemId)}
                      className="grid h-8 w-8 flex-none place-items-center rounded-full text-ink-faint transition-colors hover:bg-red-50 hover:text-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  }
                />
              ))}
            </ul>
          )}

          {/* Favourites */}
          {favorites.length > 0 && (
            <div className="mt-7">
              <p className="flex items-center gap-1.5 text-[0.66rem] font-semibold uppercase tracking-[0.12em] text-gold-600">
                <Heart className="h-3.5 w-3.5" />
                {t.item.favorite}
              </p>
              <ul className="mt-2.5 space-y-2.5">
                {favorites.map((f) => (
                  <ItemRow
                    key={`${f.itemType}:${f.itemId}`}
                    itemType={f.itemType}
                    itemId={f.itemId}
                    onClose={closeCart}
                    action={
                      <button
                        type="button"
                        aria-label={t.item.favorite}
                        onClick={() => toggleFavorite(f.itemType, f.itemId)}
                        className="grid h-8 w-8 flex-none place-items-center rounded-full text-gold-500 transition-colors hover:bg-gold-100"
                      >
                        <Heart className="h-4 w-4 fill-current" />
                      </button>
                    }
                  />
                ))}
              </ul>
            </div>
          )}
        </div>

        {cartCount > 0 && (
          <div className="border-t border-teal-900/10 px-5 py-4">
            <button
              type="button"
              className="w-full rounded-full bg-teal-700 py-3 text-[0.86rem] font-semibold text-cream-50 shadow-soft transition-colors hover:bg-teal-800"
            >
              {t.cart.checkout}
            </button>
          </div>
        )}
      </aside>
    </div>
  );

  function ItemRow({
    itemType,
    itemId,
    action,
    onClose,
  }: {
    itemType: ItemType;
    itemId: string;
    action: ReactNode;
    onClose: () => void;
  }) {
    const item = resolveItem(itemType, itemId);
    if (!item) return null;
    const body = (
      <>
        <span className="relative h-12 w-12 flex-none overflow-hidden rounded-[0.6rem] bg-teal-900">
          {item.image && (
            <Image src={item.image} alt={l(item.name)} fill sizes="48px" className="object-cover" />
          )}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate text-[0.86rem] font-semibold text-teal-900">
            {l(item.name)}
          </span>
          <span className="block text-[0.74rem] text-ink-faint">
            {item.price ? l(item.price) : item.brand ? l(item.brand.name) : ""}
          </span>
        </span>
      </>
    );
    return (
      <li className="flex items-center gap-3 rounded-[0.9rem] border border-teal-900/8 bg-white p-2.5">
        {item.href ? (
          <Link href={item.href} onClick={onClose} className="flex min-w-0 flex-1 items-center gap-3">
            {body}
          </Link>
        ) : (
          <span className="flex min-w-0 flex-1 items-center gap-3">{body}</span>
        )}
        {action}
      </li>
    );
  }
}
