"use client";

import { motion } from "framer-motion";

export function AIAssistantPreview() {
  return (
    <motion.div
      className="absolute -top-10 -left-6 w-80 rounded-xl p-4 shadow-2xl z-10"
      style={{
        background: "rgba(17, 24, 39, 0.72)",
        backdropFilter: "blur(12px)",
        border: "1px solid rgba(99, 102, 241, 0.5)",
        boxShadow: "0 0 15px rgba(99, 102, 241, 0.3)",
      }}
      animate={{ y: [0, -8, 0] }}
      transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
    >
      <div className="flex items-center gap-2 mb-3">
        <div className="w-6 h-6 rounded bg-[#6366F1] flex items-center justify-center">
          <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path d="M13 10V3L4 14h7v7l9-11h-7z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          </svg>
        </div>
        <span className="text-xs font-bold text-white uppercase tracking-tighter">AI Project Agent</span>
      </div>
      <p className="text-xs text-slate-300 leading-relaxed">
        &quot;Sprint #24 is 82% complete. 2 tasks are at risk due to dependency delays. Shall I notify the design team?&quot;
      </p>
      <div className="mt-4 flex gap-2">
        <div className="h-1.5 flex-1 bg-[#6366F1]/20 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-[#6366F1] rounded-full"
            initial={{ width: "0%" }}
            animate={{ width: "82%" }}
            transition={{ duration: 2, delay: 0.5, ease: "easeOut" }}
          />
        </div>
      </div>
    </motion.div>
  );
}
