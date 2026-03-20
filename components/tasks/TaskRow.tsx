import Link from "next/link";
import { MoreHorizontal, Play } from "lucide-react";
import { PriorityBadge } from "./PriorityBadge";
import { StatusBadge } from "./StatusBadge";
import { cn } from "@/lib/utils/cn";

export type TaskItem = {
  id: string;
  title: string;
  projectName: string;
  projectId: string;
  priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
  status: "TODO" | "IN_PROGRESS" | "BLOCKED" | "DONE";
  dueLabel: string;
  isCompleted: boolean;
};

type Props = {
  task: TaskItem;
  onToggleComplete: (id: string) => void;
  onStartWork: (id: string) => void;
  onOpen: (id: string) => void;
};

export function TaskRow({ task, onToggleComplete, onStartWork, onOpen }: Props) {
  return (
    <div
      className="group flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-3 transition-colors hover:border-primary/40 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900/50 dark:hover:border-primary/50"
      onClick={() => onOpen(task.id)}
      role="button"
    >
      <div className="flex items-center gap-4">
        <input
          type="checkbox"
          checked={task.isCompleted}
          onChange={(e) => {
            e.stopPropagation();
            onToggleComplete(task.id);
          }}
          className="h-5 w-5 rounded-full border-2 border-slate-300 bg-transparent text-primary focus:ring-primary dark:border-slate-700"
          onClick={(e) => e.stopPropagation()}
        />
        <div className="min-w-0">
          <p className={cn("text-sm font-medium text-slate-900 dark:text-slate-100", task.isCompleted && "line-through")}>
            {task.title}
          </p>
          <div className="mt-1 flex flex-wrap items-center gap-2">
            <Link
              href={`/${task.projectId}`}
              className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-500 hover:text-primary dark:bg-slate-800 dark:text-slate-400"
              onClick={(e) => e.stopPropagation()}
            >
              {task.projectName}
            </Link>
            <PriorityBadge priority={task.priority} />
            <StatusBadge status={task.status} />
            <span className="text-[11px] text-slate-400">{task.dueLabel}</span>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2 pl-2">
        {task.status !== "DONE" && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onStartWork(task.id);
            }}
            className="start-work-btn opacity-0 rounded-lg bg-primary/10 px-3 py-1 text-xs font-bold text-primary transition-opacity group-hover:opacity-100"
          >
            Start Work
          </button>
        )}
        <button
          type="button"
          onClick={(e) => e.stopPropagation()}
          className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-white/5"
        >
          <MoreHorizontal className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
