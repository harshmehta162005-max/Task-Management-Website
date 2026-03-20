"use client";

import { motion } from "framer-motion";
import { Zap, ArrowRight } from "lucide-react";

export function AIPreviewPanel() {
  return (
    <motion.div
      className="rounded-3xl p-6 border border-white/10"
      style={{
        background: "linear-gradient(145deg, rgba(31,41,55,0.4) 0%, rgba(17,24,39,0.8) 100%)",
        backdropFilter: "blur(8px)",
        boxShadow: "0 0 40px -10px rgba(99, 102, 241, 0.3)",
      }}
      animate={{ y: [0, -8, 0] }}
      transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#6366F1] to-[#22D3EE] flex items-center justify-center">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <div>
            <h4 className="text-sm font-bold">Nexus AI Agent</h4>
            <p className="text-[10px] text-[#22D3EE]">Active in #product-sync</p>
          </div>
        </div>
        <div className="flex gap-1">
          <div className="w-1.5 h-1.5 rounded-full bg-white/20" />
          <div className="w-1.5 h-1.5 rounded-full bg-white/20" />
          <div className="w-1.5 h-1.5 rounded-full bg-white/20" />
        </div>
      </div>

      {/* Chat */}
      <div className="space-y-6">
        <div className="flex gap-4">
          <motion.div
            className="flex-1 bg-white/5 p-4 rounded-2xl rounded-tl-none border border-white/5"
            style={{ background: "rgba(17, 24, 39, 0.72)", backdropFilter: "blur(12px)" }}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <p className="text-sm leading-relaxed">
              &quot;Based on our last 3 meetings, project &apos;Nebula&apos; is 82% complete but facing a bottleneck in QA. Should I draft an escalation report for Sarah?&quot;
            </p>
            {/* Citations */}
            <div className="mt-3 flex flex-wrap gap-2">
              <span className="text-[10px] bg-white/10 px-2 py-1 rounded text-slate-400">Source: Q3 Roadmap</span>
              <span className="text-[10px] bg-white/10 px-2 py-1 rounded text-slate-400">Source: Slack #dev</span>
            </div>
          </motion.div>
        </div>

        {/* Action buttons */}
        <motion.div
          className="flex flex-wrap gap-2 justify-end"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          <button className="px-4 py-2 rounded-lg bg-[#6366F1]/20 border border-[#6366F1]/40 text-xs font-semibold text-[#6366F1]">
            Draft Report
          </button>
          <button
            className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-xs font-semibold"
          >
            Reschedule QA Sync
          </button>
        </motion.div>
      </div>

      {/* Input */}
      <div className="mt-10 pt-4 border-t border-white/5">
        <div className="w-full bg-white/5 rounded-xl px-4 py-3 text-xs text-slate-400 border border-white/5 flex justify-between items-center">
          <span>Ask Nexus anything...</span>
          <ArrowRight className="w-4 h-4" />
        </div>
      </div>
    </motion.div>
  );
}
