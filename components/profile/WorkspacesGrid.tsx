"use client";

import Link from "next/link";
import { Building2, FolderOpen } from "lucide-react";

type WorkspaceItem = {
  id: string;
  name: string;
  slug: string;
  logoUrl: string | null;
  role: string;
  memberProjectCount: number;
};

type WorkspacesGridProps = {
  workspaces: WorkspaceItem[];
  currentWorkspaceSlug: string;
};

export function WorkspacesGrid({ workspaces, currentWorkspaceSlug }: WorkspacesGridProps) {
  return (
    <section>
      <div className="mb-5 flex items-center gap-3">
        <h2 className="text-lg font-bold tracking-tight text-[#dce2f7]">
          Workspaces
        </h2>
        <span className="inline-flex items-center rounded-full bg-[#191f2f] px-2.5 py-0.5 text-xs font-semibold text-[#918fa1]">
          {workspaces.length}
        </span>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {workspaces.map((ws) => {
          const isCurrent = ws.slug === currentWorkspaceSlug;
          const initials = ws.name
            .split(" ")
            .map((w) => w[0])
            .join("")
            .slice(0, 2)
            .toUpperCase();

          return (
            <Link
              key={ws.id}
              href={`/${ws.slug}/dashboard`}
              className={`group relative flex flex-col gap-4 rounded-2xl border p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-[#5048e5]/40 ${
                isCurrent
                  ? "border-[#5048e5]/50 bg-[#111827]"
                  : "border-slate-700/30 bg-[#111827]/80"
              }`}
            >
              {/* Current glow */}
              {isCurrent && (
                <div className="pointer-events-none absolute -inset-px rounded-2xl bg-[#5048e5]/5 blur-sm" />
              )}

              <div className="relative flex items-start justify-between">
                <div className="flex items-center gap-3">
                  {ws.logoUrl ? (
                    <img
                      src={ws.logoUrl}
                      alt={ws.name}
                      className="h-10 w-10 rounded-xl object-cover"
                    />
                  ) : (
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#232a3a] text-sm font-bold text-[#c3c0ff]">
                      {initials}
                    </div>
                  )}
                  <div className="min-w-0">
                    <p className="truncate text-sm font-bold text-[#dce2f7] group-hover:text-white">
                      {ws.name}
                    </p>
                    <span
                      className={`mt-1 inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${
                        ws.role === "Owner"
                          ? "bg-[#5048e5]/15 text-[#c3c0ff]"
                          : "bg-[#232a3a] text-[#918fa1]"
                      }`}
                    >
                      {ws.role}
                    </span>
                  </div>
                </div>

                {isCurrent && (
                  <span className="flex-shrink-0 rounded-full bg-[#5048e5]/20 px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest text-[#c3c0ff]">
                    Current
                  </span>
                )}
              </div>

              <div className="relative flex items-center gap-1.5 text-xs text-[#918fa1]">
                <FolderOpen className="h-3.5 w-3.5" />
                <span>{ws.memberProjectCount} project{ws.memberProjectCount !== 1 ? "s" : ""}</span>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
