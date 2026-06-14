"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Send } from "lucide-react";
import { useLiff, liffAuthHeaders } from "@/lib/useLiff";
import { useL, useT } from "@/lib/i18n";
import lineDict from "@/lib/i18n/dictionaries/line";
import { GuestProfilePanel } from "@/components/line/GuestProfilePanel";
import type { ExpertConsultContext } from "@/lib/line-context";
import type { ChatThreadView } from "@/lib/consultation";

const CHAT_LIFF_ID = process.env.NEXT_PUBLIC_LIFF_CHAT_ID ?? "";

export default function LineChatPage() {
  const { status, token, consultationId } = useLiff(CHAT_LIFF_ID);
  const t = useT(lineDict);
  const l = useL();

  const [ctx, setCtx] = useState<ExpertConsultContext | null>(null);
  const [thread, setThread] = useState<ChatThreadView | null>(null);
  const [loadError, setLoadError] = useState(false);
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);
  const [ending, setEnding] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const base = consultationId ? `/api/line/expert/${consultationId}` : null;
  const headers = liffAuthHeaders(token);

  // Initial context load
  useEffect(() => {
    if (status !== "ready" || !base) return;
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(base, { headers });
        if (!res.ok) throw new Error("load");
        const data = (await res.json()) as ExpertConsultContext;
        if (cancelled) return;
        setCtx(data);
        setThread(data.thread ?? null);
      } catch {
        if (!cancelled) setLoadError(true);
      }
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, base, token]);

  // Poll the thread while open
  const refreshThread = useCallback(async () => {
    if (!base) return;
    try {
      const res = await fetch(`${base}/chat`, { headers });
      if (!res.ok) return;
      const data = (await res.json()) as { thread: ChatThreadView | null };
      setThread(data.thread ?? null);
    } catch {
      /* ignore poll errors */
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [base, token]);

  useEffect(() => {
    if (status !== "ready" || !base || thread?.status === "ended") return;
    const iv = setInterval(refreshThread, 4000);
    return () => clearInterval(iv);
  }, [status, base, thread?.status, refreshThread]);

  // Autoscroll on new messages
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [thread?.messages.length]);

  const send = async () => {
    const body = draft.trim();
    if (!body || !base || sending) return;
    setSending(true);
    try {
      const res = await fetch(`${base}/chat`, {
        method: "POST",
        headers: { ...headers, "Content-Type": "application/json" },
        body: JSON.stringify({ body }),
      });
      if (res.ok) {
        setDraft("");
        await refreshThread();
      }
    } finally {
      setSending(false);
    }
  };

  const endChat = async () => {
    if (!base || ending) return;
    if (!window.confirm(t.chat.confirmEnd)) return;
    setEnding(true);
    try {
      const res = await fetch(`${base}/chat/end`, { method: "POST", headers });
      if (res.ok) {
        const data = (await res.json()) as { thread: ChatThreadView | null };
        setThread(data.thread ?? thread);
      }
    } finally {
      setEnding(false);
    }
  };

  const ended = thread?.status === "ended";

  return (
    <div className="fixed inset-0 z-[200] flex flex-col bg-cream-50">
      {status === "loading" && <Centered>{t.loading}</Centered>}
      {status === "ready" && loadError && <Centered>{t.notFound}</Centered>}

      {status === "ready" && !loadError && ctx && (
        <>
          <header className="flex items-center justify-between gap-3 border-b border-teal-900/10 bg-white px-4 py-3">
            <div className="min-w-0">
              <h1 className="font-display text-lg font-semibold text-teal-900">{t.chat.title}</h1>
              <p className="truncate text-[0.78rem] text-ink-soft">{l(ctx.consultation.itemName)}</p>
            </div>
            {!ended ? (
              <button
                type="button"
                onClick={endChat}
                disabled={ending}
                className="flex-none rounded-full border border-teal-900/15 px-3 py-1.5 text-[0.78rem] font-semibold text-teal-800 transition-colors hover:bg-teal-50 disabled:opacity-60"
              >
                {t.chat.end}
              </button>
            ) : (
              <span className="flex-none rounded-full bg-cream-200 px-3 py-1.5 text-[0.74rem] font-semibold text-ink-faint">
                {t.chat.ended}
              </span>
            )}
          </header>

          <div ref={scrollRef} className="min-h-0 flex-1 space-y-4 overflow-y-auto px-4 py-4">
            <details className="rounded-[1rem]">
              <summary className="cursor-pointer list-none rounded-full bg-white px-3 py-1.5 text-[0.78rem] font-semibold text-teal-800 shadow-soft">
                {t.guest.title}
                {ctx.guest ? ` · ${ctx.guest.firstName}` : ""}
              </summary>
              <div className="mt-2">
                <GuestProfilePanel
                  profile={ctx.profile}
                  guestName={ctx.guest?.firstName}
                  itemName={l(ctx.consultation.itemName)}
                  note={ctx.consultation.note}
                />
              </div>
            </details>

            {(!thread || thread.messages.length === 0) && (
              <p className="py-8 text-center text-[0.84rem] text-ink-faint">{t.chat.empty}</p>
            )}

            {thread?.messages.map((m) => {
              if (m.senderRole === "system") {
                return (
                  <p key={m.id} className="text-center text-[0.74rem] text-ink-faint">
                    {m.body}
                  </p>
                );
              }
              const mine = m.senderRole === "expert";
              return (
                <div key={m.id} className={`flex ${mine ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[78%] rounded-[1rem] px-3.5 py-2 text-[0.86rem] leading-relaxed ${
                      mine
                        ? "bg-teal-700 text-cream-50"
                        : "border border-teal-900/10 bg-white text-ink"
                    }`}
                  >
                    <p
                      className={`mb-0.5 text-[0.66rem] font-semibold uppercase tracking-wide ${
                        mine ? "text-cream-200" : "text-gold-600"
                      }`}
                    >
                      {mine ? t.chat.you : t.chat.customer}
                    </p>
                    <p className="whitespace-pre-wrap break-words">{m.body}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {!ended ? (
            <footer className="border-t border-teal-900/10 bg-white px-3 py-3">
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
                  className="max-h-28 min-h-[2.5rem] flex-1 resize-none rounded-[1rem] border border-teal-900/15 bg-cream-50 px-3.5 py-2.5 text-[0.88rem] text-ink outline-none focus:border-teal-600"
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
            </footer>
          ) : (
            <footer className="border-t border-teal-900/10 bg-cream-100 px-4 py-3 text-center text-[0.8rem] text-ink-soft">
              {t.chat.ended}
            </footer>
          )}
        </>
      )}
    </div>
  );
}

function Centered({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-1 items-center justify-center px-6 text-center text-[0.9rem] text-ink-soft">
      {children}
    </div>
  );
}
