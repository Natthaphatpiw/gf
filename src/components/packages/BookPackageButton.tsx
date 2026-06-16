"use client";

import { useState } from "react";
import type { WellnessPackage } from "@/lib/types";
import { useAccount } from "@/lib/account";
import { ConsultModal } from "@/components/consult/ConsultModal";

/* ============================================================
 * BookPackageButton — the package "book" CTA. Login-gated: if the
 * guest isn't signed in it opens the auth modal; once signed in it
 * opens the developed purchase flow (pick how the expert helps →
 * pay the FULL package price → enter the order process).
 * ============================================================ */

export function BookPackageButton({
  pkg,
  label,
  className = "",
}: {
  pkg: WellnessPackage;
  label: string;
  className?: string;
}) {
  const { user, openAuth } = useAccount();
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => {
          if (user) setOpen(true);
          else openAuth();
        }}
        className={`inline-flex items-center justify-center gap-2 rounded-full bg-teal-700 px-6 py-3 text-sm font-medium tracking-wide text-cream-50 shadow-soft transition-colors hover:bg-teal-800 ${className}`}
      >
        {label}
      </button>
      {open && (
        <ConsultModal
          item={{
            itemType: "package",
            itemId: pkg.id,
            itemName: pkg.name,
            itemImage: pkg.image,
          }}
          amount={pkg.price}
          purchase
          onClose={() => setOpen(false)}
        />
      )}
    </>
  );
}
