"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { FeaturePills } from "./FeaturePills";

export function HeroContent() {
  return (
    <section className="w-full lg:w-[42%] h-full flex flex-col justify-center px-6 sm:px-10 lg:pl-16 lg:pr-8 relative z-10 py-24 lg:py-0">
      {/* Badge */}
      <motion.div
        className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold mb-6 w-fit"
        style={{
          border: "1px solid rgba(99, 102, 241, 0.3)",
          background: "rgba(99, 102, 241, 0.1)",
          color: "#22D3EE",
        }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <motion.span
          className="w-1.5 h-1.5 rounded-full bg-[#22D3EE]"
          animate={{ opacity: [1, 0.4, 1] }}
          transition={{ duration: 2.5, repeat: Infinity }}
        />
        AI-Powered Team Workspace
      </motion.div>

      {/* Headline */}
      <motion.h1
        className="text-4xl sm:text-5xl lg:text-[3.4rem] font-bold leading-[1.1] mb-6 bg-gradient-to-br from-white via-white to-slate-500 bg-clip-text text-transparent"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.35 }}
      >
        The intelligent operating system for modern teams.
      </motion.h1>

      {/* Supporting text */}
      <motion.p
        className="text-base lg:text-lg text-slate-400 leading-relaxed mb-8 max-w-lg"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.5 }}
      >
        Manage projects, assign tasks, automate follow-ups, and ask AI for instant clarity — all from one workspace.
      </motion.p>

      {/* CTA Row */}
      <motion.div
        className="flex flex-wrap items-center gap-4 mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.65 }}
      >
        <Link
          href="/signup"
          className="bg-[#6366F1] hover:bg-[#6366F1]/90 text-white px-8 py-3.5 rounded-xl font-semibold shadow-2xl transition-all transform hover:scale-[1.02]"
          style={{ boxShadow: "0 8px 30px rgba(99, 102, 241, 0.4)" }}
        >
          Start for free
        </Link>
        <button
          className="px-8 py-3.5 rounded-xl font-semibold text-slate-300 hover:text-white transition-all"
          style={{
            background: "rgba(17, 24, 39, 0.72)",
            backdropFilter: "blur(12px)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
          }}
        >
          See live preview
        </button>
      </motion.div>

      {/* Trust line */}
      <motion.p
        className="text-[10px] text-slate-500 uppercase tracking-widest mb-6 font-medium"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.85 }}
      >
        Enterprise-grade security &amp; reliability
      </motion.p>

      {/* Feature Pills */}
      <FeaturePills />
    </section>
  );
}
