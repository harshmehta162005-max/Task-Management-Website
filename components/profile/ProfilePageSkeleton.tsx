"use client";

function SkeletonPulse({ className }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded-xl bg-[#191f2f] ${className ?? ""}`}
    />
  );
}

export function ProfilePageSkeleton() {
  return (
    <div className="space-y-8">
      {/* Identity card skeleton */}
      <div className="rounded-2xl border border-slate-700/30 bg-[#111827]/60 p-8">
        <div className="flex items-center gap-6">
          <SkeletonPulse className="h-20 w-20 !rounded-full" />
          <div className="space-y-3">
            <SkeletonPulse className="h-6 w-48" />
            <SkeletonPulse className="h-4 w-36" />
            <SkeletonPulse className="h-3 w-24" />
          </div>
        </div>
      </div>

      {/* Task snapshot skeleton */}
      <div>
        <SkeletonPulse className="mb-5 h-5 w-32" />
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="rounded-2xl border border-slate-700/20 bg-[#111827]/60 p-5"
            >
              <SkeletonPulse className="h-9 w-9" />
              <SkeletonPulse className="mt-4 h-8 w-12" />
              <SkeletonPulse className="mt-2 h-3 w-16" />
            </div>
          ))}
        </div>
      </div>

      {/* Workspaces skeleton */}
      <div>
        <SkeletonPulse className="mb-5 h-5 w-28" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="rounded-2xl border border-slate-700/20 bg-[#111827]/60 p-5"
            >
              <div className="flex items-center gap-3">
                <SkeletonPulse className="h-10 w-10" />
                <div className="space-y-2">
                  <SkeletonPulse className="h-4 w-28" />
                  <SkeletonPulse className="h-3 w-16" />
                </div>
              </div>
              <SkeletonPulse className="mt-4 h-3 w-20" />
            </div>
          ))}
        </div>
      </div>

      {/* Projects skeleton */}
      <div>
        <SkeletonPulse className="mb-5 h-5 w-28" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="rounded-2xl border border-slate-700/20 bg-[#111827]/60 p-5"
            >
              <SkeletonPulse className="h-4 w-32" />
              <SkeletonPulse className="mt-3 h-3 w-20" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
