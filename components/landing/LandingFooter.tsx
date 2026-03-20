"use client";

import Link from "next/link";

export function LandingFooter() {
  return (
    <footer className="border-t border-white/5 pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-12 mb-16">
          {/* Brand block */}
          <div className="col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-6">
              <div className="w-6 h-6 bg-gradient-to-tr from-[#6366F1] to-[#22D3EE] rounded-md flex items-center justify-center">
                <span className="font-bold text-white text-sm leading-none">N</span>
              </div>
              <span className="text-lg font-bold tracking-tight text-white">Nexus AI</span>
            </Link>
            <p className="text-slate-500 text-sm max-w-xs leading-relaxed">
              The intelligent operating system for modern high-growth teams. Designed for clarity and performance.
            </p>
          </div>

          {/* Product */}
          <div>
            <h4 className="text-white font-bold mb-6 text-sm">Product</h4>
            <ul className="space-y-4 text-sm text-slate-500">
              <li><Link href="/features" className="hover:text-[#6366F1] transition-colors">Features</Link></li>
              <li><a href="#" className="hover:text-[#6366F1] transition-colors">Integrations</a></li>
              <li><a href="#" className="hover:text-[#6366F1] transition-colors">Enterprise</a></li>
              <li><a href="#" className="hover:text-[#6366F1] transition-colors">Changelog</a></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-white font-bold mb-6 text-sm">Company</h4>
            <ul className="space-y-4 text-sm text-slate-500">
              <li><a href="#" className="hover:text-[#6366F1] transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-[#6366F1] transition-colors">Careers</a></li>
              <li><a href="#" className="hover:text-[#6366F1] transition-colors">Security</a></li>
              <li><a href="#" className="hover:text-[#6366F1] transition-colors">Privacy</a></li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="text-white font-bold mb-6 text-sm">Social</h4>
            <ul className="space-y-4 text-sm text-slate-500">
              <li><a href="#" className="hover:text-[#6366F1] transition-colors">Twitter</a></li>
              <li><a href="#" className="hover:text-[#6366F1] transition-colors">LinkedIn</a></li>
              <li><a href="#" className="hover:text-[#6366F1] transition-colors">GitHub</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col md:flex-row items-center justify-between border-t border-white/5 pt-8 gap-4">
          <p className="text-slate-600 text-xs">© 2026 Nexus AI Inc. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <a href="#" className="text-slate-600 hover:text-white transition-colors text-xs">Terms</a>
            <a href="#" className="text-slate-600 hover:text-white transition-colors text-xs">Privacy</a>
            <a href="#" className="text-slate-600 hover:text-white transition-colors text-xs">Status</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
