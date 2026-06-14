import type { Metadata } from "next";
import { ExpertsDirectoryClient } from "@/components/experts/ExpertsDirectoryClient";

export const metadata: Metadata = {
  title: "Experts — Goodfill Care",
  description:
    "Meet the Goodfill Care expert team behind personalised Koh Samui wellness journeys.",
};

export default function ExpertsPage() {
  return <ExpertsDirectoryClient />;
}
