import { NextResponse } from "next/server";
import {
  createConsultation,
  getConsultationsByCustomer,
  logConsultationActivity,
} from "@/lib/store";
import { getSessionCustomerId } from "@/lib/session-server";
import { CONSULT_DEPOSIT_THB } from "@/lib/consultation";

/* ============================================================
 * /api/consultations
 *   GET  -> the signed-in customer's consultations
 *   POST -> create one (status: awaiting_deposit)
 * ============================================================ */

export const runtime = "nodejs";

const ITEM_TYPES = ["program", "service", "menu", "package"] as const;
const CONSULT_TYPES = ["chat", "managed"] as const; // 'video' ships next round

export async function GET() {
  const customerId = await getSessionCustomerId();
  if (!customerId) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const consultations = await getConsultationsByCustomer(customerId);
  return NextResponse.json({ consultations });
}

export async function POST(req: Request) {
  const customerId = await getSessionCustomerId();
  if (!customerId) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "bad_request" }, { status: 400 });
  }

  const itemType = body.itemType as (typeof ITEM_TYPES)[number];
  const itemId = String(body.itemId ?? "").trim();
  const expertId = String(body.expertId ?? "").trim();
  const consultType = body.consultType as (typeof CONSULT_TYPES)[number];
  const name = (body.itemName ?? {}) as { th?: unknown; en?: unknown };

  if (!ITEM_TYPES.includes(itemType) || !itemId || !expertId) {
    return NextResponse.json({ error: "missing_fields" }, { status: 400 });
  }
  if (!CONSULT_TYPES.includes(consultType)) {
    return NextResponse.json({ error: "bad_consult_type" }, { status: 400 });
  }

  const itemName = {
    th: typeof name.th === "string" && name.th.trim() ? name.th : itemId,
    en: typeof name.en === "string" && name.en.trim() ? name.en : itemId,
  };
  const note =
    typeof body.note === "string" && body.note.trim() ? body.note.trim().slice(0, 2000) : undefined;
  const assessmentId =
    typeof body.assessmentId === "string" && body.assessmentId.trim()
      ? body.assessmentId.trim().toUpperCase()
      : undefined;
  const itemImage = typeof body.itemImage === "string" ? body.itemImage : undefined;

  try {
    const consultation = await createConsultation({
      customerId,
      itemType,
      itemId,
      itemName,
      itemImage,
      expertId,
      consultType,
      note,
      assessmentId,
      depositAmount: CONSULT_DEPOSIT_THB,
    });
    await logConsultationActivity(consultation.id, "customer", "consultation.created", {
      consultType,
      expertId,
      itemType,
      itemId,
    });
    return NextResponse.json({ consultation });
  } catch {
    return NextResponse.json({ error: "server_error" }, { status: 500 });
  }
}
