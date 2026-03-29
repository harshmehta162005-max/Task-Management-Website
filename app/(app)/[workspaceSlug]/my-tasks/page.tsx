"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { MyTasksHeader } from "@/components/tasks/MyTasksHeader";
import { TaskGroupedList } from "@/components/tasks/TaskGroupedList";
import { MyTasksSkeleton } from "@/components/tasks/MyTasksSkeleton";
import { TaskDrawer } from "@/components/tasks/TaskDrawer";
import type { TaskItem } from "@/components/tasks/TaskRow";
import type { DrawerTask, DrawerAssignee, WorkspaceTag } from "@/components/tasks/task-drawer/types";

type Task = TaskItem & {
  dueDate: string | null;
  updatedAt?: string;
};

type FilterTab = "all" | "dueToday" | "overdue" | "inProgress" | "waiting" | "completed" | "createdByMe";

export default function MyTasksPage() {
  const { workspaceSlug } = useParams<{ workspaceSlug: string }>();
  const router = useRouter();
  const searchParams = useSearchParams();
  const taskIdParam = searchParams.get("taskId");

  const [loading, setLoading] = useState(true);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [workspaceMembers, setWorkspaceMembers] = useState<DrawerAssignee[]>([]);
  const [workspaceTags, setWorkspaceTags] = useState<WorkspaceTag[]>([]);
  const [canManageTags, setCanManageTags] = useState(false);
  const [workspaceIdStr, setWorkspaceIdStr] = useState("");
  const [projects, setProjects] = useState<{ id: string; name: string }[]>([]);

  // Filter state
  const [activeTab, setActiveTab] = useState<FilterTab>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [projectFilter, setProjectFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");

  // Fetch tasks (now with myTasks=true to get assignee + creator tasks)
  const loadTasks = useCallback(async () => {
    try {
      const [tasksRes, membersRes] = await Promise.all([
        fetch(`/api/tasks?workspaceSlug=${workspaceSlug}&myTasks=true`),
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
  }, [workspaceSlug]);

  useEffect(() => { loadTasks(); }, [loadTasks]);

  // Fetch workspace tags, permissions, and projects
  useEffect(() => {
    async function loadTagsAndPerms() {
      try {
        const wsRes = await fetch(`/api/workspaces/${workspaceSlug}`);
        if (!wsRes.ok) return;
        const wsData = await wsRes.json();
        const wsId = wsData.id;
        setWorkspaceIdStr(wsId);

        const [tagsRes, permsRes, projRes] = await Promise.all([
          fetch(`/api/workspaces/${wsId}/tags?workspaceSlug=${workspaceSlug}`),
          fetch(`/api/workspaces/${workspaceSlug}/permissions`),
          fetch(`/api/projects?workspaceSlug=${workspaceSlug}`),
        ]);

        if (tagsRes.ok) {
          const tags = await tagsRes.json();
          setWorkspaceTags(tags.map((t: any) => ({ id: t.id, name: t.name, color: t.color })));
        }
        if (permsRes.ok) {
          const perms = await permsRes.json();
          setCanManageTags(perms.permissions?.includes("settings.tags") ?? false);
        }
        if (projRes.ok) {
          const projData = await projRes.json();
          setProjects(projData.map((p: any) => ({ id: p.id, name: p.name })));
        }
      } catch {
        // silent
      }
    }
    loadTagsAndPerms();
  }, [workspaceSlug]);

  // ── Computed summary stats ──
  const summaryStats = useMemo(() => {
    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    const endOfToday = startOfDay + 24 * 60 * 60 * 1000 - 1;
    const startOfWeek = startOfDay - now.getDay() * 24 * 60 * 60 * 1000;

    let dueToday = 0;
    let overdue = 0;
    let inProgress = 0;
    let waitingForYou = 0;
    let completedThisWeek = 0;

    tasks.forEach((t) => {
      const dueTs = t.dueDate ? new Date(t.dueDate).getTime() : null;
      const updTs = t.updatedAt ? new Date(t.updatedAt).getTime() : 0;

      if (dueTs !== null && dueTs < startOfDay && t.status !== "DONE") overdue++;
      if (dueTs !== null && dueTs >= startOfDay && dueTs <= endOfToday && t.status !== "DONE") dueToday++;
      if (t.status === "IN_PROGRESS") inProgress++;
      if (t.status === "DONE" && updTs >= startOfWeek) completedThisWeek++;

      // Waiting for You logic
      const isOwner = t.creatorId === t.currentUserId;
      const me = t.assignees?.find((a) => a.id === t.currentUserId);
      if (!isOwner && me && me.workStatus !== "SUBMITTED" && t.status !== "DONE") {
        waitingForYou++;
      }
      if (isOwner && t.assignees?.some((a) => a.workStatus === "SUBMITTED") && t.status === "IN_REVIEW") {
        waitingForYou++;
      }
    });

    return { dueToday, overdue, inProgress, waitingForYou, completedThisWeek };
  }, [tasks]);

  // ── Filtered + grouped tasks ──
  const filteredAndGrouped = useMemo(() => {
    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    const endOfToday = startOfDay + 24 * 60 * 60 * 1000 - 1;
    const endOfWeek = startOfDay + 7 * 24 * 60 * 60 * 1000;
    const startOfWeek = startOfDay - now.getDay() * 24 * 60 * 60 * 1000;

    let filtered = [...tasks];

    // Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter((t) => t.title.toLowerCase().includes(q) || t.projectName.toLowerCase().includes(q));
    }

    // Project filter
    if (projectFilter) {
      filtered = filtered.filter((t) => t.projectId === projectFilter);
    }

    // Priority filter
    if (priorityFilter) {
      filtered = filtered.filter((t) => t.priority === priorityFilter);
    }

    // Tab filter
    if (activeTab !== "all") {
      filtered = filtered.filter((t) => {
        const dueTs = t.dueDate ? new Date(t.dueDate).getTime() : null;
        const updTs = t.updatedAt ? new Date(t.updatedAt).getTime() : 0;
        const isOwner = t.creatorId === t.currentUserId;
        const me = t.assignees?.find((a) => a.id === t.currentUserId);
        const hasSubmitted = t.assignees?.some((a) => a.workStatus === "SUBMITTED");

        switch (activeTab) {
          case "dueToday":
            return dueTs !== null && dueTs >= startOfDay && dueTs <= endOfToday && t.status !== "DONE";
          case "overdue":
            return dueTs !== null && dueTs < startOfDay && t.status !== "DONE";
          case "inProgress":
            return t.status === "IN_PROGRESS";
          case "waiting":
            return (
              (!isOwner && !!me && me.workStatus !== "SUBMITTED" && t.status !== "DONE") ||
              (isOwner && !!hasSubmitted && t.status === "IN_REVIEW")
            );
          case "completed":
            return t.status === "DONE" && updTs >= startOfWeek;
          case "createdByMe":
            return t.creatorId === t.currentUserId;
          default:
            return true;
        }
      });
    }

    // Sort by due date
    filtered.sort((a, b) => dueSort(a.dueDate, b.dueDate));

    // Group tasks
    const groups: Record<string, Task[]> = {
      Overdue: [],
      "Due Today": [],
      Upcoming: [],
      "Waiting for You": [],
      "Completed This Week": [],
      "No Due Date": [],
    };

    filtered.forEach((task) => {
      const dueTs = task.dueDate ? new Date(task.dueDate).getTime() : null;
      const updTs = task.updatedAt ? new Date(task.updatedAt).getTime() : 0;
      const isOwner = task.creatorId === task.currentUserId;
      const me = task.assignees?.find((a) => a.id === task.currentUserId);
      const hasSubmitted = task.assignees?.some((a) => a.workStatus === "SUBMITTED");

      // Completed this week → separate bucket
      if (task.status === "DONE" && updTs >= startOfWeek) {
        groups["Completed This Week"].push(task);
        return;
      }

      // Waiting for You → separate bucket
      const isWaiting =
        (!isOwner && !!me && me.workStatus !== "SUBMITTED" && task.status !== "DONE") ||
        (isOwner && !!hasSubmitted && task.status === "IN_REVIEW");
      if (isWaiting && activeTab === "all") {
        groups["Waiting for You"].push(task);
        return;
      }

      // Time-based grouping
      if (!task.dueDate) {
        groups["No Due Date"].push(task);
      } else if (dueTs! < startOfDay) {
        groups.Overdue.push(task);
      } else if (dueTs! <= endOfToday) {
        groups["Due Today"].push(task);
      } else {
        groups.Upcoming.push(task);
      }
    });

    return groups;
  }, [tasks, activeTab, searchQuery, projectFilter, priorityFilter]);

  // ── Handlers ──
  const handleToggleComplete = async (id: string) => {
    const task = tasks.find((t) => t.id === id);
    if (!task) return;
    const newStatus = task.isCompleted ? "TODO" : "DONE";
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, isCompleted: !t.isCompleted, status: newStatus } : t))
    );
    try {
      const res = await fetch(`/api/tasks/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus, workspaceSlug }),
      });
      if (!res.ok) {
        const errorText = await res.text();
        console.error("Toggle Complete failed:", res.status, errorText);
        alert(`Failed to save! API Error: ${res.status} ${errorText}`);
        // Revert optimistic update
        setTasks((prev) =>
          prev.map((t) => (t.id === id ? { ...t, isCompleted: !t.isCompleted, status: task.status } : t))
        );
      }
    } catch (err) {
      console.error("Failed to toggle task:", err);
      alert("Network error toggling task");
    }
  };

  const handleStartWork = async (id: string) => {
    const task = tasks.find((t) => t.id === id);
    if (!task) return;

    setTasks((prev) => prev.map((t) => {
      if (t.id === id) {
        return {
          ...t,
          status: "IN_PROGRESS",
          assignees: t.assignees.map(a => a.id === t.currentUserId ? { ...a, workStatus: "IN_PROGRESS" } : a)
        };
      }
      return t;
    }));

    try {
      console.log("Sending PATCH for start work", { workspaceSlug, userId: task.currentUserId });
      const res = await fetch(`/api/tasks/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          workspaceSlug,
          updateAssigneeWorkStatus: true,
          workStatus: "IN_PROGRESS",
          userId: task.currentUserId,
          status: "IN_PROGRESS"
        }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.newTaskStatus) {
          setTasks(prev => prev.map(t => t.id === id ? { ...t, status: data.newTaskStatus } : t));
        }
      } else {
        const errorText = await res.text();
        console.error("Start work failed:", res.status, errorText);
        alert(`Failed to start work! API Error: ${res.status} ${errorText}`);
        // Refresh to revert optimistic update
        loadTasks();
      }
    } catch (err) {
      console.error("Failed to start work:", err);
      alert("Network error starting work");
    }
  };

  const handleOpen = (id: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("taskId", id);
    router.replace(`?${params.toString()}`, { scroll: false });
  };

  const handleSubmitReview = async (id: string) => {
    const task = tasks.find((t) => t.id === id);
    if (!task) return;

    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === id) {
          return {
            ...t,
            assignees: t.assignees.map((a) =>
              a.id === t.currentUserId ? { ...a, workStatus: "SUBMITTED" } : a
            ),
          };
        }
        return t;
      })
    );
    try {
      const res = await fetch(`/api/tasks/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          workspaceSlug,
          updateAssigneeWorkStatus: true,
          workStatus: "SUBMITTED",
          userId: task.currentUserId,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.newTaskStatus) {
          setTasks(prev => prev.map(t => t.id === id ? { ...t, status: data.newTaskStatus } : t));
        }
      } else {
        const errorText = await res.text();
        console.error("Submit review failed:", res.status, errorText);
        alert(`Failed to submit! API Error: ${res.status} ${errorText}`);
        loadTasks();
      }
    } catch (err) {
      console.error("Failed to submit review:", err);
      alert("Network error submitting review");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this task?")) return;
    setTasks(prev => prev.filter(t => t.id !== id));
    try {
      await fetch(`/api/tasks/${id}?workspaceSlug=${workspaceSlug}`, { method: 'DELETE' });
    } catch (error) {
      console.error('Failed to delete task', error);
    }
  };

  const handleQuickAdd = async (title: string) => {
    try {
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
        const res = await fetch(`/api/tasks/${taskIdParam}?workspaceSlug=${workspaceSlug}`);
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
      <MyTasksHeader
        stats={summaryStats}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        projectFilter={projectFilter}
        onProjectFilterChange={setProjectFilter}
        priorityFilter={priorityFilter}
        onPriorityFilterChange={setPriorityFilter}
        projects={projects}
      />
      <TaskGroupedList
        groups={filteredAndGrouped}
        onToggleComplete={handleToggleComplete}
        onStartWork={handleStartWork}
        onOpen={handleOpen}
        onQuickAdd={handleQuickAdd}
        onSubmitReview={handleSubmitReview}
        onDelete={handleDelete}
        onDuplicate={() => { alert("Duplicate functionality handled in detailed view") }}
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

function dueSort(a: string | null, b: string | null) {
  if (!a && !b) return 0;
  if (!a) return 1;
  if (!b) return -1;
  return new Date(a).getTime() - new Date(b).getTime();
}
