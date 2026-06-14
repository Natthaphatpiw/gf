import { NextResponse } from "next/server";
import {
  getConsultation,
  saveProposal,
  addConsultationStatus,
  logConsultationActivity,
} from "@/lib/store";
import { authLiffRequest } from "@/lib/line";
import { planItemLabel } from "@/lib/plan";
import type { ProposalSlotKind } from "@/lib/consultation";
import type { LText } from "@/lib/types";

/* ============================================================
 * POST /api/line/expert/[id]/proposal
 *
 * Expert saves an adjusted plan from the managed-plan LIFF
 * (the drag-and-drop result). Persists the proposal + ordered
 * slots and moves the order to awaiting_customer so the guest can
 * compare and accept. Token-authed.
 *
 * Body: { note?: string, slots: Array<{
 *           itemType: 'service'|'menu'|'guidance'|'unassigned',
 *           itemId?: string, label?: {th,en}, fromOriginal?: boolean }> }
 * ============================================================ */

export const runtime = "nodejs";

const KINDS: ProposalSlotKind[] = ["service", "menu", "guidance", "unassigned"];

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = await authLiffRequest(req);
  if (!auth.ok) return NextResponse.json({ error: "unauthorized" }, { status: auth.status });

  const { id } = await params;
  const consultation = await getConsultation(id);
  if (!consultation) return NextResponse.json({ error: "not_found" }, { status: 404 });

  // Only allow (re)proposing before the customer has decided — never create
  // an orphan proposal after the order has moved on.
  if (
    consultation.status !== "awaiting_expert" &&
    consultation.status !== "expert_processing" &&
    consultation.status !== "awaiting_customer"
  ) {
    return NextResponse.json({ error: "already_decided" }, { status: 409 });
  }

  const body = (await req.json().catch(() => ({}))) as {
    note?: unknown;
    slots?: unknown;
  };
  if (!Array.isArray(body.slots) || body.slots.length === 0) {
    return NextResponse.json({ error: "no_slots" }, { status: 400 });
  }

  const slots = body.slots.map((raw) => {
    const s = (raw ?? {}) as Record<string, unknown>;
    const kind: ProposalSlotKind = KINDS.includes(s.itemType as ProposalSlotKind)
      ? (s.itemType as ProposalSlotKind)
      : "unassigned";
    const itemId = typeof s.itemId === "string" && s.itemId ? s.itemId : undefined;
    // Trust the catalog for service/menu labels; fall back to the client label.
    const provided =
      s.label && typeof s.label === "object"
        ? {
            th: String((s.label as Record<string, unknown>).th ?? ""),
            en: String((s.label as Record<string, unknown>).en ?? ""),
          }
        : undefined;
    const resolved = planItemLabel(kind, itemId);
    const label: LText = resolved ?? provided ?? { th: "", en: "" };
    return {
      itemType: kind,
      itemId,
      label,
      fromOriginal: s.fromOriginal === true,
    };
  });

  const note = typeof body.note === "string" && body.note.trim() ? body.note.trim() : undefined;

  const proposal = await saveProposal({
    consultationId: id,
    expertId: consultation.expertId,
    note,
    slots,
  });

  // Move forward so the customer can review (unless already past it).
  let updated = consultation;
  if (
    consultation.status === "awaiting_expert" ||
    consultation.status === "expert_processing"
  ) {
    updated =
      (await addConsultationStatus(id, "awaiting_customer", "expert", "plan proposed")) ??
      consultation;
  }
  await logConsultationActivity(id, "expert", "proposal.sent", {
    proposalId: proposal.id,
    slots: slots.length,
    lineUserId: auth.profile?.userId,
  });

  return NextResponse.json({ proposal, consultation: updated });
}
