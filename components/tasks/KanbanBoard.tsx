import { createPortal } from "react-dom";
import { useMemo, useState } from "react";
import { KanbanColumn } from "./KanbanColumn";
import { KanbanCard } from "./KanbanCard";

export type KanbanTask = {
  id: string;
  title: string;
  status: "TODO" | "IN_PROGRESS" | "BLOCKED" | "DONE";
  priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
  assignees: { id: string; name: string; avatarUrl: string }[];
  dueDate?: string;
  tags: string[];
  commentCount?: number;
  attachmentCount?: number;
};

type Props = {
  tasks: KanbanTask[];
  onMove: (taskId: string, status: KanbanTask["status"]) => void;
  onTaskClick: (id: string) => void;
};

const columns: { id: KanbanTask["status"]; title: string; wip?: string }[] = [
  { id: "TODO", title: "Todo", wip: "WIP 0/5" },
  { id: "IN_PROGRESS", title: "In Progress", wip: "WIP 2/5" },
  { id: "BLOCKED", title: "Blocked" },
  { id: "DONE", title: "Done" },
];

export function KanbanBoard({ tasks, onMove, onTaskClick }: Props) {
  const [activeId, setActiveId] = useState<string | null>(null);

  const grouped = useMemo(() => {
    const map: Record<KanbanTask["status"], KanbanTask[]> = {
      TODO: [],
      IN_PROGRESS: [],
      BLOCKED: [],
      DONE: [],
    };
    tasks.forEach((t) => map[t.status].push(t));
    return map;
  }, [tasks]);

  const activeTask = activeId ? tasks.find((t) => t.id === activeId) : null;

  const handleDrop = (status: KanbanTask["status"]) => {
    if (!activeId) return;
    const task = tasks.find((t) => t.id === activeId);
    if (task && task.status !== status) {
      onMove(activeId, status);
    }
    setActiveId(null);
  };

  return (
    <>
      <div className="grid grid-flow-col auto-cols-[320px] gap-4 overflow-x-auto rounded-2xl bg-transparent">
        {columns.map((col) => (
          <KanbanColumn
            key={col.id}
            id={col.id}
            title={col.title}
            wip={col.wip}
            tasks={grouped[col.id]}
            onTaskClick={onTaskClick}
            onDrop={() => handleDrop(col.id)}
            onDragStart={setActiveId}
            isActiveDrop={activeId !== null}
          />
        ))}
      </div>

      {createPortal(
        activeTask ? <KanbanCard task={activeTask} onClick={onTaskClick} isDragging /> : null,
        typeof document !== "undefined" ? document.body : (null as any)
      )}
    </>
  );
}
