"use client";

import { useState } from "react";
import { cn } from "@/lib/utils/cn";

type Props = {
  label: string;
  description: string;
  checked: boolean;
  disabled?: boolean;
  onChange: (checked: boolean) => void;
};

function HoverTip({ text, children }: { text: string; children: React.ReactNode }) {
  const [show, setShow] = useState(false);

  return (
    <span
      className="relative inline-flex max-w-full"
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      {children}
      {show && text && (
        <span
          className="pointer-events-none absolute bottom-full left-0 z-50 mb-2 w-max max-w-[320px] rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs leading-relaxed font-medium text-slate-800 shadow-lg dark:border-slate-700 dark:bg-[#1e293b] dark:text-slate-100"
        >
          {text}
          <span className="absolute -bottom-1 left-4 h-2 w-2 rotate-45 border-b border-r border-slate-200 bg-white dark:border-slate-700 dark:bg-[#1e293b]" />
        </span>
      )}
    </span>
  );
}

export function PermissionToggleRow({ label, description, checked, disabled, onChange }: Props) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-xl p-3 hover:bg-slate-50 dark:hover:bg-white/5">
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-slate-900 dark:text-white">{label}</p>
        <HoverTip text={description}>
          <p className="truncate text-xs text-slate-500 dark:text-slate-400 cursor-default">{description}</p>
        </HoverTip>
      </div>
      <button
        onClick={() => !disabled && onChange(!checked)}
        className={cn(
          "relative h-6 w-11 shrink-0 rounded-full transition-colors",
          checked ? "bg-primary" : "bg-slate-300 dark:bg-slate-700",
          disabled && "cursor-not-allowed opacity-60"
        )}
        aria-pressed={checked}
      >
        <span
          className={cn(
            "absolute top-1/2 h-4 w-4 -translate-y-1/2 rounded-full bg-white shadow-sm transition-all",
            checked ? "right-1" : "left-1"
          )}
        />
      </button>
    </div>
  );
}
