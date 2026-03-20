"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { AssignTaskModal } from "@/components/dashboard/AssignTaskModal";
import { useRouter, useSearchParams, useParams } from "next/navigation";
import {
  ProjectHeader,
  ProjectMembersRow,
  ProjectTabs,
  ProjectSettingsMenu,
  TabKey,
  ProjectBoardTab,
  ProjectListTab,
  ProjectCalendarTab,
  ProjectActivityTab,
  ProjectInsightsTab,
} from "@/components/projects/project-page";
import { InviteToProjectModal } from "@/components/projects/project-page/InviteToProjectModal";
import { RenameProjectModal } from "@/components/projects/project-page/RenameProjectModal";
import { ProjectPageSkeleton } from "@/components/projects/project-page/ProjectPageSkeleton";
import { ProjectNotFound } from "@/components/projects/project-page/ProjectNotFound";
import { TaskDrawer } from "@/components/tasks/TaskDrawer";
import type { DrawerTask, DrawerAssignee } from "@/components/tasks/task-drawer/types";
import { KanbanTask } from "@/components/tasks/KanbanBoard";

type Project = {
  id: string;
  name: string;
  description: string;
  members: string[];
  memberDetails?: { id: string; name: string; avatarUrl?: string; role: string }[];
};

type Task = KanbanTask & { updatedAt: string };

const TAB_KEYS: TabKey[] = ["board", "list", "calendar", "activity", "insights"];

