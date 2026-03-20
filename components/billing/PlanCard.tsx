"use client";

import { cn } from "@/lib/utils/cn";

type Props = {
  name: string;
  price: string;
  period?: string;
  features: string[];
  highlighted?: boolean;
  badge?: string;
  ctaLabel: string;
  disabled?: boolean;
  onSelect?: () => void;
};

export function PlanCard({ name, price, period, features, highlighted, badge, ctaLabel, disabled, onSelect }: Props) {
  return (
    <div
      className={cn(
        "relative flex h-full flex-col rounded-2xl border p-5 shadow-sm dark:border-slate-800",
        highlighted
          ? "border-primary"
          : "border-slate-200 bg-white dark:border-slate-800 dark:bg-[#0f172a]"
      )}
    >
      {badge && (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-3 py-1 text-[10px] font-black uppercase text-white">
          {badge}
        </span>
      )}
      <p className={cn("text-sm font-semibold uppercase tracking-wide", highlighted ? "text-primary" : "text-slate-500 dark:text-slate-400")}>
        {name}
      </p>
      <h4 className="mt-2 text-2xl font-bold text-slate-900 dark:text-slate-100">
        {price} <span className="text-sm font-normal text-slate-500 dark:text-slate-400">{period}</span>
      </h4>
      <ul className="mt-4 space-y-2 text-sm text-slate-600 dark:text-slate-300">
        {features.map((f) => (
          <li key={f} className="flex items-start gap-2">
            <span className="text-primary">•</span>
            <span>{f}</span>
          </li>
        ))}
      </ul>
      <button
        onClick={onSelect}
        disabled={disabled}
        className={cn(
          "mt-6 w-full rounded-xl px-4 py-2.5 text-sm font-semibold transition",
          highlighted
            ? "bg-primary text-white shadow-sm shadow-primary/20 hover:bg-primary/90"
            : "bg-slate-900 text-white hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200",
          disabled && "cursor-not-allowed bg-slate-200 text-slate-500 dark:bg-slate-800 dark:text-slate-500"
        )}
      >
        {ctaLabel}
      </button>
    </div>
  );
}
