import { AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils/cn";

type RiskItem = {
  title: string;
  due: string;
  assignee: string;
};

type Props = {
  atRisk: RiskItem[];
  stale: RiskItem[];
};

export function RiskyTasksWidget({ atRisk, stale }: Props) {
  const renderSection = (title: string, color: string, items: RiskItem[]) => (
    <div className={cn("rounded-xl border p-3", color)}>
      <div className="mb-2 flex items-start justify-between">
        <p className="text-sm font-bold">{title}</p>
        <span className="text-[10px] font-bold uppercase">{items.length ? items.length : "0"}</span>
      </div>
      {items.length ? (
        <div className="space-y-2">
          {items.map((item) => (
            <div key={item.title}>
              <p className="text-xs font-medium">{item.title}</p>
              <p className="text-[11px] text-slate-500">Due: {item.due}</p>
              <p className="text-[11px] text-slate-500">Assignee: {item.assignee}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-xs text-slate-500">Nothing here</p>
      )}
    </div>
  );

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-[#111827]">
      <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-slate-900 dark:text-white">
        <AlertTriangle className="h-5 w-5 text-rose-500" />
        Risky Tasks
      </h2>
      <div className="space-y-4">
        {renderSection("At Risk", "bg-rose-500/5 border-rose-500/20", atRisk)}
        {renderSection("Stale", "bg-amber-500/5 border-amber-500/20", stale)}
      </div>
    </div>
  );
}