export default function ProjectPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = useParams<{ workspaceSlug: string; projectId: string }>();
  const workspaceSlug = params.workspaceSlug;
  const projectId = params.projectId;

  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [showRename, setShowRename] = useState(false);
  const [showInvite, setShowInvite] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [showTaskModal, setShowTaskModal] = useState(false);

  const workspaceMembers: DrawerAssignee[] = useMemo(() => {
    if (!project?.memberDetails) return [];
    return project.memberDetails.map((m) => ({ id: m.id, name: m.name }));
  }, [project]);

  // Fetch project + tasks from API
  const loadProject = useCallback(async () => {
    try {
      const res = await fetch(`/api/projects/${projectId}?workspaceSlug=${workspaceSlug}`);
      if (!res.ok) {
        setProject(null);
        return;
      }
      const data = await res.json();
      setProject({
        id: data.id,
        name: data.name,
        description: data.description,
        members: data.members,
        memberDetails: data.memberDetails,
      });
      setTasks(data.tasks ?? []);
    } catch {
      setProject(null);
    } finally {
      setLoading(false);
    }
  }, [projectId, workspaceSlug]);

  useEffect(() => {
    loadProject();
  }, [loadProject]);

  const currentTab: TabKey = useMemo(() => {
    const tab = searchParams.get("tab");
    return TAB_KEYS.includes(tab as TabKey) ? (tab as TabKey) : "board";
  }, [searchParams]);

  const handleTabChange = (tab: TabKey) => {
    const sp = new URLSearchParams(searchParams.toString());
    sp.set("tab", tab);
    router.replace(`?${sp.toString()}`);
  };

  const handleAddTask = () => {
    setShowTaskModal(true);
  };

  const handleSummarize = () => {
    router.push(`/${workspaceSlug}/ai?prompt=${encodeURIComponent(`Summarize project ${project?.name}`)}`);
  };

  const taskId = searchParams.get("taskId");
  const activeTask = tasks.find((t) => t.id === taskId);

  const [drawerTask, setDrawerTask] = useState<DrawerTask | undefined>();

  // Fetch full task details when opening drawer
  useEffect(() => {
    if (!taskId || !activeTask) {
      setDrawerTask(undefined);
      return;
    }
    async function loadTask() {
      try {
        const res = await fetch(`/api/tasks/${taskId}`);
        if (!res.ok) throw new Error();
        const data = await res.json();
        setDrawerTask(data);
      } catch {
        // Fallback to basic data
        setDrawerTask({
          id: activeTask!.id,
          title: activeTask!.title,
          status: activeTask!.status,
          priority: activeTask!.priority,
          dueDate: activeTask!.dueDate ?? null,
          assignees: activeTask!.assignees.map((a) => ({ id: a.id, name: a.name, avatar: a.avatarUrl })),
          tags: activeTask!.tags ?? [],
          description: "",
          attachments: [],
          comments: [],
          activity: [],
          subtasks: [],
          dependencies: { blockedBy: [], blocking: [] },
        });
      }
    }
    loadTask();
  }, [taskId, activeTask]);

  const openTask = (id: string) => {
    const sp = new URLSearchParams(searchParams.toString());
    sp.set("tab", currentTab);
    sp.set("taskId", id);
    router.replace(`?${sp.toString()}`, { scroll: false });
  };

  const closeTask = () => {
    const sp = new URLSearchParams(searchParams.toString());
    sp.delete("taskId");
    router.replace(`?${sp.toString()}`, { scroll: false });
  };

  const updateTaskStatus = async (id: string, status: Task["status"]) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, status } : t)));
    try {
      await fetch(`/api/tasks/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
    } catch (err) {
      console.error("Failed to update task status:", err);
    }
  };

  const handleRename = async (name: string) => {
    try {
      await fetch(`/api/projects/${projectId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, workspaceSlug }),
      });
      setProject((p) => (p ? { ...p, name } : p));
    } catch (err) {
      console.error("Failed to rename project:", err);
    }
    setShowRename(false);
  };

  if (loading) return <ProjectPageSkeleton />;
  if (!project) return <ProjectNotFound workspaceSlug={params.workspaceSlug} />;

  return (
    <main className="min-h-screen px-4 py-8 text-slate-900 dark:text-slate-100 sm:px-6 lg:px-10">
      <nav className="mb-6 flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
        <Link href={`/${workspaceSlug}/projects`} className="font-medium hover:text-primary">
          Projects
        </Link>
        <span className="text-slate-400">/</span>
        <span className="text-slate-600 dark:text-slate-300 line-clamp-1">{project.name}</span>
      </nav>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-[#111827]">
        <ProjectHeader
          name={project.name}
          description={project.description}
          onAddTask={handleAddTask}
          onSummarize={handleSummarize}
          settingsMenu={
            <ProjectSettingsMenu
              isManager={true}
              onRename={() => setShowRename(true)}
              onManageMembers={() => router.push(`/${workspaceSlug}/projects/${projectId}/settings`)}
              onArchive={() => {}}
              onDelete={() => {}}
            />
          }
        />
        <ProjectMembersRow members={project.members} total={project.members.length} onInvite={() => setShowInvite(true)} />
      </section>

      <div className="mt-6">
        <ProjectTabs currentTab={currentTab} onChange={handleTabChange} />
      </div>

      <div className="mt-6 grid gap-4">
        {currentTab === "board" && <ProjectBoardTab tasks={tasks} onMove={updateTaskStatus} onOpenTask={openTask} />}
        {currentTab === "list" && <ProjectListTab tasks={tasks} onOpenTask={openTask} />}
        {currentTab === "calendar" && <ProjectCalendarTab tasks={tasks} onOpenTask={openTask} />}
        {currentTab === "activity" && <ProjectActivityTab projectId={projectId} workspaceSlug={workspaceSlug} />}
        {currentTab === "insights" && <ProjectInsightsTab tasks={tasks} />}
      </div>

      {drawerTask && (
        <TaskDrawer open task={drawerTask} onClose={closeTask} workspaceMembers={workspaceMembers} isManager={true} />
      )}

      <RenameProjectModal
        open={showRename}
        onClose={() => setShowRename(false)}
        currentName={project.name}
        onSave={handleRename}
      />
      <InviteToProjectModal open={showInvite} onClose={() => setShowInvite(false)} />

      <AssignTaskModal
        workspaceSlug={workspaceSlug}
        open={showTaskModal}
        onClose={() => setShowTaskModal(false)}
        onCreated={loadProject}
      />
    </main>
  );
}
