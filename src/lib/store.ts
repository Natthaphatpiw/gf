import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type {
  AssessmentInput,
  Booking,
  WellnessCheckin,
  WellnessProfile,
} from "@/lib/types";
import { hashPassword, verifyPassword } from "@/lib/auth";
import type {
  Consultation,
  ConsultStatus,
  ConsultType,
  ChatMessage,
  ChatThreadView,
  ProposalView,
  ProposalSlotKind,
} from "@/lib/consultation";
import type { LText } from "@/lib/types";

/* ---------------- Account / cart / favourites types ---------------- */

export type ItemType = "program" | "service" | "menu" | "package";

export interface Account {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

export interface RegisterInput {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  password: string;
}

export interface FavItem {
  itemType: ItemType;
  itemId: string;
}

export interface CartLine {
  itemType: ItemType;
  itemId: string;
  quantity: number;
}

interface CustomerRecord extends Account {
  passwordHash: string;
}

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
  checkins: Map<string, WellnessCheckin>;
  customers: Map<string, CustomerRecord>;
  /** customerId -> set of "itemType:itemId" */
  favorites: Map<string, Set<string>>;
  /** customerId -> Map<"itemType:itemId", quantity> */
  cart: Map<string, Map<string, number>>;
  /** customerId -> assessment-type history (newest first) */
  userAssessments: Map<
    string,
    { assessmentId?: string; archetypeCode: string; archetypeName: string; createdAt: string }[]
  >;
  consultations: Map<string, Consultation>;
  /** consultationId -> chat thread + messages */
  chatThreads: Map<string, { id: string; status: "open" | "ended"; messages: ChatMessage[] }>;
  /** consultationId -> expert proposals (newest first) */
  proposals: Map<string, ProposalView[]>;
};

// Survives hot reloads in dev by hanging off globalThis.
const g = globalThis as unknown as { __gcMemoryDb?: MemoryDb };
const memory: MemoryDb = (g.__gcMemoryDb ??= {
  assessments: new Map(),
  bookings: new Map(),
  checkins: new Map(),
  customers: new Map(),
  favorites: new Map(),
  cart: new Map(),
  userAssessments: new Map(),
  consultations: new Map(),
  chatThreads: new Map(),
  proposals: new Map(),
});
// Hot-reload upgrade: older dev instances may predate newer maps.
memory.checkins ??= new Map();
memory.customers ??= new Map();
memory.favorites ??= new Map();
memory.cart ??= new Map();
memory.userAssessments ??= new Map();
memory.consultations ??= new Map();
memory.chatThreads ??= new Map();
memory.proposals ??= new Map();

const ITEM_TYPES: ItemType[] = ["program", "service", "menu", "package"];
function isItemType(v: unknown): v is ItemType {
  return typeof v === "string" && (ITEM_TYPES as string[]).includes(v);
}
function itemKey(itemType: ItemType, itemId: string) {
  return `${itemType}:${itemId}`;
}

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

/* ---------------- Check-ins (T1/T2 compass) ---------------- */

export async function saveCheckin(checkin: WellnessCheckin): Promise<void> {
  const sb = getSupabase();
  if (sb) {
    const { error } = await sb.from("checkins").insert({
      id: checkin.id,
      booking_id: checkin.bookingId,
      assessment_id: checkin.assessmentId || null,
      timepoint: checkin.timepoint,
      instrument_version: checkin.instrumentVersion,
      locale: checkin.locale,
      answers: checkin.answers,
      objective: checkin.objective ?? null,
      dials: checkin.dials,
      deltas: checkin.deltas ?? null,
      deltas_comparable: checkin.deltasComparable ?? null,
      analysis: checkin.analysis,
      t2_extras: checkin.t2 ?? null,
      consent: checkin.consent,
      consent_at: new Date().toISOString(),
      testimonial_consent: checkin.testimonialConsent ?? false,
      created_at: checkin.createdAt,
    });
    if (error) throw new Error(`Supabase insert failed: ${error.message}`);
    return;
  }
  memory.checkins.set(checkin.id, checkin);
}

