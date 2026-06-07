"use client";

import { useState } from "react";
import {
  ArrowRight,
  BadgeCheck,
  Loader2,
  Sparkles,
} from "lucide-react";
import type { Booking } from "@/lib/types";
import { useT } from "@/lib/i18n";
import booking from "@/lib/i18n/dictionaries/booking";
import { Button } from "@/components/ui/Button";

/* ============================================================
 * ExpertPanel — distinguished card showing the expert's
 * guidance, proposed adjustments, and the guest's accept action.
 * ============================================================ */

export function ExpertPanel({
  data,
  onAccepted,
}: {
  data: Booking;
  onAccepted: (updated: Booking) => void;
}) {
  const t = useT(booking);
  const review = data.expertReview;
  const [accepting, setAccepting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!review) return null;

  const hasAdjustments = review.adjustments && review.adjustments.length > 0;
  const accepted = review.customerAccepted === true;

  async function accept() {
    setAccepting(true);
    setError(null);
    try {
      const res = await fetch(`/api/bookings/${encodeURIComponent(data.id)}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "accept_adjustments" }),
      });
      if (!res.ok) throw new Error("patch failed");
      const result = (await res.json()) as { booking: Booking };
      onAccepted(result.booking);
    } catch {
      setError(t.errors.submit);
      setAccepting(false);
    }
  }

  return (
    <section className="overflow-hidden rounded-3xl border border-gold-400/30 bg-gradient-to-b from-gold-100/50 to-white shadow-soft">
      <div className="p-6">
        <div className="flex items-center gap-2.5">
          <span className="grid h-9 w-9 place-items-center rounded-full bg-gold-100 text-gold-600">
            <Sparkles className="h-4 w-4" />
          </span>
          <h2 className="font-display text-lg font-semibold text-teal-900">
            {t.track.expertTitle}
          </h2>
        </div>

        <div className="mt-4">
          <p className="text-sm font-semibold text-teal-800">
            {review.expertName}
          </p>
          <p className="text-[0.7rem] uppercase tracking-[0.16em] text-gold-600">
            {t.track.expertRole}
          </p>
        </div>

        {review.comment && (
          <p className="mt-4 text-sm leading-relaxed text-ink-soft">
            {review.comment}
          </p>
        )}

        {hasAdjustments && (
          <div className="mt-6">
            <p className="eyebrow text-ink-faint">{t.track.changesTitle}</p>
            <div className="mt-3 space-y-3">
              {review.adjustments.map((adj, i) => (
                <div
                  key={i}
                  className="rounded-2xl border border-teal-900/10 bg-white/80 p-4"
                >
                  <p className="text-[0.7rem] font-semibold uppercase tracking-[0.12em] text-teal-700">
                    {adj.target}
                  </p>
                  <div className="mt-2 flex flex-wrap items-center gap-2 text-sm">
                    <span className="text-ink-faint line-through">
                      {adj.original}
                    </span>
                    <ArrowRight className="h-3.5 w-3.5 shrink-0 text-gold-500" />
                    <span className="font-medium text-teal-800">
                      {adj.replacement}
                    </span>
                  </div>
                  {adj.reason && (
                    <p className="mt-1.5 text-[0.72rem] leading-relaxed text-ink-faint">
                      {adj.reason}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* accept action / states */}
        {hasAdjustments && !accepted && (
          <div className="mt-6">
            <Button
              variant="gold"
              size="lg"
              onClick={accept}
              disabled={accepting}
              className="w-full"
            >
              {accepting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  {t.track.accepting}
                </>
              ) : (
                t.track.accept
              )}
            </Button>
            {error && (
              <p className="mt-2 text-center text-[0.7rem] font-medium text-gold-600">
                {error}
              </p>
            )}
          </div>
        )}

        {accepted && !review.approved && (
          <p className="animate-fade mt-6 rounded-2xl bg-gold-100/70 px-4 py-3 text-xs leading-relaxed text-gold-600">
            {t.track.acceptedNote}
          </p>
        )}

        {accepted && review.approved && (
          <div className="animate-fade mt-6 flex items-start gap-3 rounded-2xl bg-teal-50 px-4 py-3.5">
            <BadgeCheck className="mt-0.5 h-5 w-5 shrink-0 text-teal-600" />
            <div>
              <p className="text-sm font-semibold text-teal-900">
                {t.track.approvedTitle}
              </p>
              <p className="mt-0.5 text-xs leading-relaxed text-ink-soft">
                {t.track.approvedNote}
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
