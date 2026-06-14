"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Send } from "lucide-react";
import { useT } from "@/lib/i18n";
import consultDict from "@/lib/i18n/dictionaries/consult";
import type { ChatThreadView } from "@/lib/consultation";

/* Customer-side realtime chat (polls the same thread the expert LIFF writes). */

export function ChatPanel({ id, onEnded }: { id: string; onEnded: () => void }) {
  const t = useT(consultDict);
  const [thread, setThread] = useState<ChatThreadView | null>(null);
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);
  const [ending, setEnding] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const refresh = useCallback(async () => {
    try {
      const res = await fetch(`/api/consultations/${id}/chat`);
      if (!res.ok) return;
      const data = (await res.json()) as { thread: ChatThreadView | null };
      setThread(data.thread ?? null);
    } catch {
      /* ignore */
    }
  }, [id]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  useEffect(() => {
    if (thread?.status === "ended") return;
    const iv = setInterval(refresh, 4000);
    return () => clearInterval(iv);
  }, [thread?.status, refresh]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [thread?.messages.length]);

  const send = async () => {
    const body = draft.trim();
    if (!body || sending) return;
    setSending(true);
    try {
      const res = await fetch(`/api/consultations/${id}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ body }),
      });
      if (res.ok) {
        setDraft("");
        await refresh();
      }
    } finally {
      setSending(false);
    }
  };

  const end = async () => {
    if (ending) return;
    if (!window.confirm(t.chat.confirmEnd)) return;
    setEnding(true);
    try {
      const res = await fetch(`/api/consultations/${id}/chat/end`, { method: "POST" });
      if (res.ok) {
        await refresh();
        onEnded();
      }
    } finally {
      setEnding(false);
    }
  };

  const ended = thread?.status === "ended";

  return (
    <section className="mt-4 overflow-hidden rounded-[1rem] border border-teal-900/10 bg-white shadow-soft">
      <header className="flex items-center justify-between border-b border-teal-900/10 px-4 py-2.5">
        <p className="text-[0.84rem] font-semibold text-teal-900">{t.chat.title}</p>
        {!ended ? (
          <button
            type="button"
            onClick={end}
            disabled={ending}
            className="rounded-full border border-teal-900/15 px-3 py-1 text-[0.74rem] font-semibold text-teal-800 transition-colors hover:bg-teal-50 disabled:opacity-60"
          >
            {t.chat.end}
          </button>
        ) : (
          <span className="rounded-full bg-cream-200 px-3 py-1 text-[0.72rem] font-semibold text-ink-faint">
            {t.chat.ended}
          </span>
        )}
      </header>

      <div ref={scrollRef} className="max-h-[60vh] min-h-[8rem] space-y-3 overflow-y-auto px-4 py-3">
        {!thread || thread.messages.length === 0 ? (
          <p className="py-6 text-center text-[0.82rem] text-ink-faint">
            {ended ? t.chat.empty : t.chat.waiting}
          </p>
        ) : (
          thread.messages.map((m) => {
            if (m.senderRole === "system") {
              return (
                <p key={m.id} className="text-center text-[0.72rem] text-ink-faint">
                  {m.body}
                </p>
              );
            }
            const mine = m.senderRole === "customer";
            return (
              <div key={m.id} className={`flex ${mine ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[80%] rounded-[1rem] px-3.5 py-2 text-[0.86rem] leading-relaxed ${
                    mine ? "bg-teal-700 text-cream-50" : "border border-teal-900/10 bg-cream-50 text-ink"
                  }`}
                >
                  <p
                    className={`mb-0.5 text-[0.64rem] font-semibold uppercase tracking-wide ${
                      mine ? "text-cream-200" : "text-gold-600"
                    }`}
                  >
                    {mine ? t.chat.you : t.chat.expert}
                  </p>
                  <p className="whitespace-pre-wrap break-words">{m.body}</p>
                </div>
              </div>
            );
          })
        )}
      </div>

      {!ended && (
        <div className="border-t border-teal-900/10 px-3 py-2.5">
          <div className="flex items-end gap-2">
            <textarea
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  void send();
                }
              }}
              rows={1}
              placeholder={t.chat.placeholder}
              className="max-h-28 min-h-[2.5rem] flex-1 resize-none rounded-[1rem] border border-teal-900/15 bg-cream-50 px-3.5 py-2.5 text-[0.86rem] text-ink outline-none focus:border-teal-600"
            />
            <button
              type="button"
              onClick={send}
              disabled={!draft.trim() || sending}
              aria-label={t.chat.send}
              className="grid h-11 w-11 flex-none place-items-center rounded-full bg-teal-700 text-cream-50 transition-colors hover:bg-teal-800 disabled:opacity-50"
            >
              <Send className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
