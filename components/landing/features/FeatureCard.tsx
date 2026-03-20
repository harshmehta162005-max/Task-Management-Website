"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

type FeatureCardProps = {
  icon: ReactNode;
  title: string;
  description: string;
  accentColor: string;
  index: number;
};

export function FeatureCard({ icon, title, description, accentColor, index }: FeatureCardProps) {
  return (
    <motion.div
      className="p-8 rounded-2xl group transition-all cursor-default"
      style={{
        background: "rgba(17, 24, 39, 0.72)",
        backdropFilter: "blur(12px)",
        border: "1px solid rgba(255, 255, 255, 0.08)",
      }}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{
        y: -4,
        borderColor: accentColor + "66",
        transition: { duration: 0.2 },
      }}
    >
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform"
        style={{ background: accentColor + "1a", color: accentColor }}
      >
        {icon}
      </div>
      <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
      <p className="text-slate-400 text-sm leading-relaxed mb-6">{description}</p>
      <div
        className="h-1 w-12 rounded group-hover:w-full transition-all duration-500"
        style={{ background: accentColor + "4d" }}
      />
    </motion.div>
  );
}
