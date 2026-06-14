import type { Metadata } from "next";
import { OrdersClient } from "@/components/orders/OrdersClient";

export const metadata: Metadata = {
  title: "My consultations — Goodfill Care",
  description: "Track your expert consultation requests.",
};

export default function OrdersPage() {
  return <OrdersClient />;
}
