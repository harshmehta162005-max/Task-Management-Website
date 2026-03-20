"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export function FeaturesHero() {
  return (
    <section
      className="relative max-w-7xl mx-auto px-6 pt-28 pb-32 text-center"
      style={{
        background: "radial-gradient(circle at 50% -20%, rgba(99, 102, 241, 0.15) 0%, rgba(6, 10, 18, 0) 50%)",
      }}
    >
      {/* Badge */}
      <motion.div
        className="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-8"
        style={{
          background: "rgba(17, 24, 39, 0.72)",
          backdropFilter: "blur(12px)",
          border: "1px solid rgba(99, 102, 241, 0.2)",
        }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <span className="w-2 h-2 rounded-full bg-[#6366F1] animate-pulse" />
        <span className="text-xs font-bold uppercase tracking-widest text-[#6366F1]">Product Features</span>
      </motion.div>

      {/* Headline */}
      <motion.h1
        className="text-5xl md:text-7xl font-black text-white leading-[1.1] mb-6 tracking-tight max-w-4xl mx-auto"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.15 }}
      >
        Everything your team needs to{" "}
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#6366F1] to-[#22D3EE]">move fast.</span>
      </motion.h1>

      {/* Subtext */}
      <motion.p
        className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed font-light"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        Projects, tasks, collaboration, insights, and automation — designed as one intelligent system.
      </motion.p>

      {/* CTA row */}
      <motion.div
        className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.45 }}
      >
        <Link
          href="/signup"
          className="w-full sm:w-auto px-8 py-4 bg-[#6366F1] text-white font-bold rounded-xl hover:scale-105 transition-transform text-center"
          style={{ boxShadow: "0 0 20px rgba(99, 102, 241, 0.3)" }}
        >
          Start for free
        </Link>
        <button
          className="w-full sm:w-auto px-8 py-4 text-white font-bold rounded-xl hover:bg-white/5 transition-colors"
          style={{
            background: "rgba(17, 24, 39, 0.72)",
            backdropFilter: "blur(12px)",
            border: "1px solid rgba(255, 255, 255, 0.08)",
          }}
        >
          See live preview
        </button>
      </motion.div>

      {/* Floating hero visuals */}
      <motion.div
        className="relative w-full max-w-5xl mx-auto h-[400px] mt-12 hidden md:block"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.6 }}
      >
        {/* Card 1 - top left */}
        <motion.div
          className="absolute top-0 left-0 w-72 p-4 rounded-xl shadow-2xl z-10"
          style={{
            background: "rgba(17, 24, 39, 0.72)",
            backdropFilter: "blur(12px)",
            border: "1px solid rgba(34, 211, 238, 0.2)",
            transform: "rotate(-6deg)",
          }}
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        >
          <div className="flex items-center gap-3 mb-4">
            <svg className="w-5 h-5 text-[#22D3EE]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
            </svg>
            <div className="h-2 w-24 bg-[#22D3EE]/20 rounded" />
          </div>
          <div className="space-y-2">
            <div className="h-3 w-full bg-white/10 rounded" />
            <div className="h-3 w-4/5 bg-white/5 rounded" />
          </div>
        </motion.div>

        {/* Card 2 - top right */}
        <motion.div
          className="absolute top-10 right-0 w-80 p-5 rounded-xl shadow-2xl z-20"
          style={{
            background: "rgba(17, 24, 39, 0.72)",
            backdropFilter: "blur(12px)",
            border: "1px solid rgba(99, 102, 241, 0.2)",
            transform: "rotate(4deg)",
          }}
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
        >
          <div className="flex justify-between items-center mb-4">
            <div className="flex -space-x-2">
              <div className="w-8 h-8 rounded-full border-2 border-slate-900 bg-slate-800" />
              <div className="w-8 h-8 rounded-full border-2 border-slate-900 bg-[#6366F1]/40 flex items-center justify-center text-[10px] font-bold">JD</div>
            </div>
            <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path d="M5 12h.01M12 12h.01M19 12h.01" strokeLinecap="round" strokeWidth="3" />
            </svg>
          </div>
          <div className="h-24 w-full bg-gradient-to-br from-[#6366F1]/10 to-transparent rounded-lg border border-white/5" />
        </motion.div>

        {/* Card 3 - bottom center */}
        <motion.div
          className="absolute bottom-10 left-1/4 w-96 p-6 rounded-2xl shadow-2xl z-30"
          style={{
            background: "rgba(17, 24, 39, 0.72)",
            backdropFilter: "blur(12px)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
          }}
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="w-10 h-10 rounded-lg bg-[#6366F1]/20 flex items-center justify-center">
              <svg className="w-5 h-5 text-[#6366F1]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
              </svg>
            </div>
            <div>
              <div className="h-3 w-32 bg-white/20 rounded mb-1" />
              <div className="h-2 w-16 bg-white/10 rounded" />
            </div>
          </div>
          <div className="flex items-end gap-2 h-20">
            <div className="flex-1 bg-[#6366F1]/40 rounded-t h-1/2" />
            <div className="flex-1 bg-[#6366F1]/60 rounded-t h-3/4" />
            <div className="flex-1 bg-[#6366F1] rounded-t h-full" />
            <div className="flex-1 bg-[#22D3EE]/60 rounded-t h-2/3" />
            <div className="flex-1 bg-[#22D3EE] rounded-t h-4/5" />
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