export async function getCheckin(id: string): Promise<WellnessCheckin | null> {
  const normalized = id.trim().toUpperCase();
  const sb = getSupabase();
  if (sb) {
    const { data, error } = await sb
      .from("checkins")
      .select("*")
      .eq("id", normalized)
      .maybeSingle();
    if (error) throw new Error(`Supabase query failed: ${error.message}`);
    return data ? rowToCheckin(data) : null;
  }
  return memory.checkins.get(normalized) ?? null;
}

/** All check-ins for one booking, oldest first (T1 before T2). */
export async function getCheckinsByBooking(
  bookingId: string,
): Promise<WellnessCheckin[]> {
  const sb = getSupabase();
  if (sb) {
    const { data, error } = await sb
      .from("checkins")
      .select("*")
      .eq("booking_id", bookingId)
      .order("created_at", { ascending: true });
    if (error) throw new Error(`Supabase query failed: ${error.message}`);
    return (data ?? []).map(rowToCheckin);
  }
  return [...memory.checkins.values()]
    .filter((c) => c.bookingId === bookingId)
    .sort((a, b) => a.createdAt.localeCompare(b.createdAt));
}

/** Record the separate testimonial-use opt-in (T2). */
export async function setCheckinTestimonialConsent(
  id: string,
  granted: boolean,
): Promise<WellnessCheckin | null> {
  const sb = getSupabase();
  if (sb) {
    const { error } = await sb
      .from("checkins")
      .update({ testimonial_consent: granted })
      .eq("id", id);
    if (error) throw new Error(`Supabase update failed: ${error.message}`);
    return getCheckin(id);
  }
  const existing = memory.checkins.get(id.trim().toUpperCase());
  if (!existing) return null;
  existing.testimonialConsent = granted;
  memory.checkins.set(existing.id, existing);
  return existing;
}

/* ---------------- Accounts (customers + password) ---------------- */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function toAccount(r: any): Account {
  return {
    id: r.id,
    firstName: r.first_name,
    lastName: r.last_name,
    email: r.email,
    phone: r.phone,
  };
}

export async function registerCustomer(input: RegisterInput): Promise<Account> {
  const email = input.email.trim().toLowerCase();
  const passwordHash = hashPassword(input.password);
  const sb = getSupabase();
  if (sb) {
    const { data: existing } = await sb
      .from("customers")
      .select("id")
      .ilike("email", email)
      .maybeSingle();
    if (existing) throw new Error("email_taken");
    const { data, error } = await sb
      .from("customers")
      .insert({
        first_name: input.firstName,
        last_name: input.lastName,
        phone: input.phone,
        email,
        password_hash: passwordHash,
        consent: true,
        consent_at: new Date().toISOString(),
      })
      .select("id, first_name, last_name, email, phone")
      .single();
    if (error) {
      // unique_violation on customers_email_idx — lost the check-then-insert race
      if ((error as { code?: string }).code === "23505") throw new Error("email_taken");
      throw new Error(`Supabase insert failed: ${error.message}`);
    }
    return toAccount(data);
  }
  for (const c of memory.customers.values()) {
    if (c.email.toLowerCase() === email) throw new Error("email_taken");
  }
  const id = newCustomerId();
  memory.customers.set(id, {
    id,
    firstName: input.firstName,
    lastName: input.lastName,
    email,
    phone: input.phone,
    passwordHash,
  });
  return { id, firstName: input.firstName, lastName: input.lastName, email, phone: input.phone };
}

export async function loginCustomer(
  email: string,
  password: string,
): Promise<Account | null> {
  const normalized = email.trim().toLowerCase();
  const sb = getSupabase();
  if (sb) {
    const { data, error } = await sb
      .from("customers")
      .select("id, first_name, last_name, email, phone, password_hash")
      .ilike("email", normalized)
      .maybeSingle();
    if (error) throw new Error(`Supabase query failed: ${error.message}`);
    const hash = (data as { password_hash?: string } | null)?.password_hash;
    if (!data || !hash || !verifyPassword(password, hash)) return null;
    return toAccount(data);
  }
  for (const c of memory.customers.values()) {
    if (c.email.toLowerCase() === normalized) {
      return verifyPassword(password, c.passwordHash)
        ? { id: c.id, firstName: c.firstName, lastName: c.lastName, email: c.email, phone: c.phone }
        : null;
    }
  }
  return null;
}

