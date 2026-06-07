"use client";

/* ============================================================
 * Lightweight bilingual (TH / EN) system.
 *
 * Usage:
 *   const { locale, setLocale } = useLocale();
 *   const t = useT(dict);            // dict: { th: {...}, en: {...} }
 *   <h1>{t.title}</h1>
 *
 * Rule: when locale === "en" the UI must contain NO Thai text at
 * all — every string must come from a dictionary or LText value.
 * ============================================================ */

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type { Locale, LText } from "@/lib/types";

const STORAGE_KEY = "gc-locale";

interface LocaleContextValue {
  locale: Locale;
  setLocale: (l: Locale) => void;
}

const LocaleContext = createContext<LocaleContextValue>({
  locale: "th",
  setLocale: () => {},
});

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("th");

  useEffect(() => {
    const saved =
      typeof window !== "undefined"
        ? (window.localStorage.getItem(STORAGE_KEY) as Locale | null)
        : null;
    if (saved === "th" || saved === "en") {
      setLocaleState(saved);
    }
  }, []);

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  const setLocale = useCallback((l: Locale) => {
    setLocaleState(l);
    try {
      window.localStorage.setItem(STORAGE_KEY, l);
      document.cookie = `${STORAGE_KEY}=${l};path=/;max-age=31536000`;
    } catch {
      /* private mode — ignore */
    }
  }, []);

  return (
    <LocaleContext.Provider value={{ locale, setLocale }}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale(): LocaleContextValue {
  return useContext(LocaleContext);
}

/** Pick the current language out of a per-namespace dictionary. */
export function useT<T>(dict: Record<Locale, T>): T {
  const { locale } = useLocale();
  return dict[locale];
}

/** Pick the current language out of a bilingual value coming from data / API. */
export function useL(): (text: LText | undefined | null) => string {
  const { locale } = useLocale();
  return (text) => (text ? text[locale] : "");
}

/** Non-hook variant for use inside callbacks. */
export function pickL(text: LText | undefined | null, locale: Locale): string {
  return text ? text[locale] : "";
}
