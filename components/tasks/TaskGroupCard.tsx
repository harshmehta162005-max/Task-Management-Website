"use client";

import { useState } from "react";
import { Sparkles, ChevronDown, ChevronRight } from "lucide-react";
import { TaskRow, type TaskItem } from "./TaskRow";
import { cn } from "@/lib/utils/cn";

type Props = {
  title: string;
  emoji: string;
  accentColor: string;
  helper?: string;
  tasks: TaskItem[];
  onToggleComplete: (id: string) => void;
  onStartWork: (id: string) => void;
  onOpen: (id: string) => void;
  onSubmitReview?: (id: string) => void;
  onDelete?: (id: string) => void;
  onDuplicate?: (id: string) => void;
  onMove?: (id: string) => void;
};

const ACCENT_BADGE: Record<string, string> = {
  rose: "bg-rose-500/10 text-rose-500 dark:text-rose-400",
  amber: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  emerald: "bg-emerald-500/10 text-emerald-500 dark:text-emerald-400",
  slate: "bg-slate-500/10 text-slate-400",
  blue: "bg-blue-500/10 text-blue-500 dark:text-blue-400",
  indigo: "bg-indigo-500/10 text-indigo-500 dark:text-indigo-400",
};

export function TaskGroupCard({ title, emoji, accentColor, helper, tasks, onToggleComplete, onStartWork, onOpen, onSubmitReview, onDelete, onDuplicate, onMove }: Props) {
  const [isExpanded, setIsExpanded] = useState(true);
  const badgeClass = ACCENT_BADGE[accentColor] || ACCENT_BADGE.slate;

  return (
    <section className="mb-6">
      {/* Group Header */}
      <button
        type="button"
        className="mb-3 flex w-full cursor-pointer items-center gap-2.5 rounded-xl px-3 py-2 transition-colors hover:bg-slate-50/60 dark:hover:bg-[#12121e]/60"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <span className="text-slate-400 dark:text-slate-500">
          {isExpanded ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />}
        </span>
        <span className="text-sm">{emoji}</span>
        <h2
          className="text-xs font-bold uppercase tracking-[0.1em] text-slate-600 dark:text-slate-300"
          style={{ fontFamily: "Manrope, sans-serif" }}
        >
          {title}
        </h2>
        <span className={cn("rounded-full px-2 py-0.5 text-[10px] font-bold", badgeClass)}>
          {tasks.length}
        </span>
        {helper && (
          <span className="ml-2 text-[10px] font-medium uppercase tracking-widest text-slate-400 opacity-60">
            {helper}
          </span>
        )}
      </button>

      {/* Task List */}
      {isExpanded && (
        <div className="flex flex-col gap-px rounded-2xl bg-white/60 dark:bg-[#1e1e2d]/40">
          {tasks.length ? (
            tasks.map((task) => (
              <TaskRow
                key={task.id}
                task={task}
                onToggleComplete={onToggleComplete}
                onStartWork={onStartWork}
                onOpen={onOpen}
                onSubmitReview={onSubmitReview}
                onDelete={onDelete}
                onDuplicate={onDuplicate}
                onMove={onMove}
              />
            ))
          ) : (
            <div className="flex items-center gap-4 px-4 py-5">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.15)]">
                <Sparkles className="h-4 w-4" />
              </div>
              <div>
                <p className="text-sm font-semibold tracking-tight text-slate-700 dark:text-slate-300">
                  You&apos;re completely caught up
                </p>
                <p className="text-xs text-slate-400">No tasks in this group right now.</p>
              </div>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
