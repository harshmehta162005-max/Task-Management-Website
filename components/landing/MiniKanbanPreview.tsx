"use client";

import { motion } from "framer-motion";

export function MiniKanbanPreview() {
  return (
    <motion.div
      className="absolute top-1/2 -right-12 -translate-y-1/2 w-64 rounded-xl p-4 shadow-2xl z-10"
      style={{
        background: "rgba(17, 24, 39, 0.72)",
        backdropFilter: "blur(12px)",
        border: "1px solid rgba(255, 255, 255, 0.1)",
      }}
      animate={{ y: ["-50%", "calc(-50% - 6px)", "-50%"] }}
      transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
    >
      <div className="flex justify-between items-center mb-4">
        <span className="text-[10px] font-bold text-slate-500 uppercase">In Progress</span>
        <span
          className="w-2 h-2 rounded-full bg-[#22D3EE]"
          style={{ boxShadow: "0 0 8px rgba(34,211,238,0.8)" }}
        />
      </div>
      <div className="space-y-3">
        <motion.div
          className="bg-white/5 p-3 rounded-lg border border-white/10 cursor-pointer"
          whileHover={{ y: -2 }}
          transition={{ duration: 0.2 }}
        >
          <div className="h-2 w-16 bg-[#22D3EE]/40 rounded mb-2" />
          <p className="text-[11px] font-medium text-slate-200">Refactor auth provider</p>
        </motion.div>
        <div className="bg-white/5 p-3 rounded-lg border border-white/5 opacity-50">
          <div className="h-2 w-12 bg-slate-500/40 rounded mb-2" />
          <p className="text-[11px] font-medium text-slate-500">Update API docs</p>
        </div>
      </div>
    </motion.div>
  );
}
