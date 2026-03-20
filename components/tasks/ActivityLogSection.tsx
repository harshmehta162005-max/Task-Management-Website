"use client";

import { useState } from "react";
import { Clock4, ChevronDown } from "lucide-react";
import { DrawerActivity, DrawerComment, DrawerAssignee } from "./task-drawer/types";

type Props = {
  activity: DrawerActivity[];
  comments: DrawerComment[];
  workspaceMembers?: DrawerAssignee[];
};

function formatRelativeTime(dateInput: string): string {
  if (dateInput === "Just now") return dateInput;
  const date = new Date(dateInput);
  if (isNaN(date.getTime())) return dateInput;
  const diffMs = Date.now() - date.getTime();
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);
  if (diffSecs < 60) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString();
}

export function ActivityLogSection({ activity, comments, workspaceMembers = [] }: Props) {
  const [open, setOpen] = useState(true);
  return (
    <div className="space-y-3">
      <button
        className="flex w-full items-center justify-between rounded-xl bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 dark:bg-white/5 dark:text-slate-100 dark:hover:bg-white/10"
        onClick={() => setOpen((v) => !v)}
      >
        <span className="flex items-center gap-2">
          <Clock4 className="h-4 w-4" /> Activity
        </span>
        <ChevronDown className={`h-4 w-4 transition ${open ? "" : "-rotate-90"}`} />
      </button>
      {open && (
        <div className="space-y-4">
          {/* Activity items */}
          {activity.map((a) => (
            <div key={a.id} className="flex items-start gap-3">
              <span className="mt-1 h-2 w-2 rounded-full bg-slate-400" />
              <div>
                <p className="text-sm text-slate-700 dark:text-slate-200">{a.text}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">{a.createdAt}</p>
              </div>
            </div>
          ))}

          {/* Posted comments inside the activity toggle */}
          {comments.length === 0 && activity.length === 0 && (
            <p className="text-xs text-slate-500 dark:text-slate-400">No activity yet.</p>
          )}
          {comments.map((c) => (
            <div key={c.id} className="flex items-start gap-3">
              <img
                src={
                  c.author.avatar ||
                  `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(c.author.name)}&backgroundColor=0f172a`
                }
                className="h-8 w-8 rounded-full object-cover"
                alt={c.author.name}
              />
              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                  <span className="font-semibold text-slate-900 dark:text-white">{c.author.name}</span>
                  <span>{formatRelativeTime(c.createdAt)}</span>
                </div>
                <p className="rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-800 dark:bg-white/5 dark:text-slate-100">
                  {c.body}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
