import { Calendar } from "lucide-react";

type Props = {
  from: string;
  to: string;
  onChange: (from: string, to: string) => void;
};

export function DateRangePicker({ from, to, onChange }: Props) {
  return (
    <div className="flex flex-col gap-1 text-slate-600 dark:text-slate-200">
      <span className="text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">Due date</span>
      <div className="grid grid-cols-2 gap-2">
        <div className="relative">
          <Calendar className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="date"
            value={from}
            onChange={(e) => onChange(e.target.value, to)}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-slate-700 dark:bg-[#111827] dark:text-slate-100"
          />
        </div>
        <div className="relative">
          <Calendar className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="date"
            value={to}
            onChange={(e) => onChange(from, e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-slate-700 dark:bg-[#111827] dark:text-slate-100"
          />
        </div>
      </div>
    </div>
  );
}

