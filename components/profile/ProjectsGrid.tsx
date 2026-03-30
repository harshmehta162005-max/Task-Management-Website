"use client";

import Link from "next/link";
import { FolderKanban, ClipboardList } from "lucide-react";

type ProjectItem = {
  id: string;
  name: string;
  role: string;
  taskCount: number;
};

type ProjectsGridProps = {
  projects: ProjectItem[];
  workspaceSlug: string;
};

export function ProjectsGrid({ projects, workspaceSlug }: ProjectsGridProps) {
  if (projects.length === 0) {
    return (
      <section>
        <div className="mb-5 flex items-center gap-3">
          <h2 className="text-lg font-bold tracking-tight text-[#dce2f7]">
            Your Projects
          </h2>
          <span className="inline-flex items-center rounded-full bg-[#191f2f] px-2.5 py-0.5 text-xs font-semibold text-[#918fa1]">
            0
          </span>
        </div>
        <div className="flex items-center justify-center rounded-2xl border border-slate-700/20 bg-[#111827]/40 px-8 py-12">
          <div className="text-center">
            <FolderKanban className="mx-auto h-10 w-10 text-[#464555]" />
            <p className="mt-3 text-sm text-[#918fa1]">
              You&apos;re not enrolled in any projects in this workspace yet.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section>
      <div className="mb-5 flex items-center gap-3">
        <h2 className="text-lg font-bold tracking-tight text-[#dce2f7]">
          Your Projects
        </h2>
        <span className="inline-flex items-center rounded-full bg-[#191f2f] px-2.5 py-0.5 text-xs font-semibold text-[#918fa1]">
          {projects.length}
        </span>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <Link
            key={project.id}
            href={`/${workspaceSlug}/projects/${project.id}`}
            className="group relative flex items-start gap-4 overflow-hidden rounded-2xl border border-slate-700/30 bg-[#111827]/80 p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-[#5048e5]/40"
          >
            {/* Left accent bar */}
            <div className="absolute inset-y-0 left-0 w-[3px] rounded-full bg-[#5048e5]/60" />

            <div className="ml-2 min-w-0 flex-1">
              <div className="flex items-start justify-between gap-2">
                <p className="truncate text-sm font-bold text-[#dce2f7] group-hover:text-white">
                  {project.name}
                </p>
                <span
                  className={`flex-shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${
                    project.role === "OWNER"
                      ? "bg-[#5048e5]/15 text-[#c3c0ff]"
                      : "bg-[#232a3a] text-[#918fa1]"
                  }`}
                >
                  {project.role}
                </span>
              </div>

              <div className="mt-3 flex items-center gap-1.5 text-xs text-[#918fa1]">
                <ClipboardList className="h-3.5 w-3.5" />
                <span>
                  {project.taskCount} task{project.taskCount !== 1 ? "s" : ""} assigned
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
