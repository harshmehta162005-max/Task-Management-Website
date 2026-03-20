import { Check, X, AlertTriangle } from "lucide-react";

type ProposedTask = {
  id: string;
  title: string;
  assignee?: string;
  due?: string;
  duplicate?: boolean;
};

type Props = {
  tasks: ProposedTask[];
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  onApproveAll: () => void;
};

export function ProposedTasksPreview({ tasks, onApprove, onReject, onApproveAll }: Props) {
  if (!tasks.length) return null;
  return (
    <div className="mt-4 border-t border-slate-200 pt-4 dark:border-slate-700">
      <div className="mb-3 flex items-center justify-between">
        <p className="text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">
          Proposed Tasks ({tasks.length})
        </p>
        <button
          onClick={onApproveAll}
          className="text-xs font-semibold text-primary hover:underline"
        >
          Approve all
        </button>
      </div>
      <div className="space-y-2">
        {tasks.map((task) => (
          <div
            key={task.id}
            className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 shadow-sm dark:border-slate-700 dark:bg-[#0f172a]"
          >
            <div className="flex items-center justify-between gap-2">
              <div className="flex-1">
                <input
                  defaultValue={task.title}
                  className="w-full bg-transparent text-sm font-semibold text-slate-900 outline-none dark:text-white"
                />
                <div className="mt-1 flex flex-wrap items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400">
                  {task.assignee ? <span>Assignee: {task.assignee}</span> : null}
                  {task.due ? <span>Due: {task.due}</span> : null}
                  {task.duplicate ? (
                    <span className="inline-flex items-center gap-1 rounded-md bg-amber-500/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-amber-600 dark:text-amber-400">
                      <AlertTriangle className="h-3 w-3" />
                      Possible duplicate
                    </span>
                  ) : null}
                </div>
              </div>
              <div className="flex gap-1">
                <button
                  onClick={() => onApprove(task.id)}
                  className="inline-flex items-center justify-center rounded-lg border border-emerald-500/40 bg-emerald-500/10 p-2 text-emerald-600 hover:bg-emerald-500/20 dark:text-emerald-400"
                  title="Approve"
                >
                  <Check className="h-4 w-4" />
                </button>
                <button
                  onClick={() => onReject(task.id)}
                  className="inline-flex items-center justify-center rounded-lg border border-slate-200 p-2 text-slate-500 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                  title="Reject"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

