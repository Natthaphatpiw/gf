"use client";

import Image from "next/image";
import Link from "next/link";
import { type ReactNode } from "react";
import {
  ArrowLeft,
  Ban,
  CheckCircle2,
  Clock,
  Leaf,
  MapPin,
  ShieldCheck,
  Sparkles,
  Target,
  Utensils,
} from "lucide-react";
import {
  BLUEPRINT_PROGRAM_DATA,
  type BlueprintProgram,
  type EvidenceLevel,
  type ProgramSlot,
} from "@/data/blueprintPackages";
import { getHugSamuiService } from "@/data/hugSamuiServices";
import { getHugSamuiMenu } from "@/data/hugSamuiMenus";
import { ConsultButton } from "@/components/consult/ConsultButton";
import { useL, useT } from "@/lib/i18n";
import programsDict from "@/lib/i18n/dictionaries/programs";

export function ProgramDetailClient({ program }: { program: BlueprintProgram }) {
  const t = useT(programsDict);
  const l = useL();

  return (
    <article className="bg-cream-50 pb-28 text-ink md:pb-20">
      {/* Hero */}
      <section className="relative">
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-teal-900 sm:aspect-[16/9] md:aspect-[21/9]">
          <Image
            src={program.image}
            alt={l(program.name)}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-teal-950/80 via-teal-950/25 to-teal-950/20" />
          <div className="absolute inset-x-0 bottom-0">
            <div className="mx-auto max-w-5xl px-4 pb-6 md:px-6 md:pb-9">
              <Link
                href="/programs"
                className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1.5 text-[0.8rem] font-semibold text-cream-50 backdrop-blur transition-colors hover:bg-white/25"
              >
                <ArrowLeft className="h-4 w-4" />
                {t.backToPrograms}
              </Link>
              <p className="mt-5 text-[0.78rem] font-medium uppercase tracking-[0.16em] text-cream-100/90">
                {l(program.subtitle)}
              </p>
              <h1 className="mt-1 font-display text-[2.1rem] font-semibold leading-[1.05] text-cream-50 sm:text-[2.8rem] md:text-[3.4rem]">
                {l(program.name)}
              </h1>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-3xl px-4 md:px-6">
        {/* Meta row */}
        <div className="-mt-6 flex flex-wrap items-center gap-2.5 md:-mt-7">
          <MetaPill icon={<MapPin className="h-3.5 w-3.5" />}>
            {t.tripPhase[program.tripPhase]}
          </MetaPill>
          <MetaPill icon={<Clock className="h-3.5 w-3.5" />}>
            {l(program.durationLabel)}
          </MetaPill>
          {program.priceFrom !== null && (
            <MetaPill>
              {t.detail.heroFrom} {program.priceFrom.toLocaleString("en-US")} {t.card.baht}
            </MetaPill>
          )}
          {program.safetyGateRequired && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-gold-100 px-3 py-1.5 text-[0.72rem] font-semibold text-gold-600 shadow-soft">
              <ShieldCheck className="h-3.5 w-3.5" />
              {t.card.doctorScreen}
            </span>
          )}
        </div>

        {/* Scenario claim */}
        <p className="mt-7 border-l-2 border-gold-400 pl-4 font-display text-[1.05rem] leading-relaxed text-teal-900 md:text-[1.25rem] md:leading-relaxed">
          “{l(program.scenarioClaim)}”
        </p>
        <p className="mt-4 text-[0.92rem] leading-relaxed text-ink-soft md:text-[0.98rem]">
          {l(program.tagline)}
        </p>

        {/* Pillars */}
        <div className="mt-5 flex flex-wrap gap-2">
          {program.pillars.map((p) => (
            <span
              key={p}
              className="inline-flex items-center gap-1.5 rounded-full bg-teal-50 px-3 py-1 text-[0.74rem] font-semibold text-teal-700"
            >
              <Leaf className="h-3.5 w-3.5" />
              {t.pillar[p]}
            </span>
          ))}
        </div>

        {/* Suitable for + why */}
        <Section icon={<Target className="h-4 w-4" />} title={t.detail.suitableFor}>
          <p className="text-[0.9rem] leading-relaxed text-ink-soft md:text-[0.96rem]">
            {l(program.suitableFor)}
          </p>
        </Section>

        <Section icon={<Sparkles className="h-4 w-4" />} title={t.detail.whyItWorks}>
          <p className="text-[0.9rem] leading-relaxed text-ink-soft md:text-[0.96rem]">
            {l(program.whyItWorks)}
          </p>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            {program.coreMechanisms.map((m, i) => (
              <div
                key={i}
                className="rounded-[1rem] border border-teal-900/10 bg-white p-4 shadow-soft"
              >
                <p className="font-display text-[1rem] font-semibold leading-tight text-teal-900">
                  {l(m.title)}
                </p>
                <p className="mt-1.5 text-[0.8rem] leading-relaxed text-ink-soft">
                  {l(m.detail)}
                </p>
              </div>
            ))}
          </div>
        </Section>

        {/* Inside the program — slot timeline */}
        <Section icon={<Utensils className="h-4 w-4" />} title={t.detail.inside}>
          <p className="text-[0.84rem] leading-relaxed text-ink-faint">
            {t.detail.insideNote}
          </p>
          <ol className="mt-5 space-y-3">
            {program.slots.map((slot) => (
              <SlotRow key={slot.order} slot={slot} />
            ))}
          </ol>
        </Section>

        {/* Triggers */}
        <Section title={t.detail.triggers}>
          <ul className="grid gap-2.5 sm:grid-cols-2">
            {program.triggers.map((tr, i) => (
              <li
                key={i}
                className="flex flex-col rounded-[0.9rem] border border-teal-900/10 bg-white px-3.5 py-3 shadow-soft"
              >
                <span className="text-[0.86rem] font-semibold text-teal-900">
                  {l(tr.label)}
                </span>
                <span className="mt-0.5 text-[0.78rem] leading-snug text-ink-soft">
                  {l(tr.criterion)}
                </span>
              </li>
            ))}
          </ul>
        </Section>

        {/* Outcomes */}
        <Section title={t.detail.outcomes}>
          <div className="overflow-hidden rounded-[1rem] border border-teal-900/10 bg-white shadow-soft">
            <div className="grid grid-cols-[minmax(0,9rem)_1fr] gap-x-4 text-[0.84rem]">
              <div className="border-b border-teal-900/10 bg-cream-100 px-4 py-2 text-[0.66rem] font-semibold uppercase tracking-[0.1em] text-ink-faint">
                {t.metricColumn.timepoint}
              </div>
              <div className="border-b border-teal-900/10 bg-cream-100 px-4 py-2 text-[0.66rem] font-semibold uppercase tracking-[0.1em] text-ink-faint">
                {t.metricColumn.measures}
              </div>
              {program.outcomeMetrics.map((om, i) => (
                <div key={i} className="contents">
                  <div className="min-w-0 break-words border-t border-teal-900/8 px-4 py-2.5 font-semibold text-teal-900">
                    {l(om.timepoint)}
                  </div>
                  <div className="min-w-0 border-t border-teal-900/8 px-4 py-2.5 text-ink-soft">
                    {l(om.measures)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Section>

        {/* Safety + expert */}
        <Section icon={<ShieldCheck className="h-4 w-4" />} title={t.detail.safety}>
          <div
            className={`rounded-[1rem] border p-4 text-[0.86rem] leading-relaxed ${
              program.safetyGateRequired
                ? "border-gold-400/60 bg-gold-100/50 text-gold-600"
                : "border-teal-900/10 bg-white text-ink-soft"
            }`}
          >
            {l(program.safetyGate)}
          </div>
          <p className="mt-3 text-[0.86rem] leading-relaxed text-ink-soft">
            <span className="font-semibold text-teal-800">{t.detail.expertLayer}: </span>
            {l(program.expertLayer)}
          </p>
        </Section>

        {/* Claims */}
        <Section title={t.detail.claims}>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-[1rem] border border-teal-700/20 bg-teal-50 p-4">
              <p className="flex items-center gap-1.5 text-[0.7rem] font-semibold uppercase tracking-[0.1em] text-teal-700">
                <CheckCircle2 className="h-3.5 w-3.5" />
                {t.detail.allowedClaim}
              </p>
              <p className="mt-2 text-[0.84rem] leading-relaxed text-teal-900">
                {l(program.allowedClaim)}
              </p>
            </div>
            <div className="rounded-[1rem] border border-ink/10 bg-white p-4">
              <p className="flex items-center gap-1.5 text-[0.7rem] font-semibold uppercase tracking-[0.1em] text-ink-faint">
                <Ban className="h-3.5 w-3.5" />
                {t.detail.forbiddenClaim}
              </p>
              <ul className="mt-2 space-y-1.5">
                {program.forbiddenClaims.map((fc, i) => (
                  <li key={i} className="flex gap-1.5 text-[0.82rem] leading-snug text-ink-soft">
                    <span aria-hidden className="text-ink-faint">·</span>
                    {l(fc)}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Section>

        {/* Consult an expert */}
        <div className="mt-8">
          <ConsultButton
            item={{
              itemType: "program",
              itemId: program.slug,
              itemName: program.name,
              itemImage: program.image,
            }}
            className="w-full"
          />
        </div>

        {/* Disclaimer */}
        <p className="mt-6 rounded-[0.9rem] bg-cream-100 px-4 py-3 text-[0.76rem] leading-relaxed text-ink-faint">
          {l(BLUEPRINT_PROGRAM_DATA.positioning.disclaimer)}
        </p>

        {/* CTA */}
        <div className="mt-8 flex flex-col gap-3 rounded-[1.3rem] bg-teal-800 p-6 text-center text-cream-50 shadow-lift sm:flex-row sm:items-center sm:justify-between sm:text-left md:p-8">
          <div>
            <h2 className="font-display text-xl font-semibold md:text-2xl">{l(program.name)}</h2>
            <p className="mt-1 text-[0.84rem] text-cream-100/85">{l(program.programIntent)}</p>
          </div>
          <Link
            href="/assessment"
            className="inline-flex flex-none items-center justify-center rounded-full bg-gold-400 px-6 py-3 text-[0.84rem] font-semibold text-teal-950 shadow-soft transition-transform hover:scale-[1.02]"
          >
            {t.detail.assessmentCta}
          </Link>
        </div>
      </div>
    </article>
  );
}

function MetaPill({ icon, children }: { icon?: ReactNode; children: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-[0.72rem] font-semibold text-teal-800 shadow-soft">
      {icon}
      {children}
    </span>
  );
}

function Section({
  icon,
  title,
  children,
}: {
  icon?: ReactNode;
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="mt-9 border-t border-teal-900/10 pt-7">
      <h2 className="flex items-center gap-2 font-display text-[1.35rem] font-semibold text-teal-900 md:text-[1.6rem]">
        {icon && <span className="text-gold-600">{icon}</span>}
        {title}
      </h2>
      <div className="mt-3.5">{children}</div>
    </section>
  );
}

const EVIDENCE_STYLE: Record<EvidenceLevel, string> = {
  A: "bg-teal-50 text-teal-700",
  B: "bg-gold-100 text-gold-600",
  C: "bg-cream-100 text-ink-faint",
};

function SlotRow({ slot }: { slot: ProgramSlot }) {
  const t = useT(programsDict);
  const l = useL();

  const service = slot.fill.serviceId ? getHugSamuiService(slot.fill.serviceId) : undefined;
  const menu = slot.fill.menuId ? getHugSamuiMenu(slot.fill.menuId) : undefined;
  const fillImage = service?.media[0]?.publicPath ?? menu?.image.publicPath;
  const fillName = service ? l(service.name) : menu ? l(menu.name) : l(slot.fill.partnerType);

  const fillTone =
    slot.fill.type === "service"
      ? "bg-teal-50 text-teal-700"
      : slot.fill.type === "menu"
        ? "bg-gold-100 text-gold-600"
        : slot.fill.type === "guidance"
          ? "bg-sage-100 text-teal-800"
          : "border border-dashed border-ink/20 bg-cream-100 text-ink-faint";

  return (
    <li className="rounded-[1.1rem] border border-teal-900/10 bg-white p-4 shadow-soft">
      <div className="flex gap-3.5">
        <span className="grid h-7 w-7 flex-none place-items-center rounded-full bg-teal-800 font-display text-[0.82rem] font-bold text-cream-50">
          {slot.order}
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-display text-[1.05rem] font-semibold leading-tight text-teal-900">
              {l(slot.name)}
            </h3>
            <span className="text-[0.72rem] font-medium text-ink-faint">{l(slot.duration)}</span>
          </div>
          <p className="mt-1.5 text-[0.82rem] leading-relaxed text-ink-soft">
            {l(slot.mechanism)}
          </p>

          <div className="mt-3 flex items-center gap-3 rounded-[0.8rem] bg-cream-50 p-2.5">
            {fillImage ? (
              <span className="relative h-11 w-11 flex-none overflow-hidden rounded-[0.6rem] bg-teal-900">
                <Image src={fillImage} alt={fillName} fill sizes="44px" className="object-cover" />
              </span>
            ) : (
              <span className="grid h-11 w-11 flex-none place-items-center rounded-[0.6rem] bg-cream-200 text-ink-faint">
                <Sparkles className="h-4 w-4" />
              </span>
            )}
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-1.5">
                <span className={`rounded-full px-2 py-0.5 text-[0.64rem] font-semibold ${fillTone}`}>
                  {t.fillType[slot.fill.type]}
                </span>
                <span className={`rounded-full px-2 py-0.5 text-[0.62rem] font-semibold ${EVIDENCE_STYLE[slot.evidenceLevel]}`}>
                  {t.evidence[slot.evidenceLevel]}
                </span>
              </div>
              <p className="mt-1 text-[0.8rem] font-semibold leading-snug text-ink">{fillName}</p>
              <p className="text-[0.74rem] leading-snug text-ink-faint">{l(slot.fill.note)}</p>
            </div>
          </div>
        </div>
      </div>
    </li>
  );
}
