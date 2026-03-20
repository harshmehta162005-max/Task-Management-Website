export function ProjectCardSkeleton() {
  return (
    <div className="flex h-full flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-[#111827] animate-pulse">
      <div>
        <div className="mb-4 flex items-start justify-between">
          <div className="h-12 w-12 rounded-xl bg-slate-100 dark:bg-slate-800" />
          <div className="h-6 w-6 rounded-lg bg-slate-100 dark:bg-slate-800" />
        </div>
        <div className="mb-4 h-6 w-2/3 rounded-lg bg-slate-100 dark:bg-slate-800" />
        <div className="mb-6 space-y-2">
          <div className="h-3 w-full rounded-lg bg-slate-100 dark:bg-slate-800" />
          <div className="h-3 w-4/5 rounded-lg bg-slate-100 dark:bg-slate-800" />
        </div>
        <div className="mb-6 flex -space-x-2">
          <div className="h-8 w-8 rounded-full border-2 border-[#111827] bg-slate-100 dark:bg-slate-800" />
          <div className="h-8 w-8 rounded-full border-2 border-[#111827] bg-slate-100 dark:bg-slate-800" />
          <div className="h-8 w-8 rounded-full border-2 border-[#111827] bg-slate-100 dark:bg-slate-800" />
        </div>
        <div className="mb-6 space-y-3">
          <div className="h-1.5 w-full rounded-full bg-slate-100 dark:bg-slate-800" />
        </div>
      </div>
      <div className="flex justify-between border-t border-slate-100 pt-4 dark:border-white/10">
        <div className="h-3 w-20 rounded-lg bg-slate-100 dark:bg-slate-800" />
        <div className="h-3 w-24 rounded-lg bg-slate-100 dark:bg-slate-800" />
      </div>
    </div>
  );
}

