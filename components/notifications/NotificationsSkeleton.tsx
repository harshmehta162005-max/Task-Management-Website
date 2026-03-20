export function NotificationsSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={i}
          className="flex gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-[#111827] animate-pulse"
        >
          <div className="h-10 w-10 rounded-xl bg-slate-200 dark:bg-slate-700" />
          <div className="flex-1 space-y-2">
            <div className="h-4 w-1/2 rounded bg-slate-200 dark:bg-slate-700" />
            <div className="h-3 w-3/4 rounded bg-slate-200 dark:bg-slate-700" />
          </div>
        </div>
      ))}
    </div>
  );
}

