import { useState } from "react";
import { TaskTableRow } from "./TaskTableRow";
import { TaskTableSkeleton } from "./TaskTableSkeleton";
import { BulkActionBar } from "./BulkActionBar";
import type { KanbanTask } from "./KanbanBoard";

type Props = {
  tasks: (KanbanTask & { updatedAt?: string; creatorId: string })[];
  loading?: boolean;
  onRowClick: (id: string) => void;
  currentUserId?: string;
  onReload?: () => void;
  workspaceSlug?: string;
  workspaceMembers?: { id: string; name: string; avatar?: string }[];
};

export function TaskTable({ tasks, loading, onRowClick, currentUserId, onReload, workspaceSlug, workspaceMembers = [] }: Props) {
  const [selected, setSelected] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  if (loading) return <TaskTableSkeleton />;

  const toggleAll = () => {
    const selectable = tasks.filter((t) => currentUserId && t.creatorId === currentUserId);
    if (selected.length === selectable.length && selectable.length > 0) setSelected([]);
    else setSelected(selectable.map((t) => t.id));
  };

  const toggle = (id: string) => {
    setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const handleBulkAction = async (action: string, payload?: any) => {
    if (!selected.length || isProcessing) return;
    try {
      setIsProcessing(true);
      const res = await fetch(`/api/tasks/bulk`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, taskIds: selected, workspaceSlug, value: payload }),
      });
      if (!res.ok) throw new Error("Bulk action failed");
      setSelected([]);
      onReload?.();
    } catch (e) {
      console.error(e);
      alert("Failed to perform bulk action");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className={`relative rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-[#0f172a] ${isProcessing ? "opacity-70 pointer-events-none" : ""}`}>
      <BulkActionBar count={selected.length} onClear={() => setSelected([])} onAction={handleBulkAction} workspaceMembers={workspaceMembers} />
      <div className={selected.length ? "mt-[52px]" : ""}>
        <table className="w-full min-w-[960px] text-left">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50 text-xs font-bold uppercase tracking-wide text-slate-500 dark:border-slate-800 dark:bg-slate-800/60">
              <th className="py-3 px-4 w-12">
                <input
                  type="checkbox"
                  checked={
                    tasks.filter((t) => currentUserId && t.creatorId === currentUserId).length > 0 &&
                    selected.length === tasks.filter((t) => currentUserId && t.creatorId === currentUserId).length
                  }
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
                disableSelection={!currentUserId || task.creatorId !== currentUserId}
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
