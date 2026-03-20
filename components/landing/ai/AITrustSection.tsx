"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";

const trustItems = [
  { title: "Zero-Trust Privacy", description: "Your data is never used to train global models. It stays within your silo.", color: "#22D3EE" },
  { title: "Verifiable Grounding", description: "Every claim made by the AI comes with a direct link to the source document.", color: "#6366F1" },
];

export function AITrustSection() {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-[#6366F1]/5 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
        {/* Text side */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            AI that stays grounded in{" "}
            <span className="text-[#22D3EE]">your reality.</span>
          </h2>
          <p className="text-slate-400 text-lg mb-8 leading-relaxed">
            Generic AI models hallucinate. Nexus AI is built on a &quot;Source-First&quot; architecture. Every answer provided includes verifiable citations to your team&apos;s specific documents and conversations.
          </p>

          <div className="space-y-6">
            {trustItems.map((item) => (
              <div key={item.title} className="flex gap-4">
                <div
                  className="w-6 h-6 rounded flex items-center justify-center shrink-0"
                  style={{ background: item.color + "33" }}
                >
                  <Check className="w-4 h-4" style={{ color: item.color }} />
                </div>
                <div>
                  <h5 className="font-bold text-sm mb-1">{item.title}</h5>
                  <p className="text-xs text-slate-400">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Visual side */}
        <motion.div
          className="rounded-3xl p-8 relative overflow-hidden"
          style={{
            background: "linear-gradient(145deg, rgba(31,41,55,0.4) 0%, rgba(17,24,39,0.8) 100%)",
            backdropFilter: "blur(8px)",
            border: "1px solid rgba(34, 211, 238, 0.3)",
          }}
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="absolute top-0 right-0 p-4">
            <span className="text-[10px] font-mono text-[#22D3EE] bg-[#22D3EE]/10 px-2 py-1 rounded">
              SECURE_TUNNEL_ACTIVE
            </span>
          </div>
          <div className="space-y-4 mb-8">
            <div className="h-2 w-3/4 bg-white/5 rounded" />
            <div className="h-2 w-1/2 bg-white/5 rounded" />
            <div className="h-2 w-5/6 bg-white/5 rounded" />
          </div>
          <div className="p-4 bg-[#22D3EE]/10 border border-[#22D3EE]/20 rounded-xl">
            <p className="text-xs text-[#22D3EE] font-mono leading-relaxed">
              &gt; Initializing Context Engine...<br />
              &gt; Linking Workspace &quot;Product_Delta&quot;<br />
              &gt; Security Layer: AES-256 Verified<br />
              &gt; Data Residency: EU-West-1 (Locked)
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
