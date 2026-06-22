"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Star, ArrowRight } from "lucide-react";
import { useL, useLocale, useT } from "@/lib/i18n";
import impactDict from "@/lib/i18n/dictionaries/impact";
import common from "@/lib/i18n/dictionaries/common";
import { DIAL_NAMES, DIAL_DIRECTION } from "@/data/checkin";
import { getPackage } from "@/data/packages";
import type { DialKey, PackageTier } from "@/lib/types";
import type { DialOutcome, OutcomeOverview, PackageOutcome } from "@/lib/outcome-stats";

/* ============================================================
 * ImpactClient — the public, aggregate pre/post dashboard.
 * Pooled, anonymised outcomes that show our programs work, in a
 * calm, easy-to-read layout. Reads /api/outcomes (Supabase-backed
 * when seeded, in-code dataset otherwise).
 * ============================================================ */

const pct = (share: number): number => Math.round(share * 100);

export function ImpactClient() {
  const t = useT(impactDict);
  const [data, setData] = useState<OutcomeOverview | null>(null);

  useEffect(() => {
    let alive = true;
    fetch("/api/outcomes", { cache: "no-store" })
      .then((r) => r.json())
      .then((d: OutcomeOverview) => alive && setData(d))
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, []);

  if (!data) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-5xl items-center justify-center px-4">
        <p className="text-sm text-ink-soft">{t.loading}</p>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-b from-cream-50 via-cream-100 to-teal-50/30">
      <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 md:py-16">
        <Hero />
        <StatStrip data={data} />
        <Highlights data={data} />
        <DialsSection data={data} />
        <PackagesSection data={data} />
        <Methodology data={data} />
        <ClosingCta />
      </div>
    </div>
  );
}

/* ---------------- hero ---------------- */

function Hero() {
  const t = useT(impactDict);
  return (
    <header className="mx-auto max-w-2xl text-center">
      <p className="eyebrow">{t.eyebrow}</p>
      <h1 className="landing-heading mt-3 whitespace-pre-line font-display text-3xl font-semibold leading-tight text-teal-900 md:text-[2.6rem]">
        {t.title}
      </h1>
      <div className="ornament my-5" />
      <p className="landing-copy mx-auto max-w-xl text-[0.95rem] leading-relaxed text-ink-soft">
        {t.intro}
      </p>
    </header>
  );
}

/* ---------------- top stats ---------------- */

function StatStrip({ data }: { data: OutcomeOverview }) {
  const t = useT(impactDict);
  const { locale } = useLocale();
  const num = (n: number) => n.toLocaleString(locale === "th" ? "th-TH" : "en-US");

  const items = [
    { value: num(data.totalParticipants), label: t.stats.guests, star: false },
    { value: data.avgRating.toFixed(1), label: t.stats.satisfaction, star: true },
    { value: String(data.packagesMeasured), label: t.stats.packages, star: false },
  ];

  return (
    <div className="mt-10 grid gap-3 sm:grid-cols-3">
      {items.map((it) => (
        <div
          key={it.label}
          className="rounded-3xl border border-teal-900/8 bg-white/80 px-5 py-6 text-center shadow-soft"
        >
          <div className="flex items-center justify-center gap-1.5">
            <span className="font-display text-4xl font-bold text-teal-700">{it.value}</span>
            {it.star && <Star className="h-6 w-6 fill-gold-400 text-gold-400" />}
          </div>
          <p className="landing-copy mt-2 text-[0.82rem] leading-snug text-ink-soft">{it.label}</p>
        </div>
      ))}
    </div>
  );
}

/* ---------------- headline highlights ---------------- */

function dialByKey(data: OutcomeOverview, key: DialKey): DialOutcome | undefined {
  return data.dials.find((d) => d.dial === key);
}

