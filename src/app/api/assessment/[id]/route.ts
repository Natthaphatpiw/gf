import { NextResponse } from "next/server";
import type { LText } from "@/lib/types";
import { getAssessment } from "@/lib/store";

/* ============================================================
 * GET /api/assessment/[id]
 *
 * Public lookup used by the family gate to validate a member's
 * assessment code. PDPA data minimisation: returns ONLY the id
 * and the archetype name — never the full wellness profile,
 * scores, traits or any other personal data.
 *
 * Response: { id: string, archetypeName: LText }
 * 404 when the code does not exist.
 * ============================================================ */

export const runtime = "nodejs";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const code = (id ?? "").trim().toUpperCase();

  if (!code) {
    return NextResponse.json({ error: "Missing id." }, { status: 400 });
  }

  let archetypeName: LText | null = null;
  try {
    const profile = await getAssessment(code);
    if (profile) archetypeName = profile.archetype.name;
  } catch {
    return NextResponse.json(
      { error: "Lookup failed." },
      { status: 500 },
    );
  }

  if (!archetypeName) {
    return NextResponse.json({ error: "Not found." }, { status: 404 });
  }

  return NextResponse.json({ id: code, archetypeName });
}
