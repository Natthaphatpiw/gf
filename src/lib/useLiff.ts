"use client";

import { useEffect, useState } from "react";

/* ============================================================
 * Minimal LIFF bootstrap. Loads the LIFF SDK, initialises it,
 * obtains the LINE access token (used as the bearer for our
 * expert APIs) and reads the consultation id from `?c=`.
 *
 * Graceful fallbacks so the page never hard-crashes:
 *  - On localhost (dev) we never redirect to LINE login; we just
 *    run tokenless (the expert APIs accept tokenless calls when
 *    LINE isn't configured).
 *  - If the SDK fails to load / init (e.g. opened outside LINE in
 *    a demo), we proceed tokenless too.
 * ============================================================ */

const SDK_SRC = "https://static.line-scdn.net/liff/edge/2/sdk.js";

export type LiffStatus = "loading" | "ready" | "error";

export interface LiffState {
  status: LiffStatus;
  token: string | null;
  consultationId: string | null;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function liffGlobal(): any {
  if (typeof window === "undefined") return null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (window as any).liff ?? null;
}

async function ensureSdk(): Promise<unknown> {
  const existing = liffGlobal();
  if (existing) return existing;
  await new Promise<void>((resolve, reject) => {
    const s = document.createElement("script");
    s.src = SDK_SRC;
    s.async = true;
    s.onload = () => resolve();
    s.onerror = () => reject(new Error("sdk_load_failed"));
    document.head.appendChild(s);
  });
  return liffGlobal();
}

function isLocalhost(): boolean {
  if (typeof window === "undefined") return false;
  return /^(localhost|127\.|0\.0\.0\.0|\[::1\])/.test(window.location.hostname);
}

export function useLiff(liffId: string): LiffState {
  const [state, setState] = useState<LiffState>({
    status: "loading",
    token: null,
    consultationId: null,
  });

  useEffect(() => {
    let cancelled = false;
    const consultationId = new URLSearchParams(window.location.search).get("c");

    (async () => {
      try {
        const liff = await ensureSdk();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const l = liff as any;
        if (l && liffId) {
          await l.init({ liffId });
          if (l.isLoggedIn?.()) {
            const token = l.getAccessToken?.() ?? null;
            if (!cancelled) setState({ status: "ready", token, consultationId });
            return;
          }
          // Not logged in: redirect to LINE login only in a real deployment.
          if (!isLocalhost() && typeof l.login === "function") {
            l.login();
            return; // navigating away
          }
        }
        // demo / localhost / no liffId -> tokenless
        if (!cancelled) setState({ status: "ready", token: null, consultationId });
      } catch {
        if (!cancelled) setState({ status: "ready", token: null, consultationId });
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [liffId]);

  return state;
}

/** Authorization header for expert API calls (empty when tokenless/demo). */
export function liffAuthHeaders(token: string | null): Record<string, string> {
  return token ? { Authorization: `Bearer ${token}` } : {};
}
