"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { X } from "lucide-react";

type Props = {
  task: {
    title: string;
    status: string;
    priority: string;
    assignees: string[];
    due: string;
  };
  onClose?: () => void;
};

export function TaskDrawerPlaceholder({ task, onClose }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams.toString());

  const close = () => {
    params.delete("taskId");
    router.replace(`?${params.toString()}`, { scroll: false });
    onClose?.();
  };

  return (
    <div className="fixed inset-0 z-40 flex justify-end bg-black/30 backdrop-blur-sm">
      <div className="h-full w-full max-w-md border-l border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-[#0B0F17]">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-slate-400 uppercase">Task</span>
            <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold uppercase text-primary">
              {task.status}
            </span>
          </div>
          <button
            type="button"
            onClick={close}
            className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-white/5"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <h2 className="text-xl font-semibold text-slate-900 dark:text-white">{task.title}</h2>
        <div className="mt-4 space-y-3 text-sm text-slate-500 dark:text-slate-300">
          <p>
            <span className="font-semibold text-slate-600 dark:text-slate-200">Priority:</span> {task.priority}
          </p>
          <p>
            <span className="font-semibold text-slate-600 dark:text-slate-200">Due:</span> {task.due}
          </p>
          <div>
            <span className="font-semibold text-slate-600 dark:text-slate-200">Assignees:</span>
            <div className="mt-2 flex -space-x-2">
              {task.assignees.map((a) => (
                <div
                  key={a}
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary"
                  title={a}
                >
                  {a[0]?.toUpperCase()}
                </div>
              ))}
            </div>
          </div>
          <p className="text-xs text-slate-400">This is a placeholder drawer. Full task details would load here.</p>
        </div>
      </div>
    </div>
  );
}
