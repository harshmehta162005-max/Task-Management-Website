import { Info } from "lucide-react";
import { cn } from "@/lib/utils/cn";

type Props = {
  value: string;
  onChange: (value: string) => void;
  prefix?: string;
  error?: string;
};

export function SlugInput({ value, onChange, prefix = "teamos.com/", error }: Props) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Workspace Slug</label>
      <div className="flex items-center">
        <span className="inline-flex items-center rounded-l-xl border border-r-0 border-slate-200 bg-slate-100 px-4 py-3 text-sm text-slate-500 dark:border-white/10 dark:bg-slate-800 dark:text-slate-400">
          {prefix}
        </span>
        <input
          className={cn(
            "w-full rounded-r-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 transition-all placeholder:text-slate-400 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-white/10 dark:bg-slate-900/50 dark:text-white",
            error && "border-red-500 focus:border-red-500 focus:ring-red-200"
          )}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>
      <div className="flex items-start gap-1.5 px-1">
        <Info className="mt-0.5 h-4 w-4 text-slate-400 dark:text-slate-500" />
        <p className="text-[12px] leading-tight text-slate-400 dark:text-slate-500">lowercase, hyphens, 3-30 chars</p>
      </div>
      {error ? <p className="text-xs font-semibold text-red-500">{error}</p> : null}
    </div>
  );
}
