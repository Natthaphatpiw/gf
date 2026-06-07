"use client";

import { useId, type InputHTMLAttributes } from "react";

/* ============================================================
 * Field — labelled text input with inline error, used in the
 * booking registration form. Mobile-first, calm styling.
 * ============================================================ */

interface FieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export function Field({ label, error, className = "", ...rest }: FieldProps) {
  const id = useId();
  return (
    <div className={className}>
      <label
        htmlFor={id}
        className="mb-1.5 block text-xs font-medium tracking-wide text-ink-soft"
      >
        {label}
      </label>
      <input
        id={id}
        aria-invalid={error ? true : undefined}
        className={`w-full rounded-2xl border bg-cream-50 px-4 py-3 text-sm text-ink placeholder:text-ink-faint/70 outline-none transition-colors focus:border-teal-600 focus:bg-white ${
          error ? "border-gold-500" : "border-teal-900/10"
        }`}
        {...rest}
      />
      {error && (
        <p className="mt-1.5 text-[0.7rem] font-medium text-gold-600">{error}</p>
      )}
    </div>
  );
}
