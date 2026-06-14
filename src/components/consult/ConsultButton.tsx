"use client";

import { useState } from "react";
import { Stethoscope } from "lucide-react";
import { useAccount } from "@/lib/account";
import { useT } from "@/lib/i18n";
import consultDict from "@/lib/i18n/dictionaries/consult";
import { ConsultModal, type ConsultItem } from "@/components/consult/ConsultModal";

/* A login-gated "Consult an expert" button + the modal it opens.
 * Drop it on any item surface (program / service / menu / package). */
export function ConsultButton({
  item,
  className = "",
}: {
  item: ConsultItem;
  className?: string;
}) {
  const t = useT(consultDict);
  const { user, openAuth } = useAccount();
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          if (user) setOpen(true);
          else openAuth();
        }}
        className={`inline-flex items-center justify-center gap-2 rounded-full border border-teal-700/30 bg-white px-4 py-2.5 text-[0.84rem] font-semibold text-teal-700 transition-colors hover:bg-teal-50 ${className}`}
      >
        <Stethoscope className="h-4 w-4" />
        {t.button}
      </button>
      {open && <ConsultModal item={item} onClose={() => setOpen(false)} />}
    </>
  );
}
