"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  Inbox,
  Users,
  RefreshCw,
  Loader2,
  AlertCircle,
  ChevronRight,
  CalendarClock,
} from "lucide-react";
import { useL, useLocale, useT } from "@/lib/i18n";
import expert from "@/lib/i18n/dictionaries/expert";
import { getPackage } from "@/data/packages";
import { TierBadge } from "@/components/packages/PackageCard";
import { StatusPill } from "@/components/expert/StatusPill";
import { expertFetch } from "@/components/expert/client";
import { formatDateTime } from "@/components/expert/format";
import type { Booking } from "@/lib/types";

/* ============================================================
 * InboxList — the consult-requested booking queue.
 * Filter chips: all / awaiting / advised / approved.
 * ============================================================ */

type Filter = "all" | "awaiting" | "advised" | "approved";

/** Does a booking still need the expert's attention? */
function needsAttention(b: Booking): boolean {
  return b.status === "expert_review" && !b.expertReview;
}

function matchesFilter(b: Booking, filter: Filter): boolean {
  switch (filter) {
    case "awaiting":
      // No review sent yet (still waiting on the expert).
      return !b.expertReview;
    case "advised":
      // Guidance sent but not yet approved.
      return !!b.expertReview && !b.expertReview.approved;
    case "approved":
      return !!b.expertReview && b.expertReview.approved;
    default:
      return true;
  }
}

export function InboxList() {
  const dict = useT(expert);
  const t = dict.inbox;
  const l = useL();
  const { locale } = useLocale();

  const [bookings, setBookings] = useState<Booking[] | null>(null);
  const [error, setError] = useState(false);
  const [filter, setFilter] = useState<Filter>("all");
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async (showSpinner = false) => {
    if (showSpinner) setRefreshing(true);
    setError(false);
    try {
      const res = await expertFetch("/api/expert/queue");
      if (!res.ok) throw new Error("queue");
      const data = (await res.json()) as { bookings: Booking[] };
      setBookings(data.bookings ?? []);
    } catch {
      setError(true);
      setBookings((prev) => prev ?? []);
    } finally {
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const pendingCount = useMemo(
    () => (bookings ?? []).filter(needsAttention).length,
    [bookings],
  );

  const visible = useMemo(
    () => (bookings ?? []).filter((b) => matchesFilter(b, filter)),
    [bookings, filter],
  );

  const FILTERS: { key: Filter; label: string }[] = [
    { key: "all", label: t.filters.all },
    { key: "awaiting", label: t.filters.awaiting },
    { key: "advised", label: t.filters.advised },
    { key: "approved", label: t.filters.approved },
  ];

  /* Pending notification line — TH and EN read differently. */
  const notice =
    pendingCount > 0
      ? locale === "th"
        ? `${t.pendingOne} ${pendingCount} ${t.pendingUnit}`
        : `${pendingCount} ${t.pendingUnit}`
      : t.noneWaiting;

  return (
    <div className="mx-auto max-w-3xl px-5 py-8 md:py-12">
      {/* Header */}
      <header className="animate-rise mb-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="eyebrow">{t.eyebrow}</p>
            <h1 className="font-display text-3xl font-semibold leading-tight text-teal-900 md:text-4xl">
              {t.title}
            </h1>
          </div>
          <button
            type="button"
            onClick={() => load(true)}
            aria-label={t.refresh}
            className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-teal-900/10 bg-white text-teal-700 shadow-soft transition-colors hover:bg-teal-50"
          >
            <RefreshCw
              className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`}
            />
          </button>
        </div>
        <p className="mt-2 flex items-center gap-2 text-sm text-ink-soft">
          {pendingCount > 0 && (
            <span className="inline-block h-2 w-2 shrink-0 rounded-full bg-gold-500" />
          )}
          {notice}
        </p>
      </header>

      {/* Filter chips */}
      <div className="no-scrollbar -mx-5 mb-5 flex gap-2 overflow-x-auto px-5">
        {FILTERS.map((f) => {
          const active = filter === f.key;
          return (
            <button
              key={f.key}
              type="button"
              onClick={() => setFilter(f.key)}
              className={`shrink-0 rounded-full px-4 py-2 text-xs font-medium tracking-wide transition-colors ${
                active
                  ? "bg-teal-800 text-cream-50"
                  : "border border-teal-900/10 bg-white text-ink-soft hover:bg-teal-50"
              }`}
            >
              {f.label}
            </button>
          );
        })}
      </div>

      {/* Body */}
      {bookings === null ? (
        <div className="flex items-center justify-center gap-2 py-16 text-sm text-ink-faint">
          <Loader2 className="h-4 w-4 animate-spin" />
          {t.loading}
        </div>
      ) : error && bookings.length === 0 ? (
        <EmptyState
          icon={<AlertCircle className="h-7 w-7 text-[#bf6b4f]" />}
          title={dict.error}
          hint=""
        />
      ) : visible.length === 0 ? (
        <EmptyState
          icon={<Inbox className="h-7 w-7 text-teal-600" />}
          title={bookings.length === 0 ? t.empty : t.noneWaiting}
          hint={bookings.length === 0 ? t.emptyHint : ""}
        />
      ) : (
        <ul className="space-y-3">
          {visible.map((b, i) => {
            const pkg = getPackage(b.packageId);
            const attention = needsAttention(b);
            return (
              <li
                key={b.id}
                className={`animate-rise${i < 3 ? `-${i + 1}` : ""}`}
              >
                <Link
                  href={`/expert/${b.id}`}
                  className="group flex items-stretch gap-3 rounded-2xl border border-teal-900/10 bg-white p-4 shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-lift"
                >
                  <div className="min-w-0 flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[0.68rem] font-semibold tracking-wide text-teal-700">
                        {b.id}
                      </span>
                      {attention && (
                        <span
                          className="inline-block h-2 w-2 rounded-full bg-gold-500"
                          aria-label={t.filters.awaiting}
                        />
                      )}
                      <span className="flex items-center gap-1 text-[0.65rem] text-ink-faint">
                        <CalendarClock className="h-3 w-3" />
                        {formatDateTime(b.createdAt, locale)}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      {pkg && <TierBadge tier={pkg.tier} />}
                      <h3 className="font-display text-base font-semibold leading-snug text-teal-900">
                        {pkg ? l(pkg.name) : b.packageId}
                      </h3>
                    </div>

                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs text-ink-soft">
                      <span className="font-medium text-ink">
                        {b.customer.firstName} {b.customer.lastName}
                      </span>
                      {b.isFamily && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-sage-100 px-2 py-0.5 text-[0.62rem] font-medium text-teal-800">
                          <Users className="h-3 w-3" />
                          {(b.familySize ?? b.familyMembers?.length ?? 0) || ""}
                        </span>
                      )}
                      <StatusPill status={b.status} />
                    </div>
                  </div>

                  <ChevronRight className="my-auto h-5 w-5 shrink-0 text-teal-300 transition-transform group-hover:translate-x-0.5 group-hover:text-teal-600" />
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

function EmptyState({
  icon,
  title,
  hint,
}: {
  icon: React.ReactNode;
  title: string;
  hint: string;
}) {
  return (
    <div className="animate-fade rounded-3xl border border-dashed border-teal-900/15 bg-white/60 px-6 py-16 text-center">
      <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-teal-50">
        {icon}
      </div>
      <p className="font-display text-lg font-semibold text-teal-900">{title}</p>
      {hint && (
        <p className="mx-auto mt-2 max-w-xs text-sm leading-relaxed text-ink-soft">
          {hint}
        </p>
      )}
    </div>
  );
}
