"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Loader2,
  AlertCircle,
  Plus,
  Trash2,
  Send,
  BadgeCheck,
  CheckCircle2,
  Users,
  Stethoscope,
  Salad,
  Database,
  ClipboardList,
  Layers,
  SlidersHorizontal,
  MessageSquareText,
  ArrowRightCircle,
} from "lucide-react";
import { useL, useLocale, useT } from "@/lib/i18n";
import expert from "@/lib/i18n/dictionaries/expert";
import common from "@/lib/i18n/dictionaries/common";
import { Button } from "@/components/ui/Button";
import { StatusPill } from "@/components/expert/StatusPill";
import { RawDataBlock } from "@/components/expert/RawDataBlock";
import { CheckinBriefPanel } from "@/components/checkin/CheckinBriefPanel";
import { ProfileSummary } from "@/components/expert/ProfileSummary";
import { PackageItinerary } from "@/components/expert/PackageItinerary";
import { formatDateTime } from "@/components/expert/format";
import {
  buildTargetOptions,
  TARGET_GENERAL,
} from "@/components/expert/targets";
import {
  expertFetch,
  newAdjustmentUid,
  type AdjustmentRow,
  type BookingDetail,
} from "@/components/expert/client";
import type { Booking, BookingStatus } from "@/lib/types";

/* ============================================================
 * Workbench — the expert review surface for a single booking.
 * ============================================================ */

type RoleKey = "nutritionist" | "doctor";
type Flash = { kind: "sent" | "approved" | "status"; ts: number } | null;

const STATUS_CHAIN: BookingStatus[] = [
  "booked",
  "expert_review",
  "processing",
  "contacted",
  "completed",
];

