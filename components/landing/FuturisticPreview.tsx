"use client";

import { motion } from "framer-motion";
import { AIAssistantPreview } from "./AIAssistantPreview";
import { MiniKanbanPreview } from "./MiniKanbanPreview";
import { TeamActivityPreview } from "./TeamActivityPreview";
import { SmartInsightsPreview } from "./SmartInsightsPreview";

export function FuturisticPreview() {
  return (
    <section className="hidden lg:block w-[58%] h-full relative overflow-hidden">
      <div className="absolute inset-0 flex items-center justify-center p-12">
        {/* Main command center panel */}
        <motion.div
          className="relative w-full max-w-4xl aspect-[16/10] rounded-2xl p-1 shadow-2xl"
          style={{
            background: "rgba(17, 24, 39, 0.72)",
            backdropFilter: "blur(12px)",
            border: "1px solid rgba(255, 255, 255, 0.2)",
          }}
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
        >
          <div className="w-full h-full bg-slate-900/40 rounded-[14px] overflow-hidden flex">
            {/* Mock Sidebar */}
            <div className="w-16 border-r border-white/10 flex flex-col items-center py-6 gap-6">
              <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10" />
              <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10" />
              <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10" />
            </div>

            {/* Mock Content */}
            <div className="flex-1 p-8">
              <div className="h-6 w-48 bg-white/10 rounded mb-8" />
              <div className="grid grid-cols-3 gap-6">
                <div className="h-32 bg-white/5 border border-white/10 rounded-xl" />
                <div className="h-32 bg-white/5 border border-white/10 rounded-xl" />
                <div className="h-32 bg-white/5 border border-white/10 rounded-xl" />
              </div>
            </div>
          </div>

          {/* Floating panels */}
          <AIAssistantPreview />
          <MiniKanbanPreview />
          <TeamActivityPreview />
          <SmartInsightsPreview />
        </motion.div>
      </div>
    </section>
  );
}