export async function getCustomerById(id: string): Promise<Account | null> {
  const sb = getSupabase();
  if (sb) {
    const { data, error } = await sb
      .from("customers")
      .select("id, first_name, last_name, email, phone")
      .eq("id", id)
      .maybeSingle();
    if (error) throw new Error(`Supabase query failed: ${error.message}`);
    return data ? toAccount(data) : null;
  }
  const c = memory.customers.get(id);
  return c ? { id: c.id, firstName: c.firstName, lastName: c.lastName, email: c.email, phone: c.phone } : null;
}

/* ---------------- Favourites ---------------- */

export async function getFavorites(customerId: string): Promise<FavItem[]> {
  const sb = getSupabase();
  if (sb) {
    const { data, error } = await sb
      .from("favorites")
      .select("item_type, item_id")
      .eq("customer_id", customerId)
      .order("created_at", { ascending: false });
    if (error) throw new Error(`Supabase query failed: ${error.message}`);
    const rows = (data ?? []) as { item_type: ItemType; item_id: string }[];
    return rows.map((r) => ({ itemType: r.item_type, itemId: r.item_id }));
  }
  const set = memory.favorites.get(customerId);
  if (!set) return [];
  return [...set].map((k) => {
    const sep = k.indexOf(":");
    return { itemType: k.slice(0, sep) as ItemType, itemId: k.slice(sep + 1) };
  });
}

export async function addFavorite(
  customerId: string,
  itemType: ItemType,
  itemId: string,
): Promise<void> {
  if (!isItemType(itemType)) throw new Error("bad_item_type");
  const sb = getSupabase();
  if (sb) {
    const { error } = await sb
      .from("favorites")
      .upsert(
        { customer_id: customerId, item_type: itemType, item_id: itemId },
        { onConflict: "customer_id,item_type,item_id", ignoreDuplicates: true },
      );
    if (error) throw new Error(`Supabase insert failed: ${error.message}`);
    return;
  }
  const set = memory.favorites.get(customerId) ?? new Set<string>();
  set.add(itemKey(itemType, itemId));
  memory.favorites.set(customerId, set);
}

export async function removeFavorite(
  customerId: string,
  itemType: ItemType,
  itemId: string,
): Promise<void> {
  const sb = getSupabase();
  if (sb) {
    const { error } = await sb
      .from("favorites")
      .delete()
      .match({ customer_id: customerId, item_type: itemType, item_id: itemId });
    if (error) throw new Error(`Supabase delete failed: ${error.message}`);
    return;
  }
  memory.favorites.get(customerId)?.delete(itemKey(itemType, itemId));
}

/* ---------------- Cart ---------------- */

export async function getCart(customerId: string): Promise<CartLine[]> {
  const sb = getSupabase();
  if (sb) {
    const { data, error } = await sb
      .from("cart_items")
      .select("item_type, item_id, quantity")
      .eq("customer_id", customerId)
      .order("created_at", { ascending: false });
    if (error) throw new Error(`Supabase query failed: ${error.message}`);
    const rows = (data ?? []) as { item_type: ItemType; item_id: string; quantity: number }[];
    return rows.map((r) => ({ itemType: r.item_type, itemId: r.item_id, quantity: r.quantity }));
  }
  const map = memory.cart.get(customerId);
  if (!map) return [];
  return [...map.entries()].map(([k, quantity]) => {
    const sep = k.indexOf(":");
    return { itemType: k.slice(0, sep) as ItemType, itemId: k.slice(sep + 1), quantity };
  });
}

export async function addCartItem(
  customerId: string,
  itemType: ItemType,
  itemId: string,
  quantity = 1,
): Promise<void> {
  if (!isItemType(itemType)) throw new Error("bad_item_type");
  const qty = Math.max(1, Math.min(99, Math.round(quantity)));
  const sb = getSupabase();
  if (sb) {
    const { error } = await sb
      .from("cart_items")
      .upsert(
        { customer_id: customerId, item_type: itemType, item_id: itemId, quantity: qty },
        { onConflict: "customer_id,item_type,item_id" },
      );
    if (error) throw new Error(`Supabase upsert failed: ${error.message}`);
    return;
  }
  const map = memory.cart.get(customerId) ?? new Map<string, number>();
  map.set(itemKey(itemType, itemId), qty);
  memory.cart.set(customerId, map);
}

