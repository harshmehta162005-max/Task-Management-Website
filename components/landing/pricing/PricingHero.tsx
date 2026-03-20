"use client";

import { motion } from "framer-motion";
import { BillingToggle } from "./BillingToggle";

type PricingHeroProps = {
  isYearly: boolean;
  onToggle: () => void;
};

export function PricingHero({ isYearly, onToggle }: PricingHeroProps) {
  return (
    <section className="max-w-4xl mx-auto text-center mb-16 pt-32 px-6">
      <motion.div
        className="inline-block px-3 py-1 rounded-full border border-[#6366F1]/30 bg-[#6366F1]/10 text-[#6366F1] text-xs font-semibold tracking-wider uppercase mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Simple Pricing
      </motion.div>

      <motion.h1
        className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-b from-white to-slate-400"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        Pricing that scales with your team.
      </motion.h1>

      <motion.p
        className="text-lg text-slate-400 max-w-2xl mx-auto mb-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.25 }}
      >
        Start free, upgrade when your team needs more power, automation, and AI workflows.
      </motion.p>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <BillingToggle isYearly={isYearly} onToggle={onToggle} />
      </motion.div>
    </section>
  );
}
