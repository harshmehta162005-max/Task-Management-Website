import { TaskRow, type TaskItem } from "./TaskRow";

type Props = {
  title: string;
  helper?: string;
  tasks: TaskItem[];
  onToggleComplete: (id: string) => void;
  onStartWork: (id: string) => void;
  onOpen: (id: string) => void;
};

export function TaskGroupCard({ title, helper, tasks, onToggleComplete, onStartWork, onOpen }: Props) {
  return (
    <section className="space-y-3">
      <div className="flex items-center gap-2 px-1">
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">{title}</h2>
        <span className="text-xs font-medium text-slate-400">• {tasks.length} tasks</span>
        {helper && <span className="text-xs text-slate-400">{helper}</span>}
      </div>
      <div className="space-y-2">
        {tasks.length ? (
          tasks.map((task) => (
            <TaskRow
              key={task.id}
              task={task}
              onToggleComplete={onToggleComplete}
              onStartWork={onStartWork}
              onOpen={onOpen}
            />
          ))
        ) : (
          <div className="rounded-2xl border border-dashed border-slate-200 bg-white/80 px-4 py-6 text-center text-sm text-slate-500 dark:border-slate-800 dark:bg-slate-900/40 dark:text-slate-400">
            No tasks in this group
          </div>
        )}
      </div>
    </section>
  );
}
