"use client";

import type { GoalId, WellnessProfile } from "@/lib/types";

/* ============================================================
 * Client-side session memory (localStorage).
 *
 * Keeps the guest's journey alive across pages without an
 * account: their assessment result, chosen goals, favourites,
 * consult-flagged packages and booking references.
 * ============================================================ */

const KEYS = {
  profile: "gc-profile",
  goals: "gc-goals",
  consults: "gc-consults",
  bookings: "gc-booking-refs",
  familyIds: "gc-family-ids",
  customer: "gc-customer",
  checkins: "gc-checkin-refs",
};

function read<T>(key: string): T | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

function write(key: string, value: unknown): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
    window.dispatchEvent(new Event("gc-session-change"));
  } catch {
    /* storage full / private mode — ignore */
  }
}

/* ---------------- Profile ---------------- */

export function getStoredProfile(): WellnessProfile | null {
  return read<WellnessProfile>(KEYS.profile);
}

export function storeProfile(profile: WellnessProfile): void {
  write(KEYS.profile, profile);
}

/* ---------------- Goals ---------------- */

export function getStoredGoals(): GoalId[] {
  return read<GoalId[]>(KEYS.goals) ?? [];
}

export function storeGoals(goals: GoalId[]): void {
  write(KEYS.goals, goals);
}

/* ---------------- Consult-before-booking flags ---------------- */

export function getConsultFlags(): string[] {
  return read<string[]>(KEYS.consults) ?? [];
}

export function toggleConsultFlag(packageId: string): string[] {
  const current = getConsultFlags();
  const next = current.includes(packageId)
    ? current.filter((id) => id !== packageId)
    : [...current, packageId];
  write(KEYS.consults, next);
  return next;
}

export function hasConsultFlag(packageId: string): boolean {
  return getConsultFlags().includes(packageId);
}

/* ---------------- Family member assessment ids ---------------- */

export function getFamilyIds(): string[] {
  return read<string[]>(KEYS.familyIds) ?? [];
}

export function storeFamilyIds(ids: string[]): void {
  write(KEYS.familyIds, ids);
}

/* ---------------- Booking references ---------------- */

export interface BookingRef {
  bookingId: string;
  packageId: string;
  email: string;
  createdAt: string;
}

export function getBookingRefs(): BookingRef[] {
  return read<BookingRef[]>(KEYS.bookings) ?? [];
}

export function addBookingRef(ref: BookingRef): void {
  write(KEYS.bookings, [ref, ...getBookingRefs()]);
}

/* ---------------- Check-in references (T1/T2) ---------------- */

export interface CheckinRef {
  checkinId: string;
  bookingId: string;
  timepoint: "T1" | "T2";
  createdAt: string;
}

export function getCheckinRefs(): CheckinRef[] {
  return read<CheckinRef[]>(KEYS.checkins) ?? [];
}

export function addCheckinRef(ref: CheckinRef): void {
  const rest = getCheckinRefs().filter((r) => r.checkinId !== ref.checkinId);
  write(KEYS.checkins, [ref, ...rest]);
}

/* ---------------- Remembered customer info ---------------- */

export interface StoredCustomer {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
}

export function getStoredCustomer(): StoredCustomer | null {
  return read<StoredCustomer>(KEYS.customer);
}

export function storeCustomer(customer: StoredCustomer): void {
  write(KEYS.customer, customer);
}
