"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { AIPreviewPanel } from "./AIPreviewPanel";

export function AIHero() {
  return (
    <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">
      {/* Grid background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(rgba(255,255,255,0.05) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />
      {/* Ambient glows */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-[#6366F1]/20 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-[#22D3EE]/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center">
        {/* Text */}
        <div className="relative z-10">
          <motion.div
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#6366F1]/30 bg-[#6366F1]/10 text-xs font-semibold text-[#6366F1] mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#6366F1] opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#6366F1]" />
            </span>
            AI WORKSPACE INTELLIGENCE
          </motion.div>

          <motion.h1
            className="text-5xl md:text-7xl font-bold leading-[1.1] mb-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
          >
            AI that understands how your{" "}
            <span className="bg-gradient-to-r from-[#6366F1] to-[#A5B4FC] bg-clip-text text-transparent">team works.</span>
          </motion.h1>

          <motion.p
            className="text-lg md:text-xl text-slate-400 mb-10 max-w-lg leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            Stop asking and start executing. Nexus AI integrates with your entire workflow to provide context-aware insights and automated action.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.45 }}
          >
            <Link
              href="/signup"
              className="px-8 py-4 bg-[#6366F1] text-white rounded-xl font-bold hover:bg-[#6366F1]/90 transition-all text-center"
              style={{ boxShadow: "0 0 40px -10px rgba(99, 102, 241, 0.3)" }}
            >
              Start for free
            </Link>
            <button
              className="px-8 py-4 text-white rounded-xl font-bold hover:bg-white/5 transition-all"
              style={{
                background: "rgba(17, 24, 39, 0.72)",
                backdropFilter: "blur(12px)",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              See live preview
            </button>
          </motion.div>
        </div>

        {/* AI Preview Panel */}
        <motion.div
          className="relative"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.3 }}
        >
          <AIPreviewPanel />
        </motion.div>
      </div>
    </section>
  );
}
