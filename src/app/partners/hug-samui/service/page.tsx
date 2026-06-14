import type { Metadata } from "next";
import { HugSamuiServiceClient } from "@/components/partners/HugSamuiServiceClient";
import { HUG_SAMUI_SERVICE_DATA } from "@/data/hugSamuiServices";

export const metadata: Metadata = {
  title: "Hug Samui Services — Goodfill Care",
  description:
    "A POC service structure for Hug Samui beach wellness lifestyle experiences.",
};

export default function HugSamuiServicePage() {
  return <HugSamuiServiceClient data={HUG_SAMUI_SERVICE_DATA} />;
}
