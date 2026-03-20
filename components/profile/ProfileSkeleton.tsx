"use client";

export function ProfileSkeleton() {
  return (
    <div className="max-w-[900px] space-y-6 px-4 py-8">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="h-40 w-full animate-pulse rounded-2xl border border-slate-200 bg-slate-100 dark:border-slate-800 dark:bg-slate-800/50"
        />
      ))}
    </div>
  );
}
