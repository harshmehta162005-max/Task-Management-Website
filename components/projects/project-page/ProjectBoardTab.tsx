import { useMemo, useState } from "react";
import { KanbanFilterBar } from "@/components/tasks/KanbanFilterBar";
import { KanbanBoard, KanbanTask } from "@/components/tasks/KanbanBoard";
import { KanbanBoardSkeleton } from "@/components/tasks/KanbanBoardSkeleton";

type Props = {
  tasks: KanbanTask[];
  onMove: (id: string, status: KanbanTask["status"]) => void;
  onOpenTask: (id: string) => void;
  onAddTask: () => void;
};

export function ProjectBoardTab({ tasks, onMove, onOpenTask, onAddTask }: Props) {
  const [loading] = useState(false);
  const [search, setSearch] = useState("");
  const [assignee, setAssignee] = useState("");
  const [priority, setPriority] = useState("");

  const filteredTasks = useMemo(() => {
    return tasks.filter((t) => {
      const matchesSearch =
        !search ||
        t.title.toLowerCase().includes(search.toLowerCase()) ||
        t.tags.some((tag) => tag.name.toLowerCase().includes(search.toLowerCase()));
      const matchesAssignee = !assignee || t.assignees.some((a) => a.id === assignee);
      const matchesPriority = !priority || t.priority === priority;
      return matchesSearch && matchesAssignee && matchesPriority;
    });
  }, [tasks, search, assignee, priority]);

  const availableAssignees = useMemo(() => {
    const map = new Map<string, { id: string; name: string }>();
    tasks.forEach(t => t.assignees.forEach(a => map.set(a.id, { id: a.id, name: a.name })));
    return Array.from(map.values()).sort((a, b) => a.name.localeCompare(b.name));
  }, [tasks]);

  return (
    <div className="space-y-4">
      <KanbanFilterBar 
        onSearchChange={setSearch} 
        onAssigneeChange={setAssignee} 
        onPriorityChange={setPriority} 
        availableAssignees={availableAssignees}
      />
      {loading ? (
        <KanbanBoardSkeleton />
      ) : filteredTasks.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center shadow-sm dark:border-slate-700 dark:bg-[#0f172a]">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Create your first task</h3>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Add tasks to start organizing work in this project.
          </p>
          <div className="mt-4"><button onClick={onAddTask} className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white shadow-sm">
            + Add task
          </button></div>
        </div>
      ) : (
        <KanbanBoard tasks={filteredTasks} onMove={onMove} onTaskClick={onOpenTask} />
      )}
    </div>
  );
}
