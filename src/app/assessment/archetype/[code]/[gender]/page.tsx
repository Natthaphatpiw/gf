import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { GuestGender } from "@/lib/types";
import { ARCHETYPE_CODES, getArchetype } from "@/lib/archetypes";
import { getArchetypeCharacter } from "@/data/archetypeCharacters";
import { siteUrl } from "@/lib/site";
import { ArchetypeShareClient } from "@/components/assessment/ArchetypeShareClient";

interface ArchetypeSharePageProps {
  params: Promise<{ code: string; gender: string }>;
}

const GENDERS: GuestGender[] = ["female", "male"];

export function generateStaticParams() {
  return ARCHETYPE_CODES.flatMap((code) =>
    GENDERS.map((gender) => ({ code, gender })),
  );
}

export async function generateMetadata({
  params,
}: ArchetypeSharePageProps): Promise<Metadata> {
  const { code: rawCode, gender: rawGender } = await params;
  const code = rawCode.toUpperCase();
  const gender = parseGender(rawGender);

  if (!ARCHETYPE_CODES.includes(code) || !gender) return {};

  const archetype = getArchetype(code);
  const title = `${archetype.name.en} - Goodfill Care Wellness Character`;
  const description = archetype.description.en;
  const url = siteUrl(`/assessment/archetype/${code}/${gender}`);
  const imageUrl = siteUrl(`/api/og/archetype/${code}/${gender}`);

  return {
    title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url,
      siteName: "Goodfill Care",
      type: "website",
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: archetype.name.en,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
  };
}

export default async function ArchetypeSharePage({
  params,
}: ArchetypeSharePageProps) {
  const { code: rawCode, gender: rawGender } = await params;
  const code = rawCode.toUpperCase();
  const gender = parseGender(rawGender);

  if (!ARCHETYPE_CODES.includes(code) || !gender) {
    notFound();
  }

  const archetype = getArchetype(code);
  const character = getArchetypeCharacter(code, gender);
  if (!character) notFound();

  const path = `/assessment/archetype/${code}/${gender}`;

  return (
    <ArchetypeShareClient
      archetype={archetype}
      characterSrc={character.src}
      shareUrl={siteUrl(path)}
      shareImageUrl={siteUrl(`/api/og/archetype/${code}/${gender}`)}
    />
  );
}

function parseGender(value: string): GuestGender | null {
  return value === "female" || value === "male" ? value : null;
}
