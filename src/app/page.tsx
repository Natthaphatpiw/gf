import { Hero } from "@/components/landing/Hero";
import { TrustStrip } from "@/components/landing/TrustStrip";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { Pillars } from "@/components/landing/Pillars";
import { Featured } from "@/components/landing/Featured";
import { QuoteBreak } from "@/components/landing/QuoteBreak";
import { AssessmentTeaser } from "@/components/landing/AssessmentTeaser";
import { ClosingCTA } from "@/components/landing/ClosingCTA";

/* ============================================================
 * Landing page — Goodfill Care, Samui Wellness.
 * Funnels every visitor toward the assessment.
 * ============================================================ */

export default function Home() {
  return (
    <>
      <Hero />
      <TrustStrip />
      <HowItWorks />
      <Pillars />
      <Featured />
      <QuoteBreak />
      <AssessmentTeaser />
      <ClosingCTA />
    </>
  );
}
