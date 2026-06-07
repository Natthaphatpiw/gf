"use client";

import { useState } from "react";
import { Check, Copy, KeyRound } from "lucide-react";
import { useT } from "@/lib/i18n";
import common from "@/lib/i18n/dictionaries/common";
import assessment from "@/lib/i18n/dictionaries/assessment";

/* ============================================================
 * UnlockCode — the guest's assessment id shown as a large
 * mono code with a copy button. This id unlocks family packages.
 * ============================================================ */

export function UnlockCode({ id }: { id: string }) {
  const t = useT(assessment);
  const tc = useT(common);
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(id);
    } catch {
      /* clipboard unavailable — ignore */
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-3xl border border-teal-900/10 bg-white p-6 shadow-soft">
      <div className="flex items-center gap-2 text-teal-700">
        <KeyRound className="h-4 w-4" />
        <p className="eyebrow !text-teal-700">{t.result.idTitle}</p>
      </div>

      <div className="mt-4 flex items-center justify-between gap-3 rounded-2xl border border-dashed border-teal-700/30 bg-teal-50/50 px-4 py-4">
        <span className="font-mono text-2xl font-bold tracking-[0.18em] text-teal-900 md:text-3xl">
          {id}
        </span>
        <button
          type="button"
          onClick={copy}
          aria-label={copied ? tc.actions.copied : tc.actions.copy}
          className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-3.5 py-2 text-xs font-semibold transition-colors ${
            copied
              ? "bg-teal-700 text-cream-50"
              : "border border-teal-700/30 text-teal-700 hover:bg-teal-50"
          }`}
        >
          {copied ? (
            <>
              <Check className="h-4 w-4" />
              {tc.actions.copied}
            </>
          ) : (
            <>
              <Copy className="h-4 w-4" />
              {tc.actions.copy}
            </>
          )}
        </button>
      </div>

      <p className="mt-4 text-xs leading-relaxed text-ink-soft">
        {t.result.idCaption}
      </p>
    </div>
  );
}
