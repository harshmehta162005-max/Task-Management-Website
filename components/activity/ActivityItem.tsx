"use client";

import Link from "next/link";
import { ActivityLogItem } from "./types";
import { cn } from "@/lib/utils/cn";

type Props = {
  item: ActivityLogItem;
  workspaceSlug: string;
};

const severityColor: Record<string, string> = {
  info: "bg-blue-500/10 text-blue-500",
  admin: "bg-amber-500/10 text-amber-500",
  security: "bg-red-500/10 text-red-500",
};

export function ActivityItem({ item, workspaceSlug }: Props) {
  return (
    <div className="flex items-start gap-4 px-4 py-3 transition hover:bg-slate-50 dark:hover:bg-white/5">
      <div className="mt-1 flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border border-slate-200 bg-slate-100 dark:border-slate-800 dark:bg-slate-900">
        {item.actor.avatarUrl ? (
          <img src={item.actor.avatarUrl} alt={item.actor.name} className="h-full w-full object-cover" />
        ) : (
          <span className="text-sm font-semibold text-slate-600 dark:text-slate-200">{initials(item.actor.name)}</span>
        )}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <p className="text-sm text-slate-800 dark:text-slate-100">
            <span className="font-semibold">{item.actor.name}</span> {item.actionText}
          </p>
          <span className="text-xs text-slate-500 dark:text-slate-400 whitespace-nowrap">{item.createdAt}</span>
        </div>
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <TargetChip item={item} workspaceSlug={workspaceSlug} />
          {item.severity && (
            <span className={cn("inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold", severityColor[item.severity])}>
              {item.severity}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

function TargetChip({ item, workspaceSlug }: { item: ActivityLogItem; workspaceSlug: string }) {
  const { target } = item;
  if (target.kind === "task") {
    return (
      <Link
        href={`/${workspaceSlug}/projects/${target.projectId}?taskId=${target.id}`}
        className="inline-flex items-center gap-1 rounded-md border border-slate-200 bg-slate-50 px-2 py-1 text-[11px] font-semibold text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
      >
        Task · {target.label}
      </Link>
    );
  }
  if (target.kind === "project") {
    return (
      <Link
        href={`/${workspaceSlug}/projects/${target.id}`}
        className="inline-flex items-center gap-1 rounded-md border border-slate-200 bg-slate-50 px-2 py-1 text-[11px] font-semibold text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
      >
        Project · {target.label}
      </Link>
    );
  }
  return (
    <Link
      href={`/${workspaceSlug}/settings/members?memberId=${target.id}`}
      className="inline-flex items-center gap-1 rounded-md border border-slate-200 bg-slate-50 px-2 py-1 text-[11px] font-semibold text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
    >
      Member · {target.label}
    </Link>
  );
}

function initials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}
