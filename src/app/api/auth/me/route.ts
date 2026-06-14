import { NextResponse } from "next/server";
import { getCustomerById } from "@/lib/store";
import { getSessionCustomerId } from "@/lib/session-server";

export async function GET() {
  const id = await getSessionCustomerId();
  if (!id) return NextResponse.json({ user: null });
  try {
    const user = await getCustomerById(id);
    return NextResponse.json({ user });
  } catch {
    return NextResponse.json({ user: null });
  }
}
