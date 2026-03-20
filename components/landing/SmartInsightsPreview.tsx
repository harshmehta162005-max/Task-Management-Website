"use client";

import { motion } from "framer-motion";

export function SmartInsightsPreview() {
  return (
    <motion.div
      className="absolute bottom-1/4 -right-16 w-48 rounded-xl p-4 shadow-2xl z-10"
      style={{
        background: "rgba(17, 24, 39, 0.72)",
        backdropFilter: "blur(12px)",
        border: "1px solid rgba(255, 255, 255, 0.1)",
      }}
      animate={{ y: [0, -7, 0] }}
      transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 2 }}
    >
      <div className="flex items-center gap-2 mb-4">
        <div className="w-2 h-2 rounded-full bg-[#8B5CF6]" />
        <span className="text-[10px] font-bold text-slate-300 uppercase">Workload Report</span>
      </div>
      <div className="space-y-4">
        <div>
          <div className="flex justify-between text-[10px] mb-1">
            <span className="text-slate-500">Resource Load</span>
            <span className="text-[#8B5CF6] font-bold">High</span>
          </div>
          <div className="h-1 w-full bg-white/5 rounded-full">
            <motion.div
              className="h-full bg-[#8B5CF6] rounded-full"
              initial={{ width: "0%" }}
              animate={{ width: "85%" }}
              transition={{ duration: 2, delay: 1, ease: "easeOut" }}
            />
          </div>
        </div>
        <div className="flex justify-between items-center pt-2 border-t border-white/10">
          <span className="text-[10px] text-slate-500">Risk Level</span>
          <span className="text-[10px] bg-red-500/20 text-red-400 px-1.5 rounded font-bold">3 Alerts</span>
        </div>
      </div>
    </motion.div>
  );
}
