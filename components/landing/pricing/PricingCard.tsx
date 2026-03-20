"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Check } from "lucide-react";

type PricingCardProps = {
  name: string;
  description: string;
  price: string;
  period: string;
  features: string[];
  ctaLabel: string;
  ctaHref: string;
  highlighted?: boolean;
  badge?: string;
  checkColor: string;
  index: number;
};

export function PricingCard({
  name,
  description,
  price,
  period,
  features,
  ctaLabel,
  ctaHref,
  highlighted,
  badge,
  checkColor,
  index,
}: PricingCardProps) {
  return (
    <motion.div
      className={`p-8 rounded-3xl flex flex-col h-full relative transition-all duration-300 hover:-translate-y-1 ${
        highlighted ? "scale-105 z-10" : ""
      }`}
      style={{
        background: "rgba(17, 24, 39, 0.72)",
        backdropFilter: "blur(12px)",
        border: highlighted
          ? "1px solid rgba(99, 102, 241, 0.5)"
          : "1px solid rgba(255,255,255,0.08)",
        boxShadow: highlighted ? "0 0 25px -5px rgba(99, 102, 241, 0.3)" : undefined,
      }}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.15 }}
      whileHover={{
        borderColor: highlighted ? "rgba(99,102,241,0.7)" : "rgba(255,255,255,0.2)",
      }}
    >
      {/* Badge */}
      {badge && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#6366F1] text-white text-[10px] font-bold uppercase tracking-widest px-4 py-1 rounded-full shadow-lg">
          {badge}
        </div>
      )}

      {/* Header */}
      <div className="mb-8">
        <h3 className={`text-xl font-semibold mb-2 ${highlighted ? "text-white" : ""}`}>{name}</h3>
        <p className="text-slate-400 text-sm">{description}</p>
      </div>

      {/* Price */}
      <div className="mb-8">
        <span className={`text-4xl font-bold ${highlighted ? "text-white" : ""}`}>{price}</span>
        <span className="text-slate-400 text-sm">{period}</span>
      </div>

      {/* Features */}
      <ul className={`space-y-4 mb-10 flex-grow text-sm ${highlighted ? "text-white" : "text-slate-400"}`}>
        {features.map((feat) => (
          <li key={feat} className="flex items-center gap-3">
            <Check className="w-5 h-5 shrink-0" style={{ color: checkColor }} />
            {feat}
          </li>
        ))}
      </ul>

      {/* CTA */}
      {highlighted ? (
        <Link
          href={ctaHref}
          className="w-full py-3 rounded-xl bg-[#6366F1] hover:bg-[#6366F1]/90 transition-all font-semibold text-sm text-center block"
          style={{ boxShadow: "0 10px 25px -5px rgba(99, 102, 241, 0.2)" }}
        >
          {ctaLabel}
        </Link>
      ) : (
        <Link
          href={ctaHref}
          className="w-full py-3 rounded-xl border border-white/10 hover:bg-white/5 transition-colors font-semibold text-sm text-center block"
        >
          {ctaLabel}
        </Link>
      )}
    </motion.div>
  );
}
