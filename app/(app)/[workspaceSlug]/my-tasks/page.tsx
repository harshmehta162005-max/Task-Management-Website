"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { MyTasksHeader } from "@/components/tasks/MyTasksHeader";
import { TaskGroupedList } from "@/components/tasks/TaskGroupedList";
import { MyTasksSkeleton } from "@/components/tasks/MyTasksSkeleton";
import { TaskDrawer } from "@/components/tasks/TaskDrawer";
import type { TaskItem } from "@/components/tasks/TaskRow";
import type { DrawerTask, DrawerAssignee, WorkspaceTag } from "@/components/tasks/task-drawer/types";

type Task = TaskItem & {
  dueDate: string | null;
};

export default function MyTasksPage() {
  const { workspaceSlug } = useParams<{ workspaceSlug: string }>();
  const router = useRouter();
  const searchParams = useSearchParams();
  const taskIdParam = searchParams.get("taskId");

  const [loading, setLoading] = useState(true);
  const [focusMode, setFocusMode] = useState(false);
  const [sort, setSort] = useState("due");
  const [tasks, setTasks] = useState<Task[]>([]);
  const [workspaceMembers, setWorkspaceMembers] = useState<DrawerAssignee[]>([]);
  const [workspaceTags, setWorkspaceTags] = useState<WorkspaceTag[]>([]);
  const [canManageTags, setCanManageTags] = useState(false);
  const [workspaceIdStr, setWorkspaceIdStr] = useState("");

  // Fetch tasks assigned to current user
  useEffect(() => {
    async function load() {
      try {
        const [tasksRes, membersRes] = await Promise.all([
          fetch(`/api/tasks?workspaceSlug=${workspaceSlug}&assignee=me`),
          fetch(`/api/workspaces/${workspaceSlug}/members?slug=${workspaceSlug}`),
        ]);

        if (tasksRes.ok) {
          const data = await tasksRes.json();
          setTasks(data);
        }
        if (membersRes.ok) {
          const data = await membersRes.json();
          setWorkspaceMembers(data.members?.map((m: { id: string; name: string }) => ({ id: m.id, name: m.name })) ?? []);
        }
      } catch (err) {
        console.error("Error loading tasks:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [workspaceSlug]);

  // Fetch workspace tags and permissions
  useEffect(() => {
    async function loadTagsAndPerms() {
      try {
        const wsRes = await fetch(`/api/workspaces/${workspaceSlug}`);
        if (!wsRes.ok) return;
        const wsData = await wsRes.json();
        const wsId = wsData.id;
        setWorkspaceIdStr(wsId);

        const [tagsRes, permsRes] = await Promise.all([
          fetch(`/api/workspaces/${wsId}/tags?workspaceSlug=${workspaceSlug}`),
          fetch(`/api/workspaces/${workspaceSlug}/permissions`),
        ]);
        if (tagsRes.ok) {
          const tags = await tagsRes.json();
          setWorkspaceTags(tags.map((t: any) => ({ id: t.id, name: t.name, color: t.color })));
        }
        if (permsRes.ok) {
          const perms = await permsRes.json();
          setCanManageTags(perms.permissions?.includes("settings.tags") ?? false);
        }
      } catch {
        // silent
      }
    }
    loadTagsAndPerms();
  }, [workspaceSlug]);

  const filteredTasks = useMemo(() => {
    let next = [...tasks];
    if (focusMode) {
      next = next.filter((t) => !t.isCompleted);
    }
    switch (sort) {
      case "priority":
        next.sort((a, b) => priorityRank(b.priority) - priorityRank(a.priority));
        break;
      case "updated":
        break;
      default:
        next.sort((a, b) => dueSort(a.dueDate, b.dueDate));
    }
    return next;
  }, [tasks, focusMode, sort]);

  const groups = useMemo(() => groupTasks(filteredTasks), [filteredTasks]);

  const handleToggleComplete = async (id: string) => {
    const task = tasks.find((t) => t.id === id);
    if (!task) return;
    const newStatus = task.isCompleted ? "TODO" : "DONE";
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, isCompleted: !t.isCompleted, status: newStatus } : t))
    );
    try {
      await fetch(`/api/tasks/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
    } catch (err) {
      console.error("Failed to toggle task:", err);
    }
  };

  const handleStartWork = async (id: string) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, status: "IN_PROGRESS" } : t)));
    try {
      await fetch(`/api/tasks/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "IN_PROGRESS" }),
      });
    } catch (err) {
      console.error("Failed to start work:", err);
    }
  };

  const handleOpen = (id: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("taskId", id);
    router.replace(`?${params.toString()}`, { scroll: false });
  };

  const handleQuickAdd = async (title: string) => {
    try {
      // Find first project in workspace for the task
      const projRes = await fetch(`/api/projects?workspaceSlug=${workspaceSlug}`);
      const projects = await projRes.json();
      const projectId = projects[0]?.id;
      if (!projectId) return;

      const res = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          workspaceSlug,
          projectId,
          title,
          dueDate: new Date().toISOString(),
        }),
      });
      if (res.ok) {
        const newTask = await res.json();
        setTasks((prev) => [newTask, ...prev]);
      }
    } catch (err) {
      console.error("Failed to create task:", err);
    }
  };

  const closeDrawer = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("taskId");
    router.replace(`?${params.toString()}`, { scroll: false });
  };

  const [drawerTask, setDrawerTask] = useState<DrawerTask | undefined>();

  useEffect(() => {
    if (!taskIdParam) {
      setDrawerTask(undefined);
      return;
    }
    async function loadTask() {
      try {
        const res = await fetch(`/api/tasks/${taskIdParam}`);
        if (res.ok) {
          const data = await res.json();
          setDrawerTask(data);
        }
      } catch {
        setDrawerTask(undefined);
      }
    }
    loadTask();
  }, [taskIdParam]);

  if (loading) {
    return (
      <div className="px-4 py-6 md:px-6">
        <MyTasksSkeleton />
      </div>
    );
  }

  return (
    <div className="px-4 py-6 md:px-6">
      <MyTasksHeader focusMode={focusMode} onToggleFocus={setFocusMode} sort={sort} onSortChange={setSort} />
      <TaskGroupedList
        groups={groups}
        onToggleComplete={handleToggleComplete}
        onStartWork={handleStartWork}
        onOpen={handleOpen}
        onQuickAdd={handleQuickAdd}
      />
      {drawerTask && (
        <TaskDrawer
          open
          task={drawerTask}
          onClose={closeDrawer}
          workspaceMembers={workspaceMembers}
          workspaceTags={workspaceTags}
          canManageTags={canManageTags}
          workspaceId={workspaceIdStr}
          workspaceSlug={workspaceSlug}
        />
      )}
    </div>
  );
}

function priorityRank(p: Task["priority"]) {
  return { URGENT: 4, HIGH: 3, MEDIUM: 2, LOW: 1 }[p];
}

function dueSort(a: string | null, b: string | null) {
  if (!a && !b) return 0;
  if (!a) return 1;
  if (!b) return -1;
  return new Date(a).getTime() - new Date(b).getTime();
}

function groupTasks(tasks: Task[]) {
  const groups: Record<string, Task[]> = {
    Overdue: [],
    Today: [],
    "This Week": [],
    Upcoming: [],
    "No Due Date": [],
  };
  const today = new Date();
  const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime();
  const endOfToday = startOfDay + 24 * 60 * 60 * 1000 - 1;
  const endOfWeek = startOfDay + 7 * 24 * 60 * 60 * 1000;

  tasks.forEach((task) => {
    if (!task.dueDate) {
      groups["No Due Date"].push(task);
      return;
    }
    const dueTs = new Date(task.dueDate).getTime();
    if (dueTs < startOfDay) groups.Overdue.push(task);
    else if (dueTs <= endOfToday) groups.Today.push(task);
    else if (dueTs <= endOfWeek) groups["This Week"].push(task);
    else groups.Upcoming.push(task);
  });

  return groups;
}
