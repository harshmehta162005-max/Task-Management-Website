export function MyTasksSkeleton() {
  return (
    <div className="space-y-8 animate-pulse">
      {/* Greeting skeleton */}
      <div className="space-y-2">
        <div className="h-7 w-48 rounded-lg bg-slate-200 dark:bg-white/10" />
        <div className="h-4 w-72 rounded bg-slate-100 dark:bg-white/5" />
      </div>

      {/* Summary cards skeleton */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center gap-3 rounded-2xl bg-white/80 px-4 py-4 dark:bg-[#1e1e2d]/80">
            <div className="h-10 w-10 rounded-xl bg-slate-200 dark:bg-white/10" />
            <div className="space-y-1.5">
              <div className="h-5 w-8 rounded bg-slate-200 dark:bg-white/10" />
              <div className="h-3 w-16 rounded bg-slate-100 dark:bg-white/5" />
            </div>
          </div>
        ))}
      </div>

      {/* Filter tabs skeleton */}
      <div className="flex gap-1 rounded-xl bg-slate-100/80 p-1 dark:bg-[#12121e]/80 w-fit">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-7 w-20 rounded-lg bg-slate-200 dark:bg-white/10" />
        ))}
      </div>

      {/* Task groups skeleton */}
      <div className="space-y-6">
        {Array.from({ length: 3 }).map((_, idx) => (
          <div key={idx} className="space-y-2">
            <div className="flex items-center gap-2 px-3">
              <div className="h-3.5 w-3.5 rounded bg-slate-200 dark:bg-white/10" />
              <div className="h-4 w-24 rounded bg-slate-200 dark:bg-white/10" />
              <div className="h-4 w-6 rounded-full bg-slate-100 dark:bg-white/5" />
            </div>
            <div className="rounded-2xl bg-white/60 dark:bg-[#1e1e2d]/40 overflow-hidden">
              {Array.from({ length: 3 }).map((_, j) => (
                <div key={j} className="flex items-center gap-4 px-4 py-3">
                  <div className="h-4 w-4 rounded-sm bg-slate-200 dark:bg-white/10" />
                  <div className="flex-1 space-y-1.5">
                    <div className="h-4 w-3/4 rounded bg-slate-200 dark:bg-white/10" />
                    <div className="flex gap-2">
                      <div className="h-3 w-16 rounded-full bg-slate-100 dark:bg-white/5" />
                      <div className="h-3 w-12 rounded-full bg-slate-100 dark:bg-white/5" />
                      <div className="h-3 w-14 rounded-full bg-slate-100 dark:bg-white/5" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
