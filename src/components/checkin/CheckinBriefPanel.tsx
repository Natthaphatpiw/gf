"use client";

import { useEffect, useState } from "react";
import { AlertTriangle, Compass, Loader2, ShieldAlert } from "lucide-react";
import type { WellnessCheckin } from "@/lib/types";
import { DIAL_KEYS, DIAL_NAMES } from "@/data/checkin";
import { useL, useLocale, useT } from "@/lib/i18n";
import checkin from "@/lib/i18n/dictionaries/checkin";
import { expertFetch } from "@/components/expert/client";
import { formatDateTime } from "@/components/expert/format";

/* ============================================================
 * CheckinBriefPanel — the T1/T2 compass data inside the expert
 * workbench: dial scores, staff brief, red flags, vitals and
 * the guest's raw open answer.
 * ============================================================ */

const NEEDS_CARE = "#bf6b4f";

export function CheckinBriefPanel({ bookingId }: { bookingId: string }) {
  const t = useT(checkin);
  const l = useL();
  const { locale } = useLocale();

  const [items, setItems] = useState<WellnessCheckin[] | null>(null);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const res = await expertFetch(`/api/expert/checkins/${bookingId}`);
        const data = res.ok
          ? ((await res.json()) as { checkins: WellnessCheckin[] })
          : { checkins: [] };
        if (active) setItems(data.checkins ?? []);
      } catch {
        if (active) setItems([]);
      }
    })();
    return () => {
      active = false;
    };
  }, [bookingId]);

  return (
    <section className="animate-rise">
      <h2 className="mb-3 flex items-center gap-2 font-display text-lg font-semibold text-teal-900">
        <span className="grid h-7 w-7 place-items-center rounded-lg bg-teal-50 text-teal-600">
          <Compass className="h-4 w-4" />
        </span>
        {t.expertPanel.title}
      </h2>

      {items === null && (
        <div className="grid place-items-center rounded-2xl border border-teal-900/10 bg-white p-6">
          <Loader2 className="h-5 w-5 animate-spin text-teal-500" />
        </div>
      )}

      {items !== null && items.length === 0 && (
        <p className="rounded-2xl border border-dashed border-teal-900/15 bg-white/60 p-4 text-center text-xs leading-relaxed text-ink-faint">
          {t.expertPanel.empty}
        </p>
      )}

      <div className="space-y-4">
        {(items ?? []).map((c) => (
          <article
            key={c.id}
            className="rounded-2xl border border-teal-900/10 bg-white p-5 shadow-soft"
          >
            <header className="flex flex-wrap items-center justify-between gap-2">
              <p className="text-sm font-semibold text-teal-900">
                {c.timepoint === "T1"
                  ? t.expertPanel.t1
                  : c.timepoint === "T3"
                    ? t.expertPanel.t3
                    : t.expertPanel.t2}
                <span className="ml-2 text-[0.68rem] font-medium text-ink-faint">
                  {c.id} · {formatDateTime(c.createdAt, locale)} ·{" "}
                  {c.instrumentVersion}
                </span>
              </p>
              <div className="flex flex-wrap gap-1.5">
                {c.analysis.urgent && (
                  <span
                    className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[0.65rem] font-semibold text-white"
                    style={{ backgroundColor: NEEDS_CARE }}
                  >
                    <AlertTriangle className="h-3 w-3" />
                    {t.expertPanel.urgentFlag}
                  </span>
                )}
                {!c.analysis.urgent && c.analysis.expertReviewRequired && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-gold-500 px-2.5 py-1 text-[0.65rem] font-semibold text-white">
                    <ShieldAlert className="h-3 w-3" />
                    {t.expertPanel.expertFlag}
                  </span>
                )}
                <span className="inline-flex items-center rounded-full bg-teal-50 px-2.5 py-1 text-[0.65rem] font-medium text-teal-700">
                  {t.expertPanel.analysisBy[c.analysis.source]}
                </span>
              </div>
            </header>

            {/* dial chips (+ delta when present) */}
            <div className="mt-3 flex flex-wrap gap-1.5">
              {DIAL_KEYS.map((dial) => {
                const delta = c.deltas?.find((d) => d.dial === dial);
                return (
                  <span
                    key={dial}
                    className="inline-flex items-center gap-1 rounded-full border border-teal-900/10 bg-cream-50 px-2.5 py-1 text-[0.68rem] text-ink"
                  >
                    {l(DIAL_NAMES[dial])}
                    <span className="font-bold text-teal-900">
                      {c.dials[dial].value}
                    </span>
                    {delta && (
                      <span
                        className="font-semibold"
                        style={{
                          color:
                            delta.trend === "improved"
                              ? "var(--color-teal-600)"
                              : delta.trend === "declined"
                                ? NEEDS_CARE
                                : "var(--color-gold-600)",
                        }}
                      >
                        ({delta.delta > 0 ? "+" : ""}
                        {delta.delta})
                      </span>
                    )}
                  </span>
                );
              })}
            </div>

            {/* staff brief */}
            <div className="mt-4">
              <p className="text-[0.62rem] font-semibold uppercase tracking-[0.12em] text-ink-faint">
                {t.expertPanel.staffBrief}
              </p>
              <ul className="mt-1.5 space-y-1">
                {c.analysis.summaryForStaff.map((line, i) => (
                  <li
                    key={i}
                    className="text-xs leading-relaxed text-ink before:mr-1.5 before:text-gold-500 before:content-['·']"
                  >
                    {line}
                  </li>
                ))}
              </ul>
            </div>

            {/* red flags */}
            {c.analysis.redFlags.length > 0 && (
              <div className="mt-4">
                <p className="text-[0.62rem] font-semibold uppercase tracking-[0.12em] text-ink-faint">
                  {t.expertPanel.redFlags}
                </p>
                <ul className="mt-1.5 space-y-1.5">
                  {c.analysis.redFlags.map((f, i) => (
                    <li
                      key={i}
                      className="rounded-xl border px-3 py-2 text-xs leading-relaxed"
                      style={{
                        borderColor: `${NEEDS_CARE}40`,
                        backgroundColor: `${NEEDS_CARE}0d`,
                      }}
                    >
                      <span
                        className="mr-1.5 font-semibold"
                        style={{ color: NEEDS_CARE }}
                      >
                        [{t.expertPanel.severity[f.severity]}]
                      </span>
                      <span className="text-ink">{f.detail}</span>
                      {f.quote && (
                        <span className="mt-0.5 block text-ink-faint">
                          “{f.quote}”
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* vitals */}
            {c.objective && (
              <div className="mt-4">
                <p className="text-[0.62rem] font-semibold uppercase tracking-[0.12em] text-ink-faint">
                  {t.expertPanel.vitals}
                </p>
                <p className="mt-1.5 text-xs text-ink">
                  {[
                    c.objective.bpSystolic !== undefined &&
                    c.objective.bpDiastolic !== undefined
                      ? `${t.expertPanel.bp} ${c.objective.bpSystolic}/${c.objective.bpDiastolic}`
                      : null,
                    c.objective.restingHr !== undefined
                      ? `${t.expertPanel.hr} ${c.objective.restingHr}`
                      : null,
                    c.objective.weightKg !== undefined
                      ? `${t.expertPanel.weight} ${c.objective.weightKg}`
                      : null,
                    c.objective.deviceSleepHours !== undefined
                      ? `${t.expertPanel.deviceSleep} ${c.objective.deviceSleepHours}`
                      : null,
                  ]
                    .filter(Boolean)
                    .join(" · ")}
                </p>
              </div>
            )}

            {/* raw open answer */}
            {c.answers.q8 && (
              <div className="mt-4">
                <p className="text-[0.62rem] font-semibold uppercase tracking-[0.12em] text-ink-faint">
                  {t.expertPanel.openAnswer}
                </p>
                <p className="mt-1.5 whitespace-pre-wrap rounded-xl bg-cream-50 px-3 py-2 text-xs leading-relaxed text-ink">
                  {c.answers.q8}
                </p>
              </div>
            )}
          </article>
        ))}
      </div>
    </section>
  );
}
