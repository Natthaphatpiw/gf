"use client";

import { Heart } from "lucide-react";
import { useT } from "@/lib/i18n";
import packagesDict from "@/lib/i18n/dictionaries/packages";
import { getPackage } from "@/data/packages";
import { useAccount } from "@/lib/account";
import { ButtonLink } from "@/components/ui/Button";
import { PackageCard } from "@/components/packages/PackageCard";

/* ============================================================
 * /favorites — the guest's saved programs (account favourites).
 * ============================================================ */

export default function FavoritesPage() {
  const t = useT(packagesDict).favorites;
  const { favorites, ready } = useAccount();

  const packages = favorites
    .filter((f) => f.itemType === "program")
    .map((f) => getPackage(f.itemId))
    .filter((p): p is NonNullable<typeof p> => Boolean(p));

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 md:px-6 md:py-12">
      <header className="animate-rise mb-8 text-center md:mb-12">
        <p className="eyebrow">{t.eyebrow}</p>
        <h1 className="mt-2 font-display text-4xl font-semibold text-teal-900 md:text-5xl">
          {t.title}
        </h1>
        <div className="ornament mt-4" />
        <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-ink-soft">
          {t.intro}
        </p>
      </header>

      {ready && packages.length === 0 ? (
        <section className="animate-fade mx-auto flex max-w-md flex-col items-center rounded-3xl border border-teal-900/10 bg-white px-6 py-16 text-center shadow-soft">
          <span className="grid h-16 w-16 place-items-center rounded-full bg-teal-50 text-teal-700">
            <Heart className="h-7 w-7" />
          </span>
          <h2 className="mt-5 font-display text-2xl font-semibold text-teal-900">
            {t.emptyTitle}
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-ink-soft">
            {t.emptyBody}
          </p>
          <div className="mt-6">
            <ButtonLink href="/packages" variant="primary" size="md">
              {t.emptyCta}
            </ButtonLink>
          </div>
        </section>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {packages.map((pkg) => (
            <PackageCard key={pkg.id} pkg={pkg} />
          ))}
        </div>
      )}
    </div>
  );
}
