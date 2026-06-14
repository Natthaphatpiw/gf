import type { Locale, WellnessPackage } from "@/lib/types";

/* ============================================================
 * Adjustment-target options derived from a package's itinerary,
 * plus the two synthetic targets "Accommodation" and "General".
 * The value is stable (EN-based) so it round-trips through storage;
 * the label is shown to the clinician.
 * ============================================================ */

export interface TargetOption {
  value: string;
  label: string;
  /** Pre-fill text for the "original" field (EN itinerary activity). */
  original: string;
}

export const TARGET_ACCOMMODATION = "Accommodation";
export const TARGET_GENERAL = "General";

export function buildTargetOptions(
  pkg: WellnessPackage | null,
  locale: Locale,
  labels: { accommodation: string; general: string; day: string },
): TargetOption[] {
  const options: TargetOption[] = [];

  if (pkg) {
    for (const day of pkg.itinerary) {
      for (const item of day.items) {
        // Label uses the localised day word + EN activity (per spec),
        // value is a stable EN identifier.
        const timeEn = typeof item.time === "string" ? item.time : item.time.en;
        const timeLocale = typeof item.time === "string" ? item.time : item.time[locale];
        const value = `Day ${day.day} · ${timeEn} · ${item.activity.en}`;
        const label = `${labels.day} ${day.day} · ${timeLocale} · ${item.activity[locale]}`;
        options.push({
          value,
          label,
          original: item.activity[locale],
        });
      }
    }
  }

  options.push({
    value: TARGET_ACCOMMODATION,
    label: labels.accommodation,
    original: "",
  });
  options.push({
    value: TARGET_GENERAL,
    label: labels.general,
    original: "",
  });

  return options;
}
