import { Filter, ArrowDownUp, CheckCircle2, AlertCircle } from "lucide-react";
import { Select } from "@/components/ui/Select";
import { cn } from "@/lib/utils/cn";

type Props = {
  focusMode: boolean;
  onToggleFocus: (value: boolean) => void;
  sort: string;
  onSortChange: (value: string) => void;
  tasksDueToday: number;
  tasksOverdue: number;
};

const sortOptions = [
  { value: "due", label: "Due date" },
  { value: "priority", label: "Priority" },
  { value: "updated", label: "Updated" },
];

export function MyTasksHeader({ focusMode, onToggleFocus, sort, onSortChange, tasksDueToday, tasksOverdue }: Props) {
  // A simple greeting based on the hour
  const hour = new Date().getHours();
  let greeting = "Good evening";
  if (hour < 12) greeting = "Good morning";
  else if (hour < 17) greeting = "Good afternoon";

  return (
    <header className="mb-8 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-[#0B0F17]">
      <div className="border-b border-slate-100 p-6 dark:border-slate-800/50">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
          {greeting}
        </h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Here is your briefing for today. Let's get things done.
        </p>
        <div className="mt-6 flex flex-wrap gap-4">
          <div className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50 px-4 py-3 dark:border-slate-800/60 dark:bg-slate-900/40">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
              <CheckCircle2 className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900 dark:text-slate-200">{tasksDueToday}</p>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-500">Due Today</p>
            </div>
          </div>
          {tasksOverdue > 0 && (
            <div className="flex items-center gap-3 rounded-xl border border-rose-100 bg-rose-50 px-4 py-3 dark:border-rose-900/10 dark:bg-rose-950/20">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400">
                <AlertCircle className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-900 dark:text-slate-200">{tasksOverdue}</p>
                <p className="text-xs font-medium text-slate-500 dark:text-slate-500">Overdue</p>
              </div>
            </div>
          )}
        </div>
      </div>
      
      <div className="flex flex-col items-start justify-between gap-4 bg-slate-50/50 px-6 py-4 dark:bg-slate-900/20 sm:flex-row sm:items-center">
        <div className="flex items-center gap-2 rounded-xl bg-white px-3 py-1.5 text-sm text-slate-700 shadow-sm ring-1 ring-inset ring-slate-200 dark:bg-slate-800/70 dark:text-slate-200 dark:ring-slate-700">
          <button
            type="button"
            role="switch"
            aria-checked={focusMode}
            onClick={() => onToggleFocus(!focusMode)}
            className={cn(
              focusMode ? "bg-indigo-600" : "bg-slate-300 dark:bg-slate-600",
              "relative inline-flex h-6 w-11 items-center rounded-full transition focus:outline-none focus:ring-2 focus:ring-indigo-600/40"
            )}
          >
            <span
              className={cn(
                focusMode ? "translate-x-6" : "translate-x-1",
                "inline-block h-4 w-4 transform rounded-full bg-white transition"
              )}
            />
          </button>
          <span className="font-semibold">Focus Mode</span>
        </div>

        <div className="flex items-center gap-3">
          <Select
            value={sort}
            onChange={onSortChange}
            options={sortOptions}
            size="sm"
            className="w-44"
            portal={false}
          />

          <button className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-sm font-semibold text-slate-600 transition hover:border-indigo-500/40 hover:text-indigo-600 shadow-sm dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:border-indigo-500/40 dark:hover:text-indigo-400">
            <Filter className="h-4 w-4" />
            Filters
          </button>
        </div>
      </div>
    </header>
  );
}
