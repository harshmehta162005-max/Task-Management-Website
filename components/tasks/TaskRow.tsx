import Link from "next/link";
import { PriorityBadge } from "./PriorityBadge";
import { StatusBadge } from "./StatusBadge";
import { TaskActionMenu } from "./TaskActionMenu";
import { cn } from "@/lib/utils/cn";

export type TaskItem = {
  id: string;
  title: string;
  projectName: string;
  projectId: string;
  priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
  status: "TODO" | "IN_PROGRESS" | "IN_REVIEW" | "BLOCKED" | "DONE";
  dueLabel: string;
  isCompleted: boolean;
  creatorId: string;
  currentUserId: string;
  assignees: { id: string; name?: string; avatarUrl?: string; workStatus: string }[];
};

type Props = {
  task: TaskItem;
  onToggleComplete: (id: string) => void;
  onStartWork: (id: string) => void;
  onOpen: (id: string) => void;
  onSubmitReview?: (id: string) => void;
  onDelete?: (id: string) => void;
  onDuplicate?: (id: string) => void;
  onMove?: (id: string) => void;
};

function computeWaitingLabel(task: TaskItem): string | null {
  const isOwner = task.creatorId === task.currentUserId;
  const me = task.assignees?.find((a) => a.id === task.currentUserId);
  const hasSubmitted = task.assignees?.some((a) => a.workStatus === "SUBMITTED");

  if (!isOwner && me && me.workStatus !== "SUBMITTED" && task.status !== "DONE") {
    if (me.workStatus === "TODO") return "Waiting for you to start";
    if (me.workStatus === "IN_PROGRESS") return "Waiting for your submission";
  }
  if (isOwner && hasSubmitted && task.status === "IN_REVIEW") {
    return "Waiting for your review";
  }
  return null;
}