export async function removeCartItem(
  customerId: string,
  itemType: ItemType,
  itemId: string,
): Promise<void> {
  const sb = getSupabase();
  if (sb) {
    const { error } = await sb
      .from("cart_items")
      .delete()
      .match({ customer_id: customerId, item_type: itemType, item_id: itemId });
    if (error) throw new Error(`Supabase delete failed: ${error.message}`);
    return;
  }
  memory.cart.get(customerId)?.delete(itemKey(itemType, itemId));
}

/* ---------------- Assessment-type history ---------------- */

export async function recordUserAssessment(
  customerId: string,
  entry: { assessmentId?: string; archetypeCode: string; archetypeName: string },
): Promise<void> {
  const sb = getSupabase();
  if (sb) {
    const { error } = await sb.from("user_assessments").insert({
      customer_id: customerId,
      assessment_id: entry.assessmentId ?? null,
      archetype_code: entry.archetypeCode,
      archetype_name: entry.archetypeName,
    });
    if (error) throw new Error(`Supabase insert failed: ${error.message}`);
    return;
  }
  const list = memory.userAssessments.get(customerId) ?? [];
  list.unshift({ ...entry, createdAt: new Date().toISOString() });
  memory.userAssessments.set(customerId, list);
}

/* ---------------- Consultations (expert orders) ---------------- */