function Highlights({ data }: { data: OutcomeOverview }) {
  const t = useT(impactDict);
  const chips = [
    { share: dialByKey(data, "stress")?.improvedShare ?? 0, label: t.highlights.lessStress },
    { share: dialByKey(data, "sleep")?.improvedShare ?? 0, label: t.highlights.betterSleep },
    { share: dialByKey(data, "energy")?.improvedShare ?? 0, label: t.highlights.moreEnergy },
  ];

  return (
    <section className="mt-14">
      <h2 className="text-center font-display text-xl font-semibold text-teal-900">
        {t.highlights.title}
      </h2>
      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        {chips.map((c) => (
          <div
            key={c.label}
            className="rounded-3xl bg-teal-700 px-6 py-7 text-center text-cream-50 shadow-lift"
          >
            <p className="font-display text-5xl font-bold text-gold-300">{pct(c.share)}%</p>
            <p className="mt-1 text-[0.7rem] uppercase tracking-[0.18em] text-cream-100/70">
              {t.highlights.ofGuests}
            </p>
            <p className="landing-copy mt-2 text-[0.95rem] font-medium">{c.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ---------------- five dials, before/after ---------------- */

function DialsSection({ data }: { data: OutcomeOverview }) {
  const t = useT(impactDict);
  return (
    <section className="mt-16">
      <div className="text-center">
        <h2 className="font-display text-2xl font-semibold text-teal-900">{t.dials.title}</h2>
        <p className="landing-copy mt-2 text-[0.9rem] text-ink-soft">{t.dials.intro}</p>
      </div>
      <div className="mt-7 space-y-3">
        {data.dials.map((d) => (
          <DialRow key={d.dial} dial={d} />
        ))}
      </div>
    </section>
  );
}

function Bar({ value, tone, label }: { value: number; tone: "before" | "after"; label: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className="w-10 shrink-0 text-[0.66rem] uppercase tracking-wide text-ink-faint">
        {label}
      </span>
      <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-cream-200">
        <div
          className={`h-full rounded-full ${tone === "after" ? "bg-teal-600" : "bg-sage-300"}`}
          style={{ width: `${Math.max(2, Math.min(100, value))}%` }}
        />
      </div>
      <span
        className={`w-7 shrink-0 text-right text-[0.74rem] font-semibold ${
          tone === "after" ? "text-teal-700" : "text-ink-faint"
        }`}
      >
        {value}
      </span>
    </div>
  );
}

function DialRow({ dial }: { dial: DialOutcome }) {
  const t = useT(impactDict);
  const l = useL();
  const lowerIsBetter = DIAL_DIRECTION[dial.dial] === "lowerIsBetter";
  const word = lowerIsBetter ? t.dials.reduced : t.dials.improved;

  return (
    <div className="rounded-2xl border border-teal-900/8 bg-white/80 px-4 py-4 shadow-soft sm:px-5">
      <div className="flex items-center gap-4">
        <div className="min-w-0 flex-1">
          <div className="flex items-baseline justify-between gap-2">
            <h3 className="truncate text-[0.92rem] font-semibold text-ink">{l(DIAL_NAMES[dial.dial])}</h3>
            <span className="shrink-0 text-[0.74rem] text-ink-faint">
              {t.dials.guestsImproved.replace("{pct}", String(pct(dial.improvedShare)))}
            </span>
          </div>
          <div className="mt-2.5 space-y-1.5">
            <Bar value={dial.avgBefore} tone="before" label={t.dials.before} />
            <Bar value={dial.avgAfter} tone="after" label={t.dials.after} />
          </div>
        </div>
        <div className="w-[4.5rem] shrink-0 border-l border-teal-900/8 pl-3 text-center">
          <div className="font-display text-2xl font-bold text-teal-700">{dial.improvementPct}%</div>
          <div className="text-[0.7rem] font-medium text-gold-600">{word}</div>
        </div>
      </div>
    </div>
  );
}

/* ---------------- per-package outcomes ---------------- */

const TIERS: PackageTier[] = ["basic", "premium", "deluxe"];

function PackagesSection({ data }: { data: OutcomeOverview }) {
  const t = useT(impactDict);
  const tc = useT(common);
  const [tier, setTier] = useState<PackageTier | "all">("all");

  const filtered = useMemo(
    () => data.byPackage.filter((p) => tier === "all" || p.tier === tier),
    [data.byPackage, tier],
  );

  const filters: { key: PackageTier | "all"; label: string }[] = [
    { key: "all", label: t.packages.filterAll },
    ...TIERS.map((k) => ({ key: k, label: tc.tier[k] })),
  ];

  return (
    <section className="mt-16">
      <div className="text-center">
        <h2 className="font-display text-2xl font-semibold text-teal-900">{t.packages.title}</h2>
        <p className="landing-copy mt-2 text-[0.9rem] text-ink-soft">{t.packages.intro}</p>
      </div>

      <div className="mt-6 flex flex-wrap justify-center gap-2">
        {filters.map((f) => (
          <button
            key={f.key}
            type="button"
            aria-pressed={tier === f.key}
            onClick={() => setTier(f.key)}
            className={`rounded-full px-4 py-1.5 text-[0.82rem] font-semibold transition-colors ${
              tier === f.key
                ? "bg-teal-700 text-cream-50"
                : "border border-teal-900/12 bg-white text-teal-800 hover:bg-teal-50/50"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="mt-8 text-center text-sm text-ink-soft">{t.packages.empty}</p>
      ) : (
        <div className="mt-7 grid gap-4 sm:grid-cols-2">
          {filtered.map((p) => (
            <PackageCard key={p.packageId} outcome={p} />
          ))}
        </div>
      )}
    </section>
  );
}

function PackageCard({ outcome }: { outcome: PackageOutcome }) {
  const t = useT(impactDict);
  const tc = useT(common);
  const l = useL();
  const { locale } = useLocale();
  const pkg = getPackage(outcome.packageId);
  if (!pkg) return null;

  const lowerIsBetter = DIAL_DIRECTION[outcome.headline.dial] === "lowerIsBetter";
  const word = lowerIsBetter ? t.dials.reduced : t.dials.improved;

  return (
    <Link
      href={`/packages/${pkg.id}`}
      className="group flex flex-col rounded-3xl border border-teal-900/8 bg-white/85 p-5 shadow-soft transition-all hover:-translate-y-0.5 hover:border-teal-700/20 hover:shadow-lift"
    >
      <div className="flex items-center justify-between gap-2">
        <span className="rounded-full bg-sage-100 px-2.5 py-0.5 text-[0.66rem] font-semibold uppercase tracking-wide text-teal-800">
          {tc.tier[pkg.tier]}
        </span>
        <span className="flex items-center gap-1 text-[0.76rem] font-semibold text-ink-soft">
          <Star className="h-3.5 w-3.5 fill-gold-400 text-gold-400" />
          {outcome.avgRating.toFixed(1)}
        </span>
      </div>

      <h3 className="mt-3 font-display text-lg font-semibold leading-snug text-teal-900">
        {l(pkg.name)}
      </h3>
      <p className="mt-0.5 text-[0.78rem] text-ink-faint">
        {t.packages.participants.replace(
          "{n}",
          outcome.participants.toLocaleString(locale === "th" ? "th-TH" : "en-US"),
        )}
      </p>

      <div className="mt-4 rounded-2xl bg-cream-100 px-4 py-3">
        <p className="text-[0.68rem] uppercase tracking-[0.14em] text-gold-600">
          {t.packages.topChange}
        </p>
        <div className="mt-1 flex items-baseline gap-2">
          <span className="font-display text-3xl font-bold text-teal-700">
            {outcome.headline.improvementPct}%
          </span>
          <span className="text-[0.84rem] font-medium text-ink-soft">
            {l(DIAL_NAMES[outcome.headline.dial])} {word}
          </span>
        </div>
        <div className="mt-2 h-2 overflow-hidden rounded-full bg-cream-200">
          <div
            className="h-full rounded-full bg-gradient-to-r from-teal-500 to-teal-700"
            style={{ width: `${Math.max(4, Math.min(100, outcome.headline.improvementPct))}%` }}
          />
        </div>
      </div>

      <span className="mt-4 inline-flex items-center gap-1 text-[0.82rem] font-semibold text-teal-700 transition-colors group-hover:text-teal-900">
        {t.packages.view}
        <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
      </span>
    </Link>
  );
}

/* ---------------- methodology + cta ---------------- */

function Methodology({ data }: { data: OutcomeOverview }) {
  const t = useT(impactDict);
  const { locale } = useLocale();
  const updated = data.window.to
    ? new Date(data.window.to).toLocaleDateString(locale === "th" ? "th-TH" : "en-GB", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "";

  return (
    <section className="mt-16 rounded-3xl border border-teal-900/8 bg-white/70 px-6 py-7">
      <h2 className="font-display text-lg font-semibold text-teal-900">{t.method.title}</h2>
      <p className="landing-copy mt-2 text-[0.86rem] leading-relaxed text-ink-soft">{t.method.body}</p>
      <p className="mt-3 text-[0.8rem] italic leading-relaxed text-ink-faint">{t.method.disclaimer}</p>
      {updated && (
        <p className="mt-3 text-[0.74rem] text-ink-faint">
          {t.method.updated}: {updated}
        </p>
      )}
    </section>
  );
}

function ClosingCta() {
  const t = useT(impactDict);
  return (
    <section className="mt-12 rounded-3xl bg-teal-900 px-6 py-10 text-center text-cream-50">
      <h2 className="landing-heading mx-auto max-w-md font-display text-2xl font-semibold leading-snug">
        {t.cta.title}
      </h2>
      <p className="landing-copy mx-auto mt-2 max-w-md text-[0.9rem] text-cream-100/80">{t.cta.body}</p>
      <Link
        href="/assessment"
        className="mt-6 inline-flex items-center gap-2 rounded-full bg-gold-400 px-7 py-3 text-[0.9rem] font-semibold text-teal-950 shadow-lift transition-transform hover:scale-[1.02]"
      >
        {t.cta.button}
        <ArrowRight className="h-4 w-4" />
      </Link>
    </section>
  );
}
