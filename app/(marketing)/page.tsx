"use client";

import { AnimatedAmbientBackground } from "@/components/landing/AnimatedAmbientBackground";
import { LandingNavbar } from "@/components/landing/LandingNavbar";
import { HeroContent } from "@/components/landing/HeroContent";
import { FuturisticPreview } from "@/components/landing/FuturisticPreview";

export default function LandingPage() {
  return (
    <div
      className="h-screen w-screen relative overflow-hidden"
      style={{
        fontFamily: "'Inter', var(--font-manrope), sans-serif",
        backgroundColor: "#060A12",
        color: "#F8FAFC",
      }}
    >
      {/* Background effects */}
      <AnimatedAmbientBackground />

      {/* Navbar */}
      <LandingNavbar />

      {/* Main hero - two-column layout */}
      <main className="flex flex-col lg:flex-row h-full pt-20 lg:pt-24">
        <HeroContent />
        <FuturisticPreview />
      </main>
    </div>
  );
}
