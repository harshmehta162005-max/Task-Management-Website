import { KanbanTask } from "@/components/tasks/KanbanBoard";
import { ReactNode } from "react";

type Props = {
  tasks: KanbanTask[];
};

export function ProjectInsightsTab({ tasks }: Props) {
  const total = tasks.length;
  const done = tasks.filter((t) => t.status === "DONE").length;
  const blocked = tasks.filter((t) => t.status === "BLOCKED").length;
  const overdue = tasks.filter((t) => t.dueDate && new Date(t.dueDate) < new Date() && t.status !== "DONE").length;
  const completion = total ? Math.round((done / total) * 100) : 0;

  // Compute average task age in days (from updatedAt field)
  const now = new Date();
  const ages = tasks.map((t) => {
    const updated = (t as KanbanTask & { updatedAt?: string }).updatedAt;
    if (!updated) return 0;
    return Math.round((now.getTime() - new Date(updated).getTime()) / (1000 * 60 * 60 * 24));
  });
  const avgAge = ages.length > 0 ? Math.round(ages.reduce((a, b) => a + b, 0) / ages.length) : 0;

  // Distribution bars for age visualization
  const ageDistribution = ages.length > 0
    ? ages.slice(0, 5).map((a: number) => Math.min(100, Math.max(10, a * 10)))
    : [10, 10, 10, 10, 10];

  // Status distribution for completed chart
  const statusCounts = ["TODO", "IN_PROGRESS", "IN_REVIEW", "DONE", "BLOCKED"].map(
    (s) => tasks.filter((t) => t.status === s).length
  );
  const maxCount = Math.max(...statusCounts, 1);
  const statusDistribution = statusCounts.map((c) => Math.round((c / maxCount) * 24));

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <InsightCard title="Completion rate" value={`${completion}%`} subtitle={`${done} of ${total} tasks done`}>
        <div className="h-3 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
          <div className="h-full bg-primary" style={{ width: `${completion}%` }} />
        </div>
      </InsightCard>
      <InsightCard title="Blocked tasks" value={blocked.toString()} subtitle="Need attention">
        <div className="flex h-2 w-full gap-1">
          <div className="h-full w-full rounded bg-amber-400/70" />
        </div>
      </InsightCard>
      <InsightCard title="Overdue" value={overdue.toString()} subtitle="Past due date">
        <div className="flex h-10 items-end gap-1">
          {[12, 30, 45, 22, 50, 80, 40].map((h, i) => (
            <div key={i} className="w-full rounded-sm bg-primary/30" style={{ height: `${Math.max(8, h / 2)}px` }} />
          ))}
        </div>
      </InsightCard>
      <InsightCard title="High priority" value={tasks.filter((t) => t.priority === "URGENT" || t.priority === "HIGH").length.toString()} subtitle="Urgent + High" />
      <InsightCard title="Avg task age" value={total > 0 ? `${avgAge}d` : "—"} subtitle="Avg days since creation">
        <div className="flex gap-1">
          {ageDistribution.map((h, i) => (
            <div key={i} className="h-2 w-full rounded-full bg-primary/40" style={{ width: `${h}%` }} />
          ))}
        </div>
      </InsightCard>
      <InsightCard title="Completed" value={done.toString()} subtitle={`${total > 0 ? Math.round((done / total) * 100) : 0}% of all tasks`}>
        <div className="flex h-8 items-end gap-1">
          {statusDistribution.map((h, i) => (
            <div key={i} className="w-full rounded bg-emerald-400/60" style={{ height: `${Math.max(4, h)}px` }} />
          ))}
        </div>
      </InsightCard>
    </div>
  );
}

function InsightCard({
  title,
  value,
  subtitle,
  children,
}: {
  title: string;
  value: string;
  subtitle: string;
  children?: ReactNode;
}) {
  return (
    <div className="space-y-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-[#111827]">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">{title}</p>
          <p className="text-2xl font-bold text-slate-900 dark:text-white">{value}</p>
        </div>
      </div>
      <p className="text-sm text-slate-500 dark:text-slate-400">{subtitle}</p>
      {children}
    </div>
  );
}
