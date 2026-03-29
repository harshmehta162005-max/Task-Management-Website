"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { AssignTaskModal } from "@/components/dashboard/AssignTaskModal";
import { useRouter, useSearchParams, useParams } from "next/navigation";
import { useUser } from "@clerk/nextjs";
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
import type { DrawerTask, DrawerAssignee, WorkspaceTag } from "@/components/tasks/task-drawer/types";
import { KanbanTask } from "@/components/tasks/KanbanBoard";
import { Loader2 } from "lucide-react";

type Project = {
  id: string;
  name: string;
  description: string;
  members: string[];
  memberDetails?: { id: string; name: string; avatarUrl?: string; role: string; clerkId?: string }[];
};

type Task = KanbanTask & { updatedAt: string; creatorId: string };

const TAB_KEYS: TabKey[] = ["board", "list", "calendar", "activity", "insights"];

export default function ProjectPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = useParams<{ workspaceSlug: string; projectId: string }>();
  const workspaceSlug = params.workspaceSlug;
  const projectId = params.projectId;
  const { user } = useUser();

  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [showRename, setShowRename] = useState(false);
  const [showInvite, setShowInvite] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [workspaceTags, setWorkspaceTags] = useState<WorkspaceTag[]>([]);
  const [canManageTags, setCanManageTags] = useState(false);
  const [workspaceIdStr, setWorkspaceIdStr] = useState("");

  const workspaceMembers: DrawerAssignee[] = useMemo(() => {
    if (!project?.memberDetails) return [];
    return project.memberDetails
      .map((m) => ({ id: m.id, name: m.name, avatar: m.avatarUrl }))
      .sort((a, b) => (a.name || "").localeCompare(b.name || ""));
  }, [project]);

  const dbUserId = useMemo(() => {
    if (!user || !project?.memberDetails) return undefined;
    return project.memberDetails.find(m => m.clerkId === user.id)?.id;
  }, [user, project]);

  const isManager = useMemo(() => {
    if (!user || !project?.memberDetails) return false;
    const member = project.memberDetails.find(m => m.clerkId === user.id);
    return member ? ["MANAGER", "OWNER"].includes(member.role) : false;
  }, [user, project]);

  // Fetch project + tasks from API
  const loadProject = useCallback(async () => {
    try {
      const res = await fetch(`/api/projects/${projectId}?workspaceSlug=${workspaceSlug}`, {
        cache: "no-store",
      });
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

  // Fetch workspace tags and permissions
  useEffect(() => {
    async function loadTagsAndPerms() {
      try {
        // First get workspace ID
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
        const res = await fetch(`/api/tasks/${taskId}?workspaceSlug=${workspaceSlug}`);
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
          tags: (activeTask!.tags ?? []).map((t: any) => typeof t === 'string' ? { id: '', name: t, color: '#6366f1' } : t),
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
    const originalTasks = tasks;
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, status } : t)));
    try {
      const res = await fetch(`/api/tasks/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, workspaceSlug }),
      });
      if (!res.ok) {
        const { error } = await res.json();
        setTasks(originalTasks);
        alert(error || "You don't have permission to manually update task statuses. Assignees must submit their work instead.");
      }
    } catch (err) {
      console.error("Failed to update task status:", err);
      setTasks(originalTasks);
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

  const [showArchiveConfirm, setShowArchiveConfirm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isProcessingAction, setIsProcessingAction] = useState(false);

  const handleArchive = async () => {
    setIsProcessingAction(true);
    try {
      await fetch(`/api/projects/${projectId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "archived", workspaceSlug }),
      });
      router.push(`/${workspaceSlug}/projects`);
    } catch (err) {
      console.error("Failed to archive project:", err);
    } finally {
      setIsProcessingAction(false);
    }
  };

  const handleDelete = async () => {
    setIsProcessingAction(true);
    try {
      await fetch(`/api/projects/${projectId}?workspaceSlug=${workspaceSlug}`, {
        method: "DELETE",
      });
      router.push(`/${workspaceSlug}/projects`);
    } catch (err) {
      console.error("Failed to delete project:", err);
    } finally {
      setIsProcessingAction(false);
    }
  };

  if (loading) return <ProjectPageSkeleton />;
  if (!project) return <ProjectNotFound workspaceSlug={params.workspaceSlug} />;

  return (
    <main className="min-h-screen min-w-0 flex-1 px-4 py-8 text-slate-900 dark:text-slate-100 sm:px-6 lg:px-10">
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
            isManager ? (
              <ProjectSettingsMenu
                isManager={isManager}
                onRename={() => setShowRename(true)}
                onManageMembers={() => router.push(`/${workspaceSlug}/projects/${projectId}/settings`)}
                onArchive={() => setShowArchiveConfirm(true)}
                onDelete={() => setShowDeleteConfirm(true)}
              />
            ) : undefined
          }
        />
        <ProjectMembersRow members={project.members} total={project.members.length} onInvite={() => setShowInvite(true)} />
      </section>

      <div className="mt-6">
        <ProjectTabs currentTab={currentTab} onChange={handleTabChange} />
      </div>

      <div className="mt-6 flex min-w-0 flex-col gap-4">
        {currentTab === "board" && <ProjectBoardTab tasks={tasks} onMove={updateTaskStatus} onOpenTask={openTask} onAddTask={handleAddTask} />}
        {currentTab === "list" && <ProjectListTab tasks={tasks} onOpenTask={openTask} onAddTask={handleAddTask} onReload={loadProject} currentUserId={dbUserId} workspaceMembers={workspaceMembers} />}
        {currentTab === "calendar" && <ProjectCalendarTab tasks={tasks} onOpenTask={openTask} onAddTask={handleAddTask} isManager={isManager} projectId={projectId} workspaceSlug={workspaceSlug} currentUserId={dbUserId} />}
        {currentTab === "activity" && <ProjectActivityTab projectId={projectId} workspaceSlug={workspaceSlug} />}
        {currentTab === "insights" && <ProjectInsightsTab tasks={tasks} />}
      </div>

      {drawerTask && (
        <TaskDrawer
          open
          task={drawerTask}
          projectTasks={tasks}
          onClose={() => { closeTask(); loadProject(); }}
          workspaceMembers={workspaceMembers}
          isManager={true}
          workspaceSlug={workspaceSlug}
          workspaceTags={workspaceTags}
          canManageTags={canManageTags}
          workspaceId={workspaceIdStr}
          onTaskDeleted={() => { closeTask(); loadProject(); }}
          onTaskDuplicated={() => { loadProject(); }}
          onTaskMoved={() => { closeTask(); loadProject(); }}
        />
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
        defaultProjectId={projectId}
      />

      {showArchiveConfirm && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => !isProcessingAction && setShowArchiveConfirm(false)} />
          <div className="relative z-10 w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-white/10 dark:bg-[#0f172a]">
            <div className="mb-4 text-center">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Archive Project</h3>
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                Are you sure you want to archive this project? You can restore it later from settings.
              </p>
            </div>
            <div className="flex gap-3">
              <button disabled={isProcessingAction} onClick={() => setShowArchiveConfirm(false)} className="flex-1 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 dark:border-white/10 dark:text-slate-300 dark:hover:bg-white/5">Cancel</button>
              <button disabled={isProcessingAction} onClick={handleArchive} className="flex-1 flex justify-center items-center rounded-xl bg-amber-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-amber-600">
                {isProcessingAction ? <Loader2 className="h-4 w-4 animate-spin" /> : "Archive"}
              </button>
            </div>
          </div>
        </div>
      )}

      {showDeleteConfirm && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => !isProcessingAction && setShowDeleteConfirm(false)} />
          <div className="relative z-10 w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-white/10 dark:bg-[#0f172a]">
            <div className="mb-4 text-center">
              <h3 className="text-lg font-bold text-red-600 dark:text-red-400">Delete Project</h3>
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                Are you sure you want to permanently delete <span className="font-semibold text-slate-700 dark:text-slate-200">&ldquo;{project.name}&rdquo;</span>? This action cannot be undone.
              </p>
            </div>
            <div className="flex gap-3">
              <button disabled={isProcessingAction} onClick={() => setShowDeleteConfirm(false)} className="flex-1 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 dark:border-white/10 dark:text-slate-300 dark:hover:bg-white/5">Cancel</button>
              <button disabled={isProcessingAction} onClick={handleDelete} className="flex-1 flex justify-center items-center rounded-xl bg-red-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-red-600">
                {isProcessingAction ? <Loader2 className="h-4 w-4 animate-spin" /> : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
