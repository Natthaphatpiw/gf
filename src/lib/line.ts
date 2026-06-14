import { createHmac, timingSafeEqual } from "crypto";

/* ============================================================
 * LINE Messaging API + LIFF helpers — server only.
 *
 * Notifies the expert OA when a customer requests a consultation
 * (a Flex card with an "open" action that deep-links into the
 * right LIFF), verifies inbound webhook signatures, and exposes
 * the LIFF deep links. All credentials come from env — nothing
 * sensitive is hard-coded:
 *   LINE_CHANNEL_ACCESS_TOKEN   (secret, server)
 *   LINE_CHANNEL_SECRET         (secret, server — webhook verify)
 *   NEXT_PUBLIC_LIFF_MANAGED_PLAN_ID   (public)
 *   NEXT_PUBLIC_LIFF_CHAT_ID           (public)
 * ============================================================ */

const TOKEN = process.env.LINE_CHANNEL_ACCESS_TOKEN;
const SECRET = process.env.LINE_CHANNEL_SECRET;

export const LIFF_MANAGED_PLAN_ID =
  process.env.NEXT_PUBLIC_LIFF_MANAGED_PLAN_ID || "";
export const LIFF_CHAT_ID = process.env.NEXT_PUBLIC_LIFF_CHAT_ID || "";

/** True when push/webhook can actually talk to LINE (else demo no-op). */
export function hasLineConfig(): boolean {
  return Boolean(TOKEN && SECRET);
}

/** Verify the X-Line-Signature header against the raw request body. */
export function verifyLineSignature(rawBody: string, signature: string | null): boolean {
  if (!SECRET || !signature) return false;
  const expected = createHmac("sha256", SECRET).update(rawBody).digest("base64");
  const a = Buffer.from(signature);
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}

/** Open a LIFF app deep link (consultationId is read by the LIFF page). */
export function liffUrl(liffId: string, consultationId: string): string {
  return `https://liff.line.me/${liffId}?c=${encodeURIComponent(consultationId)}`;
}

export interface LineProfile {
  userId: string;
  displayName?: string;
  pictureUrl?: string;
}

/** Our LINE Login channel id — the numeric prefix of the LIFF id. */
function loginChannelId(): string {
  return (LIFF_CHAT_ID || LIFF_MANAGED_PLAN_ID).split("-")[0] || "";
}

/**
 * Verify a LIFF access token and resolve the acting LINE user.
 * The token comes from `liff.getAccessToken()` in the browser.
 *
 * Two checks:
 *  1. The token must have been issued by *our* LINE Login channel
 *     (oauth2 verify → client_id === our channel id). This rejects a
 *     valid token minted by some unrelated LINE channel.
 *  2. The token must grant a profile (→ which LINE user is acting,
 *     used to audit-link expert actions).
 * Independent of our Messaging-API channel secret/token.
 */
export async function verifyLiffToken(
  accessToken: string | null | undefined,
): Promise<LineProfile | null> {
  if (!accessToken) return null;
  try {
    const channelId = loginChannelId();
    if (channelId) {
      const vr = await fetch(
        `https://api.line.me/oauth2/v2.1/verify?access_token=${encodeURIComponent(accessToken)}`,
      );
      if (!vr.ok) return null;
      const v = await vr.json().catch(() => null);
      if (!v || v.client_id !== channelId) return null;
    }
    const res = await fetch("https://api.line.me/v2/profile", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    if (!res.ok) return null;
    const data = await res.json().catch(() => null);
    if (!data?.userId) return null;
    return {
      userId: data.userId,
      displayName: data.displayName,
      pictureUrl: data.pictureUrl,
    };
  } catch {
    return null;
  }
}

export type LiffAuth =
  | { ok: true; profile: LineProfile | null }
  | { ok: false; status: number };

/**
 * Authorize an expert LIFF API call. The LIFF page sends the LINE
 * user's access token as `Authorization: Bearer <token>`; we verify it
 * against LINE. When LINE isn't configured at all (local demo) we allow
 * tokenless calls so the flow stays testable. With LINE configured, a
 * missing/invalid token is rejected.
 */
export async function authLiffRequest(req: Request): Promise<LiffAuth> {
  const header = req.headers.get("authorization") ?? "";
  const token = /^bearer\s+/i.test(header) ? header.replace(/^bearer\s+/i, "").trim() : "";
  if (token) {
    const profile = await verifyLiffToken(token);
    if (!profile) return { ok: false, status: 401 };
    return { ok: true, profile };
  }
  if (!hasLineConfig()) return { ok: true, profile: null };
  return { ok: false, status: 401 };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type LineMessage = Record<string, any>;

interface PushResult {
  ok: boolean;
  status: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  response: any;
}

async function callLine(path: string, payload: unknown): Promise<PushResult> {
  if (!TOKEN) return { ok: false, status: 0, response: { error: "no_token" } };
  try {
    const res = await fetch(`https://api.line.me/v2/bot/${path}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${TOKEN}`,
      },
      body: JSON.stringify(payload),
    });
    const response = await res.json().catch(() => ({}));
    return { ok: res.ok, status: res.status, response };
  } catch (e) {
    return { ok: false, status: 0, response: { error: String(e) } };
  }
}

