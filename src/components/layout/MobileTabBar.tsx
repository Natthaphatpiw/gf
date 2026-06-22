"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Compass, Sparkles, Heart, CalendarCheck, TrendingUp } from "lucide-react";
import { useT } from "@/lib/i18n";
import common from "@/lib/i18n/dictionaries/common";

/* ============================================================
 * App-like bottom tab bar — mobile only.
 * ============================================================ */

export function MobileTabBar() {
  const t = useT(common);
  const pathname = usePathname();

  const tabs = [
    { href: "/", label: t.nav.home, icon: Home, exact: true },
    { href: "/assessment", label: t.nav.assessment, icon: Sparkles },
    { href: "/packages", label: t.nav.packages, icon: Compass },
    { href: "/impact", label: t.nav.impact, icon: TrendingUp },
    { href: "/favorites", label: t.nav.favorites, icon: Heart },
    { href: "/orders", label: t.nav.bookings, icon: CalendarCheck },
  ];

  return (
    <nav className="pb-safe fixed inset-x-0 bottom-0 z-40 border-t border-teal-900/8 bg-cream-50/95 backdrop-blur-md md:hidden">
      <div className="grid grid-cols-6">
        {tabs.map((tab) => {
          const active = tab.exact
            ? pathname === tab.href
            : pathname.startsWith(tab.href);
          const Icon = tab.icon;
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`flex flex-col items-center gap-1 py-2.5 transition-colors ${
                active ? "text-teal-500" : "text-ink-faint"
              }`}
            >
              <Icon
                className={`h-5 w-5 ${active ? "stroke-[2.2]" : "stroke-[1.6]"}`}
              />
              <span
                className={`max-w-16 truncate text-[0.58rem] tracking-wide ${
                  active ? "font-semibold" : "font-medium"
                }`}
              >
                {tab.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
