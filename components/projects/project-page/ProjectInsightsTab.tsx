import { KanbanTask } from "@/components/tasks/KanbanBoard";
import { ReactNode } from "react";

type Props = {
  tasks: KanbanTask[];
};

export function ProjectInsightsTab({ tasks }: Props) {
  const total = tasks.length;
  const done = tasks.filter((t) => t.status === "DONE").length;
  const blocked = tasks.filter((t) => t.status === "BLOCKED").length;
  const overdueTasks = tasks.filter((t) => t.dueDate && new Date(t.dueDate) < new Date() && t.status !== "DONE");
  const overdue = overdueTasks.length;
  const highPriority = tasks.filter((t) => t.priority === "URGENT" || t.priority === "HIGH").length;

  const completion = total ? Math.round((done / total) * 100) : 0;
  const blockedPct = total ? Math.round((blocked / total) * 100) : 0;
  const highPriorityPct = total ? Math.round((highPriority / total) * 100) : 0;

  const now = new Date();

  // Overdue distribution (0-1d, 2d, 3d, 4d, 5d, 6d, 7+d)
  const overdueDistribution = [0, 0, 0, 0, 0, 0, 0];
  const overdueLabels = ["0-1 days", "2 days", "3 days", "4 days", "5 days", "6 days", "7+ days"];
  
  overdueTasks.forEach(t => {
    if (t.dueDate) {
      const days = Math.floor((now.getTime() - new Date(t.dueDate).getTime()) / (1000 * 60 * 60 * 24));
      const bucket = Math.min(6, Math.max(0, days));
      overdueDistribution[bucket]++;
    }
  });
  const maxOverdue = Math.max(...overdueDistribution, 1);
  const overdueBars = overdueDistribution.map(c => Math.max(4, Math.round((c / maxOverdue) * 40)));

  // Compute average task age in days (from updatedAt)
  const ages = tasks.map((t) => {
    const updated = (t as KanbanTask & { updatedAt?: string }).updatedAt;
    if (!updated) return 0;
    return Math.max(0, Math.floor((now.getTime() - new Date(updated).getTime()) / (1000 * 60 * 60 * 24)));
  });
  const avgAge = ages.length > 0 ? Math.round(ages.reduce((a, b) => a + b, 0) / ages.length) : 0;

  // Age bucketing
  const ageBuckets = [0, 0, 0, 0, 0];
  const ageLabels = ["0-1 days", "2-3 days", "4-7 days", "8-14 days", "15+ days"];
  ages.forEach(a => {
    if (a <= 1) ageBuckets[0]++;
    else if (a <= 3) ageBuckets[1]++;
    else if (a <= 7) ageBuckets[2]++;
    else if (a <= 14) ageBuckets[3]++;
    else ageBuckets[4]++;
  });
  const maxAgeBucket = Math.max(...ageBuckets, 1);
  const ageBars = ageBuckets.map(c => Math.max(4, Math.round((c / maxAgeBucket) * 40)));

  // Status distribution
  const statusLabels = ["Todo", "In Progress", "In Review", "Done", "Blocked"];
  const statusCounts = ["TODO", "IN_PROGRESS", "IN_REVIEW", "DONE", "BLOCKED"].map(
    (s) => tasks.filter((t) => t.status === s).length
  );
  const maxStatus = Math.max(...statusCounts, 1);
  const statusDistribution = statusCounts.map((c) => Math.max(4, Math.round((c / maxStatus) * 40)));

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <InsightCard title="Completion rate" value={`${completion}%`} subtitle={`${done} of ${total} tasks done`}>
        <div className="h-3 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
          <div className="h-full bg-primary transition-all duration-500!" style={{ width: `${completion}%` }} />
        </div>
      </InsightCard>
      
      <InsightCard title="Blocked tasks" value={blocked.toString()} subtitle="Need attention">
        <div className="h-3 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
          <div className="h-full bg-amber-500 transition-all duration-500" style={{ width: `${blockedPct}%` }} />
        </div>
      </InsightCard>
      
      <InsightCard title="Overdue" value={overdue.toString()} subtitle="Past due date">
        <div className="flex w-full items-end gap-1 h-full">
          {overdueBars.map((h, i) => (
            <div 
              key={i} 
              className="group relative w-full rounded-sm bg-primary/30 transition-all duration-500 hover:bg-primary/50" 
              style={{ height: `${h}px` }} 
            >
              <div className="pointer-events-none absolute bottom-full left-1/2 mb-2 -translate-x-1/2 whitespace-nowrap rounded-md bg-slate-900 px-2 py-1 text-[10px] font-semibold text-white opacity-0 shadow-lg transition-all group-hover:-translate-y-1 group-hover:opacity-100 dark:bg-slate-700 z-50">
                {overdueLabels[i]}: {overdueDistribution[i]} tasks
              </div>
            </div>
          ))}
        </div>
      </InsightCard>
      
      <InsightCard title="High priority" value={highPriority.toString()} subtitle="Urgent + High">
        <div className="h-3 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
          <div className="h-full bg-red-400 transition-all duration-500" style={{ width: `${highPriorityPct}%` }} />
        </div>
      </InsightCard>
      
      <InsightCard title="Time since update" value={total > 0 ? `${avgAge}d` : "—"} subtitle="Avg days since last activity">
        <div className="flex w-full items-end gap-1 h-full">
          {ageBars.map((h, i) => (
            <div 
              key={i} 
              className="group relative w-full rounded-sm bg-primary/40 transition-all duration-500 hover:bg-primary/60" 
              style={{ height: `${h}px` }} 
            >
              <div className="pointer-events-none absolute bottom-full left-1/2 mb-2 -translate-x-1/2 whitespace-nowrap rounded-md bg-slate-900 px-2 py-1 text-[10px] font-semibold text-white opacity-0 shadow-lg transition-all group-hover:-translate-y-1 group-hover:opacity-100 dark:bg-slate-700 z-50">
                {ageLabels[i]}: {ageBuckets[i]} tasks
              </div>
            </div>
          ))}
        </div>
      </InsightCard>
      
      <InsightCard title="Completed" value={done.toString()} subtitle={`${total > 0 ? Math.round((done / total) * 100) : 0}% of all tasks`}>
        <div className="flex w-full items-end gap-1 h-full">
          {statusDistribution.map((h, i) => (
            <div 
              key={i} 
              className="group relative w-full rounded-sm bg-emerald-400/60 transition-all duration-500 hover:bg-emerald-400" 
              style={{ height: `${h}px` }} 
            >
              <div className="pointer-events-none absolute bottom-full left-1/2 mb-2 -translate-x-1/2 whitespace-nowrap rounded-md bg-slate-900 px-2 py-1 text-[10px] font-semibold text-white opacity-0 shadow-lg transition-all group-hover:-translate-y-1 group-hover:opacity-100 dark:bg-slate-700 z-50">
                {statusLabels[i]}: {statusCounts[i]} tasks
              </div>
            </div>
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
    <div className="flex h-full flex-col space-y-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-[#111827]">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">{title}</p>
          <p className="text-2xl font-bold text-slate-900 dark:text-white">{value}</p>
        </div>
      </div>
      <p className="text-sm text-slate-500 dark:text-slate-400">{subtitle}</p>
      {children && (
        <div className="mt-auto flex h-10 w-full items-end">
          {children}
        </div>
      )}
    </div>
  );
}
