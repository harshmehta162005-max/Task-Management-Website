"use client";

export function TaskDrawerSkeleton() {
  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />
      <div className="relative h-full w-full max-w-[520px] border-l border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-[#0f172a]">
        <div className="space-y-4 animate-pulse">
          <div className="h-4 w-24 rounded-full bg-slate-200 dark:bg-slate-700" />
          <div className="h-8 w-full rounded-xl bg-slate-200 dark:bg-slate-700" />
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div className="h-10 rounded-xl bg-slate-200 dark:bg-slate-700" />
            <div className="h-10 rounded-xl bg-slate-200 dark:bg-slate-700" />
            <div className="h-10 rounded-xl bg-slate-200 dark:bg-slate-700" />
          </div>
          <div className="h-24 rounded-2xl bg-slate-200 dark:bg-slate-700" />
          <div className="h-24 rounded-2xl bg-slate-200 dark:bg-slate-700" />
          <div className="h-20 rounded-2xl bg-slate-200 dark:bg-slate-700" />
        </div>
      </div>
    </div>
  );
}
