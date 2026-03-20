import Link from "next/link";
import { BadgeCheck } from "lucide-react";
import { cn } from "@/lib/utils/cn";

type Task = {
  id: string;
  title: string;
  project: string;
  priority: "Low" | "Medium" | "High" | "Urgent";
  due: string;
};

type Props = {
  tasks: Task[];
  workspaceSlug: string;
};

const priorityColor: Record<Task["priority"], string> = {
  Low: "text-blue-500 bg-blue-500/10",
  Medium: "text-amber-500 bg-amber-500/10",
  High: "text-rose-500 bg-rose-500/10",
  Urgent: "text-red-600 bg-red-600/15",
};

export function MyTasksToday({ tasks, workspaceSlug }: Props) {
  if (!tasks.length) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-white/10 dark:bg-[#111827]">
        <div className="flex items-center justify-between border-b border-slate-200 p-6 dark:border-white/10">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">My Tasks Today</h2>
        </div>
        <div className="flex flex-col items-center gap-3 px-6 py-8 text-center">
          <BadgeCheck className="h-8 w-8 text-emerald-400" />
          <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">No tasks due today 🎉</p>
          <Link
            href={`/${workspaceSlug}/my-tasks`}
            className="text-sm font-semibold text-primary hover:underline"
          >
            View My Tasks
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-white/10 dark:bg-[#111827]">
      <div className="flex items-center justify-between border-b border-slate-200 p-6 dark:border-white/10">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">My Tasks Today</h2>
        <Link className="text-sm font-semibold text-primary" href={`/${workspaceSlug}/my-tasks`}>
          View all
        </Link>
      </div>
      <div className="divide-y divide-slate-200 dark:divide-white/10">
        {tasks.map((task) => (
          <div
            key={task.id}
            className="flex items-center gap-4 p-4 transition-colors hover:bg-slate-50 dark:hover:bg-white/[0.02]"
          >
            <input
              type="checkbox"
              className="h-5 w-5 rounded border-slate-300 bg-transparent text-primary focus:ring-primary dark:border-white/20"
            />
            <div className="flex-1">
              <p className="text-sm font-medium text-slate-900 dark:text-slate-100">{task.title}</p>
              <div className="mt-1 flex items-center gap-2">
                <span className="rounded-full bg-slate-400/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  {task.project}
                </span>
                <span
                  className={cn(
                    "rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider",
                    priorityColor[task.priority]
                  )}
                >
                  {task.priority}
                </span>
              </div>
            </div>
            <span className="text-xs text-slate-400">{task.due}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
