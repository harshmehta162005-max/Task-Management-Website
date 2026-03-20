export function WorkspaceCardSkeleton() {
  return (
    <div className="h-[104px] animate-pulse rounded-2xl border border-white/10 bg-slate-900/40 p-5">
      <div className="flex h-full items-center gap-4">
        <div className="h-12 w-12 rounded-xl bg-slate-700/50" />
        <div className="flex-1 space-y-2">
          <div className="h-4 w-1/3 rounded bg-slate-700/50" />
          <div className="h-3 w-1/2 rounded bg-slate-800/50" />
        </div>
        <div className="h-5 w-16 rounded-full bg-slate-800/50" />
      </div>
    </div>
  );
}
