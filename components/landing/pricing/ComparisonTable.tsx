"use client";

import { motion } from "framer-motion";

const rows = [
  { feature: "AI Summaries", free: "5 / mo", pro: "Unlimited", business: "Unlimited" },
  { feature: "Meeting Transcriptions", free: "—", pro: "Included", business: "Included" },
  { feature: "Workload Optimization", free: "—", pro: "Basic", business: "Advanced" },
  { feature: "Team Management", free: "—", pro: "10 members", business: "Unlimited" },
  { feature: "Security & Compliance", free: "Standard", pro: "Enhanced", business: "SSO & SOC2" },
];

export function ComparisonTable() {
  return (
    <motion.section
      className="max-w-6xl mx-auto mb-32 hidden md:block px-6"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      <h2 className="text-3xl font-bold text-center mb-12">Compare features</h2>
      <div
        className="overflow-hidden rounded-2xl"
        style={{
          background: "rgba(17, 24, 39, 0.72)",
          backdropFilter: "blur(12px)",
          border: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-white/5 bg-white/5">
              <th className="p-6 text-sm font-semibold">Features</th>
              <th className="p-6 text-sm font-semibold">Free</th>
              <th className="p-6 text-sm font-semibold text-[#6366F1]">Pro</th>
              <th className="p-6 text-sm font-semibold">Business</th>
            </tr>
          </thead>
          <tbody className="text-sm text-slate-400">
            {rows.map((row, i) => (
              <tr
                key={row.feature}
                className={`border-white/5 hover:bg-white/[0.02] transition-colors ${
                  i < rows.length - 1 ? "border-b" : ""
                }`}
              >
                <td className="p-6 text-white">{row.feature}</td>
                <td className="p-6">{row.free}</td>
                <td className="p-6 text-white">{row.pro}</td>
                <td className="p-6 text-white">{row.business}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.section>
  );
}
