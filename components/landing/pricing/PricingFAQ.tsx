"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    q: "Can I switch plans later?",
    a: "Yes, you can upgrade or downgrade your plan at any time. Changes will be reflected in your next billing cycle.",
  },
  {
    q: "Is there a free trial for the Pro plan?",
    a: "We offer a 14-day free trial for both Pro and Business plans so your team can experience the full power of Nexus AI.",
  },
  {
    q: "How secure is our data?",
    a: "Security is our priority. We use AES-256 encryption at rest and TLS for data in transit. Business plans include advanced compliance features.",
  },
  {
    q: "Is AI included in all plans?",
    a: "Basic AI summaries are available on all plans. Advanced features like meeting transcription, workspace Q&A, and smart automation are available on Pro and Business.",
  },
  {
    q: "Can I invite unlimited members?",
    a: "Free plans support up to 5 members. Pro supports up to 10. Business plans offer unlimited team members with role-based access control.",
  },
];

export function PricingFAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <motion.section
      className="max-w-3xl mx-auto mb-32 px-6"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      <h2 className="text-2xl font-bold mb-8 text-center">Frequently Asked Questions</h2>
      <div className="space-y-4">
        {faqs.map((faq, i) => (
          <div
            key={faq.q}
            className="rounded-xl overflow-hidden"
            style={{
              background: "rgba(17, 24, 39, 0.72)",
              backdropFilter: "blur(12px)",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            <button
              className="flex items-center justify-between w-full p-6 text-left"
              onClick={() => setOpenIndex(openIndex === i ? null : i)}
            >
              <span className="font-medium">{faq.q}</span>
              <ChevronDown
                className={`w-5 h-5 text-slate-400 transition-transform duration-300 shrink-0 ml-4 ${
                  openIndex === i ? "rotate-180" : ""
                }`}
              />
            </button>
            <AnimatePresence>
              {openIndex === i && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="px-6 pb-6 text-slate-400 text-sm">{faq.a}</div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </motion.section>
  );
}
