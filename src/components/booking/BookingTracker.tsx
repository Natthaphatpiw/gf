"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ChevronLeft, Loader2, Users } from "lucide-react";
import type { Booking } from "@/lib/types";
import { useT } from "@/lib/i18n";
import common from "@/lib/i18n/dictionaries/common";
import booking from "@/lib/i18n/dictionaries/booking";
import { getPackage } from "@/data/packages";
import { PackageSummary } from "@/components/booking/PackageSummary";
import { StatusTimeline } from "@/components/booking/StatusTimeline";
import { ExpertPanel } from "@/components/booking/ExpertPanel";
import { BookingNotFound } from "@/components/booking/BookingNotFound";
import { CheckinCard } from "@/components/checkin/CheckinCard";

/* ============================================================
 * BookingTracker — guest-facing status view for one booking.
 * ============================================================ */

export function BookingTracker({ id }: { id: string }) {
  const t = useT(booking);
  const tc = useT(common);

  const [data, setData] = useState<Booking | null>(null);
  const [state, setState] = useState<"loading" | "ready" | "notfound">(
    "loading",
  );

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const res = await fetch(`/api/bookings/${encodeURIComponent(id)}`);
        if (!res.ok) {
          if (active) setState("notfound");
          return;
        }
        const result = (await res.json()) as { booking: Booking };
        if (active) {
          setData(result.booking);
          setState("ready");
        }
      } catch {
        if (active) setState("notfound");
      }
    })();
    return () => {
      active = false;
    };
  }, [id]);

  if (state === "loading") {
    return (
      <div className="grid place-items-center px-5 py-28">
        <Loader2 className="h-7 w-7 animate-spin text-teal-500" />
      </div>
    );
  }

  if (state === "notfound" || !data) {
    return <BookingNotFound kind="booking" />;
  }

  const pkg = getPackage(data.packageId);

  return (
    <div className="mx-auto max-w-xl px-5 pt-6 md:pt-10">
      <Link
        href="/bookings"
        className="animate-fade inline-flex items-center gap-1 text-xs font-medium text-teal-700 transition-colors hover:text-teal-900"
      >
        <ChevronLeft className="h-4 w-4" />
        {t.track.backToList}
      </Link>

      <header className="animate-rise mt-4">
        <p className="eyebrow">{t.track.eyebrow}</p>
        <h1 className="font-display mt-1.5 text-3xl font-semibold text-teal-900 md:text-4xl">
          {t.track.title}
        </h1>
        <p className="mt-1.5 text-[0.72rem] tracking-wide text-ink-faint">
          {t.list.ref}{" "}
          <span className="font-semibold text-teal-700">{data.id}</span>
        </p>
      </header>

      {pkg && (
        <div className="animate-rise-1 mt-6">
          <PackageSummary pkg={pkg}>
            {data.isFamily && data.familySize && (
              <p className="mt-3 flex items-center gap-2 rounded-2xl bg-teal-50 px-4 py-2.5 text-xs font-medium text-teal-800">
                <Users className="h-4 w-4 text-teal-600" />
                {data.familySize} {tc.units.people}
              </p>
            )}
          </PackageSummary>
        </div>
      )}

      <div className="animate-rise-2 mt-8 rounded-3xl border border-teal-900/10 bg-white p-6 shadow-soft md:p-7">
        <StatusTimeline data={data} />
      </div>

      <div className="animate-rise-2 mt-6">
        <CheckinCard
          bookingId={data.id}
          hasAssessmentBaseline={Boolean(data.assessmentId)}
        />
      </div>

      {data.expertReview && (
        <div className="animate-rise-2 mt-6 mb-10">
          <ExpertPanel data={data} onAccepted={(updated) => setData(updated)} />
        </div>
      )}

      {!data.expertReview && <div className="mb-10" />}
    </div>
  );
}
