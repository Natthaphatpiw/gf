import { use } from "react";
import { CustomizeClient } from "@/components/orders/CustomizeClient";

/* /orders/[id]/customize — the customer drag-and-drop package editor. */

export default function CustomizePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  return <CustomizeClient orderId={id.toUpperCase()} />;
}
