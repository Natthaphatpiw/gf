import { Hero } from "@/components/landing/Hero";
import { WellnessTypes } from "@/components/landing/WellnessTypes";
import { TopBrands } from "@/components/landing/TopBrands";
import { ProgramsClient } from "@/components/programs/ProgramsClient";
import { CareBridge } from "@/components/landing/CareBridge";
import { ExpertShowcase } from "@/components/landing/ExpertShowcase";
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
      <WellnessTypes />
      <TopBrands />
      <ProgramsClient embedded />
      <CareBridge />
      <ExpertShowcase />
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
