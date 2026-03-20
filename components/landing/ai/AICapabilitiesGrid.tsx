"use client";

import { motion } from "framer-motion";
import {
  CalendarDays,
  FileText,
  MessageSquare,
  Zap,
  Lock,
  TrendingUp,
} from "lucide-react";

const capabilities = [
  {
    icon: <CalendarDays className="w-6 h-6" />,
    title: "Meeting Notes → Tasks",
    description: "Automatically extract action items from video calls and sync them directly to your project boards.",
    color: "#6366F1",
  },
  {
    icon: <FileText className="w-6 h-6" />,
    title: "Project Summaries",
    description: "Get caught up in seconds. AI-generated executive summaries for complex, multi-week project threads.",
    color: "#22D3EE",
  },
  {
    icon: <MessageSquare className="w-6 h-6" />,
    title: "Workspace Q&A",
    description: "Natural language search that actually works. Ask about anything across documents, tasks, and chats.",
    color: "#A78BFA",
  },
  {
    icon: <Zap className="w-6 h-6" />,
    title: "Smart Automation",
    description: "Nexus learns your repetitive habits and suggests no-code automations to handle them for you.",
    color: "#22D3EE",
  },
  {
    icon: <Lock className="w-6 h-6" />,
    title: "Enterprise Security",
    description: "Your data is yours. Enterprise-grade encryption and source-based grounding ensure total control.",
    color: "#ffffff",
  },
  {
    icon: <TrendingUp className="w-6 h-6" />,
    title: "Trend Insights",
    description: "Identify velocity bottlenecks before they become problems with AI-powered trend analysis.",
    color: "#6366F1",
  },
];

export function AICapabilitiesGrid() {
  return (
    <section className="py-24 relative">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            Intelligence at every{" "}
            <span className="bg-gradient-to-r from-[#6366F1] to-[#A5B4FC] bg-clip-text text-transparent">touchpoint.</span>
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Nexus AI isn&apos;t a sidecar; it&apos;s the engine. Every interaction is enhanced by deep contextual awareness.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {capabilities.map((cap, i) => (
            <motion.div
              key={cap.title}
              className="p-8 rounded-3xl cursor-default transition-all duration-300 hover:-translate-y-1"
              style={{
                background: "linear-gradient(145deg, rgba(31,41,55,0.4) 0%, rgba(17,24,39,0.8) 100%)",
                backdropFilter: "blur(8px)",
                border: "1px solid rgba(255,255,255,0.05)",
              }}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              whileHover={{
                borderColor: cap.color + "66",
                boxShadow: `0 20px 40px -15px rgba(0,0,0,0.5)`,
              }}
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-6 border"
                style={{
                  background: cap.color + "1a",
                  borderColor: cap.color + "33",
                  color: cap.color,
                }}
              >
                {cap.icon}
              </div>
              <h3 className="text-xl font-bold mb-3">{cap.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{cap.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
