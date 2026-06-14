"use client";

import { useEffect, useRef, useState } from "react";
import { Check } from "lucide-react";
import type { CheckinQuestion } from "@/data/checkin";
import type { CheckinTimepoint } from "@/lib/types";
import { useL, useT } from "@/lib/i18n";
import checkin from "@/lib/i18n/dictionaries/checkin";
import { iconFor } from "@/components/assessment/icons";

/* ============================================================
 * CheckinQuestionScreen — one anchored measurement question.
 * Choice answers auto-advance ~250ms after a tap (except Q5,
 * which keeps the screen open for the optional hours field).
 * ============================================================ */

export interface CheckinScreenValue {
  value: string | number | undefined;
  hours?: number;
}

export function CheckinQuestionScreen({
  question,
  timepoint,
  value,
  hours,
  onAnswer,
  onHours,
  onAdvance,
}: {
  question: CheckinQuestion;
  timepoint: CheckinTimepoint;
  value: string | number | undefined;
  hours: number | undefined;
  onAnswer: (value: string | number) => void;
  onHours: (hours: number | undefined) => void;
  onAdvance: () => void;
}) {
  const l = useL();
  const t = useT(checkin);

  const prompt =
    timepoint === "T2" && question.promptT2 ? question.promptT2 : question.prompt;
  const hint = timepoint === "T2" && question.hintT2 ? question.hintT2 : question.hint;

  return (
    <div key={`${question.id}-${timepoint}`} className="animate-fade">
      <p className="eyebrow">{l(question.scene)}</p>
      <h2 className="mt-3 font-display text-2xl font-semibold leading-snug text-teal-900 md:text-3xl">
        {l(prompt)}
      </h2>
      {hint && (
        <p className="mt-2 text-sm leading-relaxed text-ink-soft">{l(hint)}</p>
      )}
      {question.optional && (
        <p className="mt-1 text-xs text-ink-faint">{t.flow.openSkipHint}</p>
      )}

      <div className="mt-7">
        {question.kind === "choice" && (
          <ChoiceField
            question={question}
            value={value}
            onAnswer={onAnswer}
            onAdvance={question.askHours ? undefined : onAdvance}
          />
        )}
        {question.kind === "slider" && (
          <SliderField question={question} value={value} onAnswer={onAnswer} />
        )}
        {question.kind === "text" && (
          <TextField value={value} onAnswer={onAnswer} />
        )}
      </div>

      {question.askHours && (
        <HoursField hours={hours} onHours={onHours} />
      )}
    </div>
  );
}

/* ---------------- choice ---------------- */

