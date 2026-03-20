"use client";

type Props = {
  onClear?: () => void;
};

export function ActivityEmptyState({ onClear }: Props) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-slate-200 bg-white px-6 py-10 text-center text-slate-600 shadow-sm dark:border-slate-800 dark:bg-[#0f172a] dark:text-slate-300">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-slate-500 dark:bg-slate-800">
        <span className="text-lg">⚡</span>
      </div>
      <div className="space-y-1">
        <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">No activity found</p>
        <p className="text-sm text-slate-500 dark:text-slate-400">Try adjusting your filters.</p>
      </div>
      <button
        onClick={onClear}
        className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white shadow-sm shadow-primary/20 transition hover:bg-primary/90"
      >
        Clear filters
      </button>
    </div>
  );
}
