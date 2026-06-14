"use client";

import { useCallback, useEffect, useState } from "react";
import { Check, Loader2, Sparkles } from "lucide-react";
import { useL, useT } from "@/lib/i18n";
import consultDict from "@/lib/i18n/dictionaries/consult";
import type { Consultation, ProposalView, ProposalSlotView } from "@/lib/consultation";

/* Customer-side managed-plan review: compare the expert's adjusted plan with
 * the original and accept one. Shows a waiting state before the plan arrives
 * and the decision afterwards. */

export function ManagedPlanPanel({
  consultation,
  onDecided,
}: {
  consultation: Consultation;
  onDecided: () => void;
}) {
  const t = useT(consultDict);
  const l = useL();
  const id = consultation.id;
  const [proposal, setProposal] = useState<ProposalView | null>(null);
  const [original, setOriginal] = useState<ProposalSlotView[]>([]);
  const [loading, setLoading] = useState(true);
  const [deciding, setDeciding] = useState<"original" | "adjusted" | null>(null);

  const load = useCallback(async () => {
    try {
      const res = await fetch(`/api/consultations/${id}/proposal`);
      if (res.ok) {
        const data = (await res.json()) as {
          proposal: ProposalView | null;
          original: ProposalSlotView[];
        };
        setProposal(data.proposal);
        setOriginal(data.original ?? []);
      }
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    void load();
  }, [load]);

  const decide = async (choice: "original" | "adjusted") => {
    if (deciding) return;
    setDeciding(choice);
    try {
      const res = await fetch(`/api/consultations/${id}/proposal/decide`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ choice }),
      });
      if (res.ok) onDecided();
    } finally {
      setDeciding(null);
    }
  };

  if (loading) {
    return (
      <div className="mt-4 flex justify-center rounded-[1rem] border border-teal-900/10 bg-white py-6">
        <Loader2 className="h-5 w-5 animate-spin text-teal-700" />
      </div>
    );
  }

  // No proposal yet → expert still preparing.
  if (!proposal) {
    return (
      <div className="mt-4 flex items-start gap-2 rounded-[0.9rem] bg-teal-50 px-4 py-3 text-[0.82rem] leading-relaxed text-teal-800">
        <Sparkles className="mt-0.5 h-4 w-4 flex-none text-teal-600" />
        {t.proposal.preparing}
      </div>
    );
  }

  const awaitingDecision = consultation.status === "awaiting_customer";
  const chosen = consultation.chosenPlan; // set once decided

  return (
    <section className="mt-4 rounded-[1rem] border border-teal-900/10 bg-white p-4 shadow-soft">
      <div className="flex items-center gap-2">
        <Sparkles className="h-4 w-4 text-gold-500" />
        <p className="text-[0.92rem] font-semibold text-teal-900">{t.proposal.title}</p>
      </div>
      <p className="mt-1 text-[0.82rem] leading-relaxed text-ink-soft">{t.proposal.intro}</p>

      {proposal.note && (
        <div className="mt-3 rounded-[0.8rem] bg-cream-100 px-3.5 py-2.5">
          <p className="text-[0.64rem] font-semibold uppercase tracking-[0.1em] text-ink-faint">
            {t.proposal.expertNote}
          </p>
          <p className="mt-0.5 text-[0.84rem] leading-relaxed text-ink-soft">{proposal.note}</p>
        </div>
      )}

      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <PlanColumn
          title={t.proposal.originalTitle}
          slots={original}
          highlighted={chosen === "original"}
          showTags={false}
          fromOriginalLabel={t.proposal.fromOriginal}
          addedLabel={t.proposal.added}
        />
        <PlanColumn
          title={t.proposal.adjustedTitle}
          slots={proposal.slots}
          highlighted={chosen === "adjusted"}
          showTags
          fromOriginalLabel={t.proposal.fromOriginal}
          addedLabel={t.proposal.added}
          accent
        />
      </div>

      {awaitingDecision ? (
        <div className="mt-4 grid gap-2 sm:grid-cols-2">
          <button
            type="button"
            onClick={() => decide("original")}
            disabled={deciding !== null}
            className="rounded-full border border-teal-900/20 py-2.5 text-[0.84rem] font-semibold text-teal-800 transition-colors hover:bg-teal-50 disabled:opacity-50"
          >
            {deciding === "original" ? t.proposal.deciding : t.proposal.keepOriginal}
          </button>
          <button
            type="button"
            onClick={() => decide("adjusted")}
            disabled={deciding !== null}
            className="rounded-full bg-teal-700 py-2.5 text-[0.84rem] font-semibold text-cream-50 shadow-soft transition-colors hover:bg-teal-800 disabled:opacity-50"
          >
            {deciding === "adjusted" ? t.proposal.deciding : t.proposal.keepAdjusted}
          </button>
        </div>
      ) : (
        chosen && (
          <div className="mt-4 flex items-center gap-2 rounded-[0.8rem] bg-teal-50 px-4 py-2.5 text-[0.84rem] font-semibold text-teal-800">
            <Check className="h-4 w-4 text-teal-600" />
            {chosen === "adjusted" ? t.proposal.chosenAdjusted : t.proposal.chosenOriginal}
          </div>
        )
      )}
    </section>
  );
}

function PlanColumn({
  title,
  slots,
  highlighted,
  showTags,
  fromOriginalLabel,
  addedLabel,
  accent,
}: {
  title: string;
  slots: ProposalSlotView[];
  highlighted: boolean;
  showTags: boolean;
  fromOriginalLabel: string;
  addedLabel: string;
  accent?: boolean;
}) {
  const l = useL();
  return (
    <div
      className={`rounded-[0.9rem] border p-3 ${
        highlighted
          ? "border-teal-600 bg-teal-50/50"
          : accent
            ? "border-gold-400/50 bg-gold-100/30"
            : "border-teal-900/10 bg-cream-50"
      }`}
    >
      <p className="text-[0.78rem] font-semibold text-teal-900">{title}</p>
      <ol className="mt-2 space-y-1.5">
        {slots.map((s, i) => (
          <li key={`${i}:${s.itemId ?? s.label.en}`} className="flex gap-2">
            <span className="grid h-5 w-5 flex-none place-items-center rounded-full bg-white text-[0.66rem] font-semibold text-teal-700 ring-1 ring-teal-900/10">
              {i + 1}
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-[0.82rem] leading-snug text-ink">{l(s.label)}</span>
              {showTags && (
                <span
                  className={`text-[0.66rem] font-medium ${
                    s.fromOriginal ? "text-ink-faint" : "text-gold-600"
                  }`}
                >
                  {s.fromOriginal ? fromOriginalLabel : addedLabel}
                </span>
              )}
            </span>
          </li>
        ))}
      </ol>
    </div>
  );
}
