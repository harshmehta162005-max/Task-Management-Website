export function KanbanBoardSkeleton() {
  return (
    <div className="grid grid-flow-col auto-cols-[320px] gap-4 overflow-x-auto rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-[#0f172a]">
      {Array.from({ length: 4 }).map((_, col) => (
        <div key={col} className="space-y-4">
          <div className="h-6 w-32 rounded bg-slate-200 dark:bg-slate-700" />
          {Array.from({ length: 3 }).map((__, i) => (
            <div key={i} className="h-24 rounded-xl border border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-800" />
          ))}
        </div>
      ))}
    </div>
  );
}

