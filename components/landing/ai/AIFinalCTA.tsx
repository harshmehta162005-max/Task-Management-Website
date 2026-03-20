"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export function AIFinalCTA() {
  return (
    <section className="py-24">
      <div className="max-w-5xl mx-auto px-6">
        <motion.div
          className="p-12 md:p-20 rounded-[3rem] text-center relative overflow-hidden"
          style={{
            background: "linear-gradient(145deg, rgba(31,41,55,0.4) 0%, rgba(17,24,39,0.8) 100%)",
            backdropFilter: "blur(8px)",
            border: "1px solid rgba(255,255,255,0.05)",
          }}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#6366F1]/10 to-[#22D3EE]/10 pointer-events-none rounded-[3rem]" />

          <div className="relative z-10">
            <h2 className="text-4xl md:text-6xl font-bold mb-8">
              Ready to upgrade your team&apos;s IQ?
            </h2>
            <p className="text-slate-400 text-lg md:text-xl mb-12 max-w-2xl mx-auto">
              Join 10,000+ forward-thinking teams already scaling their workflows with the Nexus AI layer.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <Link
                href="/signup"
                className="w-full sm:w-auto px-10 py-5 bg-[#6366F1] text-white rounded-2xl font-bold text-lg hover:scale-105 transition-all text-center"
                style={{ boxShadow: "0 0 40px -10px rgba(99, 102, 241, 0.3)" }}
              >
                Get Started for Free
              </Link>
              <button
                className="w-full sm:w-auto px-10 py-5 text-white rounded-2xl font-bold text-lg hover:bg-white/5 transition-all text-center"
                style={{
                  background: "rgba(17, 24, 39, 0.72)",
                  backdropFilter: "blur(12px)",
                  border: "1px solid rgba(255,255,255,0.08)",
                }}
              >
                Talk to Sales
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
