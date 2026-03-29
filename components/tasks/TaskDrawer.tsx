"use client";

import { useEffect, useMemo, useState } from "react";
import { X, Loader2, CheckCircle2 } from "lucide-react";
import {
  DrawerActivity,
  DrawerAttachment,
  DrawerAssignee,
  DrawerComment,
  DrawerDependency,
  DrawerSubtask,
  DrawerTask,
  WorkspaceTag,
} from "./task-drawer/types";
import { TaskDrawerShell } from "./TaskDrawerShell";
import { TaskTitleInput } from "./TaskTitleInput";
import { TaskActionMenu } from "./TaskActionMenu";
import { TaskMetaRow } from "./TaskMetaRow";
import { AssigneeSelector } from "./AssigneeSelector";
import { TagPicker } from "./TagPicker";
import { DescriptionEditor } from "./DescriptionEditor";
import { AttachmentSection } from "./AttachmentSection";
import { CommentInput } from "./CommentInput";
import { ActivityLogSection } from "./ActivityLogSection";
import { SubtasksSection } from "./SubtasksSection";
import { DependenciesSection } from "./DependenciesSection";
import { AssigneeWorkActions } from "./AssigneeWorkActions";
import { TaskProgress } from "./TaskProgress";
import { MoveToProjectModal } from "./MoveToProjectModal";
import { ConfirmDeleteModal } from "./ConfirmDeleteModal";

type Props = {
  open: boolean;
  task: DrawerTask;
  projectTasks?: any[];
  onClose: () => void;
  workspaceMembers?: DrawerAssignee[];
  workspaceTags?: WorkspaceTag[];
  canManageTags?: boolean;
  workspaceId?: string;
  isManager?: boolean;
  workspaceSlug?: string;
  onTaskDeleted?: () => void;
  onTaskDuplicated?: () => void;
  onTaskMoved?: () => void;
  onTagsChanged?: () => void;
  currentUserId?: string;
};

