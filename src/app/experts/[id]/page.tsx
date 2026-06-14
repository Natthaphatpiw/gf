import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { EXPERTS, getExpert } from "@/data/experts";
import { ExpertDetailClient } from "@/components/experts/ExpertDetailClient";

interface ExpertPageProps {
  params: Promise<{ id: string }>;
}

export function generateStaticParams() {
  return EXPERTS.map((expert) => ({ id: expert.id }));
}

export async function generateMetadata({
  params,
}: ExpertPageProps): Promise<Metadata> {
  const { id } = await params;
  const expert = getExpert(id);
  if (!expert) return {};

  return {
    title: `${expert.name.en} — Goodfill Care Expert`,
    description: expert.shortBio.en,
  };
}

export default async function ExpertPage({ params }: ExpertPageProps) {
  const { id } = await params;
  const expert = getExpert(id);

  if (!expert) {
    notFound();
  }

  return <ExpertDetailClient expert={expert} />;
}
