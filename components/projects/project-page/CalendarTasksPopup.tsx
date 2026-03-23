"use client";

import { X } from "lucide-react";

type TaskItem = {
  id: string;
  title: string;
  color?: "red" | "amber" | "emerald" | "primary" | "slate";
};

type Props = {
  open: boolean;
  date: string;
  tasks: TaskItem[];
  onClose: () => void;
  onTaskClick: (id: string) => void;
};

const dotColors = {
  red: "bg-red-500",
  amber: "bg-amber-500",
  emerald: "bg-emerald-500",
  primary: "bg-blue-500",
  slate: "bg-slate-500",
};

const labelColors = {
  red: "text-red-600 dark:text-red-400",
  amber: "text-amber-600 dark:text-amber-400",
  emerald: "text-emerald-600 dark:text-emerald-400",
  primary: "text-blue-600 dark:text-blue-400",
  slate: "text-slate-600 dark:text-slate-400",
};

const bgColors = {
  red: "hover:bg-red-50 dark:hover:bg-red-500/10",
  amber: "hover:bg-amber-50 dark:hover:bg-amber-500/10",
  emerald: "hover:bg-emerald-50 dark:hover:bg-emerald-500/10",
  primary: "hover:bg-blue-50 dark:hover:bg-blue-500/10",
  slate: "hover:bg-slate-50 dark:hover:bg-slate-500/10",
};

export function CalendarTasksPopup({ open, date, tasks, onClose, onTaskClick }: Props) {
  if (!open) return null;

  const formattedDate = (() => {
    const [y, m, d] = date.split("-").map(Number);
    return new Date(y, m - 1, d).toLocaleDateString(undefined, {
      weekday: "long",
      month: "long",
      day: "numeric",
    });
  })();

  return (
    <div
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-[2px] px-4"
      style={{ animation: "fadeIn 0.15s ease-out" }}
    >
      <div
        className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-700 dark:bg-[#0f172a] max-h-[60vh] flex flex-col"
        style={{ animation: "slideUp 0.2s ease-out" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-3.5 dark:border-slate-700 shrink-0">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Tasks
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">{formattedDate}</p>
          </div>
          <button
            onClick={onClose}
            className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition hover:bg-red-500/15 hover:text-red-400 dark:bg-white/5"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Task list */}
        <div className="flex-1 overflow-y-auto px-3 py-2 space-y-0.5 min-h-0">
          {tasks.map((task) => {
            const color = task.color || "primary";
            return (
              <button
                key={task.id}
                onClick={() => { onTaskClick(task.id); onClose(); }}
                className={`w-full flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-left transition ${bgColors[color]}`}
              >
                <span className={`h-2.5 w-2.5 rounded-full shrink-0 ${dotColors[color]}`} />
                <span className={`text-sm font-semibold truncate ${labelColors[color]}`}>
                  {task.title}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(20px) scale(0.98); } to { opacity: 1; transform: translateY(0) scale(1); } }
      `}</style>
    </div>
  );
}
