import type { Metadata } from "next";
import { HugSamuiMenusClient } from "@/components/partners/HugSamuiMenusClient";
import { HUG_SAMUI_MENU_DATA } from "@/data/hugSamuiMenus";

export const metadata: Metadata = {
  title: "Hug Samui Menus — Goodfill Care",
  description:
    "A POC menu database and customer-facing local wellness menu page for Hug Samui.",
};

export default function HugSamuiMenusPage() {
  return <HugSamuiMenusClient data={HUG_SAMUI_MENU_DATA} />;
}
