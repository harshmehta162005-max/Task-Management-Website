"use client";

import { useEffect, useMemo, useState } from "react";
import { X, Loader2 } from "lucide-react";
import {
  DrawerActivity,
  DrawerAttachment,
  DrawerAssignee,
  DrawerComment,
  DrawerDependency,
  DrawerSubtask,
  DrawerTask,
} from "./task-drawer/types";
import { TaskDrawerShell } from "./TaskDrawerShell";
import { TaskTitleInput } from "./TaskTitleInput";
import { TaskActionMenu } from "./TaskActionMenu";
import { TaskMetaRow } from "./TaskMetaRow";
import { AssigneeSelector } from "./AssigneeSelector";
import { TagInput } from "./TagInput";
import { DescriptionEditor } from "./DescriptionEditor";
import { AttachmentSection } from "./AttachmentSection";
import { CommentInput } from "./CommentInput";
import { ActivityLogSection } from "./ActivityLogSection";
import { SubtasksSection } from "./SubtasksSection";
import { DependenciesSection } from "./DependenciesSection";

type Props = {
  open: boolean;
  task: DrawerTask;
  onClose: () => void;
  workspaceMembers?: DrawerAssignee[];
  tagSuggestions?: string[];
  isManager?: boolean;
};

export function TaskDrawer({
  open,
  task,
  onClose,
  workspaceMembers = [],
  tagSuggestions,
  isManager = true,
}: Props) {
  // Use the server-computed isCreator flag. Default to true (editable) if not provided.
  const readOnly = task.isCreator === false;
  const [isSaving, setIsSaving] = useState(false);

  const [title, setTitle] = useState(task.title);
  const [status, setStatus] = useState(task.status);
  const [priority, setPriority] = useState(task.priority);
  const [dueDate, setDueDate] = useState<string | null>(task.dueDate ?? null);
  const [assignees, setAssignees] = useState<DrawerAssignee[]>(task.assignees || []);
  const [tags, setTags] = useState<string[]>(task.tags || []);
  const [description, setDescription] = useState(task.description || "");
  const [attachments, setAttachments] = useState<DrawerAttachment[]>(task.attachments || []);
  const [comments, setComments] = useState<DrawerComment[]>(task.comments || []);
  const [activity, setActivity] = useState<DrawerActivity[]>(task.activity || []);
  const [subtasks, setSubtasks] = useState<DrawerSubtask[]>(task.subtasks || []);
  const [dependencies, setDependencies] = useState<{
    blockedBy: DrawerDependency[];
    blocking: DrawerDependency[];
  }>(task.dependencies ?? { blockedBy: [], blocking: [] });

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

  const shareLink = useMemo(() => {
    if (typeof window === "undefined") return "";
    const url = new URL(window.location.href);
    url.searchParams.set("taskId", task.id);
    return url.toString();
  }, [task.id]);

  const handleCopyLink = () => {
    if (!shareLink) return;
    navigator.clipboard?.writeText(shareLink);
  };

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
        body: JSON.stringify({ body }),
      });
    } catch {
      // silent
    }
  };

  const handleSaveAndClose = async () => {
    if (readOnly) {
      onClose();
      return;
    }
    setIsSaving(true);
    try {
      await fetch(`/api/tasks/${task.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          status,
          priority,
          dueDate,
          tags,
          description,
          assigneeIds: assignees.map(a => a.id),
          subtasks,
          dependencies,
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
              onDuplicate={() => {}}
              onMove={() => {}}
              onDelete={() => {}}
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

          <AssigneeSelector assignees={assignees} workspaceMembers={workspaceMembers} onChange={setAssignees} readOnly={readOnly} />

          <TagInput tags={tags} suggestions={tagSuggestions} onChange={setTags} readOnly={readOnly} />

          <DescriptionEditor description={description} onChange={setDescription} readOnly={readOnly} />

          <AttachmentSection attachments={attachments} onAdd={addAttachment} onDelete={removeAttachment} readOnly={readOnly} />

          {/* Subtask checkboxes: enabled for assigned members. New subtask creation: owner only */}
          <SubtasksSection subtasks={subtasks} onChange={setSubtasks} readOnly={readOnly} canCreate={task.isCreator !== false} />

          <DependenciesSection dependencies={dependencies} onChange={setDependencies} taskId={task.id} workspaceMembers={workspaceMembers} readOnly={readOnly} />

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
      </div>
    </TaskDrawerShell>
  );
}
