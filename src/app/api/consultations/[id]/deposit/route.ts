import { NextResponse } from "next/server";
import {
  getConsultation,
  addConsultationStatus,
  saveConsultationDeposit,
  logConsultationActivity,
  logLinePush,
  getCustomerById,
  seedChatThread,
} from "@/lib/store";
import { getSessionCustomerId } from "@/lib/session-server";
import { getExpert } from "@/data/experts";
import {
  hasLineConfig,
  buildConsultFlex,
  lineBroadcast,
} from "@/lib/line";

/* ============================================================
 * POST /api/consultations/[id]/deposit
 *
 * Mock deposit: the client "uploads a slip" and we advance the
 * order awaiting_deposit -> awaiting_expert, record the (mock)
 * payment, and notify the expert OA on LINE with a Flex card.
 * No real charge happens.
 * ============================================================ */

export const runtime = "nodejs";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const customerId = await getSessionCustomerId();
  if (!customerId) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const { id } = await params;
  const consultation = await getConsultation(id);
  if (!consultation || consultation.customerId !== customerId) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }
  if (consultation.status !== "awaiting_deposit") {
    // already paid — return current state idempotently
    return NextResponse.json({ consultation });
  }

  const body = (await req.json().catch(() => ({}))) as { slipUrl?: unknown };
  const slipUrl = typeof body.slipUrl === "string" ? body.slipUrl : null;

  await saveConsultationDeposit(consultation.id, consultation.depositAmount, slipUrl);
  await logConsultationActivity(consultation.id, "customer", "deposit.submitted", {
    amount: consultation.depositAmount,
  });

  const updated = await addConsultationStatus(
    consultation.id,
    "awaiting_expert",
    "system",
    "deposit submitted",
  );

  // For chat consultations, open the thread now, seeded with the customer's
  // opening message (their note becomes the first chat bubble).
  if (consultation.consultType === "chat") {
    await seedChatThread(
      consultation.id,
      consultation.expertId,
      consultation.note ?? "",
      customerId,
    );
    await logConsultationActivity(consultation.id, "customer", "chat.opened");
  }

  // Notify the expert OA on LINE (best-effort; no-op without config).
  if (hasLineConfig()) {
    const expert = getExpert(consultation.expertId);
    const customer = await getCustomerById(customerId);
    const flex = buildConsultFlex({
      consultationId: consultation.id,
      itemName: consultation.itemName.en || consultation.itemName.th,
      expertName: expert ? expert.name.en : consultation.expertId,
      consultType: consultation.consultType,
      note: consultation.note,
      customerName: customer ? `${customer.firstName} ${customer.lastName}` : "Guest",
    });
    const result = await lineBroadcast([flex]);
    await logLinePush(consultation.id, "broadcast", "flex", flex, result.ok, result.response);
  }

  return NextResponse.json({ consultation: updated ?? consultation });
}
