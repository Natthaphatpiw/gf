import { ImageResponse } from "next/og";
import { ARCHETYPE_CODES, getArchetype } from "@/lib/archetypes";
import { getArchetypeCharacter } from "@/data/archetypeCharacters";
import { siteUrl } from "@/lib/site";
import type { GuestGender } from "@/lib/types";

/* ============================================================
 * Dynamic share card — the "wellness character" image that shows
 * when an archetype page is shared (Facebook / LINE / Twitter
 * preview) and is the image handed to the native / Instagram /
 * download share. A 16personalities-style branded card: the
 * character illustration + name + code + a line of copy + the
 * site, on the brand palette. 1200×630 (the universal OG size).
 * ============================================================ */

export const runtime = "nodejs";

const W = 1200;
const H = 630;

const TEAL = "#0D5E57";
const TEAL_DEEP = "#1B3B36";
const CREAM = "#F1FAF5";
const GOLD = "#E6B53B";
const INK = "#052c24";
const INK_SOFT = "#3D5C57";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ code: string; gender: string }> },
) {
  const { code: rawCode, gender: rawGender } = await params;
  const code = rawCode.toUpperCase();
  const gender: GuestGender = rawGender === "male" ? "male" : "female";

  if (!ARCHETYPE_CODES.includes(code)) {
    return new Response("Not found", { status: 404 });
  }

  const archetype = getArchetype(code);
  const character = getArchetypeCharacter(code, gender);
  const characterUrl = siteUrl(character?.src ?? "/images/logo.png");
  const name = archetype.name.en;
  const description = archetype.description.en;
  const shortDesc = description.length > 116 ? `${description.slice(0, 116).trimEnd()}…` : description;

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          width: W,
          height: H,
          background: `linear-gradient(135deg, ${CREAM} 0%, #E2F0EA 100%)`,
          fontFamily: "sans-serif",
          position: "relative",
        }}
      >
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 12, background: GOLD, display: "flex" }} />

        {/* character panel */}
        <div
          style={{
            display: "flex",
            width: 470,
            alignItems: "center",
            justifyContent: "center",
            padding: "40px 12px 40px 48px",
          }}
        >
          <div
            style={{
              display: "flex",
              width: 392,
              height: 470,
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 36,
              background: "rgba(13,94,87,0.08)",
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={characterUrl} width={340} height={420} style={{ objectFit: "contain" }} alt="" />
          </div>
        </div>

        {/* text panel */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            flex: 1,
            justifyContent: "center",
            padding: "56px 64px 48px 12px",
          }}
        >
          <div style={{ display: "flex", fontSize: 20, letterSpacing: 3, color: TEAL, fontWeight: 700 }}>
            GOODFILL CARE · WELLNESS CHARACTER
          </div>
          <div style={{ display: "flex", fontSize: 62, fontWeight: 800, color: INK, marginTop: 16, lineHeight: 1.04 }}>
            {name}
          </div>

          <div style={{ display: "flex", gap: 10, marginTop: 24 }}>
            {code.split("").map((ch, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  width: 52,
                  height: 52,
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: 14,
                  background: TEAL,
                  color: CREAM,
                  fontSize: 26,
                  fontWeight: 800,
                }}
              >
                {ch}
              </div>
            ))}
          </div>

          <div style={{ display: "flex", fontSize: 25, color: INK_SOFT, marginTop: 26, lineHeight: 1.4 }}>
            {shortDesc}
          </div>

          <div style={{ display: "flex", alignItems: "center", marginTop: 40 }}>
            <div style={{ display: "flex", fontSize: 26, fontWeight: 800, color: TEAL_DEEP }}>chordjai.life</div>
            <div style={{ display: "flex", fontSize: 21, color: INK_SOFT, marginLeft: 14 }}>
              · Discover your character
            </div>
          </div>
        </div>
      </div>
    ),
    {
      width: W,
      height: H,
      headers: {
        "Cache-Control": "public, max-age=86400, s-maxage=604800, immutable",
      },
    },
  );
}
