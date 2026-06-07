"use client";

import type {
  Booking,
  ExpertAdjustment,
  WellnessProfile,
} from "@/lib/types";

/* ============================================================
 * Client-side helpers for the expert console: the access code
 * lives in sessionStorage ('gc-expert-code') and rides along on
 * every expert API call as the 'x-expert-code' header.
 * ============================================================ */

export const EXPERT_CODE_KEY = "gc-expert-code";

export function getExpertCode(): string {
  if (typeof window === "undefined") return "";
  try {
    return window.sessionStorage.getItem(EXPERT_CODE_KEY) ?? "";
  } catch {
    return "";
  }
}

export function setExpertCode(code: string): void {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.setItem(EXPERT_CODE_KEY, code);
  } catch {
    /* private mode — ignore */
  }
}

export function clearExpertCode(): void {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.removeItem(EXPERT_CODE_KEY);
  } catch {
    /* ignore */
  }
}

/** Authenticated fetch against an expert API route. */
export async function expertFetch(
  input: string,
  init: RequestInit = {},
): Promise<Response> {
  const headers = new Headers(init.headers);
  headers.set("x-expert-code", getExpertCode());
  if (init.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }
  return fetch(input, { ...init, headers });
}

/* ---- joined detail payload from GET /api/expert/booking/[id] ---- */

export interface FamilyProfileJoin {
  id: string;
  label?: string;
  profile: WellnessProfile | null;
}

export interface BookingDetail {
  booking: Booking;
  package: import("@/lib/types").WellnessPackage | null;
  profile: WellnessProfile | null;
  familyProfiles: FamilyProfileJoin[];
}

/* ---- editor-side adjustment row (id for stable React keys) ---- */

export interface AdjustmentRow extends ExpertAdjustment {
  uid: string;
}

export function newAdjustmentUid(): string {
  return Math.random().toString(36).slice(2, 10);
}
