"use client";

import { motion } from "framer-motion";

export function TeamActivityPreview() {
  return (
    <motion.div
      className="absolute -bottom-8 left-12 w-72 rounded-xl p-4 shadow-2xl z-10"
      style={{
        background: "rgba(17, 24, 39, 0.72)",
        backdropFilter: "blur(12px)",
        border: "1px solid rgba(255, 255, 255, 0.1)",
      }}
      animate={{ y: [0, -5, 0] }}
      transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
    >
      <h4 className="text-[10px] font-bold text-slate-500 uppercase mb-3">Live Coordination</h4>
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-7 h-7 rounded-full border border-white/20 bg-gradient-to-br from-[#6366F1] to-[#22D3EE] flex items-center justify-center">
              <span className="text-[9px] font-bold text-white">SM</span>
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 w-2 h-2 bg-green-500 rounded-full border border-slate-900" />
          </div>
          <div>
            <p className="text-[11px] font-semibold text-slate-200">
              Sarah M. <span className="text-slate-500 font-normal">updated</span> Roadmap
            </p>
            <p className="text-[9px] text-slate-500">2 mins ago</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-7 h-7 rounded-full border border-white/20 bg-gradient-to-br from-[#8B5CF6] to-[#6366F1] flex items-center justify-center">
              <span className="text-[9px] font-bold text-white">AC</span>
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 w-2 h-2 bg-yellow-500 rounded-full border border-slate-900" />
          </div>
          <div>
            <p className="text-[11px] font-semibold text-slate-200">
              Alex Chen <span className="text-slate-500 font-normal">commented</span>
            </p>
            <p className="text-[9px] text-slate-500">5 mins ago</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
