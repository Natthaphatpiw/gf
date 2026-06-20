"use client";

import Link from "next/link";
import { LeafMark } from "@/components/ui/Logo";
import { useT } from "@/lib/i18n";
import common from "@/lib/i18n/dictionaries/common";

/* ============================================================
 * Footer — desktop-leaning; mobile gets extra bottom padding so
 * the tab bar never covers content.
 * ============================================================ */

export function Footer() {
  const t = useT(common);

  return (
    <footer className="mt-20 border-t border-teal-900/10 bg-teal-900 pb-28 text-cream-100 md:pb-10">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
          <div className="flex items-center gap-3 text-cream-50">
            <LeafMark className="h-10 w-10" variant="white" />
            <div>
              <p className="font-display text-xl font-semibold tracking-wide">
                Goodfill Care
              </p>
              <p className="text-xs tracking-[0.25em] text-gold-400 uppercase">
                {t.brandSub}
              </p>
            </div>
          </div>
          <p className="max-w-sm text-sm leading-relaxed text-cream-100/70">
            {t.footer.tagline}
          </p>
        </div>

        <div className="mt-10 flex flex-col items-start justify-between gap-4 border-t border-cream-50/10 pt-6 text-xs text-cream-100/50 md:flex-row md:items-center">
          <p>
            © {new Date().getFullYear()} Goodfill Care · {t.footer.rights}
          </p>
          <div className="flex gap-6">
            <Link
              href="/privacy"
              className="transition-colors hover:text-cream-50"
            >
              {t.footer.privacy}
            </Link>
            <a
              href="mailto:care@goodfillcare.com"
              className="transition-colors hover:text-cream-50"
            >
              {t.footer.contact}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
