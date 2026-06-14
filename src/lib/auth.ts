import {
  scryptSync,
  randomBytes,
  timingSafeEqual,
  createHmac,
} from "crypto";

/* ============================================================
 * Account auth helpers — server only (Node runtime).
 * Password hashing (scrypt) + an HMAC-signed session token that
 * carries its own expiry. The signing secret comes from
 * AUTH_SECRET (add it to .env). A demo fallback keeps empty-env
 * mode working (matches the project's graceful-degradation rule).
 * ============================================================ */

const DEMO_SECRET = "goodfill-demo-secret-change-me";
let warnedMissingSecret = false;

function getAuthSecret(): string {
  const secret = process.env.AUTH_SECRET;
  if (secret) return secret;

  if (process.env.NODE_ENV === "production" && !warnedMissingSecret) {
    warnedMissingSecret = true;
    console.warn(
      "AUTH_SECRET is not set; using the demo auth secret. Set AUTH_SECRET for real deployments.",
    );
  }

  return DEMO_SECRET;
}

export const SESSION_COOKIE = "gc_session";

const MAX_AGE_SECONDS = 60 * 60 * 24 * 30; // 30 days

/** Cookie options shared by register / login / logout. */
export const SESSION_COOKIE_OPTS = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
  maxAge: MAX_AGE_SECONDS,
};

export function hashPassword(password: string): string {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

export function verifyPassword(password: string, stored: string): boolean {
  const [salt, hash] = stored.split(":");
  if (!salt || !hash) return false;
  const test = scryptSync(password, salt, 64);
  const orig = Buffer.from(hash, "hex");
  return orig.length === test.length && timingSafeEqual(orig, test);
}

/** Signed token: `${id}.${exp}.${hmac(id.exp)}` — exp is epoch ms. */
export function signSession(customerId: string): string {
  const exp = Date.now() + MAX_AGE_SECONDS * 1000;
  const payload = `${customerId}.${exp}`;
  const sig = createHmac("sha256", getAuthSecret()).update(payload).digest("hex");
  return `${payload}.${sig}`;
}

export function verifySession(token: string | undefined | null): string | null {
  if (!token) return null;
  const parts = token.split(".");
  if (parts.length !== 3) return null;
  const [id, expStr, sig] = parts;
  const payload = `${id}.${expStr}`;
  const expected = createHmac("sha256", getAuthSecret()).update(payload).digest("hex");
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  const exp = Number(expStr);
  if (!Number.isFinite(exp) || Date.now() > exp) return null;
  return id;
}
