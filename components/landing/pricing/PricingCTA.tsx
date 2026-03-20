"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export function PricingCTA() {
  return (
    <section className="max-w-5xl mx-auto mb-20 px-6">
      <motion.div
        className="p-12 md:p-20 rounded-[2.5rem] text-center relative overflow-hidden"
        style={{
          background: "rgba(17, 24, 39, 0.72)",
          backdropFilter: "blur(12px)",
          border: "1px solid rgba(255,255,255,0.08)",
        }}
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        {/* Inner glow */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#6366F1]/20 blur-[100px] pointer-events-none" />

        <div className="relative z-10">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Start free. Upgrade when your team is ready.
          </h2>
          <p className="text-slate-400 mb-10 max-w-xl mx-auto">
            Join 10,000+ teams using Nexus AI to ship faster and smarter.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/signup"
              className="w-full sm:w-auto px-10 py-4 bg-white text-[#060A12] font-bold rounded-full hover:scale-105 transition-transform text-center"
            >
              Start Free Trial
            </Link>
            <button
              className="w-full sm:w-auto px-10 py-4 font-bold rounded-full hover:bg-white/10 transition-colors"
              style={{
                background: "rgba(17, 24, 39, 0.72)",
                backdropFilter: "blur(12px)",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              Contact Sales
            </button>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
