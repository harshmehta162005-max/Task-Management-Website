import { PriorityBadge } from "./PriorityBadge";
import { StatusBadge } from "./StatusBadge";
import type { KanbanTask } from "./KanbanBoard";
import { cn } from "@/lib/utils/cn";

type Props = {
  task: KanbanTask & { updatedAt?: string };
  selected: boolean;
  onToggle: () => void;
  onClick: () => void;
  disableSelection?: boolean;
};

export function TaskTableRow({ task, selected, onToggle, onClick, disableSelection }: Props) {
  return (
    <tr
      className={cn(
        "group cursor-pointer border-b border-slate-100 text-sm transition hover:bg-slate-50/50 dark:border-slate-800 dark:hover:bg-slate-800/40",
        selected && "bg-primary/5 dark:bg-primary/10"
      )}
      onClick={onClick}
    >
      <td className="w-12 px-4 py-3" onClick={(e) => e.stopPropagation()}>
        <input
          type="checkbox"
          checked={selected}
          onChange={onToggle}
          disabled={disableSelection}
          className="rounded border-slate-300 text-primary focus:ring-primary disabled:opacity-30 dark:border-slate-700 dark:bg-slate-900"
        />
      </td>
      <td className="py-3 px-4">
        <div className="flex flex-col">
          <span className="font-semibold text-slate-900 transition-colors group-hover:text-primary dark:text-slate-100">
            {task.title}
          </span>
          <span className="text-xs text-slate-400">ID: {task.id}</span>
        </div>
      </td>
      <td className="py-3 px-4">
        <StatusBadge status={task.status as any} />
      </td>
      <td className="py-3 px-4">
        <PriorityBadge priority={task.priority as any} />
      </td>
      <td className="py-3 px-4">
        <div className="flex -space-x-2">
          {task.assignees.slice(0, 3).map((a) => (
            <img
              key={a.id}
              src={a.avatarUrl}
              alt={a.name}
              className="h-8 w-8 rounded-full border-2 border-white object-cover dark:border-slate-900"
              title={a.name}
            />
          ))}
          {task.assignees.length > 3 ? (
            <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-slate-200 text-[10px] font-bold text-slate-600 dark:border-slate-900 dark:bg-slate-700 dark:text-slate-200">
              +{task.assignees.length - 3}
            </div>
          ) : null}
        </div>
      </td>
      <td className="py-3 px-4 text-slate-500 dark:text-slate-400">{task.dueDate || "—"}</td>
      <td className="py-3 px-4">
        <div className="flex flex-wrap gap-1">
          {task.tags.slice(0, 2).map((t) => (
            <span
              key={t}
              className="rounded bg-slate-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-tight text-slate-600 dark:bg-slate-800 dark:text-slate-300"
            >
              {t}
            </span>
          ))}
          {task.tags.length > 2 ? (
            <span className="rounded bg-slate-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-tight text-slate-600 dark:bg-slate-800 dark:text-slate-300">
              +{task.tags.length - 2}
            </span>
          ) : null}
        </div>
      </td>
      <td className="py-3 px-4 text-slate-400">{task.updatedAt || "—"}</td>
    </tr>
  );
}

