"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Check, MessageCircle, Sparkles, Video, X } from "lucide-react";
import type { LText } from "@/lib/types";
import type { ItemType } from "@/lib/account";
import { EXPERTS } from "@/data/experts";
import {
  CONSULT_DEPOSIT_THB,
  CONSULT_TYPE_LABEL,
  type ConsultType,
} from "@/lib/consultation";
import { getStoredProfile } from "@/lib/session";
import { lockScroll, unlockScroll } from "@/lib/scroll-lock";
import { useL, useT } from "@/lib/i18n";
import consultDict from "@/lib/i18n/dictionaries/consult";

export interface ConsultItem {
  itemType: ItemType;
  itemId: string;
  itemName: LText;
  itemImage?: string;
}

type Step = "form" | "deposit" | "done";

export function ConsultModal({
  item,
  onClose,
}: {
  item: ConsultItem;
  onClose: () => void;
}) {
  const t = useT(consultDict);
  const l = useL();
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);

  const [step, setStep] = useState<Step>("form");
  const [expertId, setExpertId] = useState<string>("");
  const [consultType, setConsultType] = useState<ConsultType | "">("");
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);
  const [consultationId, setConsultationId] = useState<string>("");
  const [error, setError] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    lockScroll();
    return () => {
      document.removeEventListener("keydown", onKey);
      unlockScroll();
    };
  }, [onClose]);

  async function confirm() {
    if (busy || !expertId || !consultType) return;
    setBusy(true);
    setError(false);
    try {
      const res = await fetch("/api/consultations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          itemType: item.itemType,
          itemId: item.itemId,
          itemName: item.itemName,
          itemImage: item.itemImage,
          expertId,
          consultType,
          note: note.trim() || undefined,
          assessmentId: getStoredProfile()?.id,
        }),
      });
      if (!res.ok) throw new Error("create failed");
      const data = await res.json();
      setConsultationId(data.consultation.id);
      setStep("deposit");
    } catch {
      setError(true);
    } finally {
      setBusy(false);
    }
  }

  async function submitDeposit(slipName: string) {
    if (busy || !consultationId) return;
    setBusy(true);
    try {
      await fetch(`/api/consultations/${consultationId}/deposit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slipUrl: slipName }),
      });
      setStep("done");
    } catch {
      setStep("done");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[78] flex items-end justify-center sm:items-center">
      <button
        type="button"
        aria-label={t.modal.close}
        onClick={onClose}
        className="absolute inset-0 bg-teal-950/50 backdrop-blur-[2px]"
      />
      <div className="relative flex max-h-[92vh] w-full flex-col overflow-hidden rounded-t-[1.4rem] bg-cream-50 shadow-deep sm:max-h-[88vh] sm:max-w-lg sm:rounded-[1.4rem]">
        <header className="flex items-center justify-between border-b border-teal-900/10 px-5 py-4">
          <h2 className="font-display text-lg font-semibold text-teal-900">{t.modal.title}</h2>
          <button
            type="button"
            aria-label={t.modal.close}
            onClick={onClose}
            className="grid h-8 w-8 place-items-center rounded-full text-teal-800 transition-colors hover:bg-teal-50"
          >
            <X className="h-5 w-5" />
          </button>
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto p-5">
          {step === "form" && (
            <div className="space-y-5">
              <p className="text-[0.82rem] text-ink-soft">
                {t.modal.forItem}{" "}
                <span className="font-semibold text-teal-900">{l(item.itemName)}</span>
              </p>

              {/* Expert picker */}
              <div>
                <p className="text-[0.78rem] font-semibold text-ink">{t.modal.chooseExpert}</p>
                <div className="mt-2 space-y-2">
                  {EXPERTS.map((e) => {
                    const selected = expertId === e.id;
                    return (
                      <button
                        key={e.id}
                        type="button"
                        onClick={() => setExpertId(e.id)}
                        className={`flex w-full items-center gap-3 rounded-[0.9rem] border p-2.5 text-left transition-colors ${
                          selected
                            ? "border-teal-600 bg-teal-50"
                            : "border-teal-900/10 bg-white hover:bg-teal-50/40"
                        }`}
                      >
                        <span className="relative h-10 w-10 flex-none overflow-hidden rounded-full bg-teal-800 text-cream-50">
                          {e.image ? (
                            <Image src={e.image} alt={l(e.name)} fill sizes="40px" className="object-cover" />
                          ) : (
                            <span className="grid h-full w-full place-items-center text-sm font-bold">
                              {l(e.name).charAt(0)}
                            </span>
                          )}
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-[0.86rem] font-semibold text-teal-900">
                            {l(e.name)}
                          </span>
                          <span className="block truncate text-[0.74rem] text-ink-faint">
                            {l(e.title)}
                          </span>
                        </span>
                        {selected && <Check className="h-4 w-4 flex-none text-teal-600" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Consult type */}
              <div>
                <p className="text-[0.78rem] font-semibold text-ink">{t.modal.chooseType}</p>
                <div className="mt-2 space-y-2">
                  <TypeCard
                    icon={<Sparkles className="h-4 w-4" />}
                    title={l(CONSULT_TYPE_LABEL.managed)}
                    desc={t.modal.typeManagedDesc}
                    badge={t.modal.recommended}
                    selected={consultType === "managed"}
                    onClick={() => setConsultType("managed")}
                  />
                  <TypeCard
                    icon={<MessageCircle className="h-4 w-4" />}
                    title={l(CONSULT_TYPE_LABEL.chat)}
                    desc={t.modal.typeChatDesc}
                    selected={consultType === "chat"}
                    onClick={() => setConsultType("chat")}
                  />
                  <TypeCard
                    icon={<Video className="h-4 w-4" />}
                    title={l(CONSULT_TYPE_LABEL.video)}
                    desc={t.modal.typeVideoDesc}
                    selected={false}
                    disabled
                    disabledLabel={t.modal.comingSoon}
                    onClick={() => {}}
                  />
                </div>
                <p className="mt-2.5 rounded-[0.7rem] bg-gold-100/60 px-3 py-2 text-[0.74rem] leading-relaxed text-gold-900">
                  {t.modal.timeNote}
                </p>
              </div>

              {/* Note / first message */}
              <div>
                <label className="text-[0.78rem] font-semibold text-ink">
                  {consultType === "chat" ? t.modal.firstMessageLabel : t.modal.noteLabel}{" "}
                  <span className="font-normal text-ink-faint">{t.modal.noteOptional}</span>
                </label>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  rows={3}
                  placeholder={
                    consultType === "chat" ? t.modal.firstMessagePlaceholder : t.modal.notePlaceholder
                  }
                  className="mt-1.5 w-full resize-none rounded-[0.7rem] border border-teal-900/15 bg-white px-3 py-2.5 text-[0.84rem] text-ink outline-none transition-colors focus:border-teal-600 focus:ring-2 focus:ring-teal-600/20"
                />
              </div>

              {error && (
                <p className="rounded-[0.7rem] bg-red-50 px-3 py-2 text-[0.8rem] font-medium text-red-700">
                  {t.modal.error}
                </p>
              )}

              <button
                type="button"
                onClick={confirm}
                disabled={busy || !expertId || !consultType}
                className="w-full rounded-full bg-teal-700 py-3 text-[0.86rem] font-semibold text-cream-50 shadow-soft transition-colors hover:bg-teal-800 disabled:opacity-50"
              >
                {t.modal.confirm}
              </button>
            </div>
          )}

          {step === "deposit" && (
            <div className="space-y-4 text-center">
              <h3 className="font-display text-xl font-semibold text-teal-900">{t.deposit.title}</h3>
              <p className="text-[0.84rem] text-ink-soft">{t.deposit.intro}</p>
              <div className="mx-auto inline-flex items-baseline gap-2 rounded-[0.9rem] bg-white px-5 py-3 shadow-soft">
                <span className="text-[0.72rem] text-ink-faint">{t.deposit.amountLabel}</span>
                <span className="font-display text-2xl font-bold text-teal-800">
                  {CONSULT_DEPOSIT_THB.toLocaleString("en-US")}
                </span>
                <span className="text-[0.7rem] text-ink-faint">{t.deposit.baht}</span>
              </div>
              <p className="rounded-[0.7rem] bg-cream-100 px-3 py-2 text-[0.74rem] leading-relaxed text-ink-soft">
                {t.deposit.mockNote}
              </p>
              <input
                ref={fileRef}
                type="file"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  submitDeposit(f ? f.name : "slip.jpg");
                }}
              />
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                disabled={busy}
                className="w-full rounded-full bg-teal-700 py-3 text-[0.86rem] font-semibold text-cream-50 shadow-soft transition-colors hover:bg-teal-800 disabled:opacity-50"
              >
                {busy ? t.deposit.uploading : t.deposit.upload}
              </button>
            </div>
          )}

          {step === "done" && (
            <div className="space-y-4 py-4 text-center">
              <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-teal-50 text-teal-700">
                <Check className="h-7 w-7" />
              </span>
              <h3 className="font-display text-xl font-semibold text-teal-900">{t.done.title}</h3>
              <p className="text-[0.86rem] leading-relaxed text-ink-soft">{t.done.body}</p>
              <div className="flex flex-col gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    router.push(`/orders/${consultationId}`);
                  }}
                  className="w-full rounded-full bg-teal-700 py-3 text-[0.86rem] font-semibold text-cream-50 shadow-soft transition-colors hover:bg-teal-800"
                >
                  {t.done.viewOrder}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    router.push("/orders");
                  }}
                  className="w-full rounded-full border border-teal-900/15 bg-white py-3 text-[0.86rem] font-semibold text-teal-800 transition-colors hover:bg-teal-50"
                >
                  {t.done.viewAll}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function TypeCard({
  icon,
  title,
  desc,
  badge,
  selected,
  disabled,
  disabledLabel,
  onClick,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
  badge?: string;
  selected: boolean;
  disabled?: boolean;
  disabledLabel?: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`flex w-full items-start gap-3 rounded-[0.9rem] border p-3 text-left transition-colors ${
        disabled
          ? "cursor-not-allowed border-teal-900/10 bg-cream-100/60 opacity-70"
          : selected
            ? "border-teal-600 bg-teal-50"
            : "border-teal-900/10 bg-white hover:bg-teal-50/40"
      }`}
    >
      <span
        className={`mt-0.5 grid h-8 w-8 flex-none place-items-center rounded-full ${
          selected ? "bg-teal-600 text-white" : "bg-teal-50 text-teal-700"
        }`}
      >
        {icon}
      </span>
      <span className="min-w-0 flex-1">
        <span className="flex items-center gap-2">
          <span className="text-[0.86rem] font-semibold text-teal-900">{title}</span>
          {badge && (
            <span className="rounded-full bg-gold-100 px-2 py-0.5 text-[0.62rem] font-semibold text-gold-600">
              {badge}
            </span>
          )}
          {disabled && disabledLabel && (
            <span className="rounded-full bg-cream-200 px-2 py-0.5 text-[0.62rem] font-semibold text-ink-faint">
              {disabledLabel}
            </span>
          )}
        </span>
        <span className="mt-0.5 block text-[0.76rem] leading-snug text-ink-soft">{desc}</span>
      </span>
      {selected && <Check className="mt-1 h-4 w-4 flex-none text-teal-600" />}
    </button>
  );
}
