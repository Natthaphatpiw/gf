import type { Metadata } from "next";
import { ProgramsClient } from "@/components/programs/ProgramsClient";

export const metadata: Metadata = {
  title: "Wellness Programs — Goodfill Care",
  description:
    "Evidence-grounded Koh Samui wellness programs, plus island services and dishes to build your own.",
};

export default function ProgramsPage() {
  return <ProgramsClient />;
}
