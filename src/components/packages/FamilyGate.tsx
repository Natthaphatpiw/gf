"use client";

import { useEffect, useState } from "react";
import {
  Users,
  User,
  Check,
  Loader2,
  Plus,
  X,
  AlertCircle,
} from "lucide-react";
import type { LText } from "@/lib/types";
import { useT, useL } from "@/lib/i18n";
import packagesDict from "@/lib/i18n/dictionaries/packages";
import { Button } from "@/components/ui/Button";
import { getFamilyIds, storeFamilyIds } from "@/lib/session";

/* ============================================================
 * FamilyGate — Stage A of the discovery flow.
 *
 * Asks whether the guest travels as a family. If yes, lets them
 * add 1-6 members and validates each member's assessment code via
 * GET /api/assessment/[id]. Proceeding is allowed only when every
 * filled code is valid (blank rows are simply ignored). The valid
 * codes are persisted with storeFamilyIds and handed up via
 * onComplete.
 * ============================================================ */

const MAX_MEMBERS = 6;
const CODE_RE = /^SW-[A-Z0-9]{6}$/;

type FieldStatus = "empty" | "checking" | "valid" | "invalid";

interface MemberField {
  key: number;
  code: string;
  status: FieldStatus;
  archetype?: LText;
}

let counter = 0;
function blankField(): MemberField {
  counter += 1;
  return { key: counter, code: "", status: "empty" };
}