export interface CreateConsultationInput {
  customerId: string;
  itemType: ItemType;
  itemId: string;
  itemName: LText;
  itemImage?: string;
  expertId: string;
  consultType: ConsultType;
  note?: string;
  assessmentId?: string;
  depositAmount: number;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function rowToConsultation(row: any, history: any[]): Consultation {
  return {
    id: row.id,
    customerId: row.customer_id,
    itemType: row.item_type,
    itemId: row.item_id,
    itemName: { th: row.item_name_th, en: row.item_name_en },
    itemImage: row.item_image ?? undefined,
    expertId: row.expert_id,
    consultType: row.consult_type,
    note: row.note ?? undefined,
    assessmentId: row.assessment_id ?? undefined,
    status: row.status,
    depositAmount: row.deposit_amount,
    chosenPlan: row.chosen_plan ?? undefined,
    statusHistory: (history ?? []).map((h) => ({
      status: h.status,
      actorRole: h.actor_role,
      note: h.note ?? undefined,
      at: h.at,
    })),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function createConsultation(
  input: CreateConsultationInput,
): Promise<Consultation> {
  const now = new Date().toISOString();
  const id = newConsultationId();
  const sb = getSupabase();
  if (sb) {
    const { error } = await sb.from("consultations").insert({
      id,
      customer_id: input.customerId,
      item_type: input.itemType,
      item_id: input.itemId,
      item_name_th: input.itemName.th,
      item_name_en: input.itemName.en,
      item_image: input.itemImage ?? null,
      expert_id: input.expertId,
      consult_type: input.consultType,
      note: input.note ?? null,
      assessment_id: input.assessmentId ?? null,
      status: "awaiting_deposit",
      deposit_amount: input.depositAmount,
      created_at: now,
      updated_at: now,
    });
    if (error) throw new Error(`Supabase insert failed: ${error.message}`);
    await sb
      .from("consultation_status_history")
      .insert({ consultation_id: id, status: "awaiting_deposit", actor_role: "customer", at: now })
      .then(() => {}, () => {});
    const c = await getConsultation(id);
    if (!c) throw new Error("created consultation not found");
    return c;
  }
  const c: Consultation = {
    id,
    customerId: input.customerId,
    itemType: input.itemType,
    itemId: input.itemId,
    itemName: input.itemName,
    itemImage: input.itemImage,
    expertId: input.expertId,
    consultType: input.consultType,
    note: input.note,
    assessmentId: input.assessmentId,
    status: "awaiting_deposit",
    depositAmount: input.depositAmount,
    statusHistory: [{ status: "awaiting_deposit", actorRole: "customer", at: now }],
    createdAt: now,
    updatedAt: now,
  };
  memory.consultations.set(id, c);
  return c;
}

export async function getConsultation(id: string): Promise<Consultation | null> {
  const normalized = id.trim().toUpperCase();
  const sb = getSupabase();
  if (sb) {
    const { data, error } = await sb
      .from("consultations")
      .select("*")
      .eq("id", normalized)
      .maybeSingle();
    if (error) throw new Error(`Supabase query failed: ${error.message}`);
    if (!data) return null;
    const { data: hist } = await sb
      .from("consultation_status_history")
      .select("*")
      .eq("consultation_id", normalized)
      .order("at", { ascending: true });
    return rowToConsultation(data, hist ?? []);
  }
  return memory.consultations.get(normalized) ?? null;
}

export async function getConsultationsByCustomer(
  customerId: string,
): Promise<Consultation[]> {
  const sb = getSupabase();
  if (sb) {
    const { data, error } = await sb
      .from("consultations")
      .select("*")
      .eq("customer_id", customerId)
      .order("created_at", { ascending: false });
    if (error) throw new Error(`Supabase query failed: ${error.message}`);
    return (data ?? []).map((row) => rowToConsultation(row, []));
  }
  return [...memory.consultations.values()]
    .filter((c) => c.customerId === customerId)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function addConsultationStatus(
  id: string,
  status: ConsultStatus,
  actorRole: "customer" | "expert" | "system" | "partner",
  note?: string,
): Promise<Consultation | null> {
  const now = new Date().toISOString();
  const normalized = id.trim().toUpperCase();
  const sb = getSupabase();
  if (sb) {
    const { error } = await sb
      .from("consultations")
      .update({ status, updated_at: now })
      .eq("id", normalized);
    if (error) throw new Error(`Supabase update failed: ${error.message}`);
    await sb
      .from("consultation_status_history")
      .insert({ consultation_id: normalized, status, actor_role: actorRole, note: note ?? null, at: now })
      .then(() => {}, () => {});
    return getConsultation(normalized);
  }
  const c = memory.consultations.get(normalized);
  if (!c) return null;
  c.status = status;
  c.updatedAt = now;
  c.statusHistory = [...c.statusHistory, { status, actorRole, note, at: now }];
  memory.consultations.set(c.id, c);
  return c;
}

/** Record a (mock) deposit payment — Supabase only; no-op in demo. */
export async function saveConsultationDeposit(
  consultationId: string,
  amount: number,
  slipUrl: string | null,
): Promise<void> {
  const now = new Date().toISOString();
  const sb = getSupabase();
  if (!sb) return;
  await sb
    .from("payments")
    .insert({
      consultation_id: consultationId,
      kind: "deposit",
      amount,
      status: "submitted",
      slip_url: slipUrl,
      submitted_at: now,
    })
    .then(() => {}, () => {});
}

/** Append to the catch-all audit log — Supabase only; no-op in demo. */
export async function logConsultationActivity(
  consultationId: string,
  actorRole: "customer" | "expert" | "system" | "partner",
  action: string,
  detail?: unknown,
): Promise<void> {
  const sb = getSupabase();
  if (!sb) return;
  await sb
    .from("activity_log")
    .insert({ consultation_id: consultationId, actor_role: actorRole, action, detail: detail ?? null })
    .then(() => {}, () => {});
}

/** Persist an outbound LINE push to the audit log — Supabase only. */
export async function logLinePush(
  consultationId: string | null,
  target: string,
  messageType: string,
  payload: unknown,
  ok: boolean,
  response: unknown,
): Promise<void> {
  const sb = getSupabase();
  if (!sb) return;
  await sb
    .from("line_push_log")
    .insert({
      consultation_id: consultationId,
      target,
      message_type: messageType,
      payload: payload ?? null,
      status: ok ? "sent" : "failed",
      response: response ?? null,
    })
    .then(() => {}, () => {});
}

/* ---------------- Chat threads (customer <-> expert) ---------------- */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function rowToChatMessage(row: any): ChatMessage {
  return {
    id: row.id,
    senderRole: row.sender_role,
    senderId: row.sender_id ?? undefined,
    body: row.body,
    createdAt: row.created_at,
  };
}

export async function getChatThread(
  consultationId: string,
): Promise<ChatThreadView | null> {
  const cid = consultationId.trim().toUpperCase();
  const sb = getSupabase();
  if (sb) {
    const { data: thread, error } = await sb
      .from("chat_threads")
      .select("*")
      .eq("consultation_id", cid)
      .maybeSingle();
    if (error) throw new Error(`Supabase query failed: ${error.message}`);
    if (!thread) return null;
    const { data: msgs } = await sb
      .from("chat_messages")
      .select("*")
      .eq("thread_id", thread.id)
      .order("created_at", { ascending: true });
    return {
      id: thread.id,
      status: thread.status,
      messages: (msgs ?? []).map(rowToChatMessage),
    };
  }
  const t = memory.chatThreads.get(cid);
  if (!t) return null;
  return { id: t.id, status: t.status, messages: [...t.messages] };
}

/** Create the chat thread + seed the customer's opening message. Idempotent. */
export async function seedChatThread(
  consultationId: string,
  expertId: string,
  firstMessage: string,
  customerId?: string,
): Promise<ChatThreadView | null> {
  const cid = consultationId.trim().toUpperCase();
  const existing = await getChatThread(cid);
  if (existing) return existing;
  const now = new Date().toISOString();
  const body = firstMessage.trim();
  const sb = getSupabase();
  if (sb) {
    const { data: thread, error } = await sb
      .from("chat_threads")
      .insert({ consultation_id: cid, expert_id: expertId, status: "open", created_at: now })
      .select("*")
      .single();
    if (error) {
      // a concurrent insert may have won the unique race — return whatever exists
      return getChatThread(cid);
    }
    if (body) {
      await sb
        .from("chat_messages")
        .insert({ thread_id: thread.id, sender_role: "customer", sender_id: customerId ?? null, body, created_at: now })
        .then(() => {}, () => {});
    }
    return getChatThread(cid);
  }
  const messages: ChatMessage[] = body
    ? [{ id: randId(), senderRole: "customer", senderId: customerId, body, createdAt: now }]
    : [];
  const t = { id: randId(), status: "open" as const, messages };
  memory.chatThreads.set(cid, t);
  return { id: t.id, status: t.status, messages: [...t.messages] };
}

/** Append a message. Returns null if there is no open thread. */
export async function addChatMessage(
  consultationId: string,
  senderRole: "customer" | "expert" | "system",
  body: string,
  senderId?: string,
): Promise<ChatMessage | null> {
  const cid = consultationId.trim().toUpperCase();
  const text = body.trim();
  if (!text) return null;
  const now = new Date().toISOString();
  const sb = getSupabase();
  if (sb) {
    const { data: thread } = await sb
      .from("chat_threads")
      .select("id,status")
      .eq("consultation_id", cid)
      .maybeSingle();
    if (!thread || thread.status !== "open") return null;
    const { data, error } = await sb
      .from("chat_messages")
      .insert({ thread_id: thread.id, sender_role: senderRole, sender_id: senderId ?? null, body: text, created_at: now })
      .select("*")
      .single();
    if (error) throw new Error(`Supabase insert failed: ${error.message}`);
    return rowToChatMessage(data);
  }
  const t = memory.chatThreads.get(cid);
  if (!t || t.status !== "open") return null;
  const msg: ChatMessage = { id: randId(), senderRole, senderId, body: text, createdAt: now };
  t.messages.push(msg);
  memory.chatThreads.set(cid, t);
  return msg;
}

/** Close the thread. Returns the thread view, or null if none exists. */
export async function endChatThread(
  consultationId: string,
  endedBy: "customer" | "expert",
): Promise<ChatThreadView | null> {
  const cid = consultationId.trim().toUpperCase();
  const now = new Date().toISOString();
  const sb = getSupabase();
  if (sb) {
    const { data: thread } = await sb
      .from("chat_threads")
      .select("id")
      .eq("consultation_id", cid)
      .maybeSingle();
    if (!thread) return null;
    await sb
      .from("chat_threads")
      .update({ status: "ended", ended_at: now, ended_by: endedBy })
      .eq("id", thread.id)
      .then(() => {}, () => {});
    return getChatThread(cid);
  }
  const t = memory.chatThreads.get(cid);
  if (!t) return null;
  t.status = "ended";
  memory.chatThreads.set(cid, t);
  return { id: t.id, status: t.status, messages: [...t.messages] };
}

/* ---------------- Expert proposals (managed plan) ---------------- */

export interface SaveProposalInput {
  consultationId: string;
  expertId: string;
  note?: string;
  slots: {
    itemType: ProposalSlotKind;
    itemId?: string;
    label: LText;
    fromOriginal: boolean;
  }[];
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function rowToProposal(row: any, slots: any[]): ProposalView {
  return {
    id: row.id,
    note: row.note ?? undefined,
    status: row.status,
    slots: (slots ?? [])
      .map((s) => ({
        position: s.position,
        itemType: s.item_type as ProposalSlotKind,
        itemId: s.item_id ?? undefined,
        label: { th: s.label_th, en: s.label_en },
        fromOriginal: s.from_original,
      }))
      .sort((a, b) => a.position - b.position),
    createdAt: row.created_at,
  };
}

/** Save (and "send") an adjusted plan; supersedes any earlier proposals. */
export async function saveProposal(input: SaveProposalInput): Promise<ProposalView> {
  const cid = input.consultationId.trim().toUpperCase();
  const now = new Date().toISOString();
  const sb = getSupabase();
  if (sb) {
    // supersede any still-pending proposals
    await sb
      .from("expert_proposals")
      .update({ status: "superseded" })
      .eq("consultation_id", cid)
      .in("status", ["draft", "sent"])
      .then(() => {}, () => {});
    const { data: proposal, error } = await sb
      .from("expert_proposals")
      .insert({ consultation_id: cid, expert_id: input.expertId, note: input.note ?? null, status: "sent", created_at: now, sent_at: now })
      .select("*")
      .single();
    if (error) throw new Error(`Supabase insert failed: ${error.message}`);
    const slotRows = input.slots.map((s, i) => ({
      proposal_id: proposal.id,
      position: i,
      item_type: s.itemType,
      item_id: s.itemId ?? null,
      label_th: s.label.th,
      label_en: s.label.en,
      from_original: s.fromOriginal,
    }));
    if (slotRows.length) {
      await sb.from("proposal_slots").insert(slotRows).then(() => {}, () => {});
    }
    const { data: slots } = await sb
      .from("proposal_slots")
      .select("*")
      .eq("proposal_id", proposal.id)
      .order("position", { ascending: true });
    return rowToProposal(proposal, slots ?? []);
  }
  const view: ProposalView = {
    id: randId(),
    note: input.note,
    status: "sent",
    slots: input.slots.map((s, i) => ({
      position: i,
      itemType: s.itemType,
      itemId: s.itemId,
      label: s.label,
      fromOriginal: s.fromOriginal,
    })),
    createdAt: now,
  };
  const list = (memory.proposals.get(cid) ?? []).map((p) =>
    p.status === "draft" || p.status === "sent" ? { ...p, status: "superseded" as const } : p,
  );
  list.unshift(view);
  memory.proposals.set(cid, list);
  return view;
}

export async function getLatestProposal(
  consultationId: string,
): Promise<ProposalView | null> {
  const cid = consultationId.trim().toUpperCase();
  const sb = getSupabase();
  if (sb) {
    const { data: proposal } = await sb
      .from("expert_proposals")
      .select("*")
      .eq("consultation_id", cid)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    if (!proposal) return null;
    const { data: slots } = await sb
      .from("proposal_slots")
      .select("*")
      .eq("proposal_id", proposal.id)
      .order("position", { ascending: true });
    return rowToProposal(proposal, slots ?? []);
  }
  return memory.proposals.get(cid)?.[0] ?? null;
}

/**
 * Customer's decision on the latest proposal. `adjusted` keeps the expert's
 * plan, `original` keeps the program as-is. Either way the order advances to
 * coordinating_partner.
 */
export async function decideProposal(
  consultationId: string,
  proposalId: string,
  choice: "original" | "adjusted",
): Promise<Consultation | null> {
  const cid = consultationId.trim().toUpperCase();
  const now = new Date().toISOString();
  const sb = getSupabase();
  if (sb) {
    await sb
      .from("expert_proposals")
      .update({ status: choice === "adjusted" ? "accepted" : "rejected", decided_at: now })
      .eq("id", proposalId)
      .then(() => {}, () => {});
    await sb
      .from("consultations")
      .update({
        chosen_plan: choice,
        accepted_proposal_id: choice === "adjusted" ? proposalId : null,
        updated_at: now,
      })
      .eq("id", cid)
      .then(() => {}, () => {});
    return addConsultationStatus(cid, "coordinating_partner", "customer", `plan:${choice}`);
  }
  const list = memory.proposals.get(cid);
  if (list) {
    memory.proposals.set(
      cid,
      list.map((p) =>
        p.id === proposalId
          ? { ...p, status: choice === "adjusted" ? ("accepted" as const) : ("rejected" as const) }
          : p,
      ),
    );
  }
  const c = memory.consultations.get(cid);
  if (c) c.chosenPlan = choice;
  return addConsultationStatus(cid, "coordinating_partner", "customer", `plan:${choice}`);
}

/* ---------------- LINE identity links + inbound audit ---------------- */

export interface LineLink {
  lineUserId: string;
  role: "expert" | "customer";
  expertId?: string;
  customerId?: string;
  displayName?: string;
}

/** Upsert the LINE-user <-> role mapping. Supabase only (no-op in demo). */
export async function upsertLineLink(
  lineUserId: string,
  role: "expert" | "customer",
  opts: { expertId?: string; customerId?: string; displayName?: string } = {},
): Promise<void> {
  const sb = getSupabase();
  if (!sb) return;
  await sb
    .from("line_links")
    .upsert(
      {
        line_user_id: lineUserId,
        role,
        expert_id: opts.expertId ?? null,
        customer_id: opts.customerId ?? null,
        display_name: opts.displayName ?? null,
      },
      { onConflict: "line_user_id" },
    )
    .then(() => {}, () => {});
}

export async function getLineLink(lineUserId: string): Promise<LineLink | null> {
  const sb = getSupabase();
  if (!sb) return null;
  const { data } = await sb
    .from("line_links")
    .select("*")
    .eq("line_user_id", lineUserId)
    .maybeSingle();
  if (!data) return null;
  return {
    lineUserId: data.line_user_id,
    role: data.role,
    expertId: data.expert_id ?? undefined,
    customerId: data.customer_id ?? undefined,
    displayName: data.display_name ?? undefined,
  };
}

/** Persist an inbound webhook event for audit. Supabase only. */
export async function logLineWebhookEvent(
  eventType: string | null,
  lineUserId: string | null,
  consultationId: string | null,
  raw: unknown,
): Promise<void> {
  const sb = getSupabase();
  if (!sb) return;
  await sb
    .from("line_webhook_events")
    .insert({
      event_type: eventType,
      line_user_id: lineUserId,
      consultation_id: consultationId,
      raw: raw ?? {},
    })
    .then(() => {}, () => {});
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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function rowToCheckin(row: any): WellnessCheckin {
  return {
    id: row.id,
    bookingId: row.booking_id,
    assessmentId: row.assessment_id ?? undefined,
    timepoint: row.timepoint,
    instrumentVersion: row.instrument_version,
    locale: row.locale,
    answers: row.answers,
    objective: row.objective ?? undefined,
    dials: row.dials,
    deltas: row.deltas ?? undefined,
    deltasComparable: row.deltas_comparable ?? undefined,
    analysis: row.analysis,
    t2: row.t2_extras ?? undefined,
    consent: row.consent,
    testimonialConsent: row.testimonial_consent ?? undefined,
    createdAt: row.created_at,
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

/** Check-in id, e.g. "CI-4M8TRC". */
export function newCheckinId(): string {
  let suffix = "";
  for (let i = 0; i < 6; i++) {
    suffix += ID_ALPHABET[Math.floor(Math.random() * ID_ALPHABET.length)];
  }
  return `CI-${suffix}`;
}

/** Consultation id, e.g. "CS-4M8TRC". */
function newConsultationId(): string {
  let suffix = "";
  for (let i = 0; i < 6; i++) {
    suffix += ID_ALPHABET[Math.floor(Math.random() * ID_ALPHABET.length)];
  }
  return `CS-${suffix}`;
}

/** In-memory customer id (demo mode); Supabase uses a uuid default. */
function newCustomerId(): string {
  let suffix = "";
  for (let i = 0; i < 18; i++) {
    suffix += ID_ALPHABET[Math.floor(Math.random() * ID_ALPHABET.length)];
  }
  return `CU-${suffix}`;
}

/** Opaque id for in-memory chat messages / proposals (Supabase uses uuids). */
function randId(): string {
  let s = "";
  for (let i = 0; i < 20; i++) {
    s += ID_ALPHABET[Math.floor(Math.random() * ID_ALPHABET.length)];
  }
  return s.toLowerCase();
}
