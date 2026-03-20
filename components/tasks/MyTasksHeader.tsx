import { Filter, ArrowDownUp } from "lucide-react";
import { Select } from "@/components/ui/Select";
import { cn } from "@/lib/utils/cn";

type Props = {
  focusMode: boolean;
  onToggleFocus: (value: boolean) => void;
  sort: string;
  onSortChange: (value: string) => void;
};

const sortOptions = [
  { value: "due", label: "Due date" },
  { value: "priority", label: "Priority" },
  { value: "updated", label: "Updated" },
];

export function MyTasksHeader({ focusMode, onToggleFocus, sort, onSortChange }: Props) {
  return (
    <header className="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">My Tasks</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">Manage your daily workflow and deadlines</p>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 rounded-xl bg-slate-100 px-3 py-1.5 text-sm text-slate-700 dark:bg-slate-800/70 dark:text-slate-200">
          <button
            type="button"
            role="switch"
            aria-checked={focusMode}
            onClick={() => onToggleFocus(!focusMode)}
            className={cn(
              focusMode ? "bg-primary" : "bg-slate-300 dark:bg-slate-700",
              "relative inline-flex h-6 w-11 items-center rounded-full transition focus:outline-none focus:ring-2 focus:ring-primary/40"
            )}
          >
            <span
              className={cn(
                focusMode ? "translate-x-6" : "translate-x-1",
                "inline-block h-4 w-4 transform rounded-full bg-white transition"
              )}
            />
          </button>
          <span className="font-semibold">Focus</span>
        </div>

        <Select
          value={sort}
          onChange={onSortChange}
          options={sortOptions}
          size="sm"
          className="w-44"
        />

        <button className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-sm font-semibold text-slate-600 transition hover:border-primary/40 hover:text-primary dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200">
          <Filter className="h-4 w-4" />
          Filters
        </button>
      </div>
    </header>
  );
}
