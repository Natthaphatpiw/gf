import { NextResponse } from "next/server";
import { loginCustomer } from "@/lib/store";
import { signSession, SESSION_COOKIE, SESSION_COOKIE_OPTS } from "@/lib/auth";

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "bad_request" }, { status: 400 });
  }

  const email = String(body.email ?? "").trim();
  const password = String(body.password ?? "");
  if (!email || !password) {
    return NextResponse.json({ error: "missing_fields" }, { status: 400 });
  }

  try {
    const user = await loginCustomer(email, password);
    if (!user) {
      return NextResponse.json({ error: "invalid_credentials" }, { status: 401 });
    }
    const res = NextResponse.json({ user });
    res.cookies.set(SESSION_COOKIE, signSession(user.id), SESSION_COOKIE_OPTS);
    return res;
  } catch {
    return NextResponse.json({ error: "server_error" }, { status: 500 });
  }
}
