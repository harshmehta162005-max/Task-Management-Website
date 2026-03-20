import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils/cn";

type Props = {
  label: string;
  value: string | number;
  delta?: string;
  deltaColor?: "green" | "red" | "slate";
  icon: LucideIcon;
};

const deltaStyles: Record<NonNullable<Props["deltaColor"]>, string> = {
  green: "text-emerald-500 bg-emerald-500/10",
  red: "text-rose-500 bg-rose-500/10",
  slate: "text-slate-400 bg-slate-200 dark:bg-white/10",
};

export function StatCard({ label, value, delta, deltaColor = "slate", icon: Icon }: Props) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-[#111827]">
      <div className="mb-4 flex items-center justify-between">
        <div className="rounded-lg bg-primary/10 p-2">
          <Icon className="h-5 w-5 text-primary" />
        </div>
        {delta ? (
          <span className={cn("text-xs font-bold px-2 py-1 rounded-full", deltaStyles[deltaColor])}>{delta}</span>
        ) : null}
      </div>
      <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{label}</p>
      <p className="mt-1 text-2xl font-bold text-slate-900 dark:text-white">{value}</p>
    </div>
  );
}
