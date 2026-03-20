"use client";

import { Search } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { useSearch } from "@/components/search/SearchProvider";

export function GlobalSearchTrigger() {
  const { setOpen } = useSearch();
  return (
    <button
      type="button"
      className={cn(
        "group hidden items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-600 transition-all hover:border-primary/40 hover:bg-white dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:border-primary/40 sm:inline-flex"
      )}
      aria-label="Open search"
      onClick={() => setOpen(true)}
    >
      <Search className="h-4 w-4 text-slate-400 group-hover:text-primary" />
      <span className="hidden md:block">Search... (⌘K)</span>
    </button>
  );
}