export function TaskDrawer({
  open,
  task,
  projectTasks = [],
  onClose,
  workspaceMembers = [],
  workspaceTags = [],
  canManageTags = false,
  workspaceId = "",
  isManager = true,
  workspaceSlug = "",
  onTaskDeleted,
  onTaskDuplicated,
  onTaskMoved,
  onTagsChanged,
}: Props) {
  // Use the server-computed isCreator flag. Default to true (editable) if not provided.
  const readOnly = task.isCreator === false;
  const [isSaving, setIsSaving] = useState(false);

  const [title, setTitle] = useState(task.title);
  const [status, setStatus] = useState(task.status);
  const [priority, setPriority] = useState(task.priority);
  const [dueDate, setDueDate] = useState<string | null>(task.dueDate ?? null);
  const [assignees, setAssignees] = useState<DrawerAssignee[]>(task.assignees || []);
  const [tags, setTags] = useState<WorkspaceTag[]>(task.tags || []);
  const [description, setDescription] = useState(task.description || "");
  const [attachments, setAttachments] = useState<DrawerAttachment[]>(task.attachments || []);
  const [comments, setComments] = useState<DrawerComment[]>(task.comments || []);
  const [activity, setActivity] = useState<DrawerActivity[]>(task.activity || []);
  const [subtasks, setSubtasks] = useState<DrawerSubtask[]>(task.subtasks || []);
  const [dependencies, setDependencies] = useState<{
    blockedBy: DrawerDependency[];
    blocking: DrawerDependency[];
  }>(task.dependencies ?? { blockedBy: [], blocking: [] });

  // Local copy of workspace tags (can grow if user creates a tag from picker)
  const [localWorkspaceTags, setLocalWorkspaceTags] = useState<WorkspaceTag[]>(workspaceTags);

  useEffect(() => {
    setLocalWorkspaceTags(workspaceTags);
  }, [workspaceTags]);

  // Modal states
  const [showMoveModal, setShowMoveModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Toast state
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 2500);
    return () => clearTimeout(t);
  }, [toast]);

  useEffect(() => {
    setTitle(task.title);
    setStatus(task.status);
    setPriority(task.priority);
    setDueDate(task.dueDate ?? null);
    setAssignees(task.assignees || []);
    setTags(task.tags || []);
    setDescription(task.description || "");
    setAttachments(task.attachments || []);
    setComments(task.comments || []);
    setActivity(task.activity || []);
    setSubtasks(task.subtasks || []);
    setDependencies(task.dependencies ?? { blockedBy: [], blocking: [] });
  }, [task]);

  const myAssignee = useMemo(() => {
    return assignees.find(a => a.id === task.currentUserId);
  }, [assignees, task.currentUserId]);

  const handleRejectAssignee = async (assigneeId: string) => {
    try {
      const res = await fetch(`/api/tasks/${task.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          updateAssigneeWorkStatus: true,
          userId: assigneeId,
          workStatus: "IN_PROGRESS", 
          workspaceSlug 
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setAssignees(prev => prev.map(a => a.id === assigneeId ? { ...a, workStatus: "IN_PROGRESS" } : a));
        if (data.newTaskStatus) setStatus(data.newTaskStatus);
        setToast("Rejected submission");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const shareLink = useMemo(() => {
    if (typeof window === "undefined") return "";
    const url = new URL(window.location.href);
    url.searchParams.set("taskId", task.id);
    return url.toString();
  }, [task.id]);

  // ─── Action handlers ──────────────────────────────────────────────────────

  const handleCopyLink = () => {
    if (!shareLink) return;
    navigator.clipboard?.writeText(shareLink);
    setToast("Link copied to clipboard!");
  };

  const handleDuplicate = async () => {
    try {
      const res = await fetch(`/api/tasks/${task.id}/duplicate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ workspaceSlug }),
      });
      if (res.ok) {
        setToast("Task duplicated!");
        onTaskDuplicated?.();
      }
    } catch {
      // silent
    }
  };

  const handleMove = () => setShowMoveModal(true);

  const handleMoved = (projectName: string) => {
    setShowMoveModal(false);
    setToast(`Moved to ${projectName}`);
    onTaskMoved?.();
    onClose();
  };

  const handleDelete = () => setShowDeleteModal(true);

  const handleDeleted = () => {
    setShowDeleteModal(false);
    onTaskDeleted?.();
    onClose();
  };

  // ─── Tag handlers ─────────────────────────────────────────────────────

  const handleTagCreated = (tag: WorkspaceTag) => {
    setLocalWorkspaceTags((prev) => [...prev, tag]);
    onTagsChanged?.();
  };

  // ─── Existing handlers ─────────────────────────────────────────────────────

  const addAttachment = (file: DrawerAttachment) => {
    setAttachments((prev) => {
      const others = prev.filter((a) => a.id !== file.id);
      return [...others, file];
    });
  };

  const removeAttachment = (id: string) => setAttachments((prev) => prev.filter((a) => a.id !== id));

  const addComment = async (body: string) => {
    const people = workspaceMembers.length > 0
      ? workspaceMembers.map((m) => ({ id: m.id, name: m.name }))
      : [];
    const currentUser = people[0] ?? { id: "me", name: "You" };
    const comment: DrawerComment = {
      id: crypto.randomUUID(),
      author: currentUser,
      body,
      createdAt: "Just now",
      mine: true,
    };
    setComments((prev) => [comment, ...prev]);
    try {
      await fetch(`/api/tasks/${task.id}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ body, workspaceSlug }),
      });
    } catch {
      // silent
    }
  };

  const handleSaveAndClose = async (overrideStatus?: string | any) => {
    if (readOnly) {
      onClose();
      return;
    }
    setIsSaving(true);
    
    const finalStatus = typeof overrideStatus === "string" ? overrideStatus : status;
    
    try {
      await fetch(`/api/tasks/${task.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          status: finalStatus,
          priority,
          dueDate,
          tagIds: tags.map((t) => t.id),
          description,
          assigneeIds: assignees.map(a => a.id),
          subtasks,
          dependencies,
          attachments,
          workspaceSlug,
        }),
      });
    } catch (err) {
      console.error("Failed to save task", err);
    } finally {
      setIsSaving(false);
      onClose();
    }
  };

  return (
    <TaskDrawerShell open={open} onClose={handleSaveAndClose}>
      <div className="flex h-full flex-col bg-white text-slate-900 dark:bg-[#0f172a] dark:text-slate-100">
        <header className="flex items-start justify-between gap-3 border-b border-slate-100 px-5 py-4 dark:border-white/5">
          <div className="flex-1 space-y-1">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Task · {task.id.slice(0, 8)}
            </p>
            <TaskTitleInput title={title} onChange={setTitle} readOnly={readOnly} />
          </div>
          <div className="flex items-center gap-1">
            <TaskActionMenu
              onCopy={handleCopyLink}
              onDuplicate={handleDuplicate}
              onMove={handleMove}
              onDelete={handleDelete}
              isManager={isManager && !readOnly}
            />
            <button
              onClick={handleSaveAndClose}
              aria-label="Close task drawer"
              className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-white/5"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto space-y-6 px-5 py-5">
          <TaskMetaRow
            status={status}
            priority={priority}
            dueDate={dueDate}
            onStatusChange={setStatus}
            onPriorityChange={setPriority}
            onDueChange={setDueDate}
            readOnly={readOnly}
          />

          {(assignees.length > 0 || status === "IN_REVIEW") && (
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 justify-between bg-slate-50 dark:bg-slate-800/30 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
              <TaskProgress assignees={assignees} />
              
              {myAssignee && (
                <AssigneeWorkActions
                  taskId={task.id}
                  userId={task.currentUserId!}
                  workStatus={myAssignee.workStatus as any ?? "TODO"}
                  workspaceSlug={workspaceSlug}
                  onStatusUpdated={(newSt) => {
                    setAssignees(prev => prev.map(a => a.id === task.currentUserId ? { ...a, workStatus: newSt } : a))
                  }}
                  onTaskStatusDerived={(newSt) => setStatus(newSt as any)}
                />
              )}
            </div>
          )}

          {status === "IN_REVIEW" && !readOnly && (
            <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4">
              <h4 className="text-sm font-semibold text-emerald-900 dark:text-emerald-400">Owner Review Required</h4>
              <p className="text-sm text-emerald-700/80 dark:text-emerald-400/80 mb-4 mt-1">
                All assignees have submitted their work for this task. Please review their submissions.
              </p>
              <div className="flex flex-wrap items-center gap-2">
                <button 
                  onClick={() => handleSaveAndClose("DONE")} 
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl text-sm font-medium transition"
                >
                  Approve & Complete
                </button>
                {assignees.map(a => (
                  <button 
                    key={a.id} 
                    onClick={() => handleRejectAssignee(a.id)} 
                    className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 px-3 py-2 rounded-xl text-xs font-medium transition hover:bg-slate-50 dark:hover:bg-slate-800"
                  >
                    Reject {a.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          <AssigneeSelector
            assignees={assignees}
            workspaceMembers={workspaceMembers}
            onChange={setAssignees}
            readOnly={readOnly}
            excludeUserIds={task.creatorId ? [task.creatorId] : []}
          />

          <TagPicker
            selectedTags={tags}
            workspaceTags={localWorkspaceTags}
            onChange={setTags}
            canManageTags={canManageTags}
            onTagCreated={handleTagCreated}
            readOnly={readOnly}
            workspaceId={workspaceId}
            workspaceSlug={workspaceSlug}
          />

          <DescriptionEditor description={description} onChange={setDescription} readOnly={readOnly} />

          <AttachmentSection attachments={attachments} onAdd={addAttachment} onDelete={removeAttachment} readOnly={readOnly} />

          {/* Subtask checkboxes: enabled for assigned members. New subtask creation: owner only */}
          <SubtasksSection subtasks={subtasks} onChange={setSubtasks} readOnly={readOnly} canCreate={task.isCreator !== false} />

          <DependenciesSection
            dependencies={dependencies}
            onChange={setDependencies}
            taskId={task.id}
            workspaceMembers={workspaceMembers}
            readOnly={readOnly}
            excludeUserIds={[...assignees.map(a => a.id), ...(task.creatorId ? [task.creatorId] : [])]}
          />

          {/* Activity toggle — contains activity items AND posted comments */}
          <ActivityLogSection
            activity={activity}
            comments={comments}
            workspaceMembers={workspaceMembers}
          />

          {/* Comment INPUT — always visible outside the toggle */}
          <div className="space-y-2">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
              Write a Comment
            </p>
            <CommentInput
              people={workspaceMembers.map(m => ({ id: m.id, name: m.name }))}
              onSubmit={addComment}
            />
          </div>
        </div>

        {!readOnly && (
          <div className="sticky bottom-0 z-10 border-t border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-[#111827]">
            <button
              onClick={handleSaveAndClose}
              disabled={isSaving}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 font-semibold text-white shadow-sm transition hover:bg-primary/90 disabled:opacity-50"
            >
              {isSaving ? <Loader2 className="h-5 w-5 animate-spin" /> : "Save Changes"}
            </button>
          </div>
        )}
        <div id="portal-root" className="relative z-[9999]" />
      </div>

      {/* Move to Project Modal */}
      <MoveToProjectModal
        open={showMoveModal}
        onClose={() => setShowMoveModal(false)}
        taskId={task.id}
        currentProjectId={task.projectId}
        workspaceSlug={workspaceSlug}
        onMoved={handleMoved}
      />

      {/* Confirm Delete Modal */}
      <ConfirmDeleteModal
        open={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        taskId={task.id}
        taskTitle={title}
        workspaceSlug={workspaceSlug}
        onDeleted={handleDeleted}
      />

      {/* Inline Toast */}
      {toast && (
        <div className="pointer-events-none fixed bottom-6 right-4 z-[70] flex flex-col gap-2">
          <div className="pointer-events-auto flex items-center gap-3 rounded-xl border border-emerald-500/30 bg-emerald-500/15 px-4 py-3 text-sm font-semibold text-emerald-100 shadow-lg shadow-emerald-900/20 backdrop-blur-sm">
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            <span>{toast}</span>
            <button
              type="button"
              onClick={() => setToast(null)}
              className="ml-auto inline-flex h-7 w-7 items-center justify-center rounded-lg hover:bg-white/10"
              aria-label="Close toast"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </TaskDrawerShell>
  );
}