export function Workbench({ bookingId }: { bookingId: string }) {
  const dict = useT(expert);
  const t = dict.bench;
  const c = useT(common);
  const l = useL();
  const { locale } = useLocale();

  const [detail, setDetail] = useState<BookingDetail | null>(null);
  const [loadError, setLoadError] = useState<"none" | "notfound" | "error">(
    "none",
  );

  // editor state
  const [rows, setRows] = useState<AdjustmentRow[]>([]);
  const [comment, setComment] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState<RoleKey>("nutritionist");

  const [saving, setSaving] = useState<"" | "send" | "approve" | "status">("");
  const [flash, setFlash] = useState<Flash>(null);
  const [needName, setNeedName] = useState(false);

  /* ---- load & hydrate editor from any existing review ---- */
  const hydrate = useCallback((d: BookingDetail) => {
    setDetail(d);
    const review = d.booking.expertReview;
    if (review) {
      setRows(
        (review.adjustments ?? []).map((a) => ({
          ...a,
          uid: newAdjustmentUid(),
        })),
      );
      setComment(review.comment ?? "");
      // stored expertName may be "Name · Role" — split it back out.
      const raw = review.expertName ?? "";
      const parts = raw.split(" · ");
      if (parts.length === 2) {
        setName(parts[0]);
        if (parts[1] === dict.bench.review.roles.doctor) setRole("doctor");
        else setRole("nutritionist");
      } else {
        setName(raw);
      }
    }
  }, [dict.bench.review.roles.doctor]);

  const load = useCallback(async () => {
    setLoadError("none");
    try {
      const res = await expertFetch(`/api/expert/booking/${bookingId}`);
      if (res.status === 404) {
        setLoadError("notfound");
        return;
      }
      if (!res.ok) throw new Error("detail");
      const data = (await res.json()) as BookingDetail;
      hydrate(data);
    } catch {
      setLoadError("error");
    }
  }, [bookingId, hydrate]);

  useEffect(() => {
    load();
  }, [load]);

  const targetOptions = useMemo(
    () =>
      buildTargetOptions(detail?.package ?? null, locale, {
        accommodation: t.pkg.accommodation,
        general: t.pkg.general,
        day: t.pkg.day,
      }),
    [detail?.package, locale, t.pkg.accommodation, t.pkg.general, t.pkg.day],
  );

  /* ---- adjustment row ops ---- */
  function addRow() {
    setRows((prev) => [
      ...prev,
      {
        uid: newAdjustmentUid(),
        target: TARGET_GENERAL,
        original: "",
        replacement: "",
        reason: "",
      },
    ]);
  }

  function removeRow(uid: string) {
    setRows((prev) => prev.filter((r) => r.uid !== uid));
  }

  function patchRow(uid: string, patch: Partial<AdjustmentRow>) {
    setRows((prev) =>
      prev.map((r) => (r.uid === uid ? { ...r, ...patch } : r)),
    );
  }

  function onTargetChange(uid: string, value: string) {
    const opt = targetOptions.find((o) => o.value === value);
    setRows((prev) =>
      prev.map((r) =>
        r.uid === uid
          ? {
              ...r,
              target: value,
              // auto-fill original from itinerary, but don't clobber edits
              original: r.original && r.original.trim() ? r.original : opt?.original ?? "",
            }
          : r,
      ),
    );
  }

  /* ---- submit ---- */
  async function submit(action: "send" | "approve") {
    if (saving) return;
    if (!name.trim()) {
      setNeedName(true);
      return;
    }
    setNeedName(false);
    setSaving(action);
    try {
      const res = await expertFetch("/api/expert/review", {
        method: "POST",
        body: JSON.stringify({
          bookingId,
          action,
          review: {
            expertName: name.trim(),
            role: dict.bench.review.roles[role],
            comment: comment.trim(),
            adjustments: rows.map(({ uid: _uid, ...a }) => a),
          },
        }),
      });
      if (!res.ok) throw new Error("review");
      const data = (await res.json()) as { booking: Booking };
      setDetail((prev) => (prev ? { ...prev, booking: data.booking } : prev));
      setFlash({ kind: action === "approve" ? "approved" : "sent", ts: Date.now() });
    } catch {
      setFlash(null);
      setLoadError("error");
    } finally {
      setSaving("");
    }
  }

  async function setStatus(next: BookingStatus) {
    if (saving) return;
    setSaving("status");
    try {
      const res = await expertFetch("/api/expert/review", {
        method: "POST",
        body: JSON.stringify({ bookingId, action: "set_status", status: next }),
      });
      if (!res.ok) throw new Error("status");
      const data = (await res.json()) as { booking: Booking };
      setDetail((prev) => (prev ? { ...prev, booking: data.booking } : prev));
      setFlash({ kind: "status", ts: Date.now() });
    } catch {
      setLoadError("error");
    } finally {
      setSaving("");
    }
  }

  /* ---- render guards ---- */
  if (loadError === "notfound") {
    return (
      <CenterNote
        icon={<AlertCircle className="h-7 w-7 text-[#bf6b4f]" />}
        title={t.bookingNotFound}
        backLabel={t.backToInbox}
      />
    );
  }

  if (!detail) {
    return (
      <div className="grid min-h-[60vh] place-items-center px-5">
        <span className="flex items-center gap-2 text-sm text-ink-faint">
          <Loader2 className="h-4 w-4 animate-spin" />
          {t.loading}
        </span>
      </div>
    );
  }

  const { booking, package: pkg, profile, familyProfiles } = detail;
  const review = booking.expertReview;
  const accepted = !!review?.customerAccepted;

  return (
    <div className="mx-auto max-w-3xl px-5 py-6 md:py-10">
      {/* top bar */}
      <div className="animate-rise mb-5">
        <Link
          href="/expert"
          className="mb-3 inline-flex items-center gap-1.5 text-xs font-medium text-teal-700 hover:text-teal-900"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          {t.backToInbox}
        </Link>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-mono text-sm font-semibold tracking-wide text-teal-700">
              {booking.id}
            </span>
            <StatusPill status={booking.status} />
            {booking.isFamily && (
              <span className="inline-flex items-center gap-1 rounded-full bg-sage-100 px-2 py-0.5 text-[0.62rem] font-medium text-teal-800">
                <Users className="h-3 w-3" />
                {(booking.familySize ?? booking.familyMembers?.length ?? 0) || ""}
              </span>
            )}
          </div>
          <span className="text-[0.65rem] text-ink-faint">
            {c.status.booked} · {formatDateTime(booking.createdAt, locale)}
          </span>
        </div>

        <h1 className="mt-1 font-display text-2xl font-semibold leading-tight text-teal-900">
          {booking.customer.firstName} {booking.customer.lastName}
        </h1>
        <p className="text-xs text-ink-faint">
          {booking.customer.email} · {booking.customer.phone}
        </p>
      </div>

      {/* guest-accepted banner */}
      {accepted && (
        <div className="animate-fade mb-5 flex items-start gap-3 rounded-2xl border border-teal-500/30 bg-teal-50 p-4">
          <BadgeCheck className="mt-0.5 h-5 w-5 shrink-0 text-teal-600" />
          <div>
            <p className="text-sm font-semibold text-teal-900">
              {t.actions.guestAccepted}
            </p>
            <p className="mt-0.5 text-xs leading-relaxed text-ink-soft">
              {t.actions.guestAcceptedHint}
            </p>
          </div>
        </div>
      )}

      <div className="space-y-7">
        {/* 1. RAW DATA */}
        <Section icon={<Database className="h-4 w-4" />} title={t.sections.raw}>
          <RawDataBlock
            sections={[
              { label: t.raw.booking, data: booking },
              ...(profile
                ? [{ label: t.raw.primaryProfile, data: profile }]
                : []),
              ...familyProfiles
                .filter((f) => f.profile)
                .map((f) => ({
                  label: `${t.raw.familyProfile} · ${f.label ?? f.id}`,
                  data: f.profile,
                })),
            ]}
          />
        </Section>

        {/* 2. GUEST PROFILE */}
        <Section
          icon={<ClipboardList className="h-4 w-4" />}
          title={t.sections.profile}
        >
          <div className="space-y-4">
            <ProfileSummary profile={profile} heading={t.profile.primary} />
            {familyProfiles.map((f, i) => (
              <ProfileSummary
                key={f.id || i}
                profile={f.profile}
                heading={`${t.profile.member} ${i + 1}${f.label ? ` · ${f.label}` : ""}`}
              />
            ))}
          </div>
        </Section>

        {/* 2b. T1/T2 CHECK-INS */}
        <CheckinBriefPanel bookingId={bookingId} />

        {/* 3. PACKAGE */}
        <Section icon={<Layers className="h-4 w-4" />} title={t.sections.package}>
          <PackageItinerary pkg={pkg} />
        </Section>

        {/* 4. ADJUSTMENTS BUILDER */}
        <Section
          icon={<SlidersHorizontal className="h-4 w-4" />}
          title={t.sections.adjustments}
        >
          <div className="space-y-3">
            {rows.length === 0 && (
              <p className="rounded-2xl border border-dashed border-teal-900/15 bg-white/60 p-4 text-center text-xs leading-relaxed text-ink-faint">
                {t.adj.empty}
              </p>
            )}

            {rows.map((row) => (
              <div
                key={row.uid}
                className="rounded-2xl border border-teal-900/10 bg-white p-4 shadow-soft"
              >
                <div className="mb-3 flex items-start justify-between gap-3">
                  <label className="flex-1">
                    <span className="mb-1 block text-[0.62rem] font-semibold uppercase tracking-[0.12em] text-ink-faint">
                      {t.adj.target}
                    </span>
                    <select
                      value={row.target}
                      onChange={(e) => onTargetChange(row.uid, e.target.value)}
                      className="w-full rounded-xl border border-teal-900/15 bg-cream-50 px-3 py-2 text-xs text-ink outline-none focus:border-teal-500"
                    >
                      {targetOptions.map((o) => (
                        <option key={o.value} value={o.value}>
                          {o.label}
                        </option>
                      ))}
                    </select>
                  </label>
                  <button
                    type="button"
                    onClick={() => removeRow(row.uid)}
                    aria-label={t.adj.remove}
                    className="mt-5 grid h-8 w-8 shrink-0 place-items-center rounded-full text-ink-faint transition-colors hover:bg-[#bf6b4f]/10 hover:text-[#bf6b4f]"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <Field
                    label={t.adj.original}
                    value={row.original}
                    placeholder={t.adj.originalPh}
                    onChange={(v) => patchRow(row.uid, { original: v })}
                  />
                  <Field
                    label={t.adj.replacement}
                    value={row.replacement}
                    placeholder={t.adj.replacementPh}
                    onChange={(v) => patchRow(row.uid, { replacement: v })}
                  />
                </div>
                <div className="mt-3">
                  <Field
                    label={t.adj.reason}
                    value={row.reason}
                    placeholder={t.adj.reasonPh}
                    onChange={(v) => patchRow(row.uid, { reason: v })}
                  />
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={addRow}
              className="flex w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-teal-700/30 bg-white/50 py-3 text-sm font-medium text-teal-700 transition-colors hover:border-teal-700 hover:bg-teal-50"
            >
              <Plus className="h-4 w-4" />
              {t.adj.add}
            </button>
          </div>
        </Section>

        {/* 5. COMMENT + IDENTITY */}
        <Section
          icon={<MessageSquareText className="h-4 w-4" />}
          title={t.sections.comment}
        >
          <div className="space-y-4 rounded-2xl border border-teal-900/10 bg-white p-4 shadow-soft">
            <label className="block">
              <span className="mb-1.5 block text-[0.62rem] font-semibold uppercase tracking-[0.12em] text-ink-faint">
                {t.review.commentLabel}
              </span>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder={t.review.commentPh}
                rows={5}
                className="w-full resize-y rounded-xl border border-teal-900/15 bg-cream-50 px-3 py-2.5 text-sm leading-relaxed text-ink outline-none focus:border-teal-500"
              />
            </label>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="mb-1.5 block text-[0.62rem] font-semibold uppercase tracking-[0.12em] text-ink-faint">
                  {t.review.nameLabel}
                </span>
                <input
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (needName) setNeedName(false);
                  }}
                  placeholder={t.review.namePh}
                  className={`w-full rounded-xl border bg-cream-50 px-3 py-2 text-sm text-ink outline-none focus:border-teal-500 ${
                    needName ? "border-[#bf6b4f]" : "border-teal-900/15"
                  }`}
                />
              </label>

              <div>
                <span className="mb-1.5 block text-[0.62rem] font-semibold uppercase tracking-[0.12em] text-ink-faint">
                  {t.review.roleLabel}
                </span>
                <div className="flex gap-2">
                  <RoleChip
                    active={role === "nutritionist"}
                    onClick={() => setRole("nutritionist")}
                    icon={<Salad className="h-3.5 w-3.5" />}
                    label={t.review.roles.nutritionist}
                  />
                  <RoleChip
                    active={role === "doctor"}
                    onClick={() => setRole("doctor")}
                    icon={<Stethoscope className="h-3.5 w-3.5" />}
                    label={t.review.roles.doctor}
                  />
                </div>
              </div>
            </div>

            {needName && (
              <p className="flex items-center gap-2 text-xs font-medium text-[#bf6b4f]">
                <AlertCircle className="h-4 w-4 shrink-0" />
                {t.actions.needName}
              </p>
            )}
          </div>
        </Section>

        {/* 6. ACTIONS */}
        <Section
          icon={<ArrowRightCircle className="h-4 w-4" />}
          title={t.sections.actions}
        >
          <div className="space-y-3 rounded-2xl border border-teal-900/10 bg-white p-4 shadow-soft">
            {review?.reviewedAt && (
              <p className="text-[0.7rem] text-ink-faint">
                {t.actions.reviewedAt} · {formatDateTime(review.reviewedAt, locale)}
              </p>
            )}

            {flash && (
              <p className="flex items-center gap-2 text-xs font-medium text-teal-600">
                <CheckCircle2 className="h-4 w-4 shrink-0" />
                {flash.kind === "approved"
                  ? t.actions.approved
                  : flash.kind === "status"
                    ? t.statusFlow.saved
                    : t.actions.sent}
              </p>
            )}

            <div className="flex flex-col gap-3 sm:flex-row">
              <Button
                variant="secondary"
                size="md"
                onClick={() => submit("send")}
                disabled={!!saving}
                className="flex-1"
              >
                {saving === "send" ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    {t.actions.sending}
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    {t.actions.send}
                  </>
                )}
              </Button>
              <Button
                variant="gold"
                size="md"
                onClick={() => submit("approve")}
                disabled={!!saving}
                className="flex-1"
              >
                {saving === "approve" ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    {t.actions.sending}
                  </>
                ) : (
                  <>
                    <BadgeCheck className="h-4 w-4" />
                    {t.actions.approve}
                  </>
                )}
              </Button>
            </div>

            {/* status advancer */}
            <div className="mt-2 border-t border-teal-900/10 pt-4">
              <p className="text-xs font-semibold text-ink">
                {t.statusFlow.title}
              </p>
              <p className="mb-3 text-[0.68rem] leading-relaxed text-ink-faint">
                {t.statusFlow.hint}
              </p>
              <div className="no-scrollbar -mx-1 flex gap-1.5 overflow-x-auto px-1">
                {STATUS_CHAIN.map((s) => {
                  const active = booking.status === s;
                  return (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setStatus(s)}
                      disabled={!!saving || active}
                      className={`shrink-0 rounded-full px-3 py-1.5 text-[0.66rem] font-medium tracking-wide transition-colors disabled:opacity-100 ${
                        active
                          ? "bg-teal-800 text-cream-50"
                          : "border border-teal-900/10 bg-cream-50 text-ink-soft hover:bg-teal-50 disabled:opacity-40"
                      }`}
                    >
                      {c.status[s]}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </Section>
      </div>

      {/* clears the mobile tab bar */}
      <div className="h-6 md:h-0" />
    </div>
  );
}

/* ---------------- small building blocks ---------------- */

function Section({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="animate-rise">
      <h2 className="mb-3 flex items-center gap-2 font-display text-lg font-semibold text-teal-900">
        <span className="grid h-7 w-7 place-items-center rounded-lg bg-teal-50 text-teal-600">
          {icon}
        </span>
        {title}
      </h2>
      {children}
    </section>
  );
}

function Field({
  label,
  value,
  placeholder,
  onChange,
}: {
  label: string;
  value: string;
  placeholder: string;
  onChange: (v: string) => void;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-[0.62rem] font-semibold uppercase tracking-[0.12em] text-ink-faint">
        {label}
      </span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-xl border border-teal-900/15 bg-cream-50 px-3 py-2 text-xs text-ink outline-none focus:border-teal-500"
      />
    </label>
  );
}

function RoleChip({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`flex flex-1 items-center justify-center gap-1.5 rounded-xl px-3 py-2 text-xs font-medium transition-colors ${
        active
          ? "bg-teal-800 text-cream-50"
          : "border border-teal-900/15 bg-cream-50 text-ink-soft hover:bg-teal-50"
      }`}
    >
      {icon}
      {label}
    </button>
  );
}

function CenterNote({
  icon,
  title,
  backLabel,
}: {
  icon: React.ReactNode;
  title: string;
  backLabel: string;
}) {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center px-5 text-center">
      <div className="mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-teal-50">
        {icon}
      </div>
      <p className="font-display text-lg font-semibold text-teal-900">{title}</p>
      <Link
        href="/expert"
        className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-teal-700 hover:text-teal-900"
      >
        <ArrowLeft className="h-4 w-4" />
        {backLabel}
      </Link>
    </div>
  );
}
