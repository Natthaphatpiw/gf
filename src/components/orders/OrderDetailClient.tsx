"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Check, Compass, Loader2, Star } from "lucide-react";
import { useAccount } from "@/lib/account";
import { useL, useT } from "@/lib/i18n";
import consultDict from "@/lib/i18n/dictionaries/consult";
import { getExpert } from "@/data/experts";
import {
  CONSULT_STATUS_FLOW,
  CONSULT_STATUS_LABEL,
  CONSULT_TYPE_LABEL,
  type Consultation,
  type ConsultStatus,
} from "@/lib/consultation";
import { StatusBadge } from "@/components/orders/StatusBadge";
import { ChatPanel } from "@/components/orders/ChatPanel";
import { ManagedPlanPanel } from "@/components/orders/ManagedPlanPanel";
import { CheckinCard } from "@/components/checkin/CheckinCard";
import { ensureOrderBooking, getOrderBookingId } from "@/lib/order-booking";

/** What the customer's "next step" button does at each status. */
const CUSTOMER_NEXT: Partial<Record<ConsultStatus, ConsultStatus>> = {
  awaiting_expert: "coordinating_partner",
  expert_processing: "coordinating_partner",
  awaiting_customer: "coordinating_partner",
  coordinating_partner: "trip_started",
  payment: "trip_started",
  trip_started: "in_progress",
  in_progress: "completed",
  completed: "awaiting_feedback",
};

