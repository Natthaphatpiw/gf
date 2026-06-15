"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Check, Compass } from "lucide-react";
import type { CheckinSummary } from "@/lib/types";
import { useT } from "@/lib/i18n";
import checkin from "@/lib/i18n/dictionaries/checkin";
import { ButtonLink } from "@/components/ui/Button";

/* ============================================================
 * CheckinCard — entry point on the booking tracking page.
 * Shows the right CTA for where the guest is in the journey.
 * New bookings with a unified assessment use that as T1, so they
 * go straight to the post-program T2 check-in.
 * ============================================================ */

export function CheckinCard({
  bookingId,
  hasAssessmentBaseline = false,
}: {
  bookingId: string;
  hasAssessmentBaseline?: boolean;
}) {
  const t = useT(checkin);
  const [summaries, setSummaries] = useState<CheckinSummary[] | null>(null);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const res = await fetch(
          `/api/checkin?bookingId=${encodeURIComponent(bookingId)}`,
        );
        const data = res.ok
          ? ((await res.json()) as { checkins: CheckinSummary[] })
          : { checkins: [] };
        if (active) setSummaries(data.checkins ?? []);
      } catch {
        if (active) setSummaries([]);
      }
    })();
    return () => {
      active = false;
    };
  }, [bookingId]);

  if (summaries === null) return null; // quiet while loading

  const t1 = summaries.find((c) => c.timepoint === "T1");
  const t2 = summaries.find((c) => c.timepoint === "T2");
  const t3 = summaries.find((c) => c.timepoint === "T3");

  return (
    <div className="rounded-3xl border border-teal-900/10 bg-white p-6 shadow-soft md:p-7">
      <div className="flex items-start gap-3">
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-teal-50 text-teal-700">
          <Compass className="h-5 w-5" strokeWidth={1.7} />
        </span>
        <div className="min-w-0 flex-1">
          <h2 className="font-display text-lg font-semibold leading-snug text-teal-900">
            {t.card.title}
          </h2>
          <p className="mt-1 text-xs leading-relaxed text-ink-soft">
            {t.card.lead}
          </p>

          <div className="mt-4 space-y-2.5">
            {/* T1 row */}
            {t1 ? (
              <DoneRow label={t.card.t1Done} viewLabel={t.card.view} id={t1.id} />
            ) : hasAssessmentBaseline ? (
              <div className="rounded-2xl bg-teal-50 px-4 py-2.5 text-xs font-medium leading-relaxed text-teal-800">
                {t.card.baselineDone}
              </div>
            ) : (
              <ButtonLink href={`/checkin/${bookingId}`} size="sm">
                {t.card.t1Cta}
                <ArrowRight className="h-4 w-4" />
              </ButtonLink>
            )}

            {/* T2 row */}
            {(t1 || hasAssessmentBaseline) && !t2 && (
              <div className="flex flex-wrap items-center gap-2.5">
                <ButtonLink href={`/checkin/${bookingId}`} size="sm" variant="secondary">
                  {t.card.t2Cta}
                  <ArrowRight className="h-4 w-4" />
                </ButtonLink>
                <span className="text-[0.7rem] text-ink-faint">
                  {t.card.t2Hint}
                </span>
              </div>
            )}
            {t2 && (
              <DoneRow label={t.card.t2Done} viewLabel={t.card.view} id={t2.id} />
            )}

            {/* T3 row — the 30-day follow-up */}
            {t2 && !t3 && (
              <div className="flex flex-wrap items-center gap-2.5">
                <ButtonLink href={`/checkin/${bookingId}`} size="sm" variant="secondary">
                  {t.card.t3Cta}
                  <ArrowRight className="h-4 w-4" />
                </ButtonLink>
                <span className="text-[0.7rem] text-ink-faint">{t.card.t3Hint}</span>
              </div>
            )}
            {t3 && (
              <DoneRow label={t.card.t3Done} viewLabel={t.card.view} id={t3.id} />
            )}
          </div>

          {/* Program journey — the consolidated before/after + 30-day plan */}
          {(t2 || t3) && (
            <Link
              href={`/journey/${bookingId}`}
              className="mt-4 flex items-center justify-between gap-3 rounded-2xl border border-gold-400/40 bg-gold-100/30 px-4 py-3 transition-colors hover:bg-gold-100/60"
            >
              <span className="min-w-0">
                <span className="block text-[0.84rem] font-semibold text-teal-900">
                  {t.card.journeyCta}
                </span>
                <span className="block text-[0.7rem] leading-relaxed text-ink-soft">
                  {t.card.journeyHint}
                </span>
              </span>
              <ArrowRight className="h-4 w-4 shrink-0 text-teal-700" />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

function DoneRow({
  label,
  viewLabel,
  id,
}: {
  label: string;
  viewLabel: string;
  id: string;
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-2 rounded-2xl bg-teal-50 px-4 py-2.5">
      <span className="inline-flex items-center gap-1.5 text-xs font-medium text-teal-800">
        <Check className="h-4 w-4 text-teal-600" />
        {label}
      </span>
      <Link
        href={`/checkin/result/${id}`}
        className="inline-flex items-center gap-1 text-xs font-semibold text-teal-700 underline underline-offset-2 transition-colors hover:text-teal-900"
      >
        {viewLabel}
        <ArrowRight className="h-3.5 w-3.5" />
      </Link>
    </div>
  );
}
