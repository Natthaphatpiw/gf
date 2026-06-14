import { NextResponse } from "next/server";
import { getConsultation } from "@/lib/store";
import { getSessionCustomerId } from "@/lib/session-server";

/* GET /api/consultations/[id] — detail (owner only). */

export const runtime = "nodejs";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const customerId = await getSessionCustomerId();
  if (!customerId) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const { id } = await params;
  const consultation = await getConsultation(id);
  if (!consultation || consultation.customerId !== customerId) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }
  return NextResponse.json({ consultation });
}
