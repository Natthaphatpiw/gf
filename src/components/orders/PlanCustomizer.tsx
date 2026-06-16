"use client";

import { useMemo, useRef, useState } from "react";
import {
  Check,
  ChevronDown,
  ChevronUp,
  GripVertical,
  Plus,
  RotateCcw,
  Salad,
  Sparkles,
  Utensils,
  X,
} from "lucide-react";
import type { WellnessPackage } from "@/lib/types";
import { useL, useT } from "@/lib/i18n";
import consultDict from "@/lib/i18n/dictionaries/consult";
import {
  addableCatalog,
  packageComposedTotal,
  packageDefaultPlan,
  priceBreakdown,
  type CatalogEntry,
  type PlanLineItem,
} from "@/lib/pricing";
import { getOrderPlan, saveOrderPlan } from "@/lib/session";

/* ============================================================
 * PlanCustomizer — the customer-facing drag-and-drop package
 * editor. Add / remove / swap / reorder services & menus; the
 * package TOTAL recomputes live from the line items + fees. The
 * customer only sees the grand total (never the fee breakdown).
 * ============================================================ */

function fmt(n: number): string {
  return n.toLocaleString("en-US");
}

export function PlanCustomizer({
  orderId,
  pkg,
  onSaved,
}: {
  orderId: string;
  pkg: WellnessPackage;
  onSaved?: () => void;
}) {
  const t = useT(consultDict).customize;
  const l = useL();

  const defaultPlan = useMemo(() => packageDefaultPlan(pkg), [pkg]);
  const originalTotal = useMemo(() => packageComposedTotal(pkg), [pkg]);
  const catalog = useMemo(() => addableCatalog(), []);

  const [items, setItems] = useState<PlanLineItem[]>(() => {
    const saved = getOrderPlan(orderId);
    return saved?.items.length ? saved.items : defaultPlan;
  });
  const [tab, setTab] = useState<"services" | "menus">("services");
  const [saved, setSaved] = useState(false);
  const addSeq = useRef(1000);

  const total = priceBreakdown(items).total;
  const diff = total - originalTotal;

  /* ---- list ops ---- */
  const move = (from: number, to: number) =>
    setItems((prev) => {
      if (to < 0 || to >= prev.length || from === to) return prev;
      const next = [...prev];
      const [it] = next.splice(from, 1);
      next.splice(to, 0, it);
      setSaved(false);
      return next;
    });
  const remove = (uid: string) => {
    setItems((prev) => prev.filter((i) => i.uid !== uid));
    setSaved(false);
  };
  const add = (entry: CatalogEntry) => {
    setItems((prev) => [
      ...prev,
      {
        uid: `add-${entry.refId}-${++addSeq.current}`,
        kind: entry.kind,
        refId: entry.refId,
        label: entry.label,
        price: entry.price,
        image: entry.image,
      },
    ]);
    setSaved(false);
  };
  const reset = () => {
    setItems(packageDefaultPlan(pkg));
    setSaved(false);
  };
  const save = () => {
    saveOrderPlan(orderId, items, total);
    setSaved(true);
    onSaved?.();
  };

  /* ---- pointer drag ---- */
  const rowRefs = useRef<Map<string, HTMLElement>>(new Map());
  const [dragUid, setDragUid] = useState<string | null>(null);
  const onHandleMove = (clientY: number) => {
    if (!dragUid) return;
    const from = items.findIndex((i) => i.uid === dragUid);
    if (from < 0) return;
    let target = items.length - 1;
    for (let i = 0; i < items.length; i++) {
      const el = rowRefs.current.get(items[i].uid);
      if (!el) continue;
      const r = el.getBoundingClientRect();
      if (clientY < r.top + r.height / 2) {
        target = i;
        break;
      }
    }
    if (target !== from) move(from, target);
  };

  const diffLabel =
    diff > 0
      ? t.diffHigher.replace("{n}", fmt(diff))
      : diff < 0
        ? t.diffLower.replace("{n}", fmt(-diff))
        : t.diffSame;

  const catEntries = tab === "services" ? catalog.services : catalog.menus;

  return (
    <div className="space-y-5">
      <p className="text-sm leading-relaxed text-ink-soft">{t.intro}</p>

      {/* live total (the only price the customer sees) */}
      <div className="rounded-3xl border border-teal-900/10 bg-teal-50/60 p-5 text-center shadow-soft">
        <p className="text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-gold-600">
          {t.totalLabel}
        </p>
        <p className="mt-1">
          <span className="font-display text-4xl font-bold text-teal-800">
            ฿{fmt(total)}
          </span>
          <span className="ml-1 text-[0.72rem] text-ink-faint">{t.perPerson}</span>
        </p>
        <p
          className={`mt-1 text-[0.78rem] font-medium ${
            diff > 0 ? "text-gold-600" : diff < 0 ? "text-teal-700" : "text-ink-faint"
          }`}
        >
          {diffLabel}
        </p>
      </div>

      {/* current plan */}
      <section>
        <p className="eyebrow mb-2">{t.planTitle}</p>
        {items.length === 0 ? (
          <p className="rounded-[0.9rem] border border-dashed border-teal-900/15 bg-white px-3 py-6 text-center text-[0.84rem] text-ink-faint">
            {t.empty}
          </p>
        ) : (
          <ul className="space-y-2">
            {items.map((it, i) => (
              <li
                key={it.uid}
                ref={(el) => {
                  if (el) rowRefs.current.set(it.uid, el);
                  else rowRefs.current.delete(it.uid);
                }}
                className={`flex items-center gap-2 rounded-[0.9rem] border bg-white p-2.5 transition-shadow ${
                  dragUid === it.uid ? "border-teal-600 shadow-deep" : "border-teal-900/10"
                }`}
              >
                <button
                  type="button"
                  aria-label={t.drag}
                  className="flex-none cursor-grab touch-none text-ink-faint active:cursor-grabbing"
                  onPointerDown={(e) => {
                    e.currentTarget.setPointerCapture(e.pointerId);
                    setDragUid(it.uid);
                  }}
                  onPointerMove={(e) => onHandleMove(e.clientY)}
                  onPointerUp={(e) => {
                    e.currentTarget.releasePointerCapture(e.pointerId);
                    setDragUid(null);
                  }}
                  onPointerCancel={() => setDragUid(null)}
                >
                  <GripVertical className="h-5 w-5" />
                </button>
                <span className="grid h-6 w-6 flex-none place-items-center rounded-full bg-teal-50 text-teal-700">
                  {it.kind === "menu" ? (
                    <Utensils className="h-3.5 w-3.5" />
                  ) : it.kind === "service" ? (
                    <Salad className="h-3.5 w-3.5" />
                  ) : (
                    <Sparkles className="h-3.5 w-3.5" />
                  )}
                </span>
                <span className="min-w-0 flex-1 truncate text-[0.86rem] font-medium text-teal-900">
                  {l(it.label)}
                </span>
                <span className="flex flex-none items-center">
                  <button
                    type="button"
                    aria-label={t.moveUp}
                    onClick={() => move(i, i - 1)}
                    disabled={i === 0}
                    className="grid h-7 w-7 place-items-center rounded-full text-teal-700 transition-colors hover:bg-teal-50 disabled:opacity-30"
                  >
                    <ChevronUp className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    aria-label={t.moveDown}
                    onClick={() => move(i, i + 1)}
                    disabled={i === items.length - 1}
                    className="grid h-7 w-7 place-items-center rounded-full text-teal-700 transition-colors hover:bg-teal-50 disabled:opacity-30"
                  >
                    <ChevronDown className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    aria-label={t.remove}
                    onClick={() => remove(it.uid)}
                    className="grid h-7 w-7 place-items-center rounded-full text-ink-faint transition-colors hover:bg-red-50 hover:text-red-600"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* add catalog */}
      <section>
        <p className="eyebrow mb-2">{t.addTitle}</p>
        <div className="mb-2.5 inline-flex rounded-full border border-teal-900/10 bg-white p-0.5">
          {(["services", "menus"] as const).map((k) => (
            <button
              key={k}
              type="button"
              onClick={() => setTab(k)}
              className={`rounded-full px-4 py-1.5 text-[0.78rem] font-semibold transition-colors ${
                tab === k ? "bg-teal-700 text-cream-50" : "text-teal-800"
              }`}
            >
              {k === "services" ? t.services : t.menus}
            </button>
          ))}
        </div>
        <div className="max-h-72 space-y-1.5 overflow-y-auto pr-1">
          {catEntries.map((entry) => (
            <button
              key={`${entry.kind}:${entry.refId}`}
              type="button"
              onClick={() => add(entry)}
              className="flex w-full items-center gap-2 rounded-[0.8rem] border border-teal-900/10 bg-white px-3 py-2 text-left transition-colors hover:bg-teal-50"
            >
              <span className="grid h-6 w-6 flex-none place-items-center rounded-full bg-teal-700 text-cream-50">
                <Plus className="h-3.5 w-3.5" />
              </span>
              <span className="min-w-0 flex-1 truncate text-[0.84rem] text-ink">
                {l(entry.label)}
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* actions */}
      <div className="flex flex-wrap items-center gap-2.5 border-t border-teal-900/10 pt-4">
        <button
          type="button"
          onClick={save}
          className="inline-flex items-center gap-2 rounded-full bg-teal-700 px-6 py-3 text-[0.86rem] font-semibold text-cream-50 shadow-soft transition-colors hover:bg-teal-800"
        >
          {saved ? <Check className="h-4 w-4" /> : null}
          {saved ? t.saved : t.save}
        </button>
        <button
          type="button"
          onClick={reset}
          className="inline-flex items-center gap-2 rounded-full border border-teal-900/15 px-5 py-3 text-[0.84rem] font-semibold text-teal-800 transition-colors hover:bg-teal-50"
        >
          <RotateCcw className="h-4 w-4" />
          {t.reset}
        </button>
      </div>
    </div>
  );
}
