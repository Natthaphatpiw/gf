import type { Metadata } from "next";
import { ImpactClient } from "@/components/impact/ImpactClient";

export const metadata: Metadata = {
  title: "Real outcomes — Goodfill Care",
  description:
    "Pooled before-and-after results from real guests on Koh Samui — how much our wellness programs move stress, sleep, mind and energy.",
};

export default function ImpactPage() {
  return <ImpactClient />;
}
