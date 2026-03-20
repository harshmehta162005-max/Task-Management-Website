"use client";

import { Download } from "lucide-react";
import { cn } from "@/lib/utils/cn";

type Props = {
  onClick?: () => void;
  className?: string;
};

export function ExportButton({ onClick, className }: Props) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-white/5",
        className
      )}
    >
      <Download className="h-4 w-4" />
      Export CSV
    </button>
  );
}