function AssigneeProgress({ assignees }: { assignees: TaskItem["assignees"] }) {
  if (!assignees || assignees.length <= 1) return null;

  const total = assignees.length;
  const inProgress = assignees.filter((a) => a.workStatus === "IN_PROGRESS").length;
  const submitted = assignees.filter((a) => a.workStatus === "SUBMITTED").length;

  const parts: string[] = [];
  if (inProgress > 0) parts.push(`${inProgress} active`);
  if (submitted > 0) parts.push(`${submitted} submitted`);

  return (
    <span className="flex items-center gap-1.5 text-[10px] font-medium text-slate-400 dark:text-slate-500">
      {/* Avatar stack */}
      <span className="flex -space-x-1.5">
        {assignees.slice(0, 3).map((a, i) => (
          <span
            key={a.id}
            className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-200 text-[8px] font-bold text-slate-600 ring-1 ring-white dark:bg-slate-700 dark:text-slate-300 dark:ring-[#1e1e2d]"
            title={a.name || a.id}
          >
            {a.avatarUrl ? (
              <img src={a.avatarUrl} alt="" className="h-full w-full rounded-full object-cover" />
            ) : (
              (a.name || "?").charAt(0).toUpperCase()
            )}
          </span>
        ))}
        {assignees.length > 3 && (
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-300 text-[8px] font-bold text-slate-600 ring-1 ring-white dark:bg-slate-600 dark:text-slate-300 dark:ring-[#1e1e2d]">
            +{assignees.length - 3}
          </span>
        )}
      </span>
      {parts.length > 0 && (
        <span className="hidden sm:inline">
          {parts.join(" · ")}
        </span>
      )}
    </span>
  );
}

export function TaskRow({ task, onToggleComplete, onStartWork, onOpen, onSubmitReview, onDelete, onDuplicate, onMove }: Props) {
  const isOwner = task.creatorId === task.currentUserId;
  const me = task.assignees?.find((a) => a.id === task.currentUserId);
  const isSubmitted = me?.workStatus === "SUBMITTED";
  const waitingLabel = computeWaitingLabel(task);

  return (
    <div
      className={cn(
        "group flex items-center justify-between px-4 py-3 transition-all duration-200 cursor-pointer",
        "hover:bg-slate-50/80 dark:hover:bg-[#242434]/60",
        waitingLabel && "bg-amber-500/[0.03] dark:bg-amber-500/[0.03]"
      )}
      onClick={() => onOpen(task.id)}
      role="button"
    >
      {/* Left side */}
      <div className="flex items-center gap-3.5 min-w-0">
        {/* Checkbox */}
        {isOwner ? (
          <input
            type="checkbox"
            checked={task.isCompleted}
            onChange={(e) => {
              e.stopPropagation();
              onToggleComplete(task.id);
            }}
            className="h-4 w-4 cursor-pointer rounded-sm border-2 border-slate-300 bg-transparent text-indigo-600 focus:ring-indigo-600 dark:border-slate-600 shrink-0"
            onClick={(e) => e.stopPropagation()}
            title="Mark Complete"
          />
        ) : (
          <input
            type="checkbox"
            checked={isSubmitted}
            onChange={(e) => {
              e.stopPropagation();
              if (!isSubmitted && onSubmitReview) {
                onSubmitReview(task.id);
              } else if (isSubmitted) {
                onStartWork(task.id);
              }
            }}
            className="h-4 w-4 rounded-sm border-2 border-slate-300 bg-transparent text-blue-500 focus:ring-blue-500 dark:border-slate-600 cursor-pointer shrink-0"
            onClick={(e) => e.stopPropagation()}
            title="Mark as submitted"
          />
        )}

        {/* Task info */}
        <div className="min-w-0 flex-1">
          <p className={cn(
            "text-sm font-medium text-slate-900 dark:text-slate-100 truncate",
            task.isCompleted && "line-through opacity-50"
          )}>
            {task.title}
          </p>
          <div className="mt-1 flex flex-wrap items-center gap-1.5">
            <Link
              href={`/${task.projectId}`}
              className="rounded-md bg-slate-100 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-500 hover:text-primary dark:bg-[#12121e] dark:text-slate-400"
              onClick={(e) => e.stopPropagation()}
            >
              {task.projectName}
            </Link>
            <PriorityBadge priority={task.priority} />
            <StatusBadge status={task.status} />
            <span className="text-[11px] text-slate-400 dark:text-slate-500">{task.dueLabel}</span>
            {waitingLabel && (
              <span className="rounded-md bg-amber-500/10 px-1.5 py-0.5 text-[10px] font-semibold text-amber-600 dark:text-amber-400">
                {waitingLabel}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Right side */}
      <div className="flex flex-shrink-0 items-center gap-2 pl-3">
        <AssigneeProgress assignees={task.assignees} />

        {/* ASSIGNEE: TODO -> Hover "Start" */}
        {!!me && !isSubmitted && task.status === "TODO" && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onStartWork(task.id);
            }}
            className="opacity-0 group-hover:opacity-100 rounded-lg bg-slate-100 px-3 py-1.5 text-[11px] font-bold tracking-wide text-slate-600 transition hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
          >
            Start Task
          </button>
        )}

        {/* ASSIGNEE: IN_PROGRESS -> Persistent "Submit" */}
        {!!me && !isSubmitted && task.status === "IN_PROGRESS" && onSubmitReview && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onSubmitReview(task.id);
            }}
            className="rounded-lg bg-indigo-500/15 px-3 py-1.5 text-[11px] font-bold tracking-wide text-indigo-600 transition hover:bg-indigo-500/25 dark:bg-indigo-500/20 dark:text-indigo-400 dark:hover:bg-indigo-500/30 ring-1 ring-inset ring-indigo-500/20"
          >
            Submit for Review
          </button>
        )}

        {/* ASSIGNEE: IN_REVIEW -> Read-only badge */}
        {isSubmitted && !isOwner && task.status !== "DONE" && (
          <span className="rounded-lg bg-amber-500/10 px-3 py-1.5 text-[11px] font-bold tracking-wide text-amber-600 dark:text-amber-400 ring-1 ring-inset ring-amber-500/20">
            In Review
          </span>
        )}

        {/* OWNER: IN_REVIEW -> Persistent "Approve" */}
        {isOwner && task.status === "IN_REVIEW" && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleComplete(task.id);
            }}
            className="rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 px-3 py-1.5 text-[11px] font-bold tracking-wide text-white shadow-[0_0_12px_rgba(99,102,241,0.4)] transition hover:brightness-110"
          >
            Approve &amp; Done
          </button>
        )}

        {/* OWNER: TODO/IN_PROGRESS -> "View Task" */}
        {isOwner && !me && task.status !== "DONE" && task.status !== "IN_REVIEW" && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onOpen(task.id);
            }}
            className="z-10 opacity-0 group-hover:opacity-100 rounded-lg bg-slate-100 px-3 py-1.5 text-[11px] font-bold tracking-wide text-slate-600 transition hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
          >
            View Task
          </button>
        )}

        <div className="z-10 cursor-pointer" onClick={(e) => e.stopPropagation()}>
          <TaskActionMenu
            onCopy={() => {}}
            onDelete={onDelete ? () => onDelete(task.id) : undefined}
            onDuplicate={onDuplicate ? () => onDuplicate(task.id) : undefined}
            onMove={onMove ? () => onMove(task.id) : undefined}
            isManager={isOwner}
          />
        </div>
      </div>
    </div>
  );
}
