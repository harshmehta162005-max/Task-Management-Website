import { useState } from "react";
import { TaskTableRow } from "./TaskTableRow";
import { TaskTableSkeleton } from "./TaskTableSkeleton";
import { BulkActionBar } from "./BulkActionBar";
import type { KanbanTask } from "./KanbanBoard";

type Props = {
  tasks: (KanbanTask & { updatedAt?: string })[];
  loading?: boolean;
  onRowClick: (id: string) => void;
};

export function TaskTable({ tasks, loading, onRowClick }: Props) {
  const [selected, setSelected] = useState<string[]>([]);

  if (loading) return <TaskTableSkeleton />;

  const toggleAll = () => {
    if (selected.length === tasks.length) setSelected([]);
    else setSelected(tasks.map((t) => t.id));
  };

  const toggle = (id: string) => {
    setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  return (
    <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-[#0f172a]">
      <BulkActionBar count={selected.length} onClear={() => setSelected([])} />
      <div className={selected.length ? "mt-[52px]" : ""}>
        <table className="w-full min-w-[960px] text-left">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50 text-xs font-bold uppercase tracking-wide text-slate-500 dark:border-slate-800 dark:bg-slate-800/60">
              <th className="py-3 px-4 w-12">
                <input
                  type="checkbox"
                  checked={selected.length === tasks.length && tasks.length > 0}
                  onChange={toggleAll}
                  className="rounded border-slate-300 text-primary focus:ring-primary dark:border-slate-700 dark:bg-slate-900"
                />
              </th>
              <th className="py-3 px-4">Title</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Priority</th>
              <th className="py-3 px-4">Assignee</th>
              <th className="py-3 px-4">Due Date</th>
              <th className="py-3 px-4">Tags</th>
              <th className="py-3 px-4">Updated</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task) => (
              <TaskTableRow
                key={task.id}
                task={task}
                selected={selected.includes(task.id)}
                onToggle={() => toggle(task.id)}
                onClick={() => onRowClick(task.id)}
              />
            ))}
            {tasks.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-8 text-center text-sm text-slate-500 dark:text-slate-400">
                  No tasks match these filters.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
