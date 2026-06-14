import { NextResponse } from "next/server";
import { SESSION_COOKIE, SESSION_COOKIE_OPTS } from "@/lib/auth";

export async function POST() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set(SESSION_COOKIE, "", { ...SESSION_COOKIE_OPTS, maxAge: 0 });
  return res;
}
