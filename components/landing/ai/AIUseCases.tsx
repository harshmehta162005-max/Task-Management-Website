"use client";

import { motion } from "framer-motion";
import { BarChart3, Users, Settings } from "lucide-react";

const useCases = [
  {
    title: "For Managers",
    description: "Gain a bird's-eye view of team velocity and project health without reading a hundred messages.",
    icon: <BarChart3 className="w-12 h-12 opacity-50" />,
    color: "#6366F1",
    bullets: ["Automatic workload distribution alerts", "Weekly executive project summaries"],
  },
  {
    title: "For Team Members",
    titleColor: "#22D3EE",
    description: "Focus on deep work while AI handles the administrative overhead and updates your status.",
    icon: <Users className="w-12 h-12 opacity-50" />,
    color: "#22D3EE",
    bullets: ["Context-aware task prioritization", 'Instant answers to "Where is that file?"'],
  },
  {
    title: "For Operations",
    description: "Standardize workflows and maintain data hygiene effortlessly across the organization.",
    icon: <Settings className="w-12 h-12 opacity-30" />,
    color: "#ffffff",
    bullets: ["AI-driven workflow auditing", "Automated data tagging & taxonomy"],
  },
];

export function AIUseCases() {
  return (
    <section className="py-24">
      <div className="max-w-7xl mx-auto px-6">
        <motion.h2
          className="text-3xl md:text-5xl font-bold mb-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          Built for every{" "}
          <span className="bg-gradient-to-r from-[#6366F1] to-[#A5B4FC] bg-clip-text text-transparent">stakeholder.</span>
        </motion.h2>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {useCases.map((uc, i) => (
            <motion.div
              key={uc.title}
              className="rounded-3xl overflow-hidden transition-all duration-300 hover:-translate-y-1"
              style={{
                background: "linear-gradient(145deg, rgba(31,41,55,0.4) 0%, rgba(17,24,39,0.8) 100%)",
                backdropFilter: "blur(8px)",
                border: `1px solid ${i === 1 ? uc.color + "33" : "rgba(255,255,255,0.05)"}`,
              }}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              whileHover={{
                borderColor: uc.color + "66",
                boxShadow: "0 20px 40px -15px rgba(0,0,0,0.5)",
              }}
            >
              {/* Visual header */}
              <div
                className="h-48 p-8"
                style={{ background: `linear-gradient(to bottom right, ${uc.color}33, transparent)` }}
              >
                <div className="w-full h-full border border-dashed border-white/10 rounded-xl flex items-center justify-center">
                  <span style={{ color: uc.color }}>{uc.icon}</span>
                </div>
              </div>

              {/* Content */}
              <div className="p-8">
                <h4
                  className="text-xl font-bold mb-3"
                  style={{ color: uc.titleColor || "#fff" }}
                >
                  {uc.title}
                </h4>
                <p className="text-slate-400 text-sm mb-6">{uc.description}</p>
                <ul className="space-y-3 text-xs text-white/70">
                  {uc.bullets.map((b) => (
                    <li key={b} className="flex items-center gap-2">
                      <div className="w-1 h-1 rounded-full" style={{ background: uc.color }} />
                      {b}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
