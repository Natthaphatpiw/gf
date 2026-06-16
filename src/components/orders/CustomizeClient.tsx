"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useAccount } from "@/lib/account";
import { useL, useT } from "@/lib/i18n";
import consultDict from "@/lib/i18n/dictionaries/consult";
import { getPackage } from "@/data/packages";
import type { Consultation } from "@/lib/consultation";
import type { WellnessPackage } from "@/lib/types";
import { PlanCustomizer } from "@/components/orders/PlanCustomizer";

/* ============================================================
 * CustomizeClient — loads the order, resolves its package, and
 * hosts the drag-and-drop plan customiser. Owner/login-gated;
 * only package & program orders are editable.
 * ============================================================ */

export function CustomizeClient({ orderId }: { orderId: string }) {
  const t = useT(consultDict);
  const tc = t.customize;
  const l = useL();
  const { user, ready, openAuth } = useAccount();
  const [c, setC] = useState<Consultation | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      const res = await fetch(`/api/consultations/${orderId}`);
      setC(res.ok ? (await res.json()).consultation : null);
    } catch {
      setC(null);
    } finally {
      setLoading(false);
    }
  }, [orderId]);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }
    load();
  }, [user, load]);

  if (ready && !user) {
    return (
      <Centered>
        <p className="text-sm text-ink-soft">{t.orders.loginRequired}</p>
        <button
          type="button"
          onClick={openAuth}
          className="mt-4 rounded-full bg-teal-700 px-6 py-2.5 text-[0.84rem] font-semibold text-cream-50"
        >
          {t.orders.login}
        </button>
      </Centered>
    );
  }

  if (loading) {
    return (
      <Centered>
        <Loader2 className="h-6 w-6 animate-spin text-teal-700" />
      </Centered>
    );
  }

  const pkg: WellnessPackage | undefined = c ? getPackage(c.itemId) : undefined;
  const editable =
    c && (c.itemType === "package" || c.itemType === "program") && pkg;

  return (
    <div className="mx-auto max-w-2xl px-4 py-7 md:px-6 md:py-10">
      <Link
        href={`/orders/${orderId}`}
        className="inline-flex items-center gap-2 text-[0.84rem] font-semibold text-teal-700 transition-colors hover:text-teal-900"
      >
        <ArrowLeft className="h-4 w-4" />
        {tc.back}
      </Link>

      <header className="mt-4">
        <h1 className="font-display text-[1.5rem] font-semibold leading-tight text-teal-900">
          {tc.title}
        </h1>
        {c && <p className="mt-1 text-[0.84rem] text-ink-soft">{l(c.itemName)}</p>}
      </header>

      <div className="mt-6">
        {editable && pkg ? (
          <PlanCustomizer orderId={orderId} pkg={pkg} />
        ) : (
          <p className="rounded-[0.9rem] border border-dashed border-teal-900/15 bg-white px-4 py-8 text-center text-[0.86rem] text-ink-faint">
            {tc.notEditable}
          </p>
        )}
      </div>
    </div>
  );
}

function Centered({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto flex max-w-sm flex-col items-center px-4 py-24 text-center">
      {children}
    </div>
  );
}
