"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronLeft,
  Clock,
  ClipboardCheck,
  Layers,
  Loader2,
  Stethoscope,
} from "lucide-react";
import type {
  Booking,
  CheckinObjective,
  CheckinSummary,
  CheckinTimepoint,
  WellnessCheckin,
} from "@/lib/types";
import { CHECKIN_QUESTIONS } from "@/data/checkin";
import { useLocale, useL, useT } from "@/lib/i18n";
import common from "@/lib/i18n/dictionaries/common";
import checkin from "@/lib/i18n/dictionaries/checkin";
import { getPackage } from "@/data/packages";
import { Button, ButtonLink } from "@/components/ui/Button";
import { ConsentCheckbox } from "@/components/ui/ConsentCheckbox";
import { LeafMark } from "@/components/ui/Logo";
import { ProgressBar } from "@/components/assessment/ProgressBar";
import { addCheckinRef } from "@/lib/session";
import { CheckinQuestionScreen } from "@/components/checkin/CheckinQuestionScreen";

/* ============================================================
 * CheckinFlow — the T1/T2 measurement flow for one booking.
 *
 * Phases: loading -> (gate) -> intro -> play (8 screens)
 *         -> staff vitals (optional) -> submitting.
 * The timepoint is decided by what already exists server-side:
 * no T1 yet -> T1; T1 only -> T2; both -> links to results.
 * ============================================================ */

type Phase =
  | "loading"
  | "notfound"
  | "done"
  | "intro"
  | "play"
  | "staff"
  | "submitting"
  | "error";

const TOTAL = CHECKIN_QUESTIONS.length;

