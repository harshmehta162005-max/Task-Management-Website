import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { CalendarGrid } from "./CalendarGrid";
import { KanbanTask } from "@/components/tasks/KanbanBoard";

type Props = {
  tasks: KanbanTask[];
  onOpenTask: (id: string) => void;
};

export function ProjectCalendarTab({ tasks, onOpenTask }: Props) {
  const [month, setMonth] = useState(() => new Date());

  const tasksByDate = useMemo(() => {
    const map: Record<string, { id: string; title: string; color: "primary" | "emerald" | "amber" | "slate" }[]> = {};
    tasks.forEach((t) => {
      if (!t.dueDate) return;
      const key = t.dueDate.slice(0, 10);
      const color = t.status === "DONE" ? "emerald" : t.status === "BLOCKED" ? "amber" : "primary";
      if (!map[key]) map[key] = [];
      map[key].push({ id: t.id, title: t.title, color });
    });
    return map;
  }, [tasks]);

  const monthLabel = month.toLocaleDateString(undefined, { month: "long", year: "numeric" });

  const changeMonth = (delta: number) => {
    setMonth((m) => new Date(m.getFullYear(), m.getMonth() + delta, 1));
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-[#111827] md:flex-row md:items-center md:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Project Schedule</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">Track milestones and deliverables.</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center rounded-xl border border-slate-200 bg-slate-50 p-1 dark:border-slate-700 dark:bg-[#0f172a]">
            <button
              onClick={() => changeMonth(-1)}
              className="rounded-lg p-2 hover:bg-white dark:hover:bg-slate-800"
              aria-label="Previous month"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="px-3 text-sm font-semibold text-slate-700 dark:text-slate-200">{monthLabel}</span>
            <button
              onClick={() => changeMonth(1)}
              className="rounded-lg p-2 hover:bg-white dark:hover:bg-slate-800"
              aria-label="Next month"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
          <button className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-primary/90">
            <Plus className="h-4 w-4" />
            New task
          </button>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 shadow-sm dark:border-slate-800">
        <CalendarGrid month={month} tasksByDate={tasksByDate} onTaskClick={onOpenTask} />
      </div>

      {Object.keys(tasksByDate).length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-500 shadow-sm dark:border-slate-700 dark:bg-[#0f172a] dark:text-slate-300">
          No tasks scheduled this month.
        </div>
      ) : null}
    </div>
  );
}

