export function SettingsSkeleton() {
  return (
    <div className="space-y-6">
      <div className="h-8 w-48 animate-pulse rounded-lg bg-slate-200 dark:bg-slate-800" />
      <div className="h-4 w-64 animate-pulse rounded-lg bg-slate-200 dark:bg-slate-800" />
      <div className="grid gap-4 md:grid-cols-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="h-28 animate-pulse rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-[#0f172a]"
          />
        ))}
      </div>
    </div>
  );
}
