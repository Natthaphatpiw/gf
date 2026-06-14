import type { LText } from "@/lib/types";
import type { ItemType } from "@/lib/account";

/* ============================================================
 * Consultation domain contract — shared by the SQL schema, the
 * API, and the customer/expert UIs. A "consultation" is the
 * customer's order: an item + an expert + a consult type, tracked
 * through a Shopee-style status machine.
 * ============================================================ */

/** Flat (mock) deposit charged up front to reserve an expert. */
export const CONSULT_DEPOSIT_THB = 500;

export type ConsultType = "video" | "chat" | "managed";

export type ConsultStatus =
  | "awaiting_deposit"
  | "awaiting_expert"
  | "expert_processing"
  | "awaiting_customer"
  | "coordinating_partner"
  | "payment"
  | "trip_started"
  | "in_progress"
  | "completed"
  | "awaiting_feedback"
  | "cancelled";

/** The happy-path order of the tracker (excludes the terminal "cancelled"). */
export const CONSULT_STATUS_FLOW: ConsultStatus[] = [
  "awaiting_deposit",
  "awaiting_expert",
  "expert_processing",
  "awaiting_customer",
  "coordinating_partner",
  "payment",
  "trip_started",
  "in_progress",
  "completed",
  "awaiting_feedback",
];

export const CONSULT_STATUS_LABEL: Record<ConsultStatus, LText> = {
  awaiting_deposit: { th: "รอชำระค่ามัดจำ", en: "Awaiting deposit" },
  awaiting_expert: { th: "รอการตอบรับจากผู้เชี่ยวชาญ", en: "Awaiting expert" },
  expert_processing: { th: "รอผู้เชี่ยวชาญดำเนินการ", en: "Expert is working on it" },
  awaiting_customer: { th: "รอการยืนยันจากคุณ", en: "Awaiting your confirmation" },
  coordinating_partner: { th: "กำลังผสานงานกับพาร์ตเนอร์", en: "Coordinating with partners" },
  payment: { th: "รอชำระเงิน", en: "Payment" },
  trip_started: { th: "เริ่มเดินทาง", en: "Trip started" },
  in_progress: { th: "อยู่ระหว่างการผ่อนคลาย", en: "In progress" },
  completed: { th: "จบแพ็กเกจแล้ว", en: "Completed" },
  awaiting_feedback: { th: "รอรับฟีดแบ็ก", en: "Awaiting your feedback" },
  cancelled: { th: "ยกเลิกแล้ว", en: "Cancelled" },
};

export const CONSULT_TYPE_LABEL: Record<ConsultType, LText> = {
  video: { th: "วิดีโอคอล 1-1", en: "1-1 video call" },
  chat: { th: "ปรึกษาผ่านแชท", en: "Chat with the expert" },
  managed: { th: "ให้ผู้เชี่ยวชาญจัดการให้", en: "Let the expert handle it" },
};

export interface ConsultationSummary {
  id: string;
  itemType: ItemType;
  itemId: string;
  itemName: LText;
  itemImage?: string;
  expertId: string;
  consultType: ConsultType;
  status: ConsultStatus;
  depositAmount: number;
  createdAt: string;
  updatedAt: string;
}

export interface ConsultationStatusEntry {
  status: ConsultStatus;
  actorRole: "customer" | "expert" | "system" | "partner";
  note?: string;
  at: string;
}

export interface Consultation extends ConsultationSummary {
  customerId: string;
  note?: string;
  assessmentId?: string;
  chosenPlan?: "original" | "adjusted";
  statusHistory: ConsultationStatusEntry[];
}

/* ---------------- Chat (realtime, customer <-> expert) ---------------- */

export interface ChatMessage {
  id: string;
  senderRole: "customer" | "expert" | "system";
  senderId?: string;
  body: string;
  createdAt: string;
}

export interface ChatThreadView {
  id: string;
  status: "open" | "ended";
  messages: ChatMessage[];
}

/* ---------------- Expert proposal (managed drag-and-drop plan) -------- */

export type ProposalSlotKind = "service" | "menu" | "guidance" | "unassigned";

export interface ProposalSlotView {
  position: number;
  itemType: ProposalSlotKind;
  itemId?: string;
  label: LText;
  fromOriginal: boolean;
}

export interface ProposalView {
  id: string;
  note?: string;
  status: "draft" | "sent" | "accepted" | "rejected" | "superseded";
  slots: ProposalSlotView[];
  createdAt: string;
}

/** Progress 0..1 for the tracker bar. */
export function consultProgress(status: ConsultStatus): number {
  if (status === "cancelled") return 0;
  const i = CONSULT_STATUS_FLOW.indexOf(status);
  if (i < 0) return 0;
  return (i + 1) / CONSULT_STATUS_FLOW.length;
}

/** The next status in the happy path, or null at the end / when cancelled. */
export function nextConsultStatus(current: ConsultStatus): ConsultStatus | null {
  if (current === "cancelled") return null;
  const i = CONSULT_STATUS_FLOW.indexOf(current);
  if (i < 0 || i >= CONSULT_STATUS_FLOW.length - 1) return null;
  return CONSULT_STATUS_FLOW[i + 1];
}
