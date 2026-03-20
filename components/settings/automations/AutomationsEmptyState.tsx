import { Workflow } from "lucide-react";

export function AutomationsEmptyState({ onCreate }: { onCreate: () => void }) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-slate-200 bg-white p-10 text-center shadow-sm dark:border-slate-800 dark:bg-[#0f172a]">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
        <Workflow className="h-5 w-5" />
      </div>
      <div>
        <p className="text-sm font-semibold text-slate-900 dark:text-white">No automations yet</p>
        <p className="text-xs text-slate-500 dark:text-slate-400">Use a template or build your own rule.</p>
      </div>
      <button
        onClick={onCreate}
        className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-primary/90"
      >
        Create automation
      </button>
    </div>
  );
}
