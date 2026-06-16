import { Hero } from "@/components/landing/Hero";
import { TrustStrip } from "@/components/landing/TrustStrip";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { Pillars } from "@/components/landing/Pillars";
import { SimpleExperts } from "@/components/landing/SimpleExperts";
import { Featured } from "@/components/landing/Featured";
import { QuoteBreak } from "@/components/landing/QuoteBreak";
import { AssessmentTeaser } from "@/components/landing/AssessmentTeaser";
import { ClosingCTA } from "@/components/landing/ClosingCTA";

/* ============================================================
 * Landing page — Goodfill Care, Samui Wellness.
 * A calm, focused funnel toward the assessment: a strong hero,
 * how it works, the pillars, the two experts behind the plans,
 * then the assessment teaser + closing CTA.
 * ============================================================ */

export default function Home() {
  return (
    <>
      <Hero />
      <TrustStrip />
      <HowItWorks />
      <Pillars />
      <SimpleExperts />
      <Featured />
      <QuoteBreak />
      <AssessmentTeaser />
      <ClosingCTA />
    </>
  );
}
