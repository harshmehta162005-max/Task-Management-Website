"use client";

import { motion } from "framer-motion";

export function AnimatedAmbientBackground() {
  return (
    <>
      {/* Grid overlay */}
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          backgroundImage:
            "radial-gradient(circle at 2px 2px, rgba(255,255,255,0.05) 1px, transparent 0)",
          backgroundSize: "40px 40px",
        }}
      />

      {/* Primary glow orb - top left */}
      <motion.div
        className="absolute pointer-events-none z-0"
        style={{
          width: 600,
          height: 600,
          borderRadius: "50%",
          background: "#6366F1",
          filter: "blur(120px)",
          opacity: 0.15,
          top: -200,
          left: -100,
        }}
        animate={{ x: [0, 30, 0], y: [0, 20, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Violet glow orb - bottom right */}
      <motion.div
        className="absolute pointer-events-none z-0"
        style={{
          width: 600,
          height: 600,
          borderRadius: "50%",
          background: "#8B5CF6",
          filter: "blur(120px)",
          opacity: 0.15,
          bottom: -200,
          right: 100,
        }}
        animate={{ x: [0, -20, 0], y: [0, -30, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Subtle cyan accent orb */}
      <motion.div
        className="absolute pointer-events-none z-0"
        style={{
          width: 300,
          height: 300,
          borderRadius: "50%",
          background: "#22D3EE",
          filter: "blur(100px)",
          opacity: 0.07,
          top: "40%",
          right: "20%",
        }}
        animate={{ x: [0, 15, 0], y: [0, -15, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />
    </>
  );
}
