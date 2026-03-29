import { Users } from "lucide-react";

type Assignee = {
  id: string;
  name: string;
  workStatus?: string;
};

export function TaskProgress({ assignees }: { assignees: Assignee[] }) {
  if (!assignees || assignees.length === 0) return null;

  const N = assignees.length;
  const X = assignees.filter(
    (a) => a.workStatus === "IN_PROGRESS" || a.workStatus === "SUBMITTED"
  ).length;

  return (
    <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500 bg-slate-100/50 px-2 py-1 rounded-md border border-slate-200/50 dark:bg-slate-800/50 dark:border-slate-800 dark:text-slate-400 max-w-max">
      <Users className="h-3.5 w-3.5" />
      <span>{X} / {N} members working</span>
    </div>
  );
}