/** Push to a specific LINE user (the expert), if we know their id. */
export function linePush(to: string, messages: LineMessage[]): Promise<PushResult> {
  return callLine("message/push", { to, messages });
}

/** Look up a follower's display name via the OA (channel token). */
export async function getLineUserProfile(userId: string): Promise<LineProfile | null> {
  if (!TOKEN) return null;
  try {
    const res = await fetch(`https://api.line.me/v2/bot/profile/${encodeURIComponent(userId)}`, {
      headers: { Authorization: `Bearer ${TOKEN}` },
    });
    if (!res.ok) return null;
    const data = await res.json().catch(() => null);
    if (!data?.userId) return null;
    return { userId: data.userId, displayName: data.displayName, pictureUrl: data.pictureUrl };
  } catch {
    return null;
  }
}

/** Broadcast to every follower of the OA — the fallback when no expert
 *  LINE id is linked yet (POC: all experts share the one OA). */
export function lineBroadcast(messages: LineMessage[]): Promise<PushResult> {
  return callLine("message/broadcast", { messages });
}

export interface ConsultFlexInput {
  consultationId: string;
  itemName: string;
  expertName: string;
  consultType: "video" | "chat" | "managed";
  note?: string;
  customerName: string;
}

/** A tappable Flex card for the expert: summary + an action that opens
 *  the correct LIFF (managed-plan editor or chat) for this consultation. */
export function buildConsultFlex(input: ConsultFlexInput): LineMessage {
  const typeLabel =
    input.consultType === "chat"
      ? "Chat consultation"
      : input.consultType === "video"
        ? "1-1 video"
        : "Expert-managed plan";
  const liffId = input.consultType === "chat" ? LIFF_CHAT_ID : LIFF_MANAGED_PLAN_ID;
  const actionLabel = input.consultType === "chat" ? "Open chat" : "Open & adjust";

  return {
    type: "flex",
    altText: `New consultation · ${input.itemName} (${typeLabel})`,
    contents: {
      type: "bubble",
      body: {
        type: "box",
        layout: "vertical",
        spacing: "sm",
        contents: [
          { type: "text", text: "New consultation request", weight: "bold", size: "sm", color: "#1a6b60" },
          { type: "text", text: input.itemName, weight: "bold", size: "lg", wrap: true },
          {
            type: "box",
            layout: "vertical",
            spacing: "xs",
            margin: "md",
            contents: [
              kv("Type", typeLabel),
              kv("Expert", input.expertName),
              kv("Guest", input.customerName),
              ...(input.note ? [kv("Note", input.note)] : []),
              kv("Ref", input.consultationId),
            ],
          },
        ],
      },
      footer: {
        type: "box",
        layout: "vertical",
        contents: [
          {
            type: "button",
            style: "primary",
            color: "#1a6b60",
            action: { type: "uri", label: actionLabel, uri: liffUrl(liffId, input.consultationId) },
          },
        ],
      },
    },
  };
}

function kv(label: string, value: string): LineMessage {
  return {
    type: "box",
    layout: "baseline",
    spacing: "sm",
    contents: [
      { type: "text", text: label, size: "xs", color: "#74827d", flex: 2 },
      { type: "text", text: value, size: "xs", color: "#1d2a27", flex: 5, wrap: true },
    ],
  };
}
