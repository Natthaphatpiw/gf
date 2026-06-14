import { cookies } from "next/headers";
import { verifySession, SESSION_COOKIE } from "@/lib/auth";

/** Read the signed session cookie and return the customer id, or null. */
export async function getSessionCustomerId(): Promise<string | null> {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  return verifySession(token);
}
