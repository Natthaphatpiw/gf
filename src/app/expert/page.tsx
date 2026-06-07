"use client";

import { ExpertGate } from "@/components/expert/ExpertGate";
import { InboxList } from "@/components/expert/InboxList";

/* ============================================================
 * /expert — the expert console inbox (consult queue).
 * Not in the public nav; clinicians open the path directly.
 * ============================================================ */

export default function ExpertInboxPage() {
  return (
    <ExpertGate>
      <InboxList />
    </ExpertGate>
  );
}
