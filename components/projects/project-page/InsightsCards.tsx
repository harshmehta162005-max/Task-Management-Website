import { Task } from "@/components/tasks/types";

type Props = { tasks: Task[] };

export function InsightsCards({ tasks }: Props) {
  const total = tasks.length || 1;
  const done = tasks.filter((t) => t.status === "Done").length;
  const blocked = tasks.filter((t) => t.status === "Blocked").length;
  const overdue = tasks.filter((t) => new Date(t.dueDate) < new Date() && t.status !== "Done").length;

  const statusCounts = ["Todo", "In Progress", "Blocked", "Done"].map((status) => ({
    status,
    count: tasks.filter((t) => t.status === status).length,
  }));

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Card title="Completion Rate">
        <p className="text-3xl font-bold">{Math.round((done / total) * 100)}%</p>
        <div className="mt-2 h-2 rounded-full bg-slate-200 dark:bg-slate-800">
          <div className="h-full rounded-full bg-primary" style={{ width: `${(done / total) * 100}%` }} />
        </div>
        <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
          {done} of {total} tasks completed
        </p>
      </Card>
      <Card title="Status Distribution">
        <div className="space-y-2">
          {statusCounts.map((item) => (
            <div key={item.status} className="flex items-center justify-between text-sm">
              <span>{item.status}</span>
              <div className="flex items-center gap-2">
                <div className="h-2 w-24 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
                  <div
                    className="h-full rounded-full bg-primary"
                    style={{ width: `${(item.count / total) * 100}%` }}
                  />
                </div>
                <span className="text-xs text-slate-500 dark:text-slate-400">{item.count}</span>
              </div>
            </div>
          ))}
        </div>
      </Card>
      <Card title="Blocked Tasks">
        <p className="text-3xl font-bold text-rose-500">{blocked}</p>
        <p className="text-xs text-slate-500 dark:text-slate-400">Needing attention</p>
      </Card>
      <Card title="Overdue Trend">
        <p className="text-3xl font-bold text-amber-500">{overdue}</p>
        <div className="mt-3 flex h-12 items-end gap-1">
          {[4, 6, 3, 8, 5, 7].map((h, i) => (
            <div key={i} className="w-3 rounded bg-amber-500/40" style={{ height: `${h * 6}%` }} />
          ))}
        </div>
      </Card>
      <Card title="Average Completion Time">
        <p className="text-3xl font-bold">3.4d</p>
        <p className="text-xs text-slate-500 dark:text-slate-400">Across done tasks (placeholder)</p>
      </Card>
      <Card title="Blocked Tasks Trend">
        <div className="flex items-center gap-2">
          {[blocked, blocked + 1, blocked - 1, blocked + 2, blocked].map((h, i) => (
            <div key={i} className="h-10 w-3 rounded bg-rose-500/50" style={{ height: `${h * 15 + 10}px` }} />
          ))}
        </div>
        <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">Placeholder sparkline</p>
      </Card>
    </div>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-100">{title}</h4>
      <div className="mt-3 space-y-2">{children}</div>
    </div>
  );
}

export default InsightsCards;
