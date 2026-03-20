"use client";

import { useState } from "react";
import { LandingNavbar } from "@/components/landing/LandingNavbar";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { PricingHero } from "@/components/landing/pricing/PricingHero";
import { PricingCards } from "@/components/landing/pricing/PricingCards";
import { ComparisonTable } from "@/components/landing/pricing/ComparisonTable";
import { PricingFAQ } from "@/components/landing/pricing/PricingFAQ";
import { PricingCTA } from "@/components/landing/pricing/PricingCTA";

export default function PricingPage() {
  const [isYearly, setIsYearly] = useState(true);

  return (
    <div
      className="relative overflow-x-hidden"
      style={{
        fontFamily: "'Inter', var(--font-manrope), sans-serif",
        backgroundColor: "#060A12",
        color: "#F8FAFC",
      }}
    >
      {/* Ambient glows */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div
          className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%]"
          style={{
            background: "radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%)",
            filter: "blur(80px)",
            animation: "pulse 4s ease-in-out infinite",
          }}
        />
        <div
          className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%]"
          style={{
            background: "radial-gradient(circle, rgba(34,211,238,0.1) 0%, transparent 70%)",
            filter: "blur(80px)",
            animation: "pulse 4s ease-in-out infinite",
          }}
        />
      </div>

      {/* Grid background */}
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          backgroundImage: "radial-gradient(circle at 2px 2px, rgba(255,255,255,0.03) 1px, transparent 0)",
          backgroundSize: "32px 32px",
        }}
      />

      <LandingNavbar />

      <main className="relative pb-20">
        <PricingHero isYearly={isYearly} onToggle={() => setIsYearly(!isYearly)} />
        <PricingCards isYearly={isYearly} />
        <ComparisonTable />
        <PricingFAQ />
        <PricingCTA />
      </main>

      <LandingFooter />
    </div>
  );
}
