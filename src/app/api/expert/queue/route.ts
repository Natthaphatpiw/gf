import { NextResponse } from "next/server";
import { getExpertQueue } from "@/lib/store";
import { isAuthorizedExpert } from "@/components/expert/auth";

/* ============================================================
 * GET /api/expert/queue
 *   -> { bookings }  consult-requested bookings, newest first.
 * Also doubles as the access-code verifier for the gate.
 * ============================================================ */

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  if (!isAuthorizedExpert(req)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  try {
    const bookings = await getExpertQueue();
    return NextResponse.json({ bookings });
  } catch {
    return NextResponse.json({ error: "queue_failed" }, { status: 500 });
  }
}
