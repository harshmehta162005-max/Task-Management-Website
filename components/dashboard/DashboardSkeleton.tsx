export function DashboardSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-8 w-40 rounded bg-slate-200 dark:bg-white/10" />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-24 rounded-2xl border border-slate-200 bg-slate-100 dark:border-white/10 dark:bg-white/5" />
        ))}
      </div>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
        <div className="h-64 rounded-2xl border border-slate-200 bg-slate-100 lg:col-span-7 dark:border-white/10 dark:bg-white/5" />
        <div className="h-64 rounded-2xl border border-slate-200 bg-slate-100 lg:col-span-5 dark:border-white/10 dark:bg-white/5" />
      </div>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
        <div className="h-64 rounded-2xl border border-slate-200 bg-slate-100 lg:col-span-8 dark:border-white/10 dark:bg-white/5" />
        <div className="h-64 rounded-2xl border border-slate-200 bg-slate-100 lg:col-span-4 dark:border-white/10 dark:bg-white/5" />
      </div>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
        <div className="h-64 rounded-2xl border border-slate-200 bg-slate-100 lg:col-span-8 dark:border-white/10 dark:bg-white/5" />
        <div className="h-64 rounded-2xl border border-slate-200 bg-slate-100 lg:col-span-4 dark:border-white/10 dark:bg-white/5" />
      </div>
    </div>
  );
}
