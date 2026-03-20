export function MyTasksSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-8 w-40 rounded bg-slate-200 dark:bg-white/10" />
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, idx) => (
          <div key={idx} className="h-16 rounded-2xl border border-slate-200 bg-slate-100 dark:border-white/10 dark:bg-white/5" />
        ))}
      </div>
    </div>
  );
}
