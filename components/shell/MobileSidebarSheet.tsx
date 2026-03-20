"use client";

import { X } from "lucide-react";
import { useShell } from "./useShell";
import { Sidebar } from "./Sidebar";
import { cn } from "@/lib/utils/cn";

export function MobileSidebarSheet() {
  const { mobileOpen, setMobileOpen } = useShell();

  return (
    <div
      className={cn(
        "fixed inset-0 z-30 bg-black/40 backdrop-blur-sm transition-opacity duration-200",
        mobileOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
      )}
      aria-hidden={!mobileOpen}
    >
      <div className="flex h-full">
        <div className="relative h-full w-[280px] max-w-[90vw] bg-white shadow-2xl dark:bg-background-dark">
          <button
            type="button"
            className="absolute right-3 top-3 inline-flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-slate-100 dark:hover:bg-slate-800"
            onClick={() => setMobileOpen(false)}
            aria-label="Close navigation"
          >
            <X className="h-5 w-5" />
          </button>
          <Sidebar variant="mobile" />
        </div>
        <div className="flex-1" onClick={() => setMobileOpen(false)} />
      </div>
    </div>
  );
}
