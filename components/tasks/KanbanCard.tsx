import { CalendarDays, MessageSquare, Paperclip, GripVertical } from "lucide-react";
import { PriorityBadge } from "./PriorityBadge";
import { cn } from "@/lib/utils/cn";
import type { KanbanTask } from "./KanbanBoard";

type Props = {
  task: KanbanTask;
  onClick: (id: string) => void;
  isDragging?: boolean;
};

export function KanbanCard({ task, onClick, isDragging }: Props) {
  const assignees = task.assignees?.slice(0, 3) || [];
  const overflow = (task.assignees?.length || 0) - assignees.length;

  return (
    <div
      role="button"
      onClick={() => onClick(task.id)}
      className={cn(
        "group relative rounded-2xl border border-slate-200 bg-white p-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-primary/40 dark:border-slate-700 dark:bg-[#0f172a]",
        isDragging && "opacity-70 ring-2 ring-primary/50"
      )}
    >
      <div className="mb-3 flex items-center justify-between">
        <PriorityBadge priority={task.priority as any} />
        <GripVertical className="h-4 w-4 text-slate-300 opacity-0 transition group-hover:opacity-100" />
      </div>
      <p className="line-clamp-2 text-sm font-semibold text-slate-900 dark:text-white">{task.title}</p>

      <div className="mt-3 flex flex-wrap gap-2">
        {task.tags?.slice(0, 2).map((tag) => (
          <span
            key={tag}
            className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-500 dark:bg-slate-800 dark:text-slate-300"
          >
            {tag}
          </span>
        ))}
        {(task.tags?.length || 0) > 2 ? (
          <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-500 dark:bg-slate-800 dark:text-slate-300">
            +{task.tags.length - 2}
          </span>
        ) : null}
      </div>

      <div className="mt-4 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
        <div className="flex items-center gap-2">
          <CalendarDays className="h-4 w-4" />
          <span>{task.dueDate ? formatDate(task.dueDate) : "No due date"}</span>
        </div>
        <div className="flex items-center gap-3">
          {task.commentCount ? (
            <span className="flex items-center gap-1">
              <MessageSquare className="h-4 w-4" /> {task.commentCount}
            </span>
          ) : null}
          {task.attachmentCount ? (
            <span className="flex items-center gap-1">
              <Paperclip className="h-4 w-4" /> {task.attachmentCount}
            </span>
          ) : null}
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between">
        <div className="flex -space-x-2">
          {assignees.map((a) => (
            <img
              key={a.avatarUrl}
              src={a.avatarUrl}
              alt={a.name}
              className="h-8 w-8 rounded-full border-2 border-white object-cover dark:border-[#0f172a]"
              title={a.name}
            />
          ))}
          {overflow > 0 ? (
            <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-slate-200 text-[10px] font-bold text-slate-600 dark:border-[#0f172a] dark:bg-slate-700 dark:text-slate-200">
              +{overflow}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function formatDate(value: string) {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}
