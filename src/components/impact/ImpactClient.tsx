"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import Link from "next/link";
import { Star, ArrowRight } from "lucide-react";
import { useL, useLocale, useT } from "@/lib/i18n";
import impactDict from "@/lib/i18n/dictionaries/impact";
import common from "@/lib/i18n/dictionaries/common";
import { getPackage } from "@/data/packages";
import type { DialKey, PackageTier } from "@/lib/types";
import type { DialOutcome, OutcomeOverview, PackageOutcome } from "@/lib/outcome-stats";

/* ============================================================
 * ImpactClient — the public, aggregate pre/post dashboard, framed
 * around HOW MUCH the average indices move (in points) and shown
 * as charts: a before/after bar chart, a "profile lift" line
 * chart, a composition donut, and a package × index heatmap.
 * Charts are hand-rolled SVG/HTML in the brand palette (no deps).
 * ============================================================ */

/* brand palette (literal hex, matches @theme tokens) */
const TEAL = "#0D5E57";
const TEAL_DEEP = "#1B3B36";
const TEAL_BRIGHT = "#15B5AA";
const GOLD = "#E6B53B";
const GOLD_DEEP = "#C59622";
const SAGE = "#C9BE9C";
const CREAM = "#F3EEDC";
const INK_SOFT = "#3D5C57";
const INK_FAINT = "#83968f";

const DIAL_COLOR: Record<DialKey, string> = {
  stress: TEAL_DEEP,
  migraine: GOLD_DEEP,
  sleep: TEAL,
  mind: TEAL_BRIGHT,
  energy: GOLD,
};

const DIAL_ORDER: DialKey[] = ["stress", "migraine", "sleep", "mind", "energy"];

function orderedDials(data: OutcomeOverview): DialOutcome[] {
  return DIAL_ORDER.map((k) => data.dials.find((d) => d.dial === k)).filter(
    (d): d is DialOutcome => Boolean(d),
  );
}

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
        <BarSection data={data} />
        <LineSection data={data} />
        <DonutSection data={data} />
        <HeatmapSection data={data} />
        <Methodology data={data} />
        <ClosingCta />
      </div>
    </div>
  );
}

/* ---------------- hero + stats ---------------- */

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

/* ---------------- highlights: top average point shifts ---------------- */

