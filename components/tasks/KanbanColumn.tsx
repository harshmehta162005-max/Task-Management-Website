import { Plus } from "lucide-react";
import { KanbanCard } from "./KanbanCard";
import type { KanbanTask } from "./KanbanBoard";

type Props = {
  id: string;
  title: string;
  wip?: string;
  tasks: KanbanTask[];
  onTaskClick: (id: string) => void;
  onDrop: () => void;
  onDragStart: (id: string) => void;
  isActiveDrop: boolean;
};

export function KanbanColumn({ title, wip, tasks, onTaskClick, onDrop, onDragStart, isActiveDrop }: Props) {
  return (
    <div className="flex w-[320px] shrink-0 flex-col">
      <div className="mb-3 flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-semibold text-slate-900 dark:text-white">{title}</h3>
          <span className="rounded-full bg-slate-200 px-2 py-0.5 text-[11px] font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
            {tasks.length}
          </span>
          {wip ? <span className="text-[11px] font-semibold text-slate-400 dark:text-slate-500">{wip}</span> : null}
        </div>
      </div>

      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          onDrop();
        }}
        className={`flex flex-1 flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm transition dark:border-slate-800 dark:bg-[#0f172a] ${
          isActiveDrop ? "border-primary/50" : ""
        }`}
      >
        {tasks.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-slate-200 py-6 text-center text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400">
            <span className="text-lg">No tasks here</span>
          </div>
        ) : (
          tasks.map((task) => (
            <div
              key={task.id}
              draggable
              onDragStart={() => onDragStart(task.id)}
              className="cursor-grab active:cursor-grabbing"
            >
              <KanbanCard task={task} onClick={onTaskClick} />
            </div>
          ))
        )}
      </div>
    </div>
  );
}
