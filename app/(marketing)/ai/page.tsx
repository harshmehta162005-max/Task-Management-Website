"use client";

import { LandingNavbar } from "@/components/landing/LandingNavbar";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { AIHero } from "@/components/landing/ai/AIHero";
import { AICapabilitiesGrid } from "@/components/landing/ai/AICapabilitiesGrid";
import { AIWorkflowStrip } from "@/components/landing/ai/AIWorkflowStrip";
import { AIUseCases } from "@/components/landing/ai/AIUseCases";
import { AITrustSection } from "@/components/landing/ai/AITrustSection";
import { AIFinalCTA } from "@/components/landing/ai/AIFinalCTA";

export default function AIPage() {
  return (
    <div
      className="relative overflow-x-hidden"
      style={{
        fontFamily: "'Inter', var(--font-manrope), sans-serif",
        backgroundColor: "#060A12",
        color: "#F8FAFC",
      }}
    >
      <LandingNavbar />

      <main>
        <AIHero />
        <AICapabilitiesGrid />
        <AIWorkflowStrip />
        <AIUseCases />
        <AITrustSection />
        <AIFinalCTA />
      </main>

      <LandingFooter />
    </div>
  );
}
