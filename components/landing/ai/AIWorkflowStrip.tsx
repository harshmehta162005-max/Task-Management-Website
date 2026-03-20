"use client";

import { motion } from "framer-motion";

const steps = [
  { label: "ASK", sub: "Input Data", color: "#6366F1", large: false },
  { label: "CONTEXT", sub: "Gather Info", color: "#22D3EE", large: false },
  { label: "ANALYZE", sub: "Model Processing", color: "#ffffff", large: false },
  { label: "RECOMMEND", sub: "Strategic Logic", color: "#6366F1", large: false },
  { label: "EXECUTE", sub: "Action Taken", color: "#6366F1", large: true },
];

export function AIWorkflowStrip() {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          className="rounded-[2rem] p-12 text-center relative"
          style={{
            background: "linear-gradient(145deg, rgba(31,41,55,0.4) 0%, rgba(17,24,39,0.8) 100%)",
            backdropFilter: "blur(8px)",
            border: "1px solid rgba(255,255,255,0.05)",
          }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="absolute inset-0 bg-[#6366F1]/5 rounded-[2rem] pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8 md:gap-4">
            {steps.map((step, i) => (
              <div key={step.label} className="contents">
                <motion.div
                  className="flex flex-col items-center group"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.12 }}
                >
                  <div
                    className={`flex items-center justify-center mb-4 rounded-full transition-all duration-500 ${
                      step.large ? "w-20 h-20" : "w-16 h-16"
                    }`}
                    style={
                      step.large
                        ? {
                            background: step.color,
                            boxShadow: `0 0 30px ${step.color}80`,
                          }
                        : {
                            background: "rgba(17, 24, 39, 0.72)",
                            backdropFilter: "blur(12px)",
                            border: "1px solid rgba(255,255,255,0.2)",
                          }
                    }
                  >
                    <span
                      className="text-xs font-bold"
                      style={{ color: step.large ? "#fff" : step.color }}
                    >
                      {step.label}
                    </span>
                  </div>
                  <p className={`text-xs font-medium ${step.large ? "font-bold text-white" : "text-slate-400"}`}>
                    {step.sub}
                  </p>
                </motion.div>

                {/* Connector line */}
                {i < steps.length - 1 && (
                  <div className="hidden md:block flex-1 h-[2px] bg-gradient-to-r from-[#6366F1] to-[#22D3EE] opacity-20" />
                )}
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
