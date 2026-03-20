export function PreferencesSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 3 }).map((_, i) => (
        <div
          key={i}
          className="h-32 animate-pulse rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-[#0f172a]"
        />
      ))}
    </div>
  );
}
