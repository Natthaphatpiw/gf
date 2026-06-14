"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import {
  AlertTriangle,
  ArrowLeft,
  Clock,
  Coins,
  Info,
  Leaf,
  Sprout,
  X,
} from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";
import type {
  HugSamuiMenuCategory,
  HugSamuiMenuDataset,
  HugSamuiMenuGrade,
  HugSamuiMenuItem,
} from "@/data/hugSamuiMenus";
import { lockScroll, unlockScroll } from "@/lib/scroll-lock";
import { useL, useT } from "@/lib/i18n";
import partnersDict from "@/lib/i18n/dictionaries/partners";

const COURSE_ORDER: HugSamuiMenuCategory[] = [
  "starter",
  "soup",
  "main",
  "seafood",
  "drink",
];

type PartnersT = (typeof partnersDict)["th"];

export function HugSamuiMenusClient({ data }: { data: HugSamuiMenuDataset }) {
  const t = useT(partnersDict);
  const l = useL();
  const [selected, setSelected] = useState<HugSamuiMenuItem | null>(null);

  const partnerMenus = useMemo(
    () =>
      data.menus
        .filter((menu) => menu.isPartnerMenu)
        .sort((a, b) => a.sortOrder - b.sortOrder),
    [data.menus],
  );

  const courseGroups = useMemo(() => {
    return COURSE_ORDER.map((category) => ({
      category,
      items: partnerMenus.filter((menu) => menu.category === category),
    })).filter((group) => group.items.length > 0);
  }, [partnerMenus]);

  const heroMenus = partnerMenus.slice(0, 4);

  return (
    <article className="bg-cream-50 pb-28 text-ink md:pb-20">
      {/* Hero */}
      <section className="bg-white">
        <div className="mx-auto grid max-w-6xl gap-9 px-4 py-9 md:grid-cols-[minmax(0,1fr)_minmax(300px,0.82fr)] md:items-center md:gap-12 md:px-6 md:py-14">
          <div className="flex flex-col">
            <Link
              href={data.futureRoutes.partnerDetail}
              className="inline-flex w-fit items-center gap-2 text-[0.84rem] font-semibold text-teal-700 transition-colors hover:text-teal-900"
            >
              <ArrowLeft className="h-4 w-4" />
              {t.menuBack}
            </Link>

            <p className="eyebrow mt-7">{t.menuEyebrow}</p>
            <h1 className="mt-3 max-w-[24ch] font-display text-[2rem] font-semibold leading-[1.08] text-teal-900 sm:text-[2.4rem] md:text-[2.85rem]">
              {t.menuPageTitle}
            </h1>
            <p className="mt-4 max-w-xl text-[0.92rem] leading-relaxed text-ink-soft md:text-[0.98rem]">
              {t.menuPageIntro}
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <ButtonLink href="#menu-list" size="sm" className="px-5 py-2.5 text-[0.84rem]">
                {t.menuHeroPrimaryCta}
              </ButtonLink>
              <ButtonLink
                href={data.futureRoutes.partnerDetail}
                variant="secondary"
                size="sm"
                className="px-5 py-2.5 text-[0.84rem]"
              >
                {t.menuHeroSecondaryCta}
              </ButtonLink>
            </div>
          </div>

          <div className="mx-auto grid w-full max-w-[31rem] grid-cols-2 gap-3 md:gap-4">
            {heroMenus.map((menu, index) => (
              <figure
                key={menu.id}
                className={`relative aspect-[4/5] overflow-hidden rounded-[1.3rem] bg-teal-900 shadow-soft ring-1 ring-teal-900/10 ${
                  index % 2 === 1 ? "translate-y-6" : ""
                }`}
              >
                <Image
                  src={menu.image.publicPath}
                  alt={l(menu.image.alt)}
                  fill
                  sizes="(max-width: 767px) 45vw, 18rem"
                  className="object-cover"
                  priority={index < 2}
                />
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* House note strip */}
      <section className="border-y border-teal-900/10 bg-cream-100">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-5 text-[0.82rem] text-ink-soft sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-8 sm:gap-y-2 md:px-6 md:text-[0.86rem]">
          <HouseNote icon={<Clock className="h-4 w-4" />}>{t.menuMetaHours}</HouseNote>
          <HouseNote icon={<Coins className="h-4 w-4" />}>{t.menuMetaPrice}</HouseNote>
          <HouseNote icon={<Info className="h-4 w-4" />}>{t.menuMetaAllergy}</HouseNote>
        </div>
      </section>

      {/* Menu */}
      <section id="menu-list" className="bg-cream-50">
        <div className="mx-auto max-w-6xl px-4 py-10 md:px-6 md:py-16">
          <div className="space-y-12 md:space-y-16">
            {courseGroups.map((group) => (
              <div key={group.category}>
                <div className="flex items-center gap-4">
                  <h2 className="font-display text-[1.6rem] font-semibold leading-tight text-teal-900 md:text-[2.1rem]">
                    {t.menuCourseGroups[group.category]}
                  </h2>
                  <span className="h-px flex-1 bg-teal-900/12" />
                </div>

                <div className="mt-6 grid gap-4 md:mt-8 md:grid-cols-2 md:gap-5">
                  {group.items.map((menu) => (
                    <CompactMenuCard
                      key={menu.id}
                      menu={menu}
                      onOpen={() => setSelected(menu)}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {selected && (
        <MenuDetailModal menu={selected} onClose={() => setSelected(null)} />
      )}
    </article>
  );
}

function HouseNote({ icon, children }: { icon: ReactNode; children: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2">
      <span className="text-gold-600">{icon}</span>
      <span className="font-medium leading-snug">{children}</span>
    </span>
  );
}

/* ---------- Compact card (grid) ---------- */

function CompactMenuCard({
  menu,
  onOpen,
}: {
  menu: HugSamuiMenuItem;
  onOpen: () => void;
}) {
  const t = useT(partnersDict);
  const l = useL();
  const benefits = benefitLabels(menu.wellnessGoals, t).slice(0, 2);

  return (
    <button
      type="button"
      onClick={onOpen}
      className="group flex w-full gap-4 overflow-hidden rounded-[1.1rem] border border-teal-900/10 bg-white p-3 text-left shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-lift focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600/40 sm:p-3.5"
    >
      <div className="relative aspect-square w-24 flex-none overflow-hidden rounded-[0.85rem] bg-teal-900 sm:w-28">
        <Image
          src={menu.image.publicPath}
          alt={l(menu.image.alt)}
          fill
          sizes="(max-width: 767px) 6rem, 7rem"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>

      <div className="flex min-w-0 flex-1 flex-col py-0.5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-display text-[1.06rem] font-semibold leading-tight text-teal-900 break-words">
            {l(menu.name)}
          </h3>
          <span className="shrink-0 pt-0.5 text-[0.92rem] font-semibold text-gold-600">
            {l(menu.price.label)}
          </span>
        </div>

        <p className="mt-1.5 line-clamp-2 text-[0.8rem] leading-relaxed text-ink-soft">
          {l(menu.localStory)}
        </p>

        {benefits.length > 0 && (
          <div className="mt-auto flex flex-wrap gap-1.5 pt-2">
            {benefits.map((benefit, i) => (
              <span
                key={`${menu.id}-cb-${i}`}
                className="inline-flex items-center gap-1 rounded-full bg-teal-50 px-2 py-0.5 text-[0.68rem] font-semibold text-teal-800"
              >
                <Leaf className="h-3 w-3" />
                {benefit}
              </span>
            ))}
          </div>
        )}
      </div>
    </button>
  );
}

/* ---------- Detail modal ---------- */

function MenuDetailModal({
  menu,
  onClose,
}: {
  menu: HugSamuiMenuItem;
  onClose: () => void;
}) {
  const t = useT(partnersDict);
  const l = useL();
  const [shown, setShown] = useState(false);

  useEffect(() => {
    setShown(true);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    lockScroll();
    return () => {
      document.removeEventListener("keydown", onKey);
      unlockScroll();
    };
  }, [onClose]);

  const ingredients = menu.heroIngredients.slice(0, 5);
  const benefits = benefitLabels(menu.wellnessGoals, t);
  const allergens = menu.safety.allergenLabels;
  const rawAdvisory =
    menu.grade === "safety_gate" ? menu.safety.warnings[0] : undefined;
  const nutrition = nutritionRows(menu, t);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={l(menu.name)}
      className="fixed inset-0 z-[60] flex items-end justify-center sm:items-center"
    >
      <button
        type="button"
        aria-label={t.menuClose}
        onClick={onClose}
        className={`absolute inset-0 bg-teal-950/45 backdrop-blur-[2px] transition-opacity duration-200 ${
          shown ? "opacity-100" : "opacity-0"
        }`}
      />

      <div
        className={`relative flex max-h-[92vh] w-full flex-col overflow-hidden rounded-t-[1.4rem] bg-cream-50 shadow-deep transition-all duration-200 sm:max-h-[88vh] sm:max-w-lg sm:rounded-[1.4rem] ${
          shown ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0 sm:translate-y-3"
        }`}
      >
        <div className="relative aspect-[16/10] flex-none bg-teal-900">
          <Image
            src={menu.image.publicPath}
            alt={l(menu.image.alt)}
            fill
            sizes="(max-width: 639px) 100vw, 32rem"
            className="object-cover"
          />
          <div className="absolute left-3 top-3">
            <CharacterChip grade={menu.grade} label={t.menuCharacterLabels[menu.grade]} />
          </div>
          <button
            type="button"
            aria-label={t.menuClose}
            onClick={onClose}
            className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-white/92 text-teal-900 shadow-soft backdrop-blur transition-colors hover:bg-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto p-5 md:p-6">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <h2 className="font-display text-[1.5rem] font-semibold leading-tight text-teal-900 break-words md:text-[1.7rem]">
                {l(menu.name)}
              </h2>
              <p className="mt-0.5 text-[0.82rem] font-medium leading-snug text-ink-soft">
                {l(menu.englishName)}
              </p>
            </div>
            <p className="shrink-0 pt-1 font-display text-[1.25rem] font-semibold leading-none text-gold-600">
              {l(menu.price.label)}
            </p>
          </div>

          <p className="mt-3 text-[0.88rem] leading-relaxed text-ink-soft">
            {l(menu.localStory)}
          </p>

          {benefits.length > 0 && (
            <div className="mt-5">
              <Label icon={<Leaf className="h-3.5 w-3.5" />}>
                {t.menuWellnessBenefits}
              </Label>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {benefits.map((benefit, i) => (
                  <span
                    key={`${menu.id}-mb-${i}`}
                    className="rounded-full bg-teal-50 px-2.5 py-1 text-[0.74rem] font-semibold text-teal-800 ring-1 ring-teal-700/15"
                  >
                    {benefit}
                  </span>
                ))}
              </div>
            </div>
          )}

          {ingredients.length > 0 && (
            <div className="mt-5">
              <Label>{t.menuHeroIngredients}</Label>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {ingredients.map((item, i) => (
                  <span
                    key={`${menu.id}-mi-${i}`}
                    className="rounded-full bg-cream-100 px-2.5 py-1 text-[0.74rem] font-medium text-ink-soft"
                  >
                    {l(item)}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="mt-5 flex flex-col gap-3 border-t border-teal-900/10 pt-4">
            {nutrition.length > 0 && (
              <div className="flex flex-wrap items-baseline gap-x-5 gap-y-1.5">
                {nutrition.map((item) => (
                  <span key={item.label} className="inline-flex items-baseline gap-1.5">
                    <span className="text-[0.66rem] font-semibold uppercase tracking-[0.08em] text-ink-soft">
                      {item.label}
                    </span>
                    <span className="text-[0.86rem] font-semibold text-ink">
                      {item.value}
                    </span>
                  </span>
                ))}
              </div>
            )}

            {allergens.length > 0 && (
              <p className="text-[0.78rem] leading-snug text-ink-soft">
                <span className="font-semibold text-ink">{t.menuAllergens}: </span>
                {allergens.map((a) => l(a)).join(", ")}
              </p>
            )}

            {rawAdvisory && (
              <div className="flex items-start gap-2 rounded-[0.7rem] bg-gold-100/70 px-3 py-2 text-[0.78rem] leading-snug text-ink">
                <AlertTriangle className="mt-0.5 h-3.5 w-3.5 flex-none text-gold-600" />
                <span>{l(rawAdvisory)}</span>
              </div>
            )}
          </div>

          <div className="mt-4 flex items-center gap-1.5 text-[0.72rem] font-medium text-teal-700/80">
            <Sprout className="h-3.5 w-3.5" />
            {t.menuTrustLine}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------- helpers ---------- */

function benefitLabels(goals: string[], t: PartnersT) {
  const map = t.menuBenefits as Record<string, string>;
  const out: string[] = [];
  for (const goal of goals) {
    const label = map[goal];
    if (label && !out.includes(label)) out.push(label);
  }
  return out;
}

function nutritionRows(menu: HugSamuiMenuItem, t: PartnersT) {
  const rows: { label: string; value: string }[] = [];
  if (menu.nutrition.caloriesKcal !== null) {
    rows.push({
      label: t.menuCalories,
      value: `${menu.nutrition.caloriesKcal} ${t.menuCaloriesUnit}`,
    });
  }
  if (menu.nutrition.proteinG !== null) {
    rows.push({
      label: t.menuProtein,
      value: `${menu.nutrition.proteinG} ${t.menuGram}`,
    });
  }
  if (menu.nutrition.fiberG !== null) {
    rows.push({
      label: t.menuFiber,
      value: `${menu.nutrition.fiberG} ${t.menuGram}`,
    });
  }
  return rows;
}

function Label({ icon, children }: { icon?: ReactNode; children: ReactNode }) {
  return (
    <p className="flex items-center gap-1.5 text-[0.66rem] font-semibold uppercase tracking-[0.12em] text-gold-600">
      {icon}
      {children}
    </p>
  );
}

function CharacterChip({
  grade,
  label,
}: {
  grade: HugSamuiMenuGrade;
  label: string;
}) {
  const dot =
    grade === "wellness" || grade === "near_wellness"
      ? "bg-teal-600"
      : grade === "optimize"
        ? "bg-gold-500"
        : "bg-gold-600";

  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-white/92 px-2.5 py-1 text-[0.7rem] font-semibold text-ink shadow-soft ring-1 ring-black/5 backdrop-blur">
      <span className={`h-1.5 w-1.5 rounded-full ${dot}`} />
      {label}
    </span>
  );
}
