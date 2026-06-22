import { NextResponse } from "next/server";
import { OUTCOME_SAMPLES } from "@/lib/outcome-samples";
import { aggregateOutcomes } from "@/lib/outcome-stats";
import { getStoredOutcomeSamples } from "@/lib/store";
import { getPackage } from "@/data/packages";

export const runtime = "nodejs";

/**
 * Public, aggregate-only outcome statistics for the impact dashboard.
 * Reads the seeded Supabase samples when available, otherwise the in-code
 * deterministic dataset (demo mode). No PII is ever returned — only pooled
 * pre/post numbers per package.
 */
export async function GET() {
  let stored = null;
  try {
    stored = await getStoredOutcomeSamples();
  } catch {
    stored = null;
  }
  const samples = stored && stored.length > 0 ? stored : OUTCOME_SAMPLES;
  const overview = aggregateOutcomes(samples, (id) => getPackage(id)?.tier ?? "basic");

  return NextResponse.json(
    { ...overview, source: stored && stored.length > 0 ? "db" : "sample" },
    { headers: { "Cache-Control": "public, max-age=300, stale-while-revalidate=600" } },
  );
}
