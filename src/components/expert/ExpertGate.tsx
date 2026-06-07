"use client";

import { useEffect, useState, type ReactNode } from "react";
import { KeyRound, Loader2, AlertCircle } from "lucide-react";
import { useT } from "@/lib/i18n";
import expert from "@/lib/i18n/dictionaries/expert";
import { Button } from "@/components/ui/Button";
import {
  expertFetch,
  getExpertCode,
  setExpertCode,
  clearExpertCode,
} from "@/components/expert/client";

/* ============================================================
 * ExpertGate — wraps the expert pages behind a single access-code
 * input. Verifies the code by calling GET /api/expert/queue; on
 * success the code is held in sessionStorage and children render.
 * ============================================================ */

type Phase = "checking" | "locked" | "unlocked";

export function ExpertGate({ children }: { children: ReactNode }) {
  const t = useT(expert).gate;
  const [phase, setPhase] = useState<Phase>("checking");
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(false);

  // On mount, if a code is already stored, validate it silently.
  useEffect(() => {
    const stored = getExpertCode();
    if (!stored) {
      setPhase("locked");
      return;
    }
    let active = true;
    (async () => {
      try {
        const res = await expertFetch("/api/expert/queue");
        if (!active) return;
        if (res.ok) {
          setPhase("unlocked");
        } else {
          clearExpertCode();
          setPhase("locked");
        }
      } catch {
        if (active) setPhase("locked");
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  async function attempt(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = code.trim();
    if (!trimmed || busy) return;
    setBusy(true);
    setError(false);
    setExpertCode(trimmed);
    try {
      const res = await expertFetch("/api/expert/queue");
      if (res.ok) {
        setPhase("unlocked");
      } else {
        clearExpertCode();
        setError(true);
      }
    } catch {
      clearExpertCode();
      setError(true);
    } finally {
      setBusy(false);
    }
  }

  if (phase === "unlocked") return <>{children}</>;

  if (phase === "checking") {
    return (
      <div className="grid min-h-[60vh] place-items-center px-5">
        <Loader2 className="h-6 w-6 animate-spin text-teal-600" />
      </div>
    );
  }

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-5 py-12">
      <div className="animate-rise rounded-3xl border border-teal-900/10 bg-white p-7 shadow-soft md:p-9">
        <div className="mb-6 flex items-center gap-3">
          <span className="grid h-11 w-11 place-items-center rounded-2xl bg-teal-800 text-cream-50">
            <KeyRound className="h-5 w-5" />
          </span>
          <div>
            <p className="eyebrow">{t.eyebrow}</p>
            <h1 className="font-display text-2xl font-semibold leading-tight text-teal-900">
              {t.title}
            </h1>
          </div>
        </div>

        <p className="mb-5 text-sm leading-relaxed text-ink-soft">
          {t.subtitle}
        </p>

        <form onSubmit={attempt} className="space-y-3">
          <input
            type="password"
            autoComplete="off"
            value={code}
            onChange={(e) => {
              setCode(e.target.value);
              if (error) setError(false);
            }}
            placeholder={t.placeholder}
            className="w-full rounded-2xl border border-teal-900/15 bg-cream-50 px-4 py-3 text-sm text-ink outline-none transition-colors placeholder:text-ink-faint focus:border-teal-500"
          />

          {error && (
            <p className="flex items-center gap-2 text-xs font-medium text-[#bf6b4f]">
              <AlertCircle className="h-4 w-4 shrink-0" />
              {t.wrong}
            </p>
          )}

          <Button
            type="submit"
            variant="primary"
            size="md"
            disabled={busy || !code.trim()}
            className="w-full"
          >
            {busy ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                {t.verifying}
              </>
            ) : (
              t.enter
            )}
          </Button>
        </form>

        <p className="mt-6 text-center text-[0.7rem] leading-relaxed text-ink-faint">
          {t.hint}
        </p>
      </div>
    </div>
  );
}
