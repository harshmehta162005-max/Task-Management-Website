export function InviteCardSkeleton() {
  return (
    <div className="w-full max-w-[520px] overflow-hidden rounded-2xl border border-slate-200 bg-white text-slate-900 shadow-2xl dark:border-white/10 dark:bg-[#111827] dark:text-slate-100">
      <div className="flex flex-col items-center gap-4 pt-10 pb-6 animate-pulse">
        <div className="h-12 w-12 rounded-xl bg-slate-200 dark:bg-slate-700" />
        <div className="h-4 w-28 rounded bg-slate-200 dark:bg-slate-700" />
      </div>
      <div className="space-y-6 px-8 pb-10 animate-pulse">
        <div className="space-y-2 text-center">
          <div className="mx-auto h-5 w-40 rounded bg-slate-200 dark:bg-slate-700" />
          <div className="mx-auto h-4 w-64 rounded bg-slate-200 dark:bg-slate-700" />
        </div>
        <div className="h-20 rounded-xl bg-slate-200 dark:bg-slate-800" />
        <div className="space-y-3">
          <div className="h-12 rounded-xl bg-slate-200 dark:bg-slate-800" />
          <div className="h-12 rounded-xl bg-slate-200 dark:bg-slate-800" />
        </div>
      </div>
      <div className="h-10 border-t border-slate-200 bg-slate-50/50 dark:border-white/5 dark:bg-white/5" />
    </div>
  );
}
