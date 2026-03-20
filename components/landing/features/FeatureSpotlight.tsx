"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

/* ────────────────────────────────────────────── */
/* Spotlight data                                  */
/* ────────────────────────────────────────────── */
const spotlights = [
  {
    title: "Plan and execute from one workspace",
    description:
      "Stop jumping between tools. Nexus AI provides a unified board for high-level strategy and granular task execution.",
    bullets: ["Customizable Kanban & List views", "Integrated Gantt timelines"],
    reversed: false,
    visual: "board",
  },
  {
    title: "Keep the whole team in sync",
    description:
      "Never miss a beat with real-time activity feeds and context-aware notifications that only ping you when it matters.",
    avatars: ["AS", "MK"],
    reversed: true,
    visual: "activity",
  },
  {
    title: "Let AI do the heavy lifting",
    description:
      "Our integrated AI automatically extracts action items from your chats and summarizes long document threads into bullet points.",
    cta: { label: "Explore AI Agents", href: "/features" },
    reversed: false,
    visual: "ai",
  },
] as const;

/* ────────────────────────────────────────────── */
/* Mini visuals (right-side panels)                */
/* ────────────────────────────────────────────── */
function BoardVisual() {
  return (
    <div
      className="w-full rounded-2xl p-4 overflow-hidden"
      style={{
        background: "rgba(17, 24, 39, 0.72)",
        backdropFilter: "blur(12px)",
        border: "1px solid rgba(255,255,255,0.05)",
      }}
    >
      <div className="bg-slate-900/50 rounded-lg aspect-video flex flex-col p-4">
        <div className="flex gap-4 mb-4">
          <div className="w-1/3 h-2 bg-[#6366F1]/40 rounded" />
          <div className="w-1/3 h-2 bg-slate-800 rounded" />
          <div className="w-1/3 h-2 bg-slate-800 rounded" />
        </div>
        <div className="space-y-3">
          {[32, 24, 40].map((w, i) => (
            <div
              key={i}
              className="h-12 w-full rounded flex items-center px-4 justify-between"
              style={{
                background: "rgba(17, 24, 39, 0.72)",
                border: i === 2 ? "1px solid rgba(99,102,241,0.3)" : "1px solid rgba(255,255,255,0.05)",
              }}
            >
              <div className={`h-2 rounded ${i === 2 ? "bg-[#6366F1]/20" : "bg-white/10"}`} style={{ width: `${w * 4}px` }} />
              <div className={`w-6 h-6 rounded-full ${i === 2 ? "bg-[#6366F1]/40" : "bg-slate-800"}`} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ActivityVisual() {
  return (
    <div
      className="w-full rounded-2xl p-6"
      style={{
        background: "rgba(17, 24, 39, 0.72)",
        backdropFilter: "blur(12px)",
        border: "1px solid rgba(255,255,255,0.05)",
      }}
    >
      <div className="space-y-6">
        {[20, 24].map((w, i) => (
          <div key={i} className={`flex gap-4 ${i === 1 ? "opacity-70" : ""}`}>
            <div className="w-10 h-10 rounded-full bg-slate-800 shrink-0" />
            <div className="space-y-2 flex-1">
              <div className="h-2 bg-white/20 rounded" style={{ width: `${w * 4}px` }} />
              <div className={`h-3 bg-white/5 rounded ${i === 1 ? "w-3/4" : "w-full"}`} />
            </div>
          </div>
        ))}
        <div className="flex gap-4 border-l-2 border-[#6366F1] pl-4 py-2">
          <div className="w-10 h-10 rounded-full bg-[#6366F1]/20 shrink-0 flex items-center justify-center">
            <svg className="w-4 h-4 text-[#6366F1]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
            </svg>
          </div>
          <div className="space-y-2 flex-1">
            <div className="h-2 w-32 bg-[#6366F1]/30 rounded" />
            <div className="h-3 w-full bg-white/10 rounded" />
          </div>
        </div>
      </div>
    </div>
  );
}

function AIVisual() {
  return (
    <div
      className="w-full rounded-2xl p-1"
      style={{
        background: "rgba(17, 24, 39, 0.72)",
        backdropFilter: "blur(12px)",
        border: "1px solid rgba(34, 211, 238, 0.2)",
      }}
    >
      <div className="bg-slate-900 rounded-2xl p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#22D3EE]/10 blur-[60px]" />
        <div className="flex items-center gap-3 mb-6 relative">
          <svg className="w-5 h-5 text-[#22D3EE] animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          </svg>
          <span className="text-xs font-bold uppercase tracking-widest text-slate-400">AI Summary</span>
        </div>
        <div className="space-y-4 relative">
          <div className="flex items-start gap-3">
            <span className="text-[#22D3EE] text-lg">•</span>
            <div className="h-3 w-full bg-white/10 rounded mt-1.5" />
          </div>
          <div className="flex items-start gap-3">
            <span className="text-[#22D3EE] text-lg">•</span>
            <div className="h-3 w-4/5 bg-white/10 rounded mt-1.5" />
          </div>
          <div className="h-px w-full bg-white/5 my-6" />
          <div className="flex justify-between items-center">
            <span className="text-xs font-medium text-slate-500">3 tasks extracted</span>
            <button className="text-xs font-bold text-[#22D3EE] uppercase tracking-tighter hover:underline">Add to board</button>
          </div>
        </div>
      </div>
    </div>
  );
}

const visuals: Record<string, () => React.JSX.Element> = { board: BoardVisual, activity: ActivityVisual, ai: AIVisual };

/* ────────────────────────────────────────────── */
/* Main component                                  */
/* ────────────────────────────────────────────── */
export function FeatureSpotlight() {
  return (
    <section className="max-w-7xl mx-auto px-6 py-24 space-y-32">
      {spotlights.map((s, i) => {
        const Visual = visuals[s.visual];
        return (
          <motion.div
            key={s.title}
            className={`flex flex-col ${s.reversed ? "lg:flex-row-reverse" : "lg:flex-row"} items-center gap-16`}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            {/* Text side */}
            <div className="flex-1">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">{s.title}</h2>
              <p className="text-slate-400 text-lg leading-relaxed mb-8">{s.description}</p>

              {"bullets" in s && (
                <ul className="space-y-4">
                  {s.bullets.map((b) => (
                    <li key={b} className="flex items-center gap-3 text-slate-300">
                      <CheckCircle2 className="w-5 h-5 text-[#6366F1]" />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              )}

              {"avatars" in s && (
                <div className="flex -space-x-4 mb-8">
                  <div className="w-12 h-12 rounded-full border-4 border-slate-900 bg-slate-700" />
                  {s.avatars.map((a) => (
                    <div
                      key={a}
                      className="w-12 h-12 rounded-full border-4 border-slate-900 bg-[#6366F1]/30 flex items-center justify-center text-xs font-bold"
                    >
                      {a}
                    </div>
                  ))}
                  <div className="w-12 h-12 rounded-full border-4 border-slate-900 bg-slate-800 flex items-center justify-center text-xs font-medium text-slate-400">
                    +12
                  </div>
                </div>
              )}

              {"cta" in s && (
                <Link
                  href={s.cta.href}
                  className="inline-block bg-[#6366F1]/20 hover:bg-[#6366F1]/30 text-[#6366F1] font-bold py-3 px-6 rounded-lg transition-all border border-[#6366F1]/20"
                >
                  {s.cta.label}
                </Link>
              )}
            </div>

            {/* Visual side */}
            <div className="flex-1 w-full">
              <Visual />
            </div>
          </motion.div>
        );
      })}
    </section>
  );
}
