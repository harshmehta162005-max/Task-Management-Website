"use client";

import { motion } from "framer-motion";

const pills = [
  {
    label: "AI Meeting → Tasks",
    color: "#22D3EE",
    icon: (
      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
      </svg>
    ),
  },
  {
    label: "Live Coordination",
    color: "#8B5CF6",
    icon: (
      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
      </svg>
    ),
  },
  {
    label: "Smart Insights",
    color: "#6366F1",
    icon: (
      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
      </svg>
    ),
  },
];

export function FeaturePills() {
  return (
    <div className="flex flex-wrap gap-3">
      {pills.map((pill, i) => (
        <motion.div
          key={pill.label}
          className="px-3 py-2 rounded-lg text-xs font-medium text-slate-300 flex items-center gap-2"
          style={{
            background: "rgba(17, 24, 39, 0.72)",
            backdropFilter: "blur(12px)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            color: pill.color,
          }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1.2 + i * 0.15 }}
        >
          <span style={{ color: pill.color }}>{pill.icon}</span>
          <span className="text-slate-300">{pill.label}</span>
        </motion.div>
      ))}
    </div>
  );
}
