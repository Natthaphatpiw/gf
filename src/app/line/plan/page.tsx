"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown, ChevronUp, GripVertical, Plus, X } from "lucide-react";
import { useLiff, liffAuthHeaders } from "@/lib/useLiff";
import { useL, useT } from "@/lib/i18n";
import lineDict from "@/lib/i18n/dictionaries/line";
import { GuestProfilePanel } from "@/components/line/GuestProfilePanel";
import type { ExpertConsultContext } from "@/lib/line-context";
import type { ProposalSlotKind } from "@/lib/consultation";
import type { LText } from "@/lib/types";
import type { PlanCatalogItem } from "@/lib/plan";

const PLAN_LIFF_ID = process.env.NEXT_PUBLIC_LIFF_MANAGED_PLAN_ID ?? "";

interface EditSlot {
  key: string;
  itemType: ProposalSlotKind;
  itemId?: string;
  label: LText;
  fromOriginal: boolean;
}

let keySeq = 0;
const nextKey = () => `s${++keySeq}`;

export default function LinePlanPage() {
  const { status, token, consultationId } = useLiff(PLAN_LIFF_ID);
  const t = useT(lineDict);
  const l = useL();

  const [ctx, setCtx] = useState<ExpertConsultContext | null>(null);
  const [loadError, setLoadError] = useState(false);
  const [slots, setSlots] = useState<EditSlot[]>([]);
  const [note, setNote] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const base = consultationId ? `/api/line/expert/${consultationId}` : null;
  const headers = liffAuthHeaders(token);

  useEffect(() => {
    if (status !== "ready" || !base) return;
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(base, { headers });
        if (!res.ok) throw new Error("load");
        const data = (await res.json()) as ExpertConsultContext;
        if (cancelled) return;
        setCtx(data);
        const source = data.proposal?.slots ?? data.original ?? [];
        setSlots(
          source.map((s) => ({
            key: nextKey(),
            itemType: s.itemType,
            itemId: s.itemId,
            label: s.label,
            fromOriginal: s.fromOriginal,
          })),
        );
        if (data.proposal?.note) setNote(data.proposal.note);
      } catch {
        if (!cancelled) setLoadError(true);
      }
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, base, token]);

  /* ---- list operations ---- */
  const move = (from: number, to: number) => {
    setSlots((prev) => {
      if (to < 0 || to >= prev.length || from === to) return prev;
      const next = [...prev];
      const [item] = next.splice(from, 1);
      next.splice(to, 0, item);
      return next;
    });
  };
  const remove = (i: number) => setSlots((prev) => prev.filter((_, idx) => idx !== i));
  const addItem = (item: PlanCatalogItem) =>
    setSlots((prev) => [
      ...prev,
      { key: nextKey(), itemType: item.kind, itemId: item.id, label: item.label, fromOriginal: false },
    ]);

  /* ---- pointer drag-and-drop ---- */
  const rowRefs = useRef<Map<string, HTMLElement>>(new Map());
  const [draggingKey, setDraggingKey] = useState<string | null>(null);

  const onHandleMove = (clientY: number) => {
    if (!draggingKey) return;
    const fromIdx = slots.findIndex((s) => s.key === draggingKey);
    if (fromIdx < 0) return;
    let target = slots.length - 1;
    for (let i = 0; i < slots.length; i++) {
      const el = rowRefs.current.get(slots[i].key);
      if (!el) continue;
      const r = el.getBoundingClientRect();
      if (clientY < r.top + r.height / 2) {
        target = i;
        break;
      }
    }
    if (target !== fromIdx) move(fromIdx, target);
  };

  const save = async () => {
    if (!base || saving || slots.length === 0) return;
    setSaving(true);
    try {
      const res = await fetch(`${base}/proposal`, {
        method: "POST",
        headers: { ...headers, "Content-Type": "application/json" },
        body: JSON.stringify({
          note: note.trim() || undefined,
          slots: slots.map((s) => ({
            itemType: s.itemType,
            itemId: s.itemId,
            label: s.label,
            fromOriginal: s.fromOriginal,
          })),
        }),
      });
      if (res.ok) setSaved(true);
    } finally {
      setSaving(false);
    }
  };

  const kindLabel = (k: ProposalSlotKind) =>
    k === "service"
      ? t.plan.kindService
      : k === "menu"
        ? t.plan.kindMenu
        : k === "guidance"
          ? t.plan.kindGuidance
          : t.plan.kindUnassigned;

  return (
    <div className="fixed inset-0 z-[200] flex flex-col bg-cream-50">
      {status === "loading" && <Centered>{t.loading}</Centered>}
      {status === "ready" && loadError && <Centered>{t.notFound}</Centered>}

      {status === "ready" && !loadError && ctx && saved && (
        <Centered>
          <div className="max-w-sm">
            <p className="font-display text-xl font-semibold text-teal-900">{t.plan.savedTitle}</p>
            <p className="mt-2 text-[0.88rem] leading-relaxed text-ink-soft">{t.plan.savedBody}</p>
          </div>
        </Centered>
      )}

      {status === "ready" && !loadError && ctx && !saved && (
        <>
          <header className="border-b border-teal-900/10 bg-white px-4 py-3">
            <h1 className="font-display text-lg font-semibold text-teal-900">{t.plan.title}</h1>
            <p className="truncate text-[0.78rem] text-ink-soft">{l(ctx.consultation.itemName)}</p>
          </header>

          <div className="min-h-0 flex-1 space-y-4 overflow-y-auto px-4 py-4">
            <GuestProfilePanel
              profile={ctx.profile}
              guestName={ctx.guest?.firstName}
              itemName={l(ctx.consultation.itemName)}
              note={ctx.consultation.note}
            />

            {/* Plan slots (sortable) */}
            <section>
              <div className="flex items-center justify-between">
                <p className="text-[0.66rem] font-semibold uppercase tracking-[0.12em] text-gold-600">
                  {t.plan.planColumn}
                </p>
              </div>
              <p className="mt-0.5 text-[0.74rem] text-ink-faint">{t.plan.dragHint}</p>

              {slots.length === 0 ? (
                <p className="mt-2 rounded-[0.9rem] border border-dashed border-teal-900/15 bg-white px-3 py-6 text-center text-[0.82rem] text-ink-faint">
                  {t.plan.empty}
                </p>
              ) : (
                <ul className="mt-2 space-y-2">
                  {slots.map((slot, i) => (
                    <li
                      key={slot.key}
                      ref={(el) => {
                        if (el) rowRefs.current.set(slot.key, el);
                        else rowRefs.current.delete(slot.key);
                      }}
                      className={`flex items-center gap-2 rounded-[0.9rem] border bg-white p-2.5 transition-shadow ${
                        draggingKey === slot.key
                          ? "border-teal-600 shadow-deep"
                          : "border-teal-900/10"
                      }`}
                    >
                      <button
                        type="button"
                        aria-label={t.plan.drag}
                        className="flex-none cursor-grab touch-none text-ink-faint active:cursor-grabbing"
                        onPointerDown={(e) => {
                          e.currentTarget.setPointerCapture(e.pointerId);
                          setDraggingKey(slot.key);
                        }}
                        onPointerMove={(e) => onHandleMove(e.clientY)}
                        onPointerUp={(e) => {
                          e.currentTarget.releasePointerCapture(e.pointerId);
                          setDraggingKey(null);
                        }}
                        onPointerCancel={() => setDraggingKey(null)}
                      >
                        <GripVertical className="h-5 w-5" />
                      </button>

                      <span className="grid h-6 w-6 flex-none place-items-center rounded-full bg-teal-50 text-[0.74rem] font-semibold text-teal-700">
                        {i + 1}
                      </span>

                      <div className="min-w-0 flex-1">
                        <p className="truncate text-[0.86rem] font-semibold text-teal-900">
                          {l(slot.label)}
                        </p>
                        <p className="text-[0.7rem] text-ink-faint">
                          {kindLabel(slot.itemType)}
                          {" · "}
                          <span className={slot.fromOriginal ? "text-ink-faint" : "text-gold-600"}>
                            {slot.fromOriginal ? t.plan.fromOriginal : t.plan.added}
                          </span>
                        </p>
                      </div>

                      <div className="flex flex-none items-center">
                        <button
                          type="button"
                          aria-label={t.plan.moveUp}
                          onClick={() => move(i, i - 1)}
                          disabled={i === 0}
                          className="grid h-7 w-7 place-items-center rounded-full text-teal-700 transition-colors hover:bg-teal-50 disabled:opacity-30"
                        >
                          <ChevronUp className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          aria-label={t.plan.moveDown}
                          onClick={() => move(i, i + 1)}
                          disabled={i === slots.length - 1}
                          className="grid h-7 w-7 place-items-center rounded-full text-teal-700 transition-colors hover:bg-teal-50 disabled:opacity-30"
                        >
                          <ChevronDown className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          aria-label={t.plan.remove}
                          onClick={() => remove(i)}
                          className="grid h-7 w-7 place-items-center rounded-full text-ink-faint transition-colors hover:bg-red-50 hover:text-red-600"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </section>

            {/* Catalog */}
            <section>
              <p className="text-[0.66rem] font-semibold uppercase tracking-[0.12em] text-gold-600">
                {t.plan.catalogColumn}
              </p>
              {ctx.catalog && (
                <div className="mt-2 space-y-3">
                  <CatalogGroup title={t.plan.services} items={ctx.catalog.services} onAdd={addItem} l={l} addLabel={t.plan.added} />
                  <CatalogGroup title={t.plan.menus} items={ctx.catalog.menus} onAdd={addItem} l={l} addLabel={t.plan.added} />
                </div>
              )}
            </section>

            {/* Note */}
            <section>
              <label className="text-[0.66rem] font-semibold uppercase tracking-[0.12em] text-gold-600">
                {t.plan.noteLabel}{" "}
                <span className="font-normal normal-case tracking-normal text-ink-faint">
                  {t.plan.noteOptional}
                </span>
              </label>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                rows={3}
                placeholder={t.plan.notePlaceholder}
                className="mt-1.5 w-full resize-none rounded-[0.9rem] border border-teal-900/15 bg-white px-3.5 py-2.5 text-[0.86rem] text-ink outline-none focus:border-teal-600"
              />
            </section>
          </div>

          <footer className="border-t border-teal-900/10 bg-white px-4 py-3">
            <button
              type="button"
              onClick={save}
              disabled={saving || slots.length === 0}
              className="w-full rounded-full bg-teal-700 py-3 text-[0.88rem] font-semibold text-cream-50 shadow-soft transition-colors hover:bg-teal-800 disabled:opacity-50"
            >
              {saving ? t.plan.saving : t.plan.save}
            </button>
          </footer>
        </>
      )}
    </div>
  );
}

function CatalogGroup({
  title,
  items,
  onAdd,
  l,
  addLabel,
}: {
  title: string;
  items: PlanCatalogItem[];
  onAdd: (item: PlanCatalogItem) => void;
  l: (text: LText | undefined | null) => string;
  addLabel: string;
}) {
  if (items.length === 0) return null;
  return (
    <div>
      <p className="text-[0.78rem] font-semibold text-teal-900">{title}</p>
      <div className="mt-1.5 max-h-44 space-y-1.5 overflow-y-auto pr-1">
        {items.map((item) => (
          <button
            key={`${item.kind}:${item.id}`}
            type="button"
            onClick={() => onAdd(item)}
            aria-label={`${addLabel} ${l(item.label)}`}
            className="flex w-full items-center gap-2 rounded-[0.7rem] border border-teal-900/10 bg-white px-3 py-2 text-left transition-colors hover:bg-teal-50"
          >
            <span className="grid h-6 w-6 flex-none place-items-center rounded-full bg-teal-700 text-cream-50">
              <Plus className="h-3.5 w-3.5" />
            </span>
            <span className="min-w-0 flex-1 truncate text-[0.84rem] text-ink">{l(item.label)}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

function Centered({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-1 items-center justify-center px-6 text-center text-[0.9rem] text-ink-soft">
      {children}
    </div>
  );
}
