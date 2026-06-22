import { NextResponse } from "next/server";
import { OUTCOME_SAMPLES } from "@/lib/outcome-samples";
import { seedOutcomeSamples } from "@/lib/store";

export const runtime = "nodejs";

/**
 * One-shot seeder: pushes the deterministic mock pre/post dataset into the
 * Supabase `outcome_samples` table (idempotent upsert). Gated by the same
 * access code as the expert console. No-op (demo:true) without Supabase env.
 *
 *   curl -X POST <site>/api/admin/seed-outcomes -H "x-seed-code: <EXPERT_ACCESS_CODE>"
 *
 * Requires the section-11 migration in supabase/schema.sql to be applied first.
 */
export async function POST(req: Request) {
  // Write endpoint that affects the PUBLIC dashboard — fail closed rather than
  // fall back to the demo code, so an unset env can't let anyone poison stats.
  const expected = process.env.EXPERT_ACCESS_CODE;
  if (!expected) {
    return NextResponse.json(
      { error: "seeding disabled — set EXPERT_ACCESS_CODE" },
      { status: 503 },
    );
  }
  const provided = req.headers.get("x-seed-code");
  if (provided !== expected) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  try {
    const result = await seedOutcomeSamples(OUTCOME_SAMPLES);
    return NextResponse.json({ ...result, total: OUTCOME_SAMPLES.length });
  } catch (err) {
    const message = err instanceof Error ? err.message : "seed failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
