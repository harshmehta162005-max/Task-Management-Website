import { useMemo } from "react";
import { useRouter, useSearchParams, useParams } from "next/navigation";
import { TaskTable } from "@/components/tasks/TaskTable";
import { TaskFiltersPopover, TaskListFilters } from "@/components/tasks/TaskFiltersPopover";
import { SortControls } from "@/components/tasks/SortControls";
import { KanbanTask } from "@/components/tasks/KanbanBoard";

type Props = {
  tasks: (KanbanTask & { updatedAt: string; creatorId: string })[];
  onOpenTask: (id: string) => void;
  onAddTask: () => void;
  onReload?: () => void;
  currentUserId?: string;
  workspaceMembers?: { id: string; name: string; avatar?: string }[];
};

export function ProjectListTab({ tasks, onOpenTask, onAddTask, onReload, currentUserId, workspaceMembers = [] }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = useParams();

  const filters: TaskListFilters = {
    status: searchParams.get("status") || "",
    priority: searchParams.get("priority") || "",
    assignee: searchParams.get("assignee") || "",
    tag: searchParams.get("tag") || "",
    dueFrom: searchParams.get("dueFrom") || "",
    dueTo: searchParams.get("dueTo") || "",
    q: searchParams.get("q") || "",
  };
  const sort = searchParams.get("sort") || "updated_desc";

  const updateParams = (patch: Record<string, string>) => {
    const sp = new URLSearchParams(searchParams.toString());
    Object.entries(patch).forEach(([k, v]) => {
      if (v) sp.set(k, v);
      else sp.delete(k);
    });
    sp.set("tab", "list");
    router.replace(`?${sp.toString()}`, { scroll: false });
  };

  const filtered = useMemo(() => {
    return tasks
      .filter((t) => (!filters.status || t.status === filters.status))
      .filter((t) => (!filters.priority || t.priority === filters.priority))
      .filter((t) => (!filters.assignee || t.assignees.some((a) => a.id === filters.assignee)))
      .filter((t) => (!filters.tag || t.tags.some((tag) => tag.name === filters.tag)))
      .filter((t) => {
        if (!filters.q) return true;
        const q = filters.q!.toLowerCase();
        return (
          t.title.toLowerCase().includes(q) ||
          t.tags.some((tag) => tag.name.toLowerCase().includes(q))
        );
      })
      .filter((t) => {
        if (!filters.dueFrom && !filters.dueTo) return true;
        const due = t.dueDate ? new Date(t.dueDate) : null;
        if (!due) return false;
        if (filters.dueFrom && due < new Date(filters.dueFrom)) return false;
        if (filters.dueTo && due > new Date(filters.dueTo)) return false;
        return true;
      })
      .sort((a, b) => {
        if (sort === "due_asc") return (a.dueDate || "").localeCompare(b.dueDate || "");
        if (sort === "due_desc") return (b.dueDate || "").localeCompare(a.dueDate || "");
        if (sort === "priority_desc") return priorityRank(b.priority) - priorityRank(a.priority);
        return (b.updatedAt || "").localeCompare(a.updatedAt || "");
      });
  }, [tasks, filters, sort]);

  const availableTags = useMemo(() => {
    const map = new Map<string, { id: string; name: string; color: string }>();
    tasks.forEach((t) => t.tags.forEach((tag) => map.set(tag.id, tag)));
    return Array.from(map.values()).sort((a, b) => a.name.localeCompare(b.name));
  }, [tasks]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-[#111827] md:flex-row md:items-center md:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Tasks</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">Manage and track your project tasks.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <input
              value={filters.q}
              onChange={(e) => updateParams({ q: e.target.value })}
              placeholder="Search tasks..."
              className="w-48 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-slate-700 dark:bg-[#0f172a] dark:text-slate-100"
            />
          </div>
          <TaskFiltersPopover 
            filters={filters} 
            onChange={(patch) => updateParams(patch as Record<string, string>)} 
            availableTags={availableTags}
          />
          <SortControls value={sort} onChange={(v) => updateParams({ sort: v })} />
          <button onClick={onAddTask} className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-primary/90">
            New task
          </button>
        </div>
      </div>

      <TaskTable tasks={filtered} onRowClick={onOpenTask} currentUserId={currentUserId} onReload={onReload} workspaceSlug={params.workspaceSlug as string} workspaceMembers={workspaceMembers} />
    </div>
  );
}

function priorityRank(p: string) {
  if (p === "URGENT") return 4;
  if (p === "HIGH") return 3;
  if (p === "MEDIUM") return 2;
  return 1;
}

