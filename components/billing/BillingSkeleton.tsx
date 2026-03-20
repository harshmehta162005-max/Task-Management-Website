"use client";

export function BillingSkeleton() {
  return (
    <div className="mx-auto max-w-5xl space-y-4 px-4 py-8">
      {[1, 2, 3, 4].map((i) => (
        <div
          key={i}
          className="h-32 w-full animate-pulse rounded-2xl border border-slate-200 bg-slate-100 dark:border-slate-800 dark:bg-slate-800/50"
        />
      ))}
    </div>
  );
}
