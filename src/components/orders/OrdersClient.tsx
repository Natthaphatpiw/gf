"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ChevronRight, ClipboardList } from "lucide-react";
import { useAccount } from "@/lib/account";
import { useL, useT } from "@/lib/i18n";
import consultDict from "@/lib/i18n/dictionaries/consult";
import { getExpert } from "@/data/experts";
import { CONSULT_TYPE_LABEL, type Consultation } from "@/lib/consultation";
import { StatusBadge } from "@/components/orders/StatusBadge";

export function OrdersClient() {
  const t = useT(consultDict);
  const l = useL();
  const { user, ready, openAuth } = useAccount();
  const [items, setItems] = useState<Consultation[] | null>(null);

  useEffect(() => {
    if (!user) {
      setItems(null);
      return;
    }
    let alive = true;
    fetch("/api/consultations")
      .then((r) => (r.ok ? r.json() : { consultations: [] }))
      .then((d) => alive && setItems(d.consultations ?? []))
      .catch(() => alive && setItems([]));
    return () => {
      alive = false;
    };
  }, [user]);

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 md:px-6 md:py-12">
      <header className="mb-7 text-center">
        <p className="eyebrow">Goodfill Care</p>
        <h1 className="mt-2 font-display text-3xl font-semibold text-teal-900 md:text-4xl">
          {t.orders.title}
        </h1>
        <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-ink-soft">
          {t.orders.intro}
        </p>
      </header>

      {ready && !user && (
        <div className="mx-auto flex max-w-sm flex-col items-center rounded-3xl border border-teal-900/10 bg-white px-6 py-12 text-center shadow-soft">
          <ClipboardList className="h-8 w-8 text-teal-700" />
          <p className="mt-4 text-sm text-ink-soft">{t.orders.loginRequired}</p>
          <button
            type="button"
            onClick={openAuth}
            className="mt-5 rounded-full bg-teal-700 px-6 py-2.5 text-[0.84rem] font-semibold text-cream-50 shadow-soft transition-colors hover:bg-teal-800"
          >
            {t.orders.login}
          </button>
        </div>
      )}

      {user && items && items.length === 0 && (
        <div className="mx-auto flex max-w-sm flex-col items-center rounded-3xl border border-dashed border-teal-900/15 bg-white px-6 py-12 text-center">
          <ClipboardList className="h-8 w-8 text-ink-faint" />
          <p className="mt-3 font-semibold text-teal-900">{t.orders.empty}</p>
          <p className="mt-1 text-[0.82rem] text-ink-faint">{t.orders.emptyHint}</p>
        </div>
      )}

      {user && items && items.length > 0 && (
        <ul className="space-y-3">
          {items.map((c) => {
            const expert = getExpert(c.expertId);
            return (
              <li key={c.id}>
                <Link
                  href={`/orders/${c.id}`}
                  className="flex items-center gap-3.5 rounded-[1.1rem] border border-teal-900/10 bg-white p-3.5 shadow-soft transition-shadow hover:shadow-lift"
                >
                  <span className="relative h-16 w-16 flex-none overflow-hidden rounded-[0.8rem] bg-teal-900">
                    {c.itemImage && (
                      <Image src={c.itemImage} alt={l(c.itemName)} fill sizes="64px" className="object-cover" />
                    )}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex flex-wrap items-center gap-2">
                      <StatusBadge status={c.status} />
                      <span className="text-[0.68rem] text-ink-faint">
                        {l(CONSULT_TYPE_LABEL[c.consultType])}
                      </span>
                    </span>
                    <span className="mt-1 block truncate font-display text-[1.02rem] font-semibold text-teal-900">
                      {l(c.itemName)}
                    </span>
                    <span className="block truncate text-[0.76rem] text-ink-faint">
                      {expert ? `${t.orders.with} ${l(expert.name)}` : ""} · {t.orders.ref} {c.id}
                    </span>
                  </span>
                  <ChevronRight className="h-5 w-5 flex-none text-ink-faint" />
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
