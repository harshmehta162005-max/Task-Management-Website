export function OnboardingSkeleton() {
  return (
    <div className="grid animate-pulse grid-cols-1 gap-8 lg:grid-cols-12">
      <div className="space-y-4 lg:col-span-4">
        <div className="h-6 w-40 rounded bg-slate-800/60" />
        <div className="h-4 w-64 rounded bg-slate-800/60" />
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, idx) => (
            <div key={idx} className="flex items-start gap-3">
              <div className="h-8 w-8 rounded-full bg-slate-800/60" />
              <div className="space-y-2">
                <div className="h-4 w-32 rounded bg-slate-800/60" />
                <div className="h-3 w-24 rounded bg-slate-800/60" />
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="space-y-4 rounded-2xl border border-white/10 bg-[#111827] p-8 lg:col-span-8">
        <div className="h-6 w-48 rounded bg-slate-800/60" />
        <div className="h-4 w-72 rounded bg-slate-800/60" />
        {Array.from({ length: 5 }).map((_, idx) => (
          <div key={idx} className="h-10 rounded-xl bg-slate-800/60" />
        ))}
      </div>
    </div>
  );
}
