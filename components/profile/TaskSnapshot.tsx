"use client";

import { ListTodo, Timer, CheckCheck, AlertTriangle } from "lucide-react";

type TaskSnapshotProps = {
  todo: number;
  inProgress: number;
  completed: number;
  overdue: number;
};

const METRICS = [
  {
    key: "todo" as const,
    label: "To Do",
    icon: ListTodo,
    accentColor: "#f59e0b",
    accentBg: "rgba(245, 158, 11, 0.10)",
    borderColor: "rgba(245, 158, 11, 0.35)",
  },
  {
    key: "inProgress" as const,
    label: "In Progress",
    icon: Timer,
    accentColor: "#3b82f6",
    accentBg: "rgba(59, 130, 246, 0.10)",
    borderColor: "rgba(59, 130, 246, 0.35)",
  },
  {
    key: "completed" as const,
    label: "Completed",
    icon: CheckCheck,
    accentColor: "#22c55e",
    accentBg: "rgba(34, 197, 94, 0.10)",
    borderColor: "rgba(34, 197, 94, 0.35)",
  },
  {
    key: "overdue" as const,
    label: "Overdue",
    icon: AlertTriangle,
    accentColor: "#ef4444",
    accentBg: "rgba(239, 68, 68, 0.10)",
    borderColor: "rgba(239, 68, 68, 0.35)",
  },
];

export function TaskSnapshot({ todo, inProgress, completed, overdue }: TaskSnapshotProps) {
  const values: Record<string, number> = { todo, inProgress, completed, overdue };

  return (
    <section>
      <div className="mb-5 flex items-center gap-3">
        <h2 className="text-lg font-bold tracking-tight text-[#dce2f7]">
          Task Snapshot
        </h2>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {METRICS.map((metric) => {
          const count = values[metric.key];
          const isOverdueActive = metric.key === "overdue" && count > 0;

          return (
            <div
              key={metric.key}
              className="relative overflow-hidden rounded-2xl border border-slate-700/30 bg-[#111827]/80 p-5 transition-all duration-300"
            >
              {/* Accent top border */}
              <div
                className="absolute inset-x-0 top-0 h-[2px]"
                style={{ backgroundColor: metric.accentColor, opacity: 0.6 }}
              />

              <div className="flex items-start justify-between">
                <div
                  className="flex h-9 w-9 items-center justify-center rounded-xl"
                  style={{ backgroundColor: metric.accentBg }}
                >
                  <metric.icon
                    className="h-4.5 w-4.5"
                    style={{ color: metric.accentColor }}
                  />
                </div>
              </div>

              <div className="mt-4">
                <p
                  className={`text-3xl font-bold tracking-tight ${
                    isOverdueActive ? "animate-pulse" : ""
                  }`}
                  style={{ color: count > 0 ? metric.accentColor : "#464555" }}
                >
                  {count}
                </p>
                <p className="mt-1 text-xs font-medium text-[#918fa1]">
                  {metric.label}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
