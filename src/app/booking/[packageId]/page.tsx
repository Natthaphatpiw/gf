import { use } from "react";
import { getPackage } from "@/data/packages";
import { BookingForm } from "@/components/booking/BookingForm";
import { BookingNotFound } from "@/components/booking/BookingNotFound";

/* ============================================================
 * /booking/[packageId] — registration + booking page.
 * ============================================================ */

export default function BookingPage({
  params,
}: {
  params: Promise<{ packageId: string }>;
}) {
  const { packageId } = use(params);
  const pkg = getPackage(packageId);

  if (!pkg) {
    return <BookingNotFound kind="package" />;
  }

  return <BookingForm pkg={pkg} />;
}
