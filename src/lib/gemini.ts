import { GoogleGenAI } from "@google/genai";

/* ============================================================
 * Gemini client — single shared instance.
 * Reads GEMINI_API_KEY / GEMINI_MODEL from the environment.
 * ============================================================ */

let client: GoogleGenAI | null = null;

export function getGemini(): GoogleGenAI {
  if (!client) {
    // GoogleGenAI reads GEMINI_API_KEY from the environment automatically,
    // but we pass it explicitly so the failure mode is obvious.
    client = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  }
  return client;
}

export const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-2.5-flash";

export function hasGeminiKey(): boolean {
  return Boolean(process.env.GEMINI_API_KEY);
}

/**
 * Call Gemini and parse a JSON object out of the response.
 * The prompt must instruct the model to answer with JSON only.
 */
export async function generateJson<T>(options: {
  system: string;
  user: string;
  temperature?: number;
  timeoutMs?: number;
}): Promise<T> {
  const ai = getGemini();
  const response = await withTimeout(
    ai.models.generateContent({
      model: GEMINI_MODEL,
      contents: options.user,
      config: {
        systemInstruction: options.system,
        temperature: options.temperature ?? 0.4,
        responseMimeType: "application/json",
      },
    }),
    options.timeoutMs ?? 12000,
  );

  const text = response.text ?? "";
  return parseJsonLoose<T>(text);
}

function withTimeout<T>(promise: Promise<T>, timeoutMs: number): Promise<T> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  const timeout = new Promise<never>((_, reject) => {
    timer = setTimeout(
      () => reject(new Error(`Gemini request timed out after ${timeoutMs}ms`)),
      timeoutMs,
    );
  });
  return Promise.race([promise, timeout]).finally(() => {
    if (timer) clearTimeout(timer);
  });
}

/** Tolerant JSON parsing — strips code fences and leading prose if present. */
export function parseJsonLoose<T>(raw: string): T {
  const trimmed = raw.trim();
  try {
    return JSON.parse(trimmed) as T;
  } catch {
    const start = trimmed.indexOf("{");
    const end = trimmed.lastIndexOf("}");
    if (start >= 0 && end > start) {
      return JSON.parse(trimmed.slice(start, end + 1)) as T;
    }
    throw new Error("Gemini returned non-JSON output");
  }
}
