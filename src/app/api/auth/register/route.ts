import { NextResponse } from "next/server";
import { registerCustomer } from "@/lib/store";
import { signSession, SESSION_COOKIE, SESSION_COOKIE_OPTS } from "@/lib/auth";

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "bad_request" }, { status: 400 });
  }

  const firstName = String(body.firstName ?? "").trim();
  const lastName = String(body.lastName ?? "").trim();
  const phone = String(body.phone ?? "").trim();
  const email = String(body.email ?? "").trim();
  const password = String(body.password ?? "");

  if (!firstName || !lastName || !phone || !email || !password) {
    return NextResponse.json({ error: "missing_fields" }, { status: 400 });
  }
  if (!/^\S+@\S+\.\S+$/.test(email)) {
    return NextResponse.json({ error: "bad_email" }, { status: 400 });
  }
  if (password.length < 6) {
    return NextResponse.json({ error: "weak_password" }, { status: 400 });
  }

  try {
    const user = await registerCustomer({ firstName, lastName, phone, email, password });
    const res = NextResponse.json({ user });
    res.cookies.set(SESSION_COOKIE, signSession(user.id), SESSION_COOKIE_OPTS);
    return res;
  } catch (e) {
    if (e instanceof Error && e.message === "email_taken") {
      return NextResponse.json({ error: "email_taken" }, { status: 409 });
    }
    return NextResponse.json({ error: "server_error" }, { status: 500 });
  }
}
