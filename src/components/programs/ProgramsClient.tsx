"use client";

import Link from "next/link";
import { useRef, useState, type ReactNode } from "react";
import { ArrowLeft, ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import {
  BLUEPRINT_PROGRAMS,
  BLUEPRINT_PROGRAM_DATA,
} from "@/data/blueprintPackages";
import { HUG_SAMUI_SERVICES } from "@/data/hugSamuiServices";
import { HUG_SAMUI_MENUS } from "@/data/hugSamuiMenus";
import { getPartnerBrand } from "@/lib/catalog";
import { useL, useT } from "@/lib/i18n";
import programsDict from "@/lib/i18n/dictionaries/programs";
import { ProgramCard } from "@/components/programs/ProgramCard";
import { BrowseCard } from "@/components/programs/BrowseCard";
import { ItemDetailModal, type OpenItem } from "@/components/programs/ItemDetailModal";

export function ProgramsClient({ embedded = false }: { embedded?: boolean }) {
  const t = useT(programsDict);
  const l = useL();
  const [openItem, setOpenItem] = useState<OpenItem | null>(null);

  const rails = (
    <div className="space-y-12 md:space-y-16">
      {/* Programs */}
      <Rail
        title={t.programsSection.title}
        subtitle={t.programsSection.subtitle}
        scrollLeftLabel={t.a11y.scrollLeft}
        scrollRightLabel={t.a11y.scrollRight}
      >
        {BLUEPRINT_PROGRAMS.map((program) => (
          <ProgramCard key={program.id} program={program} />
        ))}
      </Rail>

      {/* Services */}
      <Rail
        title={t.servicesSection.title}
        subtitle={t.servicesSection.subtitle}
        scrollLeftLabel={t.a11y.scrollLeft}
        scrollRightLabel={t.a11y.scrollRight}
      >
        {HUG_SAMUI_SERVICES.map((service) => (
          <BrowseCard
            key={service.id}
            itemType="service"
            itemId={service.id}
            image={service.media[0]?.publicPath}
            alt={service.media[0]?.alt ?? service.name}
            title={service.name}
            subtitle={service.summary}
            meta={service.price.label}
            brand={getPartnerBrand(service.partnerId)}
            onOpen={() => setOpenItem({ itemType: "service", itemId: service.id })}
          />
        ))}
      </Rail>

      {/* Menus */}
      <Rail
        title={t.menusSection.title}
        subtitle={t.menusSection.subtitle}
        scrollLeftLabel={t.a11y.scrollLeft}
        scrollRightLabel={t.a11y.scrollRight}
      >
        {HUG_SAMUI_MENUS.map((menu) => (
          <BrowseCard
            key={menu.id}
            itemType="menu"
            itemId={menu.id}
            image={menu.image?.publicPath}
            alt={menu.image?.alt ?? menu.name}
            title={menu.name}
            subtitle={menu.localStory}
            meta={menu.price.label}
            brand={menu.isPartnerMenu ? getPartnerBrand(menu.partnerId) : null}
            onOpen={() => setOpenItem({ itemType: "menu", itemId: menu.id })}
          />
        ))}
      </Rail>
    </div>
  );

  const modal = <ItemDetailModal item={openItem} onClose={() => setOpenItem(null)} />;

  /* ----- Landing-embedded variant ----- */
  if (embedded) {
    return (
      <section className="bg-cream-50">
        <div className="mx-auto max-w-6xl px-4 py-12 md:px-6 md:py-16">
          <div className="max-w-2xl">
            <p className="eyebrow">{t.landing.eyebrow}</p>
            <h2 className="mt-2 font-display text-3xl font-semibold leading-tight text-teal-900 md:text-[2.5rem]">
              {t.landing.title}
            </h2>
            <p className="mt-3 text-[0.92rem] leading-relaxed text-ink-soft md:text-[0.98rem]">
              {t.landing.intro}
            </p>
            <Link
              href="/assessment"
              className="mt-5 inline-flex items-center gap-2 rounded-full bg-teal-700 px-5 py-2.5 text-[0.84rem] font-semibold text-cream-50 shadow-soft transition-colors hover:bg-teal-800"
            >
              <Sparkles className="h-4 w-4" />
              {t.landing.assessCta}
            </Link>
          </div>
          <div className="mt-10 md:mt-12">{rails}</div>
        </div>
        {modal}
      </section>
    );
  }

  /* ----- Standalone /programs page ----- */
  return (
    <div className="bg-cream-50 pb-28 text-ink md:pb-20">
      <header className="bg-white">
        <div className="mx-auto max-w-6xl px-4 py-9 md:px-6 md:py-12">
          <Link
            href="/"
            className="inline-flex w-fit items-center gap-2 text-[0.84rem] font-semibold text-teal-700 transition-colors hover:text-teal-900"
          >
            <ArrowLeft className="h-4 w-4" />
            {t.back}
          </Link>
          <p className="eyebrow mt-7">{t.page.eyebrow}</p>
          <h1 className="mt-3 max-w-[20ch] font-display text-[2rem] font-semibold leading-[1.08] text-teal-900 sm:text-[2.4rem] md:text-[2.9rem]">
            {t.page.title}
          </h1>
          <p className="mt-4 max-w-2xl text-[0.92rem] leading-relaxed text-ink-soft md:text-[0.98rem]">
            {t.page.intro}
          </p>
          <p className="mt-4 max-w-2xl text-[0.76rem] leading-relaxed text-ink-faint">
            {l(BLUEPRINT_PROGRAM_DATA.positioning.disclaimer)}
          </p>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-4 py-10 md:px-6 md:py-14">{rails}</div>
      {modal}
    </div>
  );
}

function Rail({
  title,
  subtitle,
  scrollLeftLabel,
  scrollRightLabel,
  children,
}: {
  title: string;
  subtitle: string;
  scrollLeftLabel: string;
  scrollRightLabel: string;
  children: ReactNode;
}) {
  const railRef = useRef<HTMLDivElement>(null);
  const scroll = (dir: -1 | 1) => {
    const rail = railRef.current;
    if (!rail) return;
    rail.scrollBy({ left: dir * rail.clientWidth * 0.85, behavior: "smooth" });
  };

  return (
    <section>
      <div className="flex items-end justify-between gap-4">
        <div className="min-w-0">
          <h2 className="font-display text-[1.55rem] font-semibold leading-tight text-teal-900 md:text-[2rem]">
            {title}
          </h2>
          <p className="mt-2 max-w-2xl text-[0.84rem] leading-relaxed text-ink-soft md:text-[0.92rem]">
            {subtitle}
          </p>
        </div>
        <div className="flex flex-none items-center gap-2">
          <button
            type="button"
            onClick={() => scroll(-1)}
            aria-label={scrollLeftLabel}
            className="grid h-9 w-9 place-items-center rounded-full border border-teal-900/10 bg-white text-teal-800 shadow-soft transition-colors hover:bg-teal-50"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => scroll(1)}
            aria-label={scrollRightLabel}
            className="grid h-9 w-9 place-items-center rounded-full border border-teal-900/10 bg-white text-teal-800 shadow-soft transition-colors hover:bg-teal-50"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div
        ref={railRef}
        className="no-scrollbar -mx-4 mt-5 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 md:mx-0 md:gap-5 md:px-0"
      >
        {children}
      </div>
    </section>
  );
}
