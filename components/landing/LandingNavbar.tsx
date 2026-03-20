"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

const navLinks = [
  { label: "Features", href: "/features" },
  { label: "AI", href: "/ai" },
  { label: "Pricing", href: "/pricing" },
];

export function LandingNavbar() {
  const pathname = usePathname();

  return (
    <motion.header
      className="fixed top-0 w-full z-50 px-4 sm:px-8 py-4"
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
    >
      <nav className="max-w-7xl mx-auto flex items-center justify-between rounded-full px-6 py-3 border border-white/10"
        style={{ background: "rgba(17, 24, 39, 0.72)", backdropFilter: "blur(12px)" }}
      >
        <div className="flex items-center gap-8">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-tr from-[#6366F1] to-[#22D3EE] rounded-lg flex items-center justify-center">
              <span className="font-bold text-white text-xl leading-none">N</span>
            </div>
            <span className="text-xl font-bold tracking-tight text-white">Nexus</span>
          </Link>

          {/* Nav links */}
          <ul className="hidden md:flex items-center gap-6 text-sm font-medium">
            {navLinks.map((link) => {
              const active = pathname === link.href;
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={`transition-colors ${
                      active
                        ? "text-[#6366F1] font-semibold"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="flex items-center gap-4">
          <Link
            href="/login"
            className="text-sm font-medium text-slate-400 hover:text-white transition-colors px-4 py-2"
          >
            Login
          </Link>
          <Link
            href="/signup"
            className="bg-white text-[#060A12] px-5 py-2 rounded-full text-sm font-semibold hover:bg-slate-200 transition-colors shadow-lg shadow-white/10"
          >
            Get Started
          </Link>
        </div>
      </nav>
    </motion.header>
  );
}

