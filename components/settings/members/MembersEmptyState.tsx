import { Users } from "lucide-react";

export function MembersEmptyState() {
  return (
    <div className="flex flex-col items-center gap-3 rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm dark:border-slate-800 dark:bg-[#0f172a]">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
        <Users className="h-5 w-5" />
      </div>
      <div>
        <p className="text-sm font-semibold text-slate-900 dark:text-white">No members yet</p>
        <p className="text-xs text-slate-500 dark:text-slate-400">Invite your team to start collaborating.</p>
      </div>
    </div>
  );
}