export function FamilyGate({
  onComplete,
}: {
  /** Called with the validated family codes (empty array when solo). */
  onComplete: (familyIds: string[]) => void;
}) {
  const t = useT(packagesDict).family;
  const l = useL();

  const [choice, setChoice] = useState<"none" | "yes" | "no">("none");
  const [fields, setFields] = useState<MemberField[]>([]);

  // Restore any previously stored family codes when entering the family path.
  useEffect(() => {
    if (choice !== "yes") return;
    if (fields.length > 0) return;
    const saved = getFamilyIds();
    if (saved.length > 0) {
      setFields(
        saved.slice(0, MAX_MEMBERS).map((code) => ({
          ...blankField(),
          code,
          status: "empty" as FieldStatus,
        })),
      );
    } else {
      setFields([blankField()]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [choice]);

  function handleNo() {
    setChoice("no");
    storeFamilyIds([]);
    onComplete([]);
  }

  function updateField(key: number, patch: Partial<MemberField>) {
    setFields((prev) =>
      prev.map((f) => (f.key === key ? { ...f, ...patch } : f)),
    );
  }

  function onCodeChange(key: number, value: string) {
    const code = value.toUpperCase().replace(/\s+/g, "");
    updateField(key, {
      code,
      status: code === "" ? "empty" : "empty",
      archetype: undefined,
    });
  }

  async function validate(key: number, code: string) {
    const trimmed = code.trim().toUpperCase();
    if (trimmed === "") {
      updateField(key, { status: "empty", archetype: undefined });
      return;
    }
    if (!CODE_RE.test(trimmed)) {
      updateField(key, { status: "invalid", archetype: undefined });
      return;
    }
    updateField(key, { status: "checking" });
    try {
      const res = await fetch(`/api/assessment/${trimmed}`);
      if (!res.ok) {
        updateField(key, { status: "invalid", archetype: undefined });
        return;
      }
      const data = (await res.json()) as { archetypeName?: LText };
      if (data?.archetypeName) {
        updateField(key, {
          status: "valid",
          archetype: data.archetypeName,
        });
      } else {
        updateField(key, { status: "invalid", archetype: undefined });
      }
    } catch {
      updateField(key, { status: "invalid", archetype: undefined });
    }
  }

  function addField() {
    setFields((prev) =>
      prev.length >= MAX_MEMBERS ? prev : [...prev, blankField()],
    );
  }

  function removeField(key: number) {
    setFields((prev) => prev.filter((f) => f.key !== key));
  }

  const filled = fields.filter((f) => f.code.trim() !== "");
  const allFilledValid =
    filled.length > 0 &&
    filled.every((f) => f.status === "valid") &&
    !fields.some((f) => f.status === "checking");
  const canContinue = filled.length === 0 ? true : allFilledValid;

  function handleContinue() {
    const validCodes = fields
      .filter((f) => f.status === "valid")
      .map((f) => f.code.trim().toUpperCase());
    storeFamilyIds(validCodes);
    onComplete(validCodes);
  }

  return (
    <section className="animate-rise rounded-3xl border border-teal-900/10 bg-white p-6 shadow-soft md:p-8">
      <p className="eyebrow">{t.eyebrow}</p>
      <h2 className="mt-2 font-display text-2xl font-semibold text-teal-900 md:text-3xl">
        {t.title}
      </h2>
      <p className="mt-3 max-w-xl text-sm leading-relaxed text-ink-soft">
        {t.body}
      </p>

      {/* Two big choices */}
      <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <button
          type="button"
          onClick={() => setChoice("yes")}
          aria-pressed={choice === "yes"}
          className={`flex items-center gap-3 rounded-2xl border p-4 text-left transition-all ${
            choice === "yes"
              ? "border-teal-700 bg-teal-50 shadow-soft"
              : "border-teal-900/10 bg-cream-50 hover:border-teal-700/40"
          }`}
        >
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-teal-700/10 text-teal-700">
            <Users className="h-5 w-5" />
          </span>
          <span className="text-sm font-medium text-teal-900">{t.yes}</span>
        </button>

        <button
          type="button"
          onClick={handleNo}
          aria-pressed={choice === "no"}
          className={`flex items-center gap-3 rounded-2xl border p-4 text-left transition-all ${
            choice === "no"
              ? "border-teal-700 bg-teal-50 shadow-soft"
              : "border-teal-900/10 bg-cream-50 hover:border-teal-700/40"
          }`}
        >
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-teal-700/10 text-teal-700">
            <User className="h-5 w-5" />
          </span>
          <span className="text-sm font-medium text-teal-900">{t.no}</span>
        </button>
      </div>

      {/* Member stepper */}
      {choice === "yes" && (
        <div className="animate-fade mt-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-teal-900">
                {t.memberTitle}
              </p>
              <p className="mt-0.5 text-xs text-ink-faint">{t.memberHint}</p>
            </div>
            <span className="rounded-full bg-teal-50 px-3 py-1 text-xs font-medium text-teal-700">
              {filled.length} / {MAX_MEMBERS}
            </span>
          </div>

          <ul className="space-y-3">
            {fields.map((f, i) => (
              <li
                key={f.key}
                className="rounded-2xl border border-teal-900/10 bg-cream-50 p-3"
              >
                <div className="flex items-center gap-2">
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-white text-xs font-semibold text-teal-700 shadow-soft">
                    {i + 1}
                  </span>
                  <div className="relative flex-1">
                    <input
                      type="text"
                      inputMode="text"
                      autoComplete="off"
                      spellCheck={false}
                      maxLength={9}
                      value={f.code}
                      placeholder={t.placeholder}
                      onChange={(e) => onCodeChange(f.key, e.target.value)}
                      onBlur={() => validate(f.key, f.code)}
                      className="w-full rounded-xl border border-teal-900/10 bg-white px-3 py-2.5 pr-10 text-sm tracking-wider text-ink outline-none transition-colors placeholder:text-ink-faint/60 focus:border-teal-700"
                    />
                    <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">
                      {f.status === "checking" && (
                        <Loader2 className="h-4 w-4 animate-spin text-teal-500" />
                      )}
                      {f.status === "valid" && (
                        <Check className="h-4 w-4 text-teal-600" />
                      )}
                      {f.status === "invalid" && (
                        <AlertCircle className="h-4 w-4 text-gold-600" />
                      )}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeField(f.key)}
                    aria-label={t.remove}
                    className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-ink-faint transition-colors hover:bg-white hover:text-teal-700"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                {f.status === "valid" && f.archetype && (
                  <p className="mt-2 pl-10 text-xs font-medium text-teal-600">
                    {l(f.archetype)}
                  </p>
                )}
                {f.status === "invalid" && (
                  <p className="mt-2 pl-10 text-xs text-gold-600">
                    {t.invalid}
                  </p>
                )}
                {f.status === "empty" && (
                  <p className="mt-2 pl-10 text-xs text-ink-faint">
                    {t.optional}
                  </p>
                )}
              </li>
            ))}
          </ul>

          <div className="flex flex-wrap items-center gap-3">
            {fields.length < MAX_MEMBERS ? (
              <button
                type="button"
                onClick={addField}
                className="inline-flex items-center gap-1.5 rounded-full border border-teal-700/30 px-4 py-2 text-xs font-medium text-teal-700 transition-colors hover:bg-teal-50"
              >
                <Plus className="h-3.5 w-3.5" />
                {t.add}
              </button>
            ) : (
              <span className="text-xs text-ink-faint">{t.max}</span>
            )}
            <Button
              variant="primary"
              size="md"
              onClick={handleContinue}
              disabled={!canContinue}
              className="ml-auto"
            >
              {t.continue}
            </Button>
          </div>
        </div>
      )}
    </section>
  );
}
