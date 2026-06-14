import { NextResponse } from "next/server";
import {
  getConsultation,
  getAssessment,
  getCustomerById,
  getChatThread,
  getLatestProposal,
  upsertLineLink,
  logConsultationActivity,
} from "@/lib/store";
import { authLiffRequest } from "@/lib/line";
import { getExpert } from "@/data/experts";
import { getOriginalPlanSlots, getPlanCatalog } from "@/lib/plan";

/* ============================================================
 * GET /api/line/expert/[id]
 *
 * Context for the expert LIFF apps (chat + managed-plan editor).
 * Authorized by the expert's LINE access token (Authorization:
 * Bearer <liff token>) — verified against LINE. Returns the
 * consultation, the guest's assessment profile ("who is this
 * guest"), and — by consult type — the chat thread or the plan
 * editor data (original slots + latest proposal + catalog).
 * ============================================================ */

export const runtime = "nodejs";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = await authLiffRequest(req);
  if (!auth.ok) return NextResponse.json({ error: "unauthorized" }, { status: auth.status });

  const { id } = await params;
  const consultation = await getConsultation(id);
  if (!consultation) return NextResponse.json({ error: "not_found" }, { status: 404 });

  // Best-effort audit link: remember which LINE user opened this consult.
  if (auth.profile) {
    await upsertLineLink(auth.profile.userId, "expert", {
      expertId: consultation.expertId,
      displayName: auth.profile.displayName,
    });
    await logConsultationActivity(id, "expert", "liff.opened", {
      lineUserId: auth.profile.userId,
    });
  }

  const expert = getExpert(consultation.expertId);
  const customer = await getCustomerById(consultation.customerId);
  const profile = consultation.assessmentId
    ? await getAssessment(consultation.assessmentId)
    : null;

  const guestProfile = profile
    ? {
        id: profile.id,
        archetype: { code: profile.archetype.code, name: profile.archetype.name, description: profile.archetype.description },
        scores: {
          stress: profile.stress,
          migraine: profile.migraine,
          mental: profile.mental,
        },
        traits: profile.traits,
        recommendedGoals: profile.recommendedGoals,
      }
    : null;

  const base = {
    consultation: {
      id: consultation.id,
      itemType: consultation.itemType,
      itemId: consultation.itemId,
      itemName: consultation.itemName,
      itemImage: consultation.itemImage,
      consultType: consultation.consultType,
      status: consultation.status,
      note: consultation.note,
    },
    expert: expert ? { id: expert.id, name: expert.name } : null,
    guest: customer ? { firstName: customer.firstName } : null,
    profile: guestProfile,
  };

  if (consultation.consultType === "chat") {
    const thread = await getChatThread(id);
    return NextResponse.json({ ...base, thread });
  }

  // managed (or video, deferred) -> plan editor data
  const original = getOriginalPlanSlots(consultation.itemType, consultation.itemId);
  const proposal = await getLatestProposal(id);
  const catalog = getPlanCatalog();
  return NextResponse.json({ ...base, original, proposal, catalog });
}
