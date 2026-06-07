"use client";

import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import { useT } from "@/lib/i18n";
import common from "@/lib/i18n/dictionaries/common";

/* ============================================================
 * PDPA consent block — used before the assessment and at booking.
 * ============================================================ */

export function ConsentCheckbox({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  const t = useT(common);

  return (
    <div className="rounded-2xl border border-teal-700/15 bg-teal-50/60 p-4">
      <div className="flex items-start gap-3">
        <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-teal-600" />
        <div className="space-y-2.5">
          <p className="text-xs leading-relaxed text-ink-soft">
            {t.pdpa.shortNotice}{" "}
            <Link
              href="/privacy"
              className="font-medium text-teal-700 underline underline-offset-2"
            >
              {t.pdpa.learnMore}
            </Link>
          </p>
          <label className="flex cursor-pointer items-start gap-2.5">
            <input
              type="checkbox"
              checked={checked}
              onChange={(e) => onChange(e.target.checked)}
              className="mt-0.5 h-4 w-4 shrink-0 cursor-pointer accent-teal-700"
            />
            <span className="text-xs font-medium leading-relaxed text-ink">
              {t.pdpa.agree}
            </span>
          </label>
        </div>
      </div>
    </div>
  );
}
