export function TagsSkeleton() {
  return (
    <div className="space-y-3 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-[#0f172a]">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex items-center gap-3">
          <div className="h-3 w-3 rounded-full bg-slate-200 dark:bg-slate-700 animate-pulse" />
          <div className="h-4 w-24 rounded bg-slate-200 dark:bg-slate-700 animate-pulse" />
          <div className="ml-auto h-4 w-16 rounded bg-slate-200 dark:bg-slate-700 animate-pulse" />
          <div className="h-8 w-20 rounded bg-slate-200 dark:bg-slate-700 animate-pulse" />
        </div>
      ))}
    </div>
  );
}
