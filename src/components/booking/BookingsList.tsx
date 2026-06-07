"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ChevronRight, Loader2, Search } from "lucide-react";
import type { Booking } from "@/lib/types";
import { useLocale, useL, useT } from "@/lib/i18n";
import common from "@/lib/i18n/dictionaries/common";
import booking from "@/lib/i18n/dictionaries/booking";
import { getBookingRefs, getStoredCustomer } from "@/lib/session";
import { getPackage } from "@/data/packages";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Field } from "@/components/booking/Field";
import { StatusPill } from "@/components/booking/StatusPill";

/* ============================================================
 * BookingsList — "My bookings". Resolves the guest's email,
 * fetches their bookings and merges any locally remembered
 * booking references, then renders a list of booking cards.
 * ============================================================ */

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function dedupe(bookings: Booking[]): Booking[] {
  const seen = new Set<string>();
  const out: Booking[] = [];
  for (const b of bookings) {
    if (seen.has(b.id)) continue;
    seen.add(b.id);
    out.push(b);
  }
  return out.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function BookingsList() {
  const t = useT(booking);
  const l = useL();
  const { locale } = useLocale();
  const dateLocale = locale === "th" ? "th-TH" : "en-GB";

  const [email, setEmail] = useState<string | null>(null);
  const [lookupValue, setLookupValue] = useState("");
  const [lookupTouched, setLookupTouched] = useState(false);
  const [bookings, setBookings] = useState<Booking[] | null>(null);
  const [loading, setLoading] = useState(false);

  const load = useCallback(async (guestEmail: string) => {
    setLoading(true);
    try {
      // bookings by email
      const res = await fetch(
        `/api/bookings?email=${encodeURIComponent(guestEmail)}`,
      );
      const data = res.ok
        ? ((await res.json()) as { bookings: Booking[] })
        : { bookings: [] };
      const byEmail = data.bookings ?? [];

      // merge any locally remembered refs not already present
      const known = new Set(byEmail.map((b) => b.id));
      const refs = getBookingRefs().filter((r) => !known.has(r.bookingId));
      const extra = await Promise.all(
        refs.map(async (r) => {
          try {
            const single = await fetch(
              `/api/bookings/${encodeURIComponent(r.bookingId)}`,
            );
            if (!single.ok) return null;
            const d = (await single.json()) as { booking: Booking };
            return d.booking;
          } catch {
            return null;
          }
        }),
      );

      setBookings(
        dedupe([...byEmail, ...extra.filter((b): b is Booking => b !== null)]),
      );
    } catch {
      setBookings([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // resolve email from stored customer on mount
  useEffect(() => {
    const c = getStoredCustomer();
    if (c?.email) {
      setEmail(c.email);
      void load(c.email);
    }
  }, [load]);

  function handleLookup(e: React.FormEvent) {
    e.preventDefault();
    setLookupTouched(true);
    const value = lookupValue.trim().toLowerCase();
    if (!EMAIL_RE.test(value)) return;
    setEmail(value);
    void load(value);
  }

  // ----- lookup form (no remembered email) -----
  if (!email) {
    return (
      <div className="mx-auto max-w-md px-5 pt-10 md:pt-16">
        <header className="animate-rise text-center">
          <p className="eyebrow">{t.list.eyebrow}</p>
          <h1 className="font-display mt-1.5 text-3xl font-semibold text-teal-900 md:text-4xl">
            {t.list.title}
          </h1>
        </header>
        <form
          onSubmit={handleLookup}
          noValidate
          className="animate-rise-1 mt-8 space-y-5 rounded-3xl border border-teal-900/10 bg-white p-6 shadow-soft"
        >
          <div>
            <h2 className="font-display text-xl font-semibold text-teal-900">
              {t.list.lookupTitle}
            </h2>
            <p className="mt-2 text-xs leading-relaxed text-ink-soft">
              {t.list.lookupHint}
            </p>
          </div>
          <Field
            label={t.list.lookupPlaceholder}
            type="email"
            inputMode="email"
            placeholder="you@example.com"
            value={lookupValue}
            onChange={(e) => setLookupValue(e.target.value)}
            error={
              lookupTouched && !EMAIL_RE.test(lookupValue.trim())
                ? t.errors.email
                : undefined
            }
            autoComplete="email"
          />
          <Button type="submit" size="lg" disabled={loading} className="w-full">
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                {t.list.lookupSearching}
              </>
            ) : (
              <>
                <Search className="h-4 w-4" />
                {t.list.lookupSubmit}
              </>
            )}
          </Button>
        </form>
      </div>
    );
  }

  // ----- loading -----
  if (loading && bookings === null) {
    return (
      <div className="grid place-items-center px-5 py-28">
        <Loader2 className="h-7 w-7 animate-spin text-teal-500" />
      </div>
    );
  }

  // ----- empty state -----
  if (bookings && bookings.length === 0) {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center px-5 py-20 text-center md:py-28">
        <header className="animate-rise">
          <p className="eyebrow">{t.list.eyebrow}</p>
          <h1 className="font-display mt-1.5 text-3xl font-semibold text-teal-900">
            {t.list.emptyTitle}
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-ink-soft">
            {t.list.emptyHint}
          </p>
        </header>
        <div className="animate-rise-1 mt-7">
          <ButtonLink href="/packages" size="lg">
            {t.list.browse}
            <ArrowRight className="h-4 w-4" />
          </ButtonLink>
        </div>
      </div>
    );
  }

  // ----- list -----
  return (
    <div className="mx-auto max-w-2xl px-5 pt-8 md:pt-12">
      <header className="animate-rise">
        <p className="eyebrow">{t.list.eyebrow}</p>
        <h1 className="font-display mt-1.5 text-3xl font-semibold text-teal-900 md:text-4xl">
          {t.list.title}
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-ink-soft">
          {t.list.subtitle}
        </p>
      </header>

      <div className="mt-7 space-y-4">
        {(bookings ?? []).map((b, i) => {
          const pkg = getPackage(b.packageId);
          const created = new Date(b.createdAt).toLocaleDateString(dateLocale, {
            day: "numeric",
            month: "short",
            year: "numeric",
          });
          return (
            <Link
              key={b.id}
              href={`/bookings/${b.id}`}
              className={`group flex items-stretch gap-4 overflow-hidden rounded-3xl border border-teal-900/10 bg-white p-3 shadow-soft transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lift animate-rise-${Math.min(i + 1, 3)}`}
            >
              {pkg && (
                <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-2xl">
                  <Image
                    src={pkg.image}
                    alt={l(pkg.name)}
                    fill
                    sizes="100px"
                    className="object-cover"
                  />
                </div>
              )}
              <div className="flex min-w-0 flex-1 flex-col justify-between py-1">
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-display truncate text-base font-semibold text-teal-900">
                      {pkg ? l(pkg.name) : b.packageId}
                    </h3>
                    <StatusPill status={b.status} />
                  </div>
                  <p className="mt-1 text-[0.7rem] tracking-wide text-ink-faint">
                    {t.list.ref}{" "}
                    <span className="font-semibold text-teal-700">{b.id}</span>
                  </p>
                </div>
                <div className="mt-2 flex items-center justify-between">
                  <p className="text-[0.7rem] text-ink-faint">
                    {t.list.bookedOn} {created}
                  </p>
                  <ChevronRight className="h-4 w-4 text-gold-500 transition-transform duration-300 group-hover:translate-x-0.5" />
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
