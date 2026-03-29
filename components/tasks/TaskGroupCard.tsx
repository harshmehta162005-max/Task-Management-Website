import { useState } from "react";
import { Sparkles, ChevronDown, ChevronRight } from "lucide-react";
import { TaskRow, type TaskItem } from "./TaskRow";

type Props = {
  title: string;
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

export function TaskGroupCard({ title, helper, tasks, onToggleComplete, onStartWork, onOpen, onSubmitReview, onDelete, onDuplicate, onMove }: Props) {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <section className="mb-10">
      <div 
        className="mb-4 flex cursor-pointer items-baseline gap-2 px-2 transition hover:opacity-80"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <span className="text-slate-400 dark:text-slate-500">
          {isExpanded ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />}
        </span>
        <h2 className="text-xs font-bold uppercase tracking-[0.08em] text-slate-500 dark:text-slate-400">
          {title}
        </h2>
        <span className="text-[10px] font-bold tracking-wider text-slate-400/80 dark:text-slate-500/80">
          {tasks.length}
        </span>
        {helper && <span className="ml-2 text-[10px] font-medium uppercase tracking-widest text-slate-400 opacity-60">{helper}</span>}
      </div>
      
      {isExpanded && (
        <div className="flex flex-col space-y-0.5">
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
          <div className="flex items-center gap-4 rounded-xl px-3 py-4 dark:bg-slate-900/10">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.15)]">
              <Sparkles className="h-4 w-4" />
            </div>
            <div>
              <p className="text-sm font-semibold tracking-tight text-slate-700 dark:text-slate-300">You're completely caught up</p>
            </div>
          </div>
        )}
        </div>
      )}
    </section>
  );
}
