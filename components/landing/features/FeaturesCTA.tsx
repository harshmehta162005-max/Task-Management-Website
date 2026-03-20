"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export function FeaturesCTA() {
  return (
    <section className="max-w-5xl mx-auto px-6 py-32 text-center">
      <motion.div
        className="p-12 md:p-20 rounded-3xl relative overflow-hidden"
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
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-tr from-[#6366F1]/10 via-transparent to-[#22D3EE]/5 pointer-events-none" />

        <div className="relative z-10">
          <h2 className="text-4xl md:text-5xl font-black text-white mb-6 leading-tight">
            Built for teams that want clarity, speed, and control
          </h2>
          <p className="text-slate-400 text-lg mb-10 max-w-xl mx-auto">
            Join 10,000+ teams worldwide already scaling their workflows with Nexus AI.
          </p>
          <Link
            href="/signup"
            className="inline-block bg-[#6366F1] hover:bg-[#6366F1]/90 text-white font-bold py-4 px-10 rounded-xl transition-all"
            style={{ boxShadow: "0 0 20px rgba(99, 102, 241, 0.3)" }}
          >
            Start for free
          </Link>
        </div>
      </motion.div>
    </section>
  );
}