export function OrderDetailClient({ id }: { id: string }) {
  const t = useT(consultDict);
  const l = useL();
  const { user, ready, openAuth } = useAccount();
  const [c, setC] = useState<Consultation | null>(null);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);
  const [advancing, setAdvancing] = useState(false);
  const [bookingId, setBookingId] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const load = useCallback(async () => {
    try {
      const res = await fetch(`/api/consultations/${id}`);
      setC(res.ok ? (await res.json()).consultation : null);
    } catch {
      setC(null);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }
    load();
  }, [user, load]);

  async function payDeposit(slipName: string) {
    if (paying) return;
    setPaying(true);
    try {
      await fetch(`/api/consultations/${id}/deposit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slipUrl: slipName }),
      });
      await load();
    } finally {
      setPaying(false);
    }
  }

  async function advance(to: ConsultStatus) {
    if (advancing) return;
    setAdvancing(true);
    try {
      await fetch(`/api/consultations/${id}/advance`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ to }),
      });
      await load();
    } finally {
      setAdvancing(false);
    }
  }

  // Once the trip is being coordinated, bridge the order to a booking so the
  // pre/post check-in + journey become available.
  useEffect(() => {
    if (!c || !user) return;
    if (c.itemType !== "package" && c.itemType !== "program") return;
    const tripIdx = CONSULT_STATUS_FLOW.indexOf("coordinating_partner");
    if (CONSULT_STATUS_FLOW.indexOf(c.status) < tripIdx) return;
    const existing = getOrderBookingId(c.id);
    if (existing) {
      setBookingId(existing);
      return;
    }
    let active = true;
    ensureOrderBooking({
      orderId: c.id,
      packageId: c.itemId,
      assessmentId: c.assessmentId,
      customer: {
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone,
        email: user.email,
      },
    }).then((bid) => {
      if (active && bid) setBookingId(bid);
    });
    return () => {
      active = false;
    };
  }, [c, user]);

  if (ready && !user) {
    return (
      <CenterCard>
        <p className="text-sm text-ink-soft">{t.orders.loginRequired}</p>
        <button
          type="button"
          onClick={openAuth}
          className="mt-4 rounded-full bg-teal-700 px-6 py-2.5 text-[0.84rem] font-semibold text-cream-50"
        >
          {t.orders.login}
        </button>
      </CenterCard>
    );
  }

  if (loading) {
    return (
      <CenterCard>
        <Loader2 className="h-6 w-6 animate-spin text-teal-700" />
      </CenterCard>
    );
  }

  if (!c) {
    return (
      <CenterCard>
        <p className="text-sm text-ink-soft">{t.detail.notFound}</p>
        <Link href="/orders" className="mt-4 text-[0.84rem] font-semibold text-teal-700">
          {t.detail.back}
        </Link>
      </CenterCard>
    );
  }

  const expert = getExpert(c.expertId);
  const currentIndex = CONSULT_STATUS_FLOW.indexOf(c.status);
  const cancelled = c.status === "cancelled";
  const isPkg = c.itemType === "package" || c.itemType === "program";
  const prepostVisible =
    isPkg && currentIndex >= CONSULT_STATUS_FLOW.indexOf("coordinating_partner");
  const nextStatus = CUSTOMER_NEXT[c.status];
  const advanceLabel = (() => {
    switch (c.status) {
      case "awaiting_expert":
      case "expert_processing":
      case "awaiting_customer":
        return t.detail.advanceConsultDone;
      case "coordinating_partner":
      case "payment":
        return t.detail.advanceStartTrip;
      case "trip_started":
        return t.detail.advanceStartProgram;
      case "in_progress":
        return t.detail.advanceFinish;
      case "completed":
        return t.detail.advanceToFeedback;
      default:
        return "";
    }
  })();

  return (
    <div className="mx-auto max-w-2xl px-4 py-7 md:px-6 md:py-10">
      <Link
        href="/orders"
        className="inline-flex items-center gap-2 text-[0.84rem] font-semibold text-teal-700 transition-colors hover:text-teal-900"
      >
        <ArrowLeft className="h-4 w-4" />
        {t.detail.back}
      </Link>

      {/* Item header */}
      <div className="mt-5 flex gap-4 rounded-[1.2rem] border border-teal-900/10 bg-white p-4 shadow-soft">
        <span className="relative h-20 w-20 flex-none overflow-hidden rounded-[0.9rem] bg-teal-900">
          {c.itemImage && (
            <Image src={c.itemImage} alt={l(c.itemName)} fill sizes="80px" className="object-cover" />
          )}
        </span>
        <div className="min-w-0 flex-1">
          <StatusBadge status={c.status} />
          <h1 className="mt-1.5 font-display text-[1.3rem] font-semibold leading-tight text-teal-900">
            {l(c.itemName)}
          </h1>
          <p className="mt-1 text-[0.76rem] text-ink-faint">
            {t.orders.ref} {c.id}
          </p>
        </div>
      </div>

      {/* Meta */}
      <div className="mt-3 grid gap-2.5 sm:grid-cols-2">
        <MetaRow label={t.detail.expert} value={expert ? l(expert.name) : c.expertId} />
        <MetaRow label={t.detail.type} value={l(CONSULT_TYPE_LABEL[c.consultType])} />
      </div>
      {c.note && (
        <div className="mt-3 rounded-[0.9rem] bg-cream-100 px-4 py-3">
          <p className="text-[0.68rem] font-semibold uppercase tracking-[0.1em] text-ink-faint">
            {t.detail.note}
          </p>
          <p className="mt-1 text-[0.86rem] leading-relaxed text-ink-soft">{c.note}</p>
        </div>
      )}

      {/* Customise the package plan (drag-and-drop) */}
      {(c.itemType === "package" || c.itemType === "program") && (
        <Link
          href={`/orders/${c.id}/customize`}
          className="mt-3 flex items-center justify-between gap-3 rounded-[0.9rem] border border-gold-400/40 bg-gold-100/30 px-4 py-3 transition-colors hover:bg-gold-100/60"
        >
          <span className="min-w-0">
            <span className="block text-[0.86rem] font-semibold text-teal-900">
              {t.customize.cta}
            </span>
            <span className="block text-[0.72rem] leading-relaxed text-ink-soft">
              {t.customize.ctaHint}
            </span>
          </span>
          <span aria-hidden className="flex-none text-teal-700">
            ›
          </span>
        </Link>
      )}

      {/* Deposit action */}
      {c.status === "awaiting_deposit" && (
        <div className="mt-4 rounded-[1rem] border border-gold-400/50 bg-gold-100/40 p-4">
          <p className="text-[0.84rem] font-semibold text-gold-600">
            {t.detail.payDeposit} · {c.depositAmount.toLocaleString("en-US")} {t.deposit.baht}
          </p>
          <p className="mt-1 text-[0.74rem] leading-relaxed text-ink-soft">{t.deposit.mockNote}</p>
          <input
            ref={fileRef}
            type="file"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              payDeposit(f ? f.name : "slip.jpg");
            }}
          />
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            disabled={paying}
            className="mt-3 w-full rounded-full bg-teal-700 py-2.5 text-[0.84rem] font-semibold text-cream-50 shadow-soft transition-colors hover:bg-teal-800 disabled:opacity-50"
          >
            {paying ? t.deposit.uploading : t.deposit.upload}
          </button>
        </div>
      )}

      {/* Type-specific: realtime chat or managed-plan review */}
      {c.consultType === "chat" && c.status !== "awaiting_deposit" && (
        <ChatPanel id={c.id} onEnded={load} />
      )}
      {c.consultType === "managed" && c.status !== "awaiting_deposit" && (
        <ManagedPlanPanel consultation={c} onDecided={load} />
      )}

      {/* Pre / post check-in (bridged to a booking once the trip coordinates) */}
      {prepostVisible && (
        <section className="mt-4">
          <div className="rounded-[0.9rem] border border-teal-900/10 bg-teal-50/50 px-4 py-3">
            <p className="flex items-center gap-1.5 text-[0.86rem] font-semibold text-teal-900">
              <Compass className="h-4 w-4 text-teal-600" />
              {t.detail.prepostTitle}
            </p>
            <p className="mt-0.5 text-[0.76rem] leading-relaxed text-ink-soft">
              {t.detail.prepostIntro}
            </p>
          </div>
          {bookingId ? (
            <div className="mt-3">
              <CheckinCard bookingId={bookingId} hasAssessmentBaseline={Boolean(c.assessmentId)} />
            </div>
          ) : (
            <div className="mt-3 flex justify-center py-3">
              <Loader2 className="h-5 w-5 animate-spin text-teal-500" />
            </div>
          )}
        </section>
      )}

      {/* Customer next step, or feedback at the end */}
      {c.status === "awaiting_feedback" ? (
        <FeedbackForm id={c.id} />
      ) : nextStatus && c.status !== "awaiting_deposit" ? (
        <button
          type="button"
          onClick={() => advance(nextStatus)}
          disabled={advancing}
          className="mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-teal-700 py-3 text-[0.86rem] font-semibold text-cream-50 shadow-soft transition-colors hover:bg-teal-800 disabled:opacity-50"
        >
          {advancing ? t.detail.advancing : advanceLabel}
          {!advancing && <ArrowRight className="h-4 w-4" />}
        </button>
      ) : null}

      {/* Status tracker */}
      <section className="mt-6">
        <p className="eyebrow">{t.detail.timeline}</p>
        <ol className="mt-4 space-y-0">
          {CONSULT_STATUS_FLOW.map((s, i) => {
            const done = !cancelled && i < currentIndex;
            const current = !cancelled && i === currentIndex;
            const last = i === CONSULT_STATUS_FLOW.length - 1;
            return (
              <li key={s} className="flex gap-3">
                <div className="flex flex-col items-center">
                  <span
                    className={`grid h-7 w-7 flex-none place-items-center rounded-full text-[0.7rem] font-bold ${
                      done
                        ? "bg-teal-600 text-white"
                        : current
                          ? "bg-gold-500 text-white ring-4 ring-gold-100"
                          : "bg-cream-200 text-ink-faint"
                    }`}
                  >
                    {done ? <Check className="h-3.5 w-3.5" /> : i + 1}
                  </span>
                  {!last && (
                    <span className={`w-px flex-1 ${i < currentIndex ? "bg-teal-500" : "bg-teal-900/12"}`} />
                  )}
                </div>
                <div className={`pb-6 ${current ? "" : "opacity-90"}`}>
                  <p
                    className={`text-[0.88rem] ${
                      current
                        ? "font-semibold text-teal-900"
                        : done
                          ? "font-medium text-ink"
                          : "text-ink-faint"
                    }`}
                  >
                    {l(CONSULT_STATUS_LABEL[s])}
                  </p>
                </div>
              </li>
            );
          })}
        </ol>
      </section>
    </div>
  );
}

function FeedbackForm({ id }: { id: string }) {
  const t = useT(consultDict).detail;
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    try {
      if (window.localStorage.getItem(`gc-order-feedback:${id}`)) setDone(true);
    } catch {
      /* ignore */
    }
  }, [id]);

  const submit = async () => {
    if (!rating || submitting) return;
    setSubmitting(true);
    try {
      const res = await fetch(`/api/consultations/${id}/feedback`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rating, comment: comment.trim() || undefined }),
      });
      if (res.ok) {
        try {
          window.localStorage.setItem(`gc-order-feedback:${id}`, "1");
        } catch {
          /* ignore */
        }
        setDone(true);
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (done) {
    return (
      <div className="mt-5 flex items-center justify-center gap-2 rounded-3xl bg-teal-50 px-4 py-4 text-[0.88rem] font-semibold text-teal-800">
        <Check className="h-5 w-5 text-teal-600" />
        {t.feedbackThanks}
      </div>
    );
  }

  return (
    <section className="mt-5 rounded-3xl border border-teal-900/10 bg-white p-5 shadow-soft">
      <p className="font-display text-lg font-semibold text-teal-900">{t.feedbackTitle}</p>
      <p className="mt-1 text-[0.84rem] leading-relaxed text-ink-soft">{t.feedbackIntro}</p>

      <p className="mt-4 text-[0.78rem] font-semibold text-ink">{t.feedbackRating}</p>
      <div className="mt-1.5 flex gap-1">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            aria-label={`${n}`}
            onClick={() => setRating(n)}
            className="p-0.5"
          >
            <Star
              className={`h-7 w-7 transition-colors ${
                n <= rating ? "fill-gold-500 text-gold-500" : "text-teal-900/20"
              }`}
            />
          </button>
        ))}
      </div>

      <label className="mt-4 block text-[0.78rem] font-semibold text-ink">
        {t.feedbackComment}
      </label>
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        rows={3}
        placeholder={t.feedbackPlaceholder}
        className="mt-1.5 w-full resize-none rounded-[0.8rem] border border-teal-900/15 bg-cream-50 px-3.5 py-2.5 text-[0.86rem] text-ink outline-none focus:border-teal-600"
      />

      <button
        type="button"
        onClick={submit}
        disabled={!rating || submitting}
        className="mt-3 w-full rounded-full bg-teal-700 py-3 text-[0.86rem] font-semibold text-cream-50 shadow-soft transition-colors hover:bg-teal-800 disabled:opacity-50"
      >
        {submitting ? t.feedbackSubmitting : t.feedbackSubmit}
      </button>
    </section>
  );
}

function MetaRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[0.9rem] border border-teal-900/10 bg-white px-4 py-2.5 shadow-soft">
      <p className="text-[0.66rem] font-semibold uppercase tracking-[0.1em] text-ink-faint">{label}</p>
      <p className="mt-0.5 text-[0.86rem] font-semibold text-teal-900">{value}</p>
    </div>
  );
}

function CenterCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto flex max-w-sm flex-col items-center px-4 py-24 text-center">{children}</div>
  );
}
