"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Sparkles,
  Clock,
  Layers,
  UserRound,
} from "lucide-react";
import type {
  AssessmentAnswer,
  AssessmentInput,
  GuestGender,
  WellnessProfile,
} from "@/lib/types";
import { QUIZ_QUESTIONS } from "@/data/questions";
import { useLocale, useT } from "@/lib/i18n";
import common from "@/lib/i18n/dictionaries/common";
import assessment from "@/lib/i18n/dictionaries/assessment";
import { Button } from "@/components/ui/Button";
import { ConsentCheckbox } from "@/components/ui/ConsentCheckbox";
import { LeafMark } from "@/components/ui/Logo";
import { storeGoals, storeProfile } from "@/lib/session";
import { ProgressBar } from "@/components/assessment/ProgressBar";
import { QuestionScreen } from "@/components/assessment/QuestionScreen";
import { LoadingJourney } from "@/components/assessment/LoadingJourney";

/* ============================================================
 * The Island Journey — a gamified wellness assessment.
 * Phases: intro -> per-scene play -> submitting -> redirect.
 * ============================================================ */

type Phase = "intro" | "play" | "submitting" | "error";

export default function AssessmentPage() {
  const router = useRouter();
  const { locale } = useLocale();
  const t = useT(assessment);
  const tc = useT(common);

  const [phase, setPhase] = useState<Phase>("intro");
  const [consent, setConsent] = useState(false);
  const [gender, setGender] = useState<GuestGender | null>(null);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string | number>>({});

  const total = QUIZ_QUESTIONS.length;
  const question = QUIZ_QUESTIONS[step];
  const progress = ((step + 1) / total) * 100;

  const setAnswer = (value: string | number) => {
    setAnswers((prev) => ({ ...prev, [question.id]: value }));
  };

  const goNext = () => {
    if (step < total - 1) setStep((s) => s + 1);
    else void submit();
  };

  const goBack = () => {
    if (step > 0) setStep((s) => s - 1);
    else setPhase("intro");
  };

  const currentValue = answers[question?.id];
  const answered =
    question?.optional ||
    (currentValue !== undefined && currentValue !== "");

  const buildInput = (): AssessmentInput => {
    const list: AssessmentAnswer[] = [];
    let mbti = "";
    let note = "";
    for (const q of QUIZ_QUESTIONS) {
      const v = answers[q.id];
      if (v === undefined || v === "") continue;
      if (q.kind === "mbti") {
        mbti = String(v);
        continue;
      }
      if (q.kind === "text") {
        note = String(v);
        continue;
      }
      list.push({ questionId: q.id, value: v });
    }
    return {
      locale,
      gender: gender ?? undefined,
      answers: list,
      mbti: mbti || undefined,
      note: note || undefined,
      consent,
    };
  };

  const submit = async () => {
    setPhase("submitting");
    try {
      const res = await fetch("/api/assessment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(buildInput()),
      });
      if (!res.ok) throw new Error("request_failed");
      const data = (await res.json()) as { profile: WellnessProfile };
      if (!data?.profile?.id) throw new Error("no_profile");
      storeProfile(data.profile);
      storeGoals(data.profile.recommendedGoals);
      router.push("/assessment/result");
    } catch {
      setPhase("error");
    }
  };

  if (phase === "submitting") return <LoadingJourney />;

  if (phase === "error") {
    return (
      <div className="mx-auto flex min-h-[70vh] max-w-lg flex-col items-center justify-center px-6 text-center">
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
    return (
      <Intro
        consent={consent}
        gender={gender}
        setConsent={setConsent}
        setGender={setGender}
        onStart={() => setPhase("play")}
      />
    );
  }

  // play
  return (
    <div className="mx-auto max-w-2xl px-5 pt-6 md:pt-10">
      {/* progress chrome */}
      <div className="mb-7">
        <div className="mb-2 flex items-center justify-between text-[0.7rem] font-medium tracking-wide text-ink-faint">
          <span>
            {t.progress.sceneOf
              .replace("{current}", String(step + 1))
              .replace("{total}", String(total))}
          </span>
          <span>{Math.round(progress)}%</span>
        </div>
        <ProgressBar value={progress} />
      </div>

      <QuestionScreen
        question={question}
        value={currentValue}
        onAnswer={setAnswer}
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
            {step === total - 1 ? (
              <>
                {tc.actions.submit}
                <Check className="h-4 w-4" />
              </>
            ) : (
              <>
                {tc.actions.next}
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

/* ---------------- intro ---------------- */

function Intro({
  consent,
  gender,
  setConsent,
  setGender,
  onStart,
}: {
  consent: boolean;
  gender: GuestGender | null;
  setConsent: (v: boolean) => void;
  setGender: (v: GuestGender) => void;
  onStart: () => void;
}) {
  const t = useT(assessment);

  const facts = useMemo(
    () => [
      { icon: Clock, label: t.intro.minutes },
      { icon: Layers, label: t.intro.questions },
    ],
    [t.intro.minutes, t.intro.questions],
  );

  return (
    <div className="mx-auto max-w-2xl px-5 pb-10 pt-8 md:pt-14">
      <div className="animate-rise text-center">
        <div className="mx-auto mb-5 w-fit text-teal-600 animate-breathe">
          <LeafMark className="h-14 w-14" />
        </div>
        <p className="eyebrow">{t.eyebrow}</p>
        <h1 className="mt-3 font-display text-4xl font-semibold leading-tight text-teal-900 md:text-5xl">
          {t.intro.title}
        </h1>
        <div className="ornament mx-auto mt-5 w-44" aria-hidden="true" />
        <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-ink-soft">
          {t.intro.lead}
        </p>

        <div className="mt-6 flex items-center justify-center gap-3">
          {facts.map(({ icon: Icon, label }) => (
            <span
              key={label}
              className="inline-flex items-center gap-1.5 rounded-full border border-teal-900/10 bg-white px-3.5 py-1.5 text-xs font-medium text-teal-800 shadow-soft"
            >
              <Icon className="h-3.5 w-3.5 text-gold-500" />
              {label}
            </span>
          ))}
        </div>
      </div>

      <div className="animate-rise-1 mt-8 rounded-3xl border border-teal-900/10 bg-white p-6 shadow-soft md:p-8">
        <p className="eyebrow">{t.intro.whatYouGet}</p>
        <ul className="mt-4 space-y-3">
          {t.intro.benefits.map((b) => (
            <li key={b} className="flex items-start gap-3 text-sm leading-relaxed text-ink">
              <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-teal-50 text-teal-700">
                <Sparkles className="h-3 w-3" />
              </span>
              {b}
            </li>
          ))}
        </ul>
        <p className="mt-5 border-t border-teal-900/10 pt-4 text-center text-sm italic text-ink-soft">
          {t.intro.reassure}
        </p>
      </div>

      <div className="animate-rise-2 mt-6 rounded-3xl border border-teal-900/10 bg-cream-50 p-5 shadow-soft">
        <div className="flex items-start gap-3">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-teal-50 text-teal-700">
            <UserRound className="h-5 w-5" strokeWidth={1.7} />
          </span>
          <div className="min-w-0 flex-1">
            <p className="font-display text-lg font-semibold leading-snug text-teal-900">
              {t.intro.genderTitle}
            </p>
            <p className="mt-1 text-xs leading-relaxed text-ink-soft">
              {t.intro.genderHint}
            </p>
            <div className="mt-4 grid grid-cols-2 gap-2.5">
              {(
                [
                  ["female", t.intro.genderFemale],
                  ["male", t.intro.genderMale],
                ] as const
              ).map(([value, label]) => {
                const active = gender === value;
                return (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setGender(value)}
                    aria-pressed={active}
                    className={`rounded-2xl border px-4 py-3 text-sm font-semibold transition-all ${
                      active
                        ? "border-teal-700 bg-teal-700 text-cream-50 shadow-soft"
                        : "border-teal-900/10 bg-white text-teal-800 hover:border-teal-300"
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <div className="animate-rise-2 mt-4">
        <ConsentCheckbox checked={consent} onChange={setConsent} />
      </div>

      <div className="animate-rise-3 mt-6 flex justify-center">
        <Button
          size="lg"
          onClick={onStart}
          disabled={!consent || !gender}
          className="w-full md:w-auto"
        >
          {t.intro.start}
          <ArrowRight className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}
