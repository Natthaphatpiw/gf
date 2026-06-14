import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPartner } from "@/data/partners";
import { PartnerDetailClient } from "@/components/partners/PartnerDetailClient";

interface PartnerPageProps {
  params: Promise<{ id: string }>;
}

export function generateStaticParams() {
  return [{ id: "hug-samui" }];
}

export async function generateMetadata({
  params,
}: PartnerPageProps): Promise<Metadata> {
  const { id } = await params;
  const partner = getPartner(id);
  if (!partner) return {};

  return {
    title: `${partner.name.en} — Goodfill Care Partner`,
    description: partner.summary.en,
  };
}

export default async function PartnerPage({ params }: PartnerPageProps) {
  const { id } = await params;
  const partner = getPartner(id);

  if (!partner || partner.id !== "hug-samui") {
    notFound();
  }

  return <PartnerDetailClient partner={partner} />;
}
