/* ============================================================
 * Expert console access control (server-side).
 *
 * The clinician sends their access code in the 'x-expert-code'
 * header on every request. We compare it against
 * process.env.EXPERT_ACCESS_CODE, falling back to the demo code
 * 'samui-expert' when the env var is not configured so the
 * platform stays demoable without any setup.
 * ============================================================ */

const DEMO_CODE = "samui-expert";

export function expectedExpertCode(): string {
  return process.env.EXPERT_ACCESS_CODE || DEMO_CODE;
}

/** True when the request carries a valid expert access code. */
export function isAuthorizedExpert(req: Request): boolean {
  const code = req.headers.get("x-expert-code");
  return typeof code === "string" && code === expectedExpertCode();
}
