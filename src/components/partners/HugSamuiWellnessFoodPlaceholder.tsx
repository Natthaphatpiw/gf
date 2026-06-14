"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";
import {
  HUG_SAMUI_SERVICE_DATA,
  HUG_SAMUI_SERVICE_HREF,
} from "@/data/hugSamuiServices";
import { useT } from "@/lib/i18n";
import partnersDict from "@/lib/i18n/dictionaries/partners";

export function HugSamuiWellnessFoodPlaceholder() {
  const t = useT(partnersDict);

  return (
    <article className="min-h-[calc(100svh-4rem)] bg-white pb-28 md:pb-16">
      <section className="mx-auto flex max-w-4xl flex-col px-4 py-14 md:px-6 md:py-20">
        <Link
          href={HUG_SAMUI_SERVICE_HREF}
          className="inline-flex w-fit items-center gap-2 text-sm font-semibold text-teal-700 transition-colors hover:text-teal-900"
        >
          <ArrowLeft className="h-4 w-4" />
          {t.wellnessFoodBackToServices}
        </Link>

        <div className="mt-10 border-y border-teal-900/10 py-10">
          <h1 className="font-display text-[2.4rem] font-semibold leading-[0.98] text-teal-900 md:text-[4rem]">
            {t.futureFoodTitle}
          </h1>
          <p className="mt-5 max-w-2xl text-sm leading-relaxed text-ink-soft md:text-base">
            {t.futureFoodDescription}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <ButtonLink href={HUG_SAMUI_SERVICE_HREF} variant="secondary">
              {t.wellnessFoodBackToServices}
            </ButtonLink>
            <ButtonLink href={HUG_SAMUI_SERVICE_DATA.futureRoutes.partnerDetail}>
              {t.wellnessFoodBackToPartner}
            </ButtonLink>
          </div>
        </div>
      </section>
    </article>
  );
}
