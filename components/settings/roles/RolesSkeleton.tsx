export function RolesSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={i}
          className="h-28 rounded-2xl border border-slate-200 bg-white shadow-sm animate-pulse dark:border-slate-800 dark:bg-[#0f172a]"
        />
      ))}
    </div>
  );
}
