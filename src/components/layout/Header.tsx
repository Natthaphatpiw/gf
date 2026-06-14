"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Heart, ShoppingBag, User } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { useT, useLocale } from "@/lib/i18n";
import common from "@/lib/i18n/dictionaries/common";
import accountDict from "@/lib/i18n/dictionaries/account";
import { useAccount } from "@/lib/account";

/* ============================================================
 * Desktop / tablet header. On mobile the tab bar handles nav,
 * so the header stays slim: logo + favourites + language.
 * ============================================================ */

function LocaleSwitch() {
  const { locale, setLocale } = useLocale();
  return (
    <div className="flex items-center overflow-hidden rounded-full border border-teal-700/25 text-[0.7rem] font-semibold tracking-wider">
      <button
        onClick={() => setLocale("th")}
        className={`px-3 py-1.5 transition-colors ${
          locale === "th"
            ? "bg-teal-700 text-cream-50"
            : "text-teal-700 hover:bg-teal-50"
        }`}
        aria-label="Switch to Thai"
      >
        TH
      </button>
      <button
        onClick={() => setLocale("en")}
        className={`px-3 py-1.5 transition-colors ${
          locale === "en"
            ? "bg-teal-700 text-cream-50"
            : "text-teal-700 hover:bg-teal-50"
        }`}
        aria-label="Switch to English"
      >
        EN
      </button>
    </div>
  );
}

export function Header() {
  const t = useT(common);
  const ta = useT(accountDict);
  const { user, cartCount, favCount, openCart, openAuth } = useAccount();
  const pathname = usePathname();

  const links = [
    { href: "/", label: t.nav.home },
    { href: "/assessment", label: t.nav.assessment },
    { href: "/packages", label: t.nav.packages },
    { href: "/experts", label: t.nav.experts },
    { href: "/bookings", label: t.nav.bookings },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-teal-900/8 bg-cream-100/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Logo sub={t.brandSub} />

        <nav className="hidden items-center gap-7 md:flex">
          {links.map((link) => {
            const active =
              link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`text-[0.8rem] font-medium tracking-wide transition-colors ${
                  active
                    ? "text-teal-800"
                    : "text-ink-faint hover:text-teal-700"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={openCart}
            aria-label={t.nav.favorites}
            className="relative hidden h-9 w-9 place-items-center rounded-full text-teal-700 transition-colors hover:bg-teal-50 sm:grid"
          >
            <Heart className="h-[18px] w-[18px]" />
            {favCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 grid h-4 min-w-4 place-items-center rounded-full bg-gold-500 px-1 text-[0.58rem] font-bold text-white">
                {favCount}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={openCart}
            aria-label={ta.cart.open}
            className="relative grid h-9 w-9 place-items-center rounded-full text-teal-700 transition-colors hover:bg-teal-50"
          >
            <ShoppingBag className="h-[18px] w-[18px]" />
            {cartCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 grid h-4 min-w-4 place-items-center rounded-full bg-teal-700 px-1 text-[0.58rem] font-bold text-cream-50">
                {cartCount}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={user ? openCart : openAuth}
            aria-label={user ? ta.account.myAccount : ta.auth.loginTab}
            className="grid h-9 w-9 place-items-center rounded-full text-teal-700 transition-colors hover:bg-teal-50"
          >
            {user ? (
              <span className="grid h-7 w-7 place-items-center rounded-full bg-teal-700 text-[0.74rem] font-bold uppercase text-cream-50">
                {user.firstName.charAt(0)}
              </span>
            ) : (
              <User className="h-[18px] w-[18px]" />
            )}
          </button>

          <LocaleSwitch />
        </div>
      </div>
    </header>
  );
}