export function CheckinFlow({ bookingId }: { bookingId: string }) {
  const router = useRouter();
  const { locale } = useLocale();
  const t = useT(checkin);
  const tc = useT(common);
  const l = useL();

  const [phase, setPhase] = useState<Phase>("loading");
  const [booking, setBooking] = useState<Booking | null>(null);
  const [existing, setExisting] = useState<CheckinSummary[]>([]);
  const [consent, setConsent] = useState(false);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string | number>>({});
  const [hours, setHours] = useState<number | undefined>(undefined);
  const [staffValues, setStaffValues] = useState<Record<string, string>>({});

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const [bookingRes, listRes] = await Promise.all([
          fetch(`/api/bookings/${encodeURIComponent(bookingId)}`),
          fetch(`/api/checkin?bookingId=${encodeURIComponent(bookingId)}`),
        ]);
        if (!bookingRes.ok) {
          if (active) setPhase("notfound");
          return;
        }
        const bookingData = (await bookingRes.json()) as { booking: Booking };
        const listData = listRes.ok
          ? ((await listRes.json()) as { checkins: CheckinSummary[] })
          : { checkins: [] };
        if (!active) return;
        setBooking(bookingData.booking);
        setExisting(listData.checkins ?? []);
        const list = listData.checkins ?? [];
        const hasT1 = list.some((c) => c.timepoint === "T1");
        const hasT2 = list.some((c) => c.timepoint === "T2");
        const hasT3 = list.some((c) => c.timepoint === "T3");
        const hasAssessmentBaseline = Boolean(bookingData.booking.assessmentId);
        // Done once the whole arc exists: a baseline, the post-program T2, and
        // the 30-day T3.
        setPhase(
          hasT3 && hasT2 && (hasT1 || hasAssessmentBaseline) ? "done" : "intro",
        );
      } catch {
        if (active) setPhase("notfound");
      }
    })();
    return () => {
      active = false;
    };
  }, [bookingId]);

  const timepoint: CheckinTimepoint = useMemo(() => {
    const hasBaseline =
      existing.some((c) => c.timepoint === "T1") || Boolean(booking?.assessmentId);
    const hasT2 = existing.some((c) => c.timepoint === "T2");
    if (!hasBaseline) return "T1";
    if (!hasT2) return "T2";
    return "T3";
  }, [booking?.assessmentId, existing]);

  const question = CHECKIN_QUESTIONS[step];
  const currentValue = question ? answers[question.id] : undefined;
  const answered =
    question?.optional || (currentValue !== undefined && currentValue !== "");

  const setAnswer = (value: string | number) => {
    setAnswers((prev) => ({ ...prev, [question.id]: value }));
  };

  const goNext = () => {
    if (step < TOTAL - 1) setStep((s) => s + 1);
    else setPhase("staff");
  };

  const goBack = () => {
    if (phase === "staff") {
      setPhase("play");
      return;
    }
    if (step > 0) setStep((s) => s - 1);
    else setPhase("intro");
  };

  const buildObjective = (): CheckinObjective | undefined => {
    const parse = (key: string): number | undefined => {
      const raw = (staffValues[key] ?? "").trim();
      if (!raw) return undefined;
      const n = Number(raw);
      return Number.isFinite(n) ? n : undefined;
    };
    const objective: CheckinObjective = {
      bpSystolic: parse("bpSys"),
      bpDiastolic: parse("bpDia"),
      restingHr: parse("hr"),
      weightKg: parse("weight"),
      deviceSleepHours: parse("deviceSleep"),
    };
    return Object.values(objective).some((v) => v !== undefined)
      ? objective
      : undefined;
  };

  const submit = async () => {
    setPhase("submitting");
    try {
      const q8 = answers.q8;
      const res = await fetch("/api/checkin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookingId,
          timepoint,
          locale,
          consent,
          answers: {
            q1: answers.q1,
            q2: answers.q2,
            q3: answers.q3,
            q4: answers.q4,
            q5: answers.q5,
            q5Hours: hours,
            q6: answers.q6,
            q7: answers.q7,
            q8: typeof q8 === "string" && q8.trim() ? q8.trim() : undefined,
          },
          objective: buildObjective(),
        }),
      });

      if (res.status === 409) {
        const data = (await res.json()) as { checkinId?: string };
        if (data.checkinId) {
          router.push(`/checkin/result/${data.checkinId}`);
          return;
        }
        throw new Error("conflict");
      }
      if (!res.ok) throw new Error("request_failed");

      const data = (await res.json()) as { checkin: WellnessCheckin };
      if (!data?.checkin?.id) throw new Error("no_checkin");
      addCheckinRef({
        checkinId: data.checkin.id,
        bookingId,
        timepoint: data.checkin.timepoint,
        createdAt: data.checkin.createdAt,
      });
      router.push(`/checkin/result/${data.checkin.id}`);
    } catch {
      setPhase("error");
    }
  };

  /* ---------------- screens ---------------- */

  if (phase === "loading" || phase === "submitting") {
    return (
      <div className="grid place-items-center px-5 py-28">
        <Loader2 className="h-7 w-7 animate-spin text-teal-500" />
      </div>
    );
  }

  if (phase === "notfound") {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-lg flex-col items-center justify-center px-6 text-center">
        <h2 className="font-display text-2xl font-semibold text-teal-900">
          {t.notFound.title}
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-ink-soft">
          {t.notFound.body}
        </p>
        <div className="mt-7">
          <ButtonLink href="/bookings">{t.notFound.back}</ButtonLink>
        </div>
      </div>
    );
  }

  if (phase === "done") {
    const t1 = existing.find((c) => c.timepoint === "T1");
    const t2 = existing.find((c) => c.timepoint === "T2");
    const t3 = existing.find((c) => c.timepoint === "T3");
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-lg flex-col items-center justify-center px-6 text-center">
        <div className="mb-5 text-teal-600">
          <LeafMark className="h-12 w-12" />
        </div>
        <h2 className="font-display text-2xl font-semibold text-teal-900">
          {t.gate.allDone}
        </h2>
        <div className="mt-7">
          <ButtonLink href={`/journey/${bookingId}`} size="lg">
            {t.gate.viewJourney}
          </ButtonLink>
        </div>
        <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
          {t1 && (
            <ButtonLink href={`/checkin/result/${t1.id}`} variant="secondary" size="sm">
              {t.gate.viewT1}
            </ButtonLink>
          )}
          {t2 && (
            <ButtonLink href={`/checkin/result/${t2.id}`} variant="secondary" size="sm">
              {t.gate.viewT2}
            </ButtonLink>
          )}
          {t3 && (
            <ButtonLink href={`/checkin/result/${t3.id}`} variant="secondary" size="sm">
              {t.gate.viewT3}
            </ButtonLink>
          )}
        </div>
        <Link
          href={`/bookings/${bookingId}`}
          className="mt-6 inline-flex items-center gap-1 text-xs font-medium text-teal-700 transition-colors hover:text-teal-900"
        >
          <ChevronLeft className="h-4 w-4" />
          {t.result.backToBooking}
        </Link>
      </div>
    );
  }

  if (phase === "error") {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-lg flex-col items-center justify-center px-6 text-center">
        <h2 className="font-display text-2xl font-semibold text-teal-900">
          {t.error.title}
        </h2>
        <p className="mt-3 text-sm text-ink-soft">{tc.errors.generic}</p>
        <div className="mt-7">
          <Button onClick={() => void submit()}>{t.error.retry}</Button>
        </div>
      </div>
    );
  }

  if (phase === "intro") {
    const pkg = booking ? getPackage(booking.packageId) : undefined;
    const eyebrow =
      timepoint === "T3"
        ? t.intro.eyebrowT3
        : timepoint === "T2"
          ? t.intro.eyebrowT2
          : t.intro.eyebrowT1;
    const title =
      timepoint === "T3"
        ? t.intro.titleT3
        : timepoint === "T2"
          ? t.intro.titleT2
          : t.intro.titleT1;
    const lead =
      timepoint === "T3"
        ? t.intro.leadT3
        : timepoint === "T2"
          ? t.intro.leadT2
          : t.intro.leadT1;
    return (
      <div className="mx-auto max-w-2xl px-5 pb-10 pt-8 md:pt-14">
        <div className="animate-rise text-center">
          <div className="mx-auto mb-5 w-fit text-teal-600 animate-breathe">
            <LeafMark className="h-14 w-14" />
          </div>
          <p className="eyebrow">{eyebrow}</p>
          <h1 className="mt-3 font-display text-4xl font-semibold leading-tight text-teal-900 md:text-5xl">
            {title}
          </h1>
          <div className="ornament mx-auto mt-5 w-44" aria-hidden="true" />
          <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-ink-soft">
            {lead}
          </p>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            {[
              { icon: Clock, label: t.intro.minutes },
              { icon: Layers, label: t.intro.questions },
            ].map(({ icon: Icon, label }) => (
              <span
                key={label}
                className="inline-flex items-center gap-1.5 rounded-full border border-teal-900/10 bg-white px-3.5 py-1.5 text-xs font-medium text-teal-800 shadow-soft"
              >
                <Icon className="h-3.5 w-3.5 text-gold-500" />
                {label}
              </span>
            ))}
            {pkg && (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-teal-900/10 bg-white px-3.5 py-1.5 text-xs font-medium text-teal-800 shadow-soft">
                <ClipboardCheck className="h-3.5 w-3.5 text-gold-500" />
                {t.intro.forBooking} {bookingId} · {l(pkg.name)}
              </span>
            )}
          </div>
        </div>

        <div className="animate-rise-1 mt-8 rounded-3xl border border-teal-900/10 bg-white p-5 shadow-soft">
          <p className="text-xs leading-relaxed text-ink-soft">
            {t.intro.healthNote}
          </p>
        </div>

        <div className="animate-rise-2 mt-4">
          <ConsentCheckbox checked={consent} onChange={setConsent} />
        </div>

        <div className="animate-rise-3 mt-6 flex justify-center">
          <Button
            size="lg"
            onClick={() => setPhase("play")}
            disabled={!consent}
            className="w-full md:w-auto"
          >
            {t.intro.start}
            <ArrowRight className="h-5 w-5" />
          </Button>
        </div>
      </div>
    );
  }

  if (phase === "staff") {
    return (
      <StaffScreen
        values={staffValues}
        onChange={setStaffValues}
        onBack={goBack}
        onSubmit={() => void submit()}
      />
    );
  }

  // play
  const progress = ((step + 1) / TOTAL) * 100;
  return (
    <div className="mx-auto max-w-2xl px-5 pt-6 md:pt-10">
      <div className="mb-7">
        <div className="mb-2 flex items-center justify-between text-[0.7rem] font-medium tracking-wide text-ink-faint">
          <span>
            {t.progress.stepOf
              .replace("{current}", String(step + 1))
              .replace("{total}", String(TOTAL))}
          </span>
          <span>{Math.round(progress)}%</span>
        </div>
        <ProgressBar value={progress} />
      </div>

      <CheckinQuestionScreen
        question={question}
        timepoint={timepoint}
        value={currentValue}
        hours={hours}
        onAnswer={setAnswer}
        onHours={setHours}
        onAdvance={goNext}
      />

      {/* nav — clears the mobile tab bar */}
      <div className="sticky bottom-20 z-10 mt-8 flex items-center justify-between gap-3 md:bottom-0 md:mt-12">
        <button
          type="button"
          onClick={goBack}
          className="inline-flex items-center gap-1.5 rounded-full bg-cream-50/90 px-4 py-2.5 text-sm font-medium text-teal-700 shadow-soft backdrop-blur transition-colors hover:text-teal-900"
        >
          <ArrowLeft className="h-4 w-4" />
          {tc.actions.back}
        </button>

        <div className="flex items-center gap-2">
          {question.optional && !answered && (
            <button
              type="button"
              onClick={goNext}
              className="rounded-full px-4 py-2.5 text-sm font-medium text-ink-faint transition-colors hover:text-teal-700"
            >
              {tc.actions.skip}
            </button>
          )}
          <Button onClick={goNext} disabled={!answered}>
            {tc.actions.next}
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

/* ---------------- staff vitals (Part B) ---------------- */

function StaffScreen({
  values,
  onChange,
  onBack,
  onSubmit,
}: {
  values: Record<string, string>;
  onChange: (values: Record<string, string>) => void;
  onBack: () => void;
  onSubmit: () => void;
}) {
  const t = useT(checkin);
  const tc = useT(common);

  const fields: { key: string; label: string }[] = [
    { key: "bpSys", label: t.flow.staff.bpSys },
    { key: "bpDia", label: t.flow.staff.bpDia },
    { key: "hr", label: t.flow.staff.hr },
    { key: "weight", label: t.flow.staff.weight },
    { key: "deviceSleep", label: t.flow.staff.deviceSleep },
  ];

  return (
    <div className="mx-auto max-w-2xl px-5 pt-6 md:pt-10">
      <div className="animate-fade">
        <p className="eyebrow">{t.flow.staff.scene}</p>
        <h2 className="mt-3 flex items-center gap-3 font-display text-2xl font-semibold leading-snug text-teal-900 md:text-3xl">
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-teal-50 text-teal-700">
            <Stethoscope className="h-5 w-5" strokeWidth={1.6} />
          </span>
          {t.flow.staff.title}
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-ink-soft">
          {t.flow.staff.hint}
        </p>

        <div className="mt-7 grid gap-4 rounded-3xl border border-teal-900/10 bg-white p-6 shadow-soft sm:grid-cols-2">
          {fields.map((f) => (
            <label key={f.key} className="block">
              <span className="text-xs font-medium text-teal-900">
                {f.label}
              </span>
              <input
                type="number"
                inputMode="decimal"
                value={values[f.key] ?? ""}
                onChange={(e) =>
                  onChange({ ...values, [f.key]: e.target.value })
                }
                className="mt-1.5 w-full rounded-xl border border-teal-900/10 bg-cream-50 px-4 py-2.5 text-sm font-semibold text-teal-900 outline-none transition-colors focus:border-teal-500"
              />
            </label>
          ))}
        </div>
      </div>

      <div className="sticky bottom-20 z-10 mt-8 flex items-center justify-between gap-3 md:bottom-0 md:mt-12">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-1.5 rounded-full bg-cream-50/90 px-4 py-2.5 text-sm font-medium text-teal-700 shadow-soft backdrop-blur transition-colors hover:text-teal-900"
        >
          <ArrowLeft className="h-4 w-4" />
          {tc.actions.back}
        </button>

        <Button onClick={onSubmit}>
          {t.flow.submit}
          <Check className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
