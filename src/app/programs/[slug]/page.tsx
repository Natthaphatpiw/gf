import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  BLUEPRINT_PROGRAM_SLUGS,
  getBlueprintProgram,
} from "@/data/blueprintPackages";
import { ProgramDetailClient } from "@/components/programs/ProgramDetailClient";

interface ProgramPageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return BLUEPRINT_PROGRAM_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: ProgramPageProps): Promise<Metadata> {
  const { slug } = await params;
  const program = getBlueprintProgram(slug);
  if (!program) return {};
  return {
    title: `${program.name.en} — Goodfill Wellness Programs`,
    description: program.tagline.en,
  };
}

export default async function ProgramPage({ params }: ProgramPageProps) {
  const { slug } = await params;
  const program = getBlueprintProgram(slug);
  if (!program) notFound();

  return <ProgramDetailClient program={program} />;
}
