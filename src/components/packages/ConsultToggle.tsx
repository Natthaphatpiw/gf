"use client";

import { useEffect, useState } from "react";
import { ShieldCheck } from "lucide-react";
import { useT } from "@/lib/i18n";
import packagesDict from "@/lib/i18n/dictionaries/packages";
import { hasConsultFlag, toggleConsultFlag } from "@/lib/session";

/* ============================================================
 * ConsultToggle — the distinguished "consult a nutritionist and
 * doctor before booking" card on the package detail page. State
 * persists to the gc-consults session key and is read by the
 * booking flow.
 * ============================================================ */

export function ConsultToggle({ packageId }: { packageId: string }) {
  const t = useT(packagesDict).detail;
  const [on, setOn] = useState(false);

  useEffect(() => {
    setOn(hasConsultFlag(packageId));
    const sync = () => setOn(hasConsultFlag(packageId));
    window.addEventListener("gc-session-change", sync);
    return () => window.removeEventListener("gc-session-change", sync);
  }, [packageId]);

  function handleToggle() {
    toggleConsultFlag(packageId);
    setOn((v) => !v);
  }

  return (
    <div className="rounded-3xl border border-gold-200 bg-gradient-to-br from-cream-50 to-gold-100/40 p-5 shadow-soft md:p-6">
      <div className="flex items-start gap-4">
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-teal-700/10 text-teal-700">
          <ShieldCheck className="h-5 w-5" />
        </span>
        <div className="flex-1">
          <div className="flex items-start justify-between gap-4">
            <h3 className="font-display text-lg font-semibold leading-snug text-teal-900">
              {t.consultTitle}
            </h3>
            <button
              type="button"
              role="switch"
              aria-checked={on}
              aria-label={t.consultTitle}
              onClick={handleToggle}
              className={`relative mt-0.5 h-7 w-12 shrink-0 rounded-full outline-none transition-colors duration-300 focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-2 focus-visible:ring-offset-cream-50 ${
                on ? "bg-teal-700" : "bg-teal-900/15"
              }`}
            >
              <span
                style={{ left: on ? "1.375rem" : "0.125rem" }}
                className="absolute top-0.5 h-6 w-6 rounded-full bg-white shadow-soft transition-all duration-300"
              />
            </button>
          </div>
          <p className="mt-2 text-sm leading-relaxed text-ink-soft">
            {t.consultBody}
          </p>
          <p
            className={`mt-3 text-xs font-semibold tracking-wide ${
              on ? "text-teal-700" : "text-ink-faint"
            }`}
          >
            {on ? t.consultOn : t.consultOff}
          </p>
        </div>
      </div>
    </div>
  );
}
