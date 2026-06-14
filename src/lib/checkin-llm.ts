import type { CheckinTimepoint, WellnessPackage } from "@/lib/types";
import { generateJson } from "@/lib/gemini";
import { DIAL_KEYS } from "@/data/checkin";
import { PACKAGES } from "@/data/packages";
import type { CheckinContext, LlmCheckinResult } from "@/lib/checkin-core";

/* ============================================================
 * Check-in LLM pipeline — read & interpret ONLY.
 *
 * The model receives dial scores that are already computed from
 * the fixed anchor table and is explicitly forbidden from
 * recalculating them. Its five jobs: red flags from Q8, a warm
 * customer summary, a staff brief, the expert-review decision,
 * and (T2 only) the change narrative + a next step picked from
 * the real catalog. Output is validated in checkin-core before
 * anything is stored; any failure falls back to rules.
 * ============================================================ */

function buildSystemPrompt(timepoint: CheckinTimepoint): string {
  return [
    'คุณคือระบบประมวลผล "เช็คอินเข็มทิศกายใจ" ของ Goodfill Care แพลตฟอร์มเวลเนสบนเกาะสมุย',
    "หน้าที่ของคุณคือ อ่านและตีความ — ห้ามคำนวณ แก้ไข หรือแต่งคะแนน dial ใด ๆ",
    "(คะแนนทั้งหมดถูกคำนวณจากตารางค่าคงที่ในระบบมาแล้ว)",
    "",
    "งานของคุณ:",
    "1) วิเคราะห์ q8_text → red_flags / preferences / goals พร้อมอ้าง quote ต้นฉบับ",
    "2) summary_for_customer: ไม่เกิน 3 ประโยค โทนอบอุ่นแบบโฮสต์เวลเนสหรู (Six Senses / Kamalaya)",
    "   อิง archetype ที่ให้มา และพูดถึง dial ที่เด่นที่สุด 2 ตัว ห้ามใช้คำวินิจฉัยทางการแพทย์",
    "3) summary_for_staff: bullet สั้น ภาษาไทยเสมอ เน้นข้อควรระวังและสิ่งที่ลูกค้าขอ",
    "4) expert_review_required = true เมื่อเข้าเงื่อนไขข้อใดข้อหนึ่ง:",
    "   - dial ไมเกรน >= 70",
    "   - พบยา/โรคที่กระทบการนวดหรือสมุนไพร (เช่น ยาละลายลิ่มเลือด, ความดันสูง, เบาหวาน),",
    "     ตั้งครรภ์/ให้นมบุตร, หรือผ่าตัดภายใน 6 เดือน",
    "   - ความดันที่วัดได้ >= 160/100",
    timepoint === "T2"
      ? "5) เขียน change_narrative จาก deltas ที่ให้มาเท่านั้น (ห้ามแต่งตัวเลขเอง ใช้เฉพาะตัวเลขใน deltas)\n   และเลือก next_recommendation จาก next_catalog เท่านั้น (item_id ต้องตรงกับ id ใน catalog) พร้อมเหตุผล 1 ประโยค"
      : "",
    "",
    "กฎเหล็ก:",
    '- ห้ามใช้คำวินิจฉัย ("คุณเป็นไมเกรน/ซึมเศร้า") → ใช้ "แนวโน้ม/สัญญาณ/อาการที่เล่ามา"',
    "- ตั้ง urgent = true และเขียน urgent_message แนะนำพบแพทย์ทันที (และตั้ง next_recommendation เป็น null)",
    "  เมื่อพบ: ปวดหัวรุนแรงเฉียบพลันที่สุดในชีวิต, ปวดหัวร่วมกับแขนขาอ่อนแรง/ชา/พูดไม่ชัด/ตามัว,",
    "  เจ็บแน่นหน้าอก, หรือข้อความที่สื่อถึงการทำร้ายตัวเอง (กรณีสุดท้ายให้ severity เป็น urgent และส่งต่อทีมงานมนุษย์)",
    "- q8_text ว่าง → red_flags: [], preferences: [], goals: [] แล้วทำงานข้ออื่นตามปกติ",
    "- ฟิลด์ข้อความที่ลูกค้าเห็น (summary_for_customer, urgent_message, change_narrative, reason_one_liner)",
    "  ต้องมีทั้งภาษาไทยและอังกฤษแบบ { \"th\": \"...\", \"en\": \"...\" } เขียนให้เป็นธรรมชาติทั้งสองภาษา ห้ามปนภาษาในฟิลด์เดียว",
    "- summary_for_staff เป็น array ของ string ภาษาไทยเสมอ",
    "- language_detected คือภาษาหลักของ q8_text (เช่น th, en, zh, ja) ถ้าว่างให้ใช้ th",
    "- ตอบเป็น JSON ตาม OUTPUT SCHEMA เท่านั้น ห้ามมีข้อความนอก JSON",
    "",
    "OUTPUT SCHEMA:",
    JSON.stringify(
      {
        open_text_analysis: {
          language_detected: "th",
          red_flags: [
            {
              type: "medication | condition | pregnancy | recent_surgery | severe_symptom | mood_risk",
              detail: "ทานยาละลายลิ่มเลือด",
              quote: "ผมกินยา warfarin อยู่",
              severity: "review | urgent",
            },
          ],
          preferences: ["ไม่ชอบกลิ่นน้ำมันหอมระเหยแรง ๆ"],
          goals: ["อยากกลับไปนอนหลับได้ดีขึ้น"],
          sentiment: "neutral | positive | negative | mixed",
          testimonial_candidate: false,
        },
        expert_review_required: true,
        urgent: false,
        urgent_message: null,
        summary_for_customer: { th: "...", en: "..." },
        summary_for_staff: ["ระวังกลิ่นแรง", "มียาละลายลิ่มเลือด — รอรีวิวก่อนนวดแรง"],
        ...(timepoint === "T2"
          ? {
              t2_extras: {
                change_narrative: { th: "...", en: "..." },
                highlight_dial: `one of: ${DIAL_KEYS.join(" | ")}`,
                next_recommendation: {
                  item_id: "id จาก next_catalog เท่านั้น",
                  reason_one_liner: { th: "...", en: "..." },
                },
              },
            }
          : {}),
      },
      null,
      1,
    ),
  ]
    .filter(Boolean)
    .join("\n");
}

