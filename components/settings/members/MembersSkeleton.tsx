export function MembersSkeleton() {
  return (
    <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-[#0f172a]">
      <div className="h-4 w-32 animate-pulse rounded-lg bg-slate-200 dark:bg-slate-700" />
      <div className="space-y-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-slate-200 dark:bg-slate-700 animate-pulse" />
            <div className="flex-1 space-y-2">
              <div className="h-3 w-40 rounded bg-slate-200 dark:bg-slate-700 animate-pulse" />
              <div className="h-3 w-24 rounded bg-slate-200 dark:bg-slate-700 animate-pulse" />
            </div>
            <div className="h-8 w-24 rounded bg-slate-200 dark:bg-slate-700 animate-pulse" />
          </div>
        ))}
      </div>
    </div>
  );
}
