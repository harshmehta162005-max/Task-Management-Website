"use client";

import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import type { ReactNode } from "react";

type Props = {
  icon: ReactNode;
  title: string;
  subtitle?: string;
  active?: boolean;
  onClick?: () => void;
};

export function SearchResultRow({ icon, title, subtitle, active, onClick }: Props) {
  return (
    <button
      role="option"
      aria-selected={active}
      onClick={onClick}
      className={cn(
        "group flex w-full items-center gap-3 rounded-xl border border-transparent px-3 py-2.5 text-left transition hover:border-primary/30 hover:bg-primary/5",
        active && "border-primary/40 bg-primary/5"
      )}
    >
      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-600 dark:bg-white/5 dark:text-slate-200">
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-slate-900 dark:text-slate-100">{title}</p>
        {subtitle ? <p className="truncate text-xs text-slate-500 dark:text-slate-400">{subtitle}</p> : null}
      </div>
      <ChevronRight className={cn("h-4 w-4 text-slate-400 transition", active && "text-primary")} />
    </button>
  );
}