/** Compact catalog the model may pick a next step from (T2). */
function nextCatalogForLlm(): unknown {
  return PACKAGES.map((p) => ({
    item_id: p.id,
    tier: p.tier,
    name: p.name.en,
    tagline: p.tagline.en,
    goals: p.goals,
  }));
}

function buildUserPrompt(ctx: CheckinContext, pkg?: WellnessPackage): string {
  const dialScores: Record<string, { value: number; band: string }> = {};
  for (const key of DIAL_KEYS) {
    dialScores[key] = { value: ctx.dials[key].value, band: ctx.dials[key].band };
  }

  const input = {
    timepoint: ctx.timepoint,
    instrument_note:
      ctx.timepoint === "T2"
        ? "Q3 (headache) uses a different timeframe at T1 (last 7 days) vs T2 (during the program) — treat its delta as a trend indicator, not a strict measurement."
        : undefined,
    archetype: ctx.archetypeName
      ? `${ctx.archetypeName.th} (${ctx.archetypeName.en})`
      : null,
    dial_scores: dialScores,
    deltas:
      ctx.timepoint === "T2" && ctx.deltas
        ? ctx.deltas.map((d) => ({
            dial: d.dial,
            before: d.before,
            after: d.after,
            delta: d.delta,
            trend: d.trend,
          }))
        : undefined,
    q8_text: ctx.q8 ?? "",
    objective: ctx.objective ?? null,
    program: pkg
      ? {
          name: pkg.name.en,
          tier: pkg.tier,
          days: pkg.days,
          nights: pkg.nights,
        }
      : null,
    next_catalog: ctx.timepoint === "T2" ? nextCatalogForLlm() : undefined,
  };

  return `INPUT (JSON):\n${JSON.stringify(input, null, 1)}`;
}

/** Single LLM call — caller handles fallback on any throw. */
export async function runCheckinLlm(
  ctx: CheckinContext,
  pkg?: WellnessPackage,
): Promise<LlmCheckinResult> {
  return generateJson<LlmCheckinResult>({
    system: buildSystemPrompt(ctx.timepoint),
    user: buildUserPrompt(ctx, pkg),
    temperature: 0.3,
  });
}
