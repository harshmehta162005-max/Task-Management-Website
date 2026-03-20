"use client";

import { motion } from "framer-motion";
import { Network, RefreshCw, ShieldCheck, Lock } from "lucide-react";

const capabilities = [
  { icon: <Network className="w-4 h-4" />, label: "Multi-workspace" },
  { icon: <RefreshCw className="w-4 h-4" />, label: "Real-time updates" },
  { icon: <ShieldCheck className="w-4 h-4" />, label: "Audit logs" },
  { icon: <Lock className="w-4 h-4" />, label: "256-bit Encryption" },
];

export function CapabilityStrip() {
  return (
    <motion.section
      className="my-24 py-10 overflow-hidden"
      style={{
        background: "rgba(17, 24, 39, 0.72)",
        backdropFilter: "blur(12px)",
        borderTop: "1px solid rgba(255,255,255,0.05)",
        borderBottom: "1px solid rgba(255,255,255,0.05)",
      }}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      <div className="max-w-7xl mx-auto px-6 flex flex-wrap items-center justify-center md:justify-between gap-8">
        {capabilities.map((cap) => (
          <div key={cap.label} className="flex items-center gap-3 bg-white/5 px-4 py-2 rounded-full">
            <span className="text-slate-400">{cap.icon}</span>
            <span className="text-xs font-bold uppercase tracking-widest text-slate-300">{cap.label}</span>
          </div>
        ))}
      </div>
    </motion.section>
  );
}
