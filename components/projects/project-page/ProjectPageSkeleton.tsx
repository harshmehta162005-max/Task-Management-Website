export function ProjectPageSkeleton() {
  return (
    <main className="min-h-screen bg-background-light px-4 py-8 dark:bg-background-dark sm:px-6 lg:px-10 animate-pulse">
      <div className="mb-6 h-4 w-40 rounded bg-slate-200 dark:bg-slate-800" />
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-[#111827]">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="space-y-3">
            <div className="h-6 w-48 rounded bg-slate-200 dark:bg-slate-800" />
            <div className="h-4 w-72 rounded bg-slate-200 dark:bg-slate-800" />
          </div>
          <div className="flex gap-3">
            <div className="h-10 w-28 rounded-xl bg-slate-200 dark:bg-slate-800" />
            <div className="h-10 w-36 rounded-xl bg-slate-200 dark:bg-slate-800" />
            <div className="h-10 w-10 rounded-xl bg-slate-200 dark:bg-slate-800" />
          </div>
        </div>
        <div className="mt-6 h-12 w-full rounded-xl bg-slate-200 dark:bg-slate-800" />
      </div>
      <div className="mt-6 h-10 w-96 rounded bg-slate-200 dark:bg-slate-800" />
      <div className="mt-4 h-64 rounded-2xl border border-slate-200 bg-white dark:border-white/10 dark:bg-[#111827]" />
    </main>
  );
}

