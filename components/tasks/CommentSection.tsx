"use client";

import { DrawerAssignee, DrawerComment } from "./task-drawer/types";
import { CommentInput } from "./CommentInput";

type Props = {
  comments: DrawerComment[];
  onAdd: (c: DrawerComment) => void;
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

export function CommentSection({ comments, onAdd, workspaceMembers = [] }: Props) {
  // Use workspace members for the people list in the comment input
  const people = workspaceMembers.length > 0
    ? workspaceMembers.map((m) => ({ id: m.id, name: m.name }))
    : [];

  const currentUser = people[0] ?? { id: "me", name: "You" };

  return (
    <div className="space-y-4">
      <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
        Comments ({comments.length})
      </p>
      <div className="space-y-4">
        {comments.length === 0 && (
          <p className="text-xs text-slate-500 dark:text-slate-400">No comments yet.</p>
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
        <CommentInput
          people={people}
          onSubmit={(body) =>
            onAdd({
              id: crypto.randomUUID(),
              author: currentUser,
              body,
              createdAt: "Just now",
              mine: true,
            })
          }
        />
      </div>
    </div>
  );
}
