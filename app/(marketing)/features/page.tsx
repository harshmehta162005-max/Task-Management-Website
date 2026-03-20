"use client";

import { LandingNavbar } from "@/components/landing/LandingNavbar";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { FeaturesHero } from "@/components/landing/features/FeaturesHero";
import { FeaturesGrid } from "@/components/landing/features/FeaturesGrid";
import { FeatureSpotlight } from "@/components/landing/features/FeatureSpotlight";
import { CapabilityStrip } from "@/components/landing/features/CapabilityStrip";
import { FeaturesCTA } from "@/components/landing/features/FeaturesCTA";

export default function FeaturesPage() {
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

      <main className="relative pt-16">
        <FeaturesHero />
        <FeaturesGrid />
        <FeatureSpotlight />
        <CapabilityStrip />
        <FeaturesCTA />
      </main>

      <LandingFooter />
    </div>
  );
}
