"use client";

import { useEffect, useRef, useState } from "react";
import { Check, ExternalLink } from "lucide-react";
import type { QuizQuestion } from "@/data/questions";
import { MBTI_TYPES } from "@/data/questions";
import { useL, useT } from "@/lib/i18n";
import assessment from "@/lib/i18n/dictionaries/assessment";
import { iconFor } from "./icons";

/* ============================================================
 * QuestionScreen — renders a single Island Journey scene.
 * Supports the four kinds: choice, slider, mbti, text.
 * Choice answers auto-advance ~250ms after a tap.
 * ============================================================ */

const PERSONALITY_TEST_URL =
  "https://www.16personalities.com/free-personality-test";

export interface QuestionScreenProps {
  question: QuizQuestion;
  /** Current answer value for this question, if any. */
  value: string | number | undefined;
  /** Commit an answer (choice key / slider number / mbti / text). */
  onAnswer: (value: string | number) => void;
  /** Auto-advance to next scene (used by choice + mbti select). */
  onAdvance: () => void;
}

export function QuestionScreen({
  question,
  value,
  onAnswer,
  onAdvance,
}: QuestionScreenProps) {
  const l = useL();
  const t = useT(assessment);

  return (
    <div key={question.id} className="animate-fade">
      <p className="eyebrow">{l(question.scene)}</p>
      <h2 className="mt-3 font-display text-2xl font-semibold leading-snug text-teal-900 md:text-3xl">
        {l(question.prompt)}
      </h2>
      {question.hint && (
        <p className="mt-2 text-sm leading-relaxed text-ink-soft">
          {l(question.hint)}
        </p>
      )}

      <div className="mt-7">
        {question.kind === "choice" && (
          <ChoiceField
            question={question}
            value={value}
            onAnswer={onAnswer}
            onAdvance={onAdvance}
          />
        )}
        {question.kind === "slider" && (
          <SliderField question={question} value={value} onAnswer={onAnswer} />
        )}
        {question.kind === "mbti" && (
          <MbtiField value={value} onAnswer={onAnswer} />
        )}
        {question.kind === "text" && (
          <TextField value={value} onAnswer={onAnswer} placeholder={t.text.placeholder} />
        )}
      </div>
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
  question: QuizQuestion;
  value: string | number | undefined;
  onAnswer: (value: string) => void;
  onAdvance: () => void;
}) {
  const l = useL();
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hasImages = question.options?.some((opt) => !!opt.image) ?? false;

  useEffect(() => {
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);

  const handlePick = (key: string) => {
    onAnswer(key);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(onAdvance, 250);
  };

  return (
    <div className={`grid gap-3 ${hasImages ? "sm:grid-cols-2" : ""}`}>
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
            {opt.image && (
              <OptionalOptionImage src={opt.image} alt={l(opt.label)} />
            )}
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

function OptionalOptionImage({ src, alt }: { src: string; alt: string }) {
  const [visible, setVisible] = useState(true);
  if (!visible) return null;
  return (
    <span className="relative block aspect-[16/9] overflow-hidden bg-teal-50">
      <img
        src={src}
        alt={alt}
        className="h-full w-full object-cover"
        onError={() => setVisible(false)}
      />
      <span className="absolute inset-0 bg-gradient-to-t from-teal-900/30 to-transparent" />
    </span>
  );
}

/* ---------------- slider ---------------- */

function SliderField({
  question,
  value,
  onAnswer,
}: {
  question: QuizQuestion;
  value: string | number | undefined;
  onAnswer: (value: number) => void;
}) {
  const l = useL();
  const t = useT(assessment);
  const cfg = question.slider!;
  const mid = Math.round((cfg.min + cfg.max) / 2);
  const current = typeof value === "number" ? value : mid;

  // Seed the answer with the midpoint so the scene is always answered.
  useEffect(() => {
    if (typeof value !== "number") onAnswer(mid);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const range = cfg.max - cfg.min || 1;
  const pct = ((current - cfg.min) / range) * 100;

  return (
    <div className="rounded-3xl border border-teal-900/10 bg-white p-6 shadow-soft">
      <div className="mb-6 text-center">
        <p className="eyebrow">{t.slider.current}</p>
        <p className="mt-1 font-display text-5xl font-bold text-teal-800">
          {current}
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

/* ---------------- mbti ---------------- */

function MbtiField({
  value,
  onAnswer,
}: {
  value: string | number | undefined;
  onAnswer: (value: string) => void;
}) {
  const t = useT(assessment);
  const selected = typeof value === "string" ? value : "";

  return (
    <div>
      <p className="mb-3 text-sm text-ink-soft">{t.mbti.chooseHint}</p>
      <div className="grid grid-cols-4 gap-2.5">
        {MBTI_TYPES.map((type) => {
          const active = selected === type;
          return (
            <button
              key={type}
              type="button"
              onClick={() => onAnswer(active ? "" : type)}
              aria-pressed={active}
              className={`rounded-xl border py-3 text-center text-sm font-semibold tracking-wide transition-all duration-200 ${
                active
                  ? "border-teal-700 bg-teal-700 text-cream-50 shadow-soft"
                  : "border-teal-900/10 bg-white text-teal-800 hover:border-teal-300"
              }`}
            >
              {type}
            </button>
          );
        })}
      </div>

      <a
        href={PERSONALITY_TEST_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-teal-700 underline underline-offset-4 transition-colors hover:text-teal-900"
      >
        {t.mbti.takeTest}
        <ExternalLink className="h-4 w-4" />
      </a>
    </div>
  );
}

/* ---------------- text ---------------- */

function TextField({
  value,
  onAnswer,
  placeholder,
}: {
  value: string | number | undefined;
  onAnswer: (value: string) => void;
  placeholder: string;
}) {
  const [text, setText] = useState(typeof value === "string" ? value : "");

  return (
    <textarea
      value={text}
      onChange={(e) => {
        setText(e.target.value);
        onAnswer(e.target.value);
      }}
      placeholder={placeholder}
      rows={5}
      className="w-full resize-none rounded-2xl border border-teal-900/10 bg-white p-4 text-sm leading-relaxed text-ink shadow-soft outline-none transition-colors placeholder:text-ink-faint focus:border-teal-500"
    />
  );
}
