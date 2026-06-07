"use client";

import { Compass } from "lucide-react";
import { useT } from "@/lib/i18n";
import common from "@/lib/i18n/dictionaries/common";
import booking from "@/lib/i18n/dictionaries/booking";
import { ButtonLink } from "@/components/ui/Button";

/* ============================================================
 * BookingNotFound — calm empty state when a package or booking
 * cannot be found.
 * ============================================================ */

export function BookingNotFound({
  kind,
}: {
  kind: "package" | "booking";
}) {
  const tc = useT(common);
  const t = useT(booking);
  const message = kind === "booking" ? t.errors.notFound : tc.errors.notFound;

  return (
    <div className="mx-auto flex max-w-md flex-col items-center px-5 py-20 text-center md:py-28">
      <div className="grid h-20 w-20 place-items-center rounded-full bg-teal-50">
        <Compass className="h-9 w-9 text-teal-600" />
      </div>
      <h1 className="font-display mt-6 text-2xl font-semibold text-teal-900">
        {message}
      </h1>
      <div className="mt-7 flex flex-col gap-3">
        <ButtonLink href="/packages">{tc.nav.packages}</ButtonLink>
        <ButtonLink href="/bookings" variant="ghost">
          {tc.nav.bookings}
        </ButtonLink>
      </div>
    </div>
  );
}
