import type { Locale } from "@/lib/types";

/* ============================================================
 * Small formatting helpers for the expert console.
 * ============================================================ */

/** Render an ISO datetime in a compact, locale-aware way. */
export function formatDateTime(iso: string, locale: Locale): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return new Intl.DateTimeFormat(locale === "th" ? "th-TH" : "en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(d);
}

/** Band colour for the three wellness scores (teal / gold / clay). */
export function bandColor(band: "low" | "moderate" | "high"): string {
  if (band === "low") return "#2e8377"; // teal-500 — calm / low
  if (band === "moderate") return "#b99355"; // gold-500 — watchful
  return "#bf6b4f"; // clay — high concern
}
