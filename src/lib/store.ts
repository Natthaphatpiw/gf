import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { AssessmentInput, Booking, WellnessProfile } from "@/lib/types";

/* ============================================================
 * Data layer.
 *
 * Primary store:  Supabase (PostgreSQL) — see supabase/schema.sql.
 * Fallback store: in-memory maps, used automatically when the
 *                 Supabase env vars are not configured, so the
 *                 whole flow is demoable without a database.
 * ============================================================ */

/* ---------------- Supabase client ---------------- */

let supabase: SupabaseClient | null | undefined;

export function getSupabase(): SupabaseClient | null {
  if (supabase !== undefined) return supabase;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  supabase = url && key ? createClient(url, key) : null;
  return supabase;
}

/* ---------------- In-memory fallback (demo mode) ---------------- */

type MemoryDb = {
  assessments: Map<
    string,
    { profile: WellnessProfile; input: AssessmentInput }
  >;
  bookings: Map<string, Booking>;
};

// Survives hot reloads in dev by hanging off globalThis.
const g = globalThis as unknown as { __gcMemoryDb?: MemoryDb };
const memory: MemoryDb = (g.__gcMemoryDb ??= {
  assessments: new Map(),
  bookings: new Map(),
});

/* ---------------- Assessments ---------------- */

export async function saveAssessment(
  profile: WellnessProfile,
  input: AssessmentInput,
): Promise<void> {
  const sb = getSupabase();
  if (sb) {
    const { error } = await sb.from("assessments").insert({
      id: profile.id,
      locale: input.locale,
      answers: input.answers,
      mbti: input.mbti || null,
      note: input.note || null,
      result: profile,
      consent: input.consent,
      consent_at: new Date().toISOString(),
    });
    if (error) throw new Error(`Supabase insert failed: ${error.message}`);
    return;
  }
  memory.assessments.set(profile.id, { profile, input });
}

export async function getAssessment(
  id: string,
): Promise<WellnessProfile | null> {
  const normalized = id.trim().toUpperCase();
  const sb = getSupabase();
  if (sb) {
    const { data, error } = await sb
      .from("assessments")
      .select("result")
      .eq("id", normalized)
      .maybeSingle();
    if (error) throw new Error(`Supabase query failed: ${error.message}`);
    return (data?.result as WellnessProfile) ?? null;
  }
  return memory.assessments.get(normalized)?.profile ?? null;
}

/* ---------------- Bookings ---------------- */

export async function saveBooking(booking: Booking): Promise<void> {
  const sb = getSupabase();
  if (sb) {
    const { error } = await sb.from("bookings").insert({
      id: booking.id,
      package_id: booking.packageId,
      first_name: booking.customer.firstName,
      last_name: booking.customer.lastName,
      phone: booking.customer.phone,
      email: booking.customer.email,
      assessment_id: booking.assessmentId || null,
      is_family: booking.isFamily,
      family_size: booking.familySize ?? null,
      family_members: booking.familyMembers ?? null,
      consult_requested: booking.consultRequested,
      status: booking.status,
      status_history: booking.statusHistory,
      expert_review: booking.expertReview ?? null,
      consent: booking.consent,
      created_at: booking.createdAt,
      updated_at: booking.updatedAt,
    });
    if (error) throw new Error(`Supabase insert failed: ${error.message}`);
    return;
  }
  memory.bookings.set(booking.id, booking);
}

export async function updateBooking(booking: Booking): Promise<void> {
  booking.updatedAt = new Date().toISOString();
  const sb = getSupabase();
  if (sb) {
    const { error } = await sb
      .from("bookings")
      .update({
        status: booking.status,
        status_history: booking.statusHistory,
        expert_review: booking.expertReview ?? null,
        updated_at: booking.updatedAt,
      })
      .eq("id", booking.id);
    if (error) throw new Error(`Supabase update failed: ${error.message}`);
    return;
  }
  memory.bookings.set(booking.id, booking);
}

export async function getBooking(id: string): Promise<Booking | null> {
  const sb = getSupabase();
  if (sb) {
    const { data, error } = await sb
      .from("bookings")
      .select("*")
      .eq("id", id)
      .maybeSingle();
    if (error) throw new Error(`Supabase query failed: ${error.message}`);
    return data ? rowToBooking(data) : null;
  }
  return memory.bookings.get(id) ?? null;
}

/** Look up bookings owned by a guest (by email — used for "my bookings"). */
export async function getBookingsByEmail(email: string): Promise<Booking[]> {
  const normalized = email.trim().toLowerCase();
  const sb = getSupabase();
  if (sb) {
    const { data, error } = await sb
      .from("bookings")
      .select("*")
      .ilike("email", normalized)
      .order("created_at", { ascending: false });
    if (error) throw new Error(`Supabase query failed: ${error.message}`);
    return (data ?? []).map(rowToBooking);
  }
  return [...memory.bookings.values()]
    .filter((b) => b.customer.email.toLowerCase() === normalized)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

/** Bookings waiting in (or already through) the expert queue. */
export async function getExpertQueue(): Promise<Booking[]> {
  const sb = getSupabase();
  if (sb) {
    const { data, error } = await sb
      .from("bookings")
      .select("*")
      .eq("consult_requested", true)
      .order("created_at", { ascending: false });
    if (error) throw new Error(`Supabase query failed: ${error.message}`);
    return (data ?? []).map(rowToBooking);
  }
  return [...memory.bookings.values()]
    .filter((b) => b.consultRequested)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

/* ---------------- Row mapping ---------------- */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function rowToBooking(row: any): Booking {
  return {
    id: row.id,
    packageId: row.package_id,
    customer: {
      firstName: row.first_name,
      lastName: row.last_name,
      phone: row.phone,
      email: row.email,
    },
    assessmentId: row.assessment_id ?? undefined,
    isFamily: row.is_family,
    familySize: row.family_size ?? undefined,
    familyMembers: row.family_members ?? undefined,
    consultRequested: row.consult_requested,
    status: row.status,
    statusHistory: row.status_history ?? [],
    expertReview: row.expert_review ?? undefined,
    consent: row.consent,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

/* ---------------- Ids ---------------- */

const ID_ALPHABET = "ABCDEFGHJKMNPQRSTUVWXYZ23456789"; // unambiguous chars

/** Public assessment id, e.g. "SW-7F3K2A". */
export function newAssessmentId(): string {
  let suffix = "";
  for (let i = 0; i < 6; i++) {
    suffix += ID_ALPHABET[Math.floor(Math.random() * ID_ALPHABET.length)];
  }
  return `SW-${suffix}`;
}

/** Booking id, e.g. "BK-9D4QXW". */
export function newBookingId(): string {
  let suffix = "";
  for (let i = 0; i < 6; i++) {
    suffix += ID_ALPHABET[Math.floor(Math.random() * ID_ALPHABET.length)];
  }
  return `BK-${suffix}`;
}
