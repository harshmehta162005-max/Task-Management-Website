export function TaskTableSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-[#0f172a]">
      <div className="h-12 bg-slate-50 dark:bg-slate-800/50" />
      <div className="divide-y divide-slate-200 dark:divide-slate-800">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-14 bg-white px-4 dark:bg-[#0f172a]">
            <div className="flex h-full items-center gap-3">
              <div className="h-4 w-4 rounded bg-slate-200 dark:bg-slate-700" />
              <div className="h-3 w-48 rounded bg-slate-200 dark:bg-slate-700" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

