import Link from "next/link";
import { MoreHorizontal, FolderKanban, Archive, Pencil, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import type { ReactNode } from "react";
import type { Project } from "./types";

type Props = {
  project: Project;
  href: string;
  isManager?: boolean;
};

export function ProjectCard({ project, href, isManager }: Props) {
  const {
    name,
    description,
    members,
    totalTasks,
    completedTasks,
    blockedTasks,
    overdueTasks,
    accentBg,
    accentColor,
    icon,
    createdAt,
  } = project;

  const progress = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

  return (
    <Link
      href={href}
      className="group flex h-full flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/50 dark:border-white/10 dark:bg-[#111827]"
    >
      <div>
        <div className="mb-4 flex items-start justify-between">
          <div className={cn("flex h-12 w-12 items-center justify-center rounded-xl", accentBg, accentColor)}>
            <span className="material-symbols-outlined text-2xl">{icon || "folder_open"}</span>
          </div>
          <div className="relative">
            <button className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-800 hover:text-slate-100">
              <MoreHorizontal className="h-4 w-4" />
            </button>
            {/* Context menu UI only; would be a dropdown in real app */}
            <div className="pointer-events-none absolute right-0 top-10 hidden min-w-[180px] rounded-xl border border-slate-200 bg-white p-2 text-sm shadow-lg group-hover:pointer-events-auto group-hover:block dark:border-white/10 dark:bg-[#0f172a]">
              {isManager ? (
                <>
                  <MenuItem icon={<Pencil className="h-4 w-4" />} label="Edit" />
                  <MenuItem icon={<Archive className="h-4 w-4" />} label="Archive" />
                  <MenuItem icon={<Trash2 className="h-4 w-4" />} label="Delete" danger />
                </>
              ) : (
                <MenuItem icon={<FolderKanban className="h-4 w-4" />} label="View details" />
              )}
            </div>
          </div>
        </div>

        <h3 className="mb-2 text-lg font-bold text-slate-900 dark:text-white line-clamp-1">{name}</h3>
        <p className="mb-6 text-sm text-slate-500 line-clamp-2 dark:text-slate-400">{description}</p>

        <div className="mb-6 flex -space-x-2 overflow-hidden">
          {members.slice(0, 4).map((src, idx) => (
            <img
              key={src + idx}
              alt=""
              className="inline-block h-8 w-8 rounded-full ring-2 ring-white object-cover dark:ring-[#111827]"
              src={src}
            />
          ))}
          {members.length > 4 ? (
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-800 text-[10px] font-bold text-slate-300 ring-2 ring-white dark:ring-[#111827]">
              +{members.length - 4}
            </div>
          ) : null}
        </div>

        <div className="mb-6 space-y-2">
          <div className="flex justify-between text-xs font-medium text-slate-400">
            <span>Progress</span>
            <span>{progress}%</span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
            <div className="h-full rounded-full bg-primary" style={{ width: `${progress}%` }} />
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between border-t border-slate-100 pt-4 text-xs dark:border-white/10">
        <div className="flex items-center gap-3">
          {overdueTasks > 0 ? (
            <span className="rounded-md bg-rose-500/10 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-rose-500">
              Overdue
            </span>
          ) : null}
          <span className="text-slate-500 dark:text-slate-400">{createdAt}</span>
        </div>
        <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400">
          <span className="flex items-center gap-0.5">{totalTasks} tasks</span>
          <span>•</span>
          <span className="flex items-center gap-0.5 text-emerald-500">{completedTasks} done</span>
          {blockedTasks > 0 ? (
            <>
              <span>•</span>
              <span className="flex items-center gap-0.5 text-amber-500">{blockedTasks} blocked</span>
            </>
          ) : null}
        </div>
      </div>
    </Link>
  );
}

function MenuItem({ icon, label, danger }: { icon: ReactNode; label: string; danger?: boolean }) {
  return (
    <div
      className={cn(
        "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-white/5",
        danger && "text-rose-500 hover:bg-rose-500/10 dark:hover:bg-rose-500/10"
      )}
    >
      {icon}
      <span>{label}</span>
    </div>
  );
}