function ChoiceField({
  question,
  value,
  onAnswer,
  onAdvance,
}: {
  question: CheckinQuestion;
  value: string | number | undefined;
  onAnswer: (value: string) => void;
  /** When set, a tap auto-advances after a short beat. */
  onAdvance?: () => void;
}) {
  const l = useL();
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);

  const handlePick = (key: string) => {
    onAnswer(key);
    if (!onAdvance) return;
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(onAdvance, 250);
  };

  return (
    <div className="grid gap-3">
      {question.options?.map((opt) => {
        const selected = value === opt.key;
        const Icon = iconFor(opt.icon);
        return (
          <button
            key={opt.key}
            type="button"
            onClick={() => handlePick(opt.key)}
            aria-pressed={selected}
            className={`group overflow-hidden rounded-2xl border text-left transition-all duration-300 ${
              selected
                ? "border-teal-700 bg-teal-700 text-cream-50 shadow-lift"
                : "border-teal-900/10 bg-white text-ink hover:border-teal-300 hover:shadow-soft"
            }`}
          >
            <span className="flex w-full items-center gap-4 p-4">
              <span
                className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl transition-colors duration-300 ${
                  selected
                    ? "bg-cream-50/15 text-cream-50"
                    : "bg-teal-50 text-teal-700"
                }`}
              >
                <Icon className="h-5 w-5" strokeWidth={1.6} />
              </span>
              <span className="flex-1 text-sm font-medium leading-snug md:text-base">
                {l(opt.label)}
              </span>
              {selected && <Check className="h-5 w-5 shrink-0 text-cream-50" />}
            </span>
          </button>
        );
      })}
    </div>
  );
}

/* ---------------- slider (Q7 vitality VAS) ---------------- */

function SliderField({
  question,
  value,
  onAnswer,
}: {
  question: CheckinQuestion;
  value: string | number | undefined;
  onAnswer: (value: number) => void;
}) {
  const l = useL();
  const cfg = question.slider!;
  const mid = Math.round((cfg.min + cfg.max) / 2);
  const current = typeof value === "number" ? value : mid;

  // Seed with the midpoint so the question is always answered.
  useEffect(() => {
    if (typeof value !== "number") onAnswer(mid);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const range = cfg.max - cfg.min || 1;
  const pct = ((current - cfg.min) / range) * 100;

  return (
    <div className="rounded-3xl border border-teal-900/10 bg-white p-6 shadow-soft">
      <div className="mb-6 text-center">
        <p className="font-display text-5xl font-bold text-teal-800">
          {current}
          <span className="ml-1 text-2xl font-semibold text-teal-600">%</span>
        </p>
      </div>

      <input
        type="range"
        min={cfg.min}
        max={cfg.max}
        step={cfg.step}
        value={current}
        onChange={(e) => onAnswer(Number(e.target.value))}
        aria-label={l(question.prompt)}
        className="gc-range w-full accent-teal-700"
        style={{
          background: `linear-gradient(to right, var(--color-teal-500) 0%, var(--color-teal-500) ${pct}%, var(--color-teal-100) ${pct}%, var(--color-teal-100) 100%)`,
        }}
      />

      <div className="mt-4 flex items-start justify-between gap-4 text-xs text-ink-faint">
        <span className="max-w-[45%] leading-snug">{l(cfg.minLabel)}</span>
        <span className="max-w-[45%] text-right leading-snug">
          {l(cfg.maxLabel)}
        </span>
      </div>

      <style jsx>{`
        .gc-range {
          -webkit-appearance: none;
          appearance: none;
          height: 8px;
          border-radius: 9999px;
          outline: none;
          cursor: pointer;
        }
        .gc-range::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          height: 30px;
          width: 30px;
          border-radius: 9999px;
          background: var(--color-teal-700);
          border: 4px solid var(--color-cream-50);
          box-shadow: 0 4px 14px rgba(16, 61, 55, 0.28);
          transition: transform 0.2s ease;
        }
        .gc-range::-webkit-slider-thumb:active {
          transform: scale(1.12);
        }
        .gc-range::-moz-range-thumb {
          height: 26px;
          width: 26px;
          border-radius: 9999px;
          background: var(--color-teal-700);
          border: 4px solid var(--color-cream-50);
          box-shadow: 0 4px 14px rgba(16, 61, 55, 0.28);
        }
      `}</style>
    </div>
  );
}

/* ---------------- open text (Q8) ---------------- */

function TextField({
  value,
  onAnswer,
}: {
  value: string | number | undefined;
  onAnswer: (value: string) => void;
}) {
  const [text, setText] = useState(typeof value === "string" ? value : "");

  return (
    <textarea
      value={text}
      onChange={(e) => {
        setText(e.target.value);
        onAnswer(e.target.value);
      }}
      rows={5}
      className="w-full resize-none rounded-2xl border border-teal-900/10 bg-white p-4 text-sm leading-relaxed text-ink shadow-soft outline-none transition-colors placeholder:text-ink-faint focus:border-teal-500"
    />
  );
}

/* ---------------- Q5 supplement: hours slept ---------------- */

function HoursField({
  hours,
  onHours,
}: {
  hours: number | undefined;
  onHours: (hours: number | undefined) => void;
}) {
  const t = useT(checkin);

  return (
    <div className="mt-4 rounded-2xl border border-teal-900/10 bg-cream-50 p-4 shadow-soft">
      <label className="block">
        <span className="text-sm font-medium text-teal-900">
          {t.flow.hoursLabel}
        </span>
        <span className="mt-0.5 block text-xs text-ink-faint">
          {t.flow.hoursHint}
        </span>
        <span className="mt-3 flex items-center gap-2.5">
          <input
            type="number"
            inputMode="decimal"
            min={0}
            max={24}
            step={0.5}
            value={hours ?? ""}
            onChange={(e) => {
              const raw = e.target.value;
              if (raw === "") {
                onHours(undefined);
                return;
              }
              const n = Number(raw);
              if (Number.isFinite(n)) onHours(Math.max(0, Math.min(24, n)));
            }}
            className="w-28 rounded-xl border border-teal-900/10 bg-white px-4 py-2.5 text-center text-base font-semibold text-teal-900 outline-none transition-colors focus:border-teal-500"
          />
          <span className="text-sm text-ink-soft">{t.flow.hoursUnit}</span>
        </span>
      </label>
    </div>
  );
}