function Highlights({ data }: { data: OutcomeOverview }) {
  const t = useT(impactDict);
  const top = [...data.dials]
    .sort((a, b) => b.improvementPoints - a.improvementPoints)
    .slice(0, 3);

  return (
    <section className="mt-14">
      <h2 className="text-center font-display text-xl font-semibold text-teal-900">
        {t.highlights.title}
      </h2>
      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        {top.map((d) => {
          const word = d.direction === "lowerIsBetter" ? t.decreased : t.increased;
          return (
            <div
              key={d.dial}
              className="rounded-3xl bg-teal-700 px-6 py-7 text-center text-cream-50 shadow-lift"
            >
              <p className="font-display text-5xl font-bold text-gold-300">
                {d.improvementPoints}
                <span className="ml-1 text-xl font-semibold text-cream-100/80">{t.unit}</span>
              </p>
              <p className="landing-copy mt-2 text-[0.95rem] font-medium">
                {t.dialShort[d.dial]} {word} {t.highlights.avg}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}

/* ---------------- shared section heading ---------------- */

function SectionHead({ title, intro }: { title: string; intro: string }) {
  return (
    <div className="text-center">
      <h2 className="font-display text-2xl font-semibold text-teal-900">{title}</h2>
      <p className="landing-copy mx-auto mt-2 max-w-xl text-[0.9rem] text-ink-soft">{intro}</p>
    </div>
  );
}

function ChartCard({ children }: { children: ReactNode }) {
  return (
    <div className="mt-7 rounded-3xl border border-teal-900/8 bg-white/80 p-5 shadow-soft sm:p-6">
      {children}
    </div>
  );
}

/* ---------------- BAR: average index, before vs after ---------------- */

function BarSection({ data }: { data: OutcomeOverview }) {
  const t = useT(impactDict);
  const dials = orderedDials(data);

  const W = 500;
  const H = 300;
  const mL = 30;
  const mR = 12;
  const mT = 22;
  const mB = 56;
  const pw = W - mL - mR;
  const ph = H - mT - mB;
  const yBase = mT + ph;
  const yOf = (v: number) => yBase - (v / 100) * ph;
  const gw = pw / dials.length;
  const bw = Math.min(24, gw * 0.26);

  return (
    <section className="mt-16">
      <SectionHead title={t.bar.title} intro={t.bar.intro} />
      <ChartCard>
        <Legend
          items={[
            { color: SAGE, label: t.before },
            { color: TEAL, label: t.after },
          ]}
        />
        <div className="mt-3 overflow-x-auto no-scrollbar">
          <svg viewBox={`0 0 ${W} ${H}`} className="w-full min-w-[460px]" role="img" aria-label={t.bar.title}>
            {[0, 25, 50, 75, 100].map((g) => (
              <g key={g}>
                <line x1={mL} y1={yOf(g)} x2={W - mR} y2={yOf(g)} stroke={CREAM} strokeWidth={1} />
                <text x={mL - 6} y={yOf(g) + 3} fontSize={10} fill={INK_FAINT} textAnchor="end">
                  {g}
                </text>
              </g>
            ))}
            {dials.map((d, i) => {
              const cx = mL + (i + 0.5) * gw;
              const goodDown = d.direction === "lowerIsBetter";
              const deltaText = `${d.avgDelta > 0 ? "+" : ""}${d.avgDelta}`;
              return (
                <g key={d.dial}>
                  <rect
                    x={cx - bw - 2}
                    y={yOf(d.avgBefore)}
                    width={bw}
                    height={yBase - yOf(d.avgBefore)}
                    rx={3}
                    fill={SAGE}
                  />
                  <rect
                    x={cx + 2}
                    y={yOf(d.avgAfter)}
                    width={bw}
                    height={yBase - yOf(d.avgAfter)}
                    rx={3}
                    fill={TEAL}
                  />
                  <text x={cx - bw / 2 - 2} y={yOf(d.avgBefore) - 4} fontSize={10} fill={INK_FAINT} textAnchor="middle">
                    {d.avgBefore}
                  </text>
                  <text x={cx + bw / 2 + 2} y={yOf(d.avgAfter) - 4} fontSize={10} fontWeight={700} fill={TEAL} textAnchor="middle">
                    {d.avgAfter}
                  </text>
                  <text x={cx} y={yBase + 16} fontSize={11} fill={INK_SOFT} textAnchor="middle">
                    {t.dialShort[d.dial]}
                  </text>
                  <text
                    x={cx}
                    y={yBase + 32}
                    fontSize={11}
                    fontWeight={700}
                    fill={goodDown ? TEAL : GOLD_DEEP}
                    textAnchor="middle"
                  >
                    {deltaText} {t.unit}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
      </ChartCard>
    </section>
  );
}

/* ---------------- LINE: normalised profile lift ---------------- */

function LineSection({ data }: { data: OutcomeOverview }) {
  const t = useT(impactDict);
  const dials = orderedDials(data);

  const W = 500;
  const H = 290;
  const mL = 30;
  const mR = 14;
  const mT = 18;
  const mB = 46;
  const pw = W - mL - mR;
  const ph = H - mT - mB;
  const yBase = mT + ph;
  const xOf = (i: number) => mL + (i + 0.5) * (pw / dials.length);
  const yOf = (v: number) => yBase - (v / 100) * ph;
  const path = (key: "goodBefore" | "goodAfter") =>
    dials.map((d, i) => `${i === 0 ? "M" : "L"}${xOf(i)} ${yOf(d[key])}`).join(" ");

  return (
    <section className="mt-16">
      <SectionHead title={t.line.title} intro={t.line.intro} />
      <ChartCard>
        <Legend
          items={[
            { color: SAGE, label: t.before },
            { color: TEAL, label: t.after },
          ]}
        />
        <div className="mt-3 overflow-x-auto no-scrollbar">
          <svg viewBox={`0 0 ${W} ${H}`} className="w-full min-w-[460px]" role="img" aria-label={t.line.title}>
            {[0, 25, 50, 75, 100].map((g) => (
              <g key={g}>
                <line x1={mL} y1={yOf(g)} x2={W - mR} y2={yOf(g)} stroke={CREAM} strokeWidth={1} />
                <text x={mL - 6} y={yOf(g) + 3} fontSize={10} fill={INK_FAINT} textAnchor="end">
                  {g}
                </text>
              </g>
            ))}
            <path d={path("goodBefore")} fill="none" stroke={SAGE} strokeWidth={2.5} strokeDasharray="5 5" strokeLinecap="round" />
            <path d={path("goodAfter")} fill="none" stroke={TEAL} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
            {dials.map((d, i) => (
              <g key={d.dial}>
                <circle cx={xOf(i)} cy={yOf(d.goodBefore)} r={3.5} fill="#fff" stroke={SAGE} strokeWidth={2} />
                <circle cx={xOf(i)} cy={yOf(d.goodAfter)} r={4} fill={TEAL} />
                <text x={xOf(i)} y={yBase + 16} fontSize={11} fill={INK_SOFT} textAnchor="middle">
                  {t.dialShort[d.dial]}
                </text>
              </g>
            ))}
          </svg>
        </div>
        <p className="mt-2 text-center text-[0.74rem] text-ink-faint">{t.line.axis}</p>
      </ChartCard>
    </section>
  );
}

/* ---------------- DONUT: composition of improvement ---------------- */

function polar(cx: number, cy: number, r: number, ang: number): [number, number] {
  return [cx + r * Math.cos(ang), cy + r * Math.sin(ang)];
}
function arcPath(cx: number, cy: number, rO: number, rI: number, a0: number, a1: number): string {
  const large = a1 - a0 > Math.PI ? 1 : 0;
  const [x0, y0] = polar(cx, cy, rO, a0);
  const [x1, y1] = polar(cx, cy, rO, a1);
  const [x2, y2] = polar(cx, cy, rI, a1);
  const [x3, y3] = polar(cx, cy, rI, a0);
  return `M${x0} ${y0} A${rO} ${rO} 0 ${large} 1 ${x1} ${y1} L${x2} ${y2} A${rI} ${rI} 0 ${large} 0 ${x3} ${y3} Z`;
}

function DonutSection({ data }: { data: OutcomeOverview }) {
  const t = useT(impactDict);
  const dials = orderedDials(data).filter((d) => d.improvementPoints > 0);
  const total = dials.reduce((s, d) => s + d.improvementPoints, 0) || 1;

  let acc = -Math.PI / 2;
  const segs = dials.map((d) => {
    const frac = d.improvementPoints / total;
    const a0 = acc;
    const a1 = acc + frac * Math.PI * 2;
    acc = a1;
    return { d, a0, a1, frac };
  });

  const cx = 100;
  const cy = 100;

  return (
    <section className="mt-16">
      <SectionHead title={t.donut.title} intro={t.donut.intro} />
      <ChartCard>
        <div className="flex flex-col items-center gap-6 sm:flex-row sm:justify-center sm:gap-10">
          <svg viewBox="0 0 200 200" className="h-48 w-48 shrink-0" role="img" aria-label={t.donut.title}>
            {segs.map((s) => (
              <path key={s.d.dial} d={arcPath(cx, cy, 92, 56, s.a0, s.a1)} fill={DIAL_COLOR[s.d.dial]} />
            ))}
            <text x={cx} y={cy - 4} fontSize={30} fontWeight={700} fill={TEAL} textAnchor="middle">
              {total}
            </text>
            <text x={cx} y={cy + 18} fontSize={11} fill={INK_FAINT} textAnchor="middle">
              {t.unit}
            </text>
          </svg>
          <ul className="w-full max-w-xs space-y-2.5">
            {segs.map((s) => (
              <li key={s.d.dial} className="flex items-center gap-3 text-[0.86rem]">
                <span className="h-3 w-3 flex-none rounded-sm" style={{ background: DIAL_COLOR[s.d.dial] }} />
                <span className="flex-1 text-ink">{t.dialShort[s.d.dial]}</span>
                <span className="font-semibold text-teal-800">
                  {s.d.improvementPoints} {t.unit}
                </span>
                <span className="w-10 text-right text-ink-faint">{Math.round(s.frac * 100)}%</span>
              </li>
            ))}
          </ul>
        </div>
      </ChartCard>
    </section>
  );
}

/* ---------------- HEATMAP: package × index average change ---------------- */

function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace("#", "");
  return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
}
function cellColor(t: number): string {
  const [r1, g1, b1] = hexToRgb(CREAM);
  const [r2, g2, b2] = hexToRgb(TEAL);
  const k = Math.max(0, Math.min(1, t));
  const m = (a: number, b: number) => Math.round(a + (b - a) * k);
  return `rgb(${m(r1, r2)}, ${m(g1, g2)}, ${m(b1, b2)})`;
}

const TIERS: PackageTier[] = ["basic", "premium", "deluxe"];

function HeatmapSection({ data }: { data: OutcomeOverview }) {
  const t = useT(impactDict);
  const tc = useT(common);
  const l = useL();
  const [tier, setTier] = useState<PackageTier | "all">("all");

  const rows = useMemo(
    () => data.byPackage.filter((p) => tier === "all" || p.tier === tier),
    [data.byPackage, tier],
  );
  const maxPts = useMemo(() => {
    let m = 1;
    for (const p of data.byPackage)
      for (const d of p.dials) m = Math.max(m, d.improvementPoints);
    return m;
  }, [data.byPackage]);

  const filters: { key: PackageTier | "all"; label: string }[] = [
    { key: "all", label: t.heat.filterAll },
    ...TIERS.map((k) => ({ key: k, label: tc.tier[k] })),
  ];

  const dialByKey = (p: PackageOutcome, dial: DialKey) =>
    p.dials.find((d) => d.dial === dial);

  return (
    <section className="mt-16">
      <SectionHead title={t.heat.title} intro={t.heat.intro} />

      <div className="mt-5 flex flex-wrap justify-center gap-2">
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

      <ChartCard>
        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full min-w-[520px] border-separate border-spacing-1 text-center">
            <thead>
              <tr>
                <th className="w-[34%] px-2 py-1 text-left text-[0.72rem] font-semibold uppercase tracking-wide text-ink-faint">
                  {t.heat.packageCol}
                </th>
                {DIAL_ORDER.map((d) => (
                  <th key={d} className="px-1 py-1 text-[0.72rem] font-semibold text-ink-soft">
                    {t.dialShort[d]}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((p) => {
                const pkg = getPackage(p.packageId);
                return (
                  <tr key={p.packageId}>
                    <td className="px-2 py-1 text-left">
                      <Link
                        href={`/packages/${p.packageId}`}
                        className="text-[0.82rem] font-medium text-teal-800 hover:text-teal-950 hover:underline"
                      >
                        {pkg ? l(pkg.name) : p.packageId}
                      </Link>
                    </td>
                    {DIAL_ORDER.map((dk) => {
                      const pts = Math.max(0, dialByKey(p, dk)?.improvementPoints ?? 0);
                      const ratio = pts / maxPts;
                      return (
                        <td
                          key={dk}
                          className="rounded-md px-1 py-1.5 text-[0.78rem] font-semibold tabular-nums"
                          style={{ background: cellColor(ratio), color: ratio > 0.55 ? "#F1FAF5" : INK_SOFT }}
                        >
                          {pts}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </ChartCard>
    </section>
  );
}

/* ---------------- small shared bits ---------------- */

function Legend({ items }: { items: { color: string; label: string }[] }) {
  return (
    <div className="flex flex-wrap justify-center gap-4">
      {items.map((it) => (
        <span key={it.label} className="flex items-center gap-1.5 text-[0.78rem] text-ink-soft">
          <span className="h-2.5 w-2.5 rounded-sm" style={{ background: it.color }} />
          {it.label}
        </span>
      ))}
    </div>
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
