"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowLeft, Check, Loader2 } from "lucide-react";
import { useAccount } from "@/lib/account";
import { useL, useT } from "@/lib/i18n";
import consultDict from "@/lib/i18n/dictionaries/consult";
import { getExpert } from "@/data/experts";
import {
  CONSULT_STATUS_FLOW,
  CONSULT_STATUS_LABEL,
  CONSULT_TYPE_LABEL,
  type Consultation,
} from "@/lib/consultation";
import { StatusBadge } from "@/components/orders/StatusBadge";
import { ChatPanel } from "@/components/orders/ChatPanel";
import { ManagedPlanPanel } from "@/components/orders/ManagedPlanPanel";

export function OrderDetailClient({ id }: { id: string }) {
  const t = useT(consultDict);
  const l = useL();
  const { user, ready, openAuth } = useAccount();
  const [c, setC] = useState<Consultation | null>(null);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);
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
