"use client";

import { useEffect, useState, useRef } from "react";
import { Loader2, Plus, X, Trash2, Bold, Italic, List, Link2, Code } from "lucide-react";
import { Select } from "@/components/ui/Select";
import { AttachmentSection } from "@/components/tasks/AttachmentSection";
import { DrawerAttachment, DrawerAssignee, WorkspaceTag } from "@/components/tasks/task-drawer/types";
import { AssigneeSelector } from "@/components/tasks/AssigneeSelector";
import { TagPicker } from "@/components/tasks/TagPicker";
import { DatePicker } from "@/components/ui/DatePicker";
import { useUser } from "@clerk/nextjs";

type Project = { id: string; name: string; memberDetails: { id: string; name: string; avatarUrl: string }[] };

type Props = {
  workspaceSlug: string;
  open: boolean;
  onClose: () => void;
  onCreated?: () => void;
  defaultProjectId?: string;
};

export function AssignTaskModal({ workspaceSlug, open, onClose, onCreated, defaultProjectId }: Props) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const { user } = useUser();

  // Form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [projectId, setProjectId] = useState("");
  const [dueDate, setDueDate] = useState<Date | undefined>();
  const [status, setStatus] = useState<"TODO" | "IN_PROGRESS">("TODO");
  const [priority, setPriority] = useState<"LOW" | "MEDIUM" | "HIGH" | "URGENT">("MEDIUM");
  const [selectedAssignees, setSelectedAssignees] = useState<DrawerAssignee[]>([]);
  const [selectedTags, setSelectedTags] = useState<WorkspaceTag[]>([]);
  const [subtasks, setSubtasks] = useState<{ text: string; done: boolean }[]>([]);
  const [newSubtask, setNewSubtask] = useState("");
  const [attachments, setAttachments] = useState<DrawerAttachment[]>([]);

  // Data from API
  const [projects, setProjects] = useState<Project[]>([]);
  const [workspaceTags, setWorkspaceTags] = useState<WorkspaceTag[]>([]);
  const [canManageTags, setCanManageTags] = useState(false);
  const [workspaceId, setWorkspaceId] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch projects, tags, and permissions when modal opens
  useEffect(() => {
    if (!open) return;
    setLoading(true);
    async function load() {
      try {
        // Get workspace ID
        const wsRes = await fetch(`/api/workspaces/${workspaceSlug}`);
        let wsId = "";
        if (wsRes.ok) {
          const wsData = await wsRes.json();
          wsId = wsData.id;
          setWorkspaceId(wsId);
        }

        const fetches: Promise<Response>[] = [
          fetch(`/api/projects?workspaceSlug=${workspaceSlug}`),
        ];
        if (wsId) {
          fetches.push(fetch(`/api/workspaces/${wsId}/tags?workspaceSlug=${workspaceSlug}`));
          fetches.push(fetch(`/api/workspaces/${workspaceSlug}/permissions`));
        }

        const results = await Promise.all(fetches);

        if (results[0].ok) {
          const data = await results[0].json();
          setProjects(data.map((p: any) => ({ id: p.id, name: p.name, memberDetails: p.memberDetails })));
        }
        if (results[1]?.ok) {
          const tags = await results[1].json();
          setWorkspaceTags(tags.map((t: any) => ({ id: t.id, name: t.name, color: t.color })));
        }
        if (results[2]?.ok) {
          const perms = await results[2].json();
          setCanManageTags(perms.permissions?.includes("settings.tags") ?? false);
        }
      } catch {
        // silent
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [open, workspaceSlug]);

  // Reset form when modal opens
  useEffect(() => {
    if (open) {
      setTitle("");
      setDescription("");
      setProjectId(defaultProjectId || "");
      setDueDate(undefined);
      setStatus("TODO");
      setPriority("MEDIUM");
      setSelectedAssignees([]);
      setSelectedTags([]);
      setSubtasks([]);
      setAttachments([]);
      setError(null);
    }
  }, [open]);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose]);

  // Close on backdrop click
  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === overlayRef.current) onClose();
  };

  const handleTagCreated = (tag: WorkspaceTag) => {
    setWorkspaceTags((prev) => [...prev, tag]);
  };

  const addSubtask = () => {
    if (newSubtask.trim()) {
      setSubtasks([...subtasks, { text: newSubtask.trim(), done: false }]);
      setNewSubtask("");
    }
  };

  const removeSubtask = (idx: number) => setSubtasks(subtasks.filter((_, i) => i !== idx));

  const addAttachment = (file: DrawerAttachment) => setAttachments((prev) => [...prev, file]);
  const removeAttachment = (id: string) => setAttachments((prev) => prev.filter((a) => a.id !== id));

  const handleSubmit = async () => {
    if (!title.trim()) {
      setError("Task title is required");
      return;
    }
    if (!projectId) {
      setError("Please select a project");
      return;
    }
    setError(null);
    setSubmitting(true);

    try {
      const res = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          workspaceSlug,
          projectId,
          title: title.trim(),
          description: description.trim() || null,
          status,
          priority,
          dueDate: dueDate ? dueDate.toISOString() : null,
          assigneeIds: selectedAssignees.length > 0 ? selectedAssignees.map(a => a.id) : undefined,
          tagIds: selectedTags.length > 0 ? selectedTags.map(t => t.id) : undefined,
          subtasks: subtasks.length > 0 ? subtasks : undefined,
          attachments: attachments.length > 0 ? attachments : undefined,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Failed to create task");
        setSubmitting(false);
        return;
      }

      onCreated?.();
      onClose();
    } catch {
      setError("Failed to create task. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const priorityConfig = {
    LOW: { label: "Low", active: "bg-slate-500/10 border-slate-500/30 text-slate-400", inactive: "bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-white/10 text-slate-500" },
    MEDIUM: { label: "Medium", active: "bg-amber-500/10 border-amber-500/30 text-amber-500", inactive: "bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-white/10 text-slate-500" },
    HIGH: { label: "High", active: "bg-orange-500/10 border-orange-500/30 text-orange-500", inactive: "bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-white/10 text-slate-500" },
    URGENT: { label: "Urgent", active: "bg-red-500/10 border-red-500/30 text-red-500", inactive: "bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-white/10 text-slate-500" },
  };

  if (!open) return null;

  return (
    <div
      ref={overlayRef}
      onClick={handleOverlayClick}
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/60 px-4 py-10 backdrop-blur-sm"
      style={{ animation: "fadeIn 0.2s ease-out" }}
    >
      <div
        className="relative w-full max-w-[820px] overflow-visible rounded-2xl border border-white/10 bg-white shadow-2xl dark:bg-[#0f1520]"
        style={{ animation: "slideUp 0.25s ease-out" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-8 py-5 dark:border-white/10">
          <div>
            <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Assign Task
            </h2>
            <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">
              Add a new task to your workspace
            </p>
          </div>
          <button
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition hover:bg-red-500/15 hover:text-red-400 dark:bg-white/5"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <>
            {/* Scrollable form body */}
            <div className="max-h-[65vh] space-y-7 overflow-y-auto px-8 py-6" style={{ scrollbarWidth: "thin", scrollbarColor: "#374151 transparent" }}>
              {/* Error */}
              {error && (
                <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-2.5 text-sm text-red-400">
                  {error}
                </div>
              )}

              {/* Task Title */}
              <section>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Task Title
                </label>
                <input
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-5 py-3.5 text-lg font-medium outline-none transition-all placeholder:text-slate-400 focus:border-transparent focus:ring-2 focus:ring-primary dark:border-white/10 dark:bg-slate-900/50 dark:placeholder:text-slate-600"
                  placeholder="e.g. Redesign landing page hero section"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  autoFocus
                />
              </section>

              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                {/* Project Selection */}
                <section>
                  <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Project
                  </label>
                  <div className="relative">
                    <Select
                      value={projectId}
                      onChange={setProjectId}
                      options={projects.map((p) => ({ value: p.id, label: p.name }))}
                      placeholder="Select a project"
                      portal={false}
                      disabled={!!defaultProjectId}
                    />
                  </div>
                </section>

                {/* Due Date */}
                <section>
                  <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Due Date
                  </label>
                  <DatePicker
                    date={dueDate}
                    onChange={setDueDate}
                    disabled={{ before: new Date() }}
                  />
                </section>
              </div>

              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                {/* Status */}
                <section>
                  <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Status
                  </label>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setStatus("TODO")}
                      className={`flex flex-1 items-center justify-center gap-2 rounded-lg border py-2.5 text-sm font-medium transition ${status === "TODO"
                          ? "border-primary/30 bg-primary/10 text-primary"
                          : "border-slate-200 bg-slate-100 text-slate-500 dark:border-white/10 dark:bg-slate-800"
                        }`}
                    >
                      To Do
                    </button>
                    <button
                      onClick={() => setStatus("IN_PROGRESS")}
                      className={`flex flex-1 items-center justify-center gap-2 rounded-lg border py-2.5 text-sm font-medium transition ${status === "IN_PROGRESS"
                          ? "border-primary/30 bg-primary/10 text-primary"
                          : "border-slate-200 bg-slate-100 text-slate-500 dark:border-white/10 dark:bg-slate-800"
                        }`}
                    >
                      Active
                    </button>
                  </div>
                </section>

                {/* Priority */}
                <section>
                  <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Priority
                  </label>
                  <div className="flex gap-2">
                    {(["LOW", "MEDIUM", "HIGH", "URGENT"] as const).map((p) => (
                      <button
                        key={p}
                        onClick={() => setPriority(p)}
                        className={`flex-1 rounded-lg border py-2.5 text-sm font-medium transition ${priority === p ? priorityConfig[p].active : priorityConfig[p].inactive
                          }`}
                      >
                        {priorityConfig[p].label}
                      </button>
                    ))}
                  </div>
                </section>
              </div>

              {/* Description */}
              <section>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Description
                </label>
                <div className="overflow-hidden rounded-xl border border-slate-200 dark:border-white/10">
                  <div className="flex gap-1 border-b border-slate-200 bg-slate-50 p-2 dark:border-white/10 dark:bg-slate-800/50">
                    <button className="rounded p-1.5 text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700"><Bold className="h-4 w-4" /></button>
                    <button className="rounded p-1.5 text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700"><Italic className="h-4 w-4" /></button>
                    <button className="rounded p-1.5 text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700"><List className="h-4 w-4" /></button>
                    <button className="rounded p-1.5 text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700"><Link2 className="h-4 w-4" /></button>
                    <button className="ml-auto rounded p-1.5 text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700"><Code className="h-4 w-4" /></button>
                  </div>
                  <textarea
                    className="w-full resize-none border-none bg-transparent p-4 text-sm outline-none placeholder:text-slate-500 focus:ring-0 dark:text-slate-300 dark:placeholder:text-slate-600"
                    placeholder="Write detailed task requirements..."
                    rows={4}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>
              </section>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {/* Assignees */}
                <section>
                  <div className="flex flex-col">
                    <AssigneeSelector
                      assignees={selectedAssignees}
                      workspaceMembers={
                        projectId
                          ? (projects.find((p) => p.id === projectId)?.memberDetails || []).map(m => ({ id: m.id, name: m.name, avatar: m.avatarUrl }))
                          : []
                      }
                      onChange={setSelectedAssignees}
                      excludeUserIds={user?.id ? [user.id] : []}
                    />
                  </div>
                </section>

                {/* Tags — Managed Tag Picker */}
                <section>
                  <TagPicker
                    selectedTags={selectedTags}
                    workspaceTags={workspaceTags}
                    onChange={setSelectedTags}
                    canManageTags={canManageTags}
                    onTagCreated={handleTagCreated}
                    workspaceId={workspaceId}
                    workspaceSlug={workspaceSlug}
                  />
                </section>
              </div>

              {/* Subtasks */}
              <section>
                <div className="mb-3 flex items-center justify-between">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Subtasks ({subtasks.length})
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      className="w-44 rounded-lg border border-white/10 bg-slate-900/30 px-3 py-1.5 text-xs outline-none placeholder:text-slate-600 focus:border-primary"
                      value={newSubtask}
                      onChange={(e) => setNewSubtask(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && addSubtask()}
                      placeholder="Add a subtask..."
                    />
                    <button onClick={addSubtask} className="flex items-center gap-1 text-xs font-bold text-primary hover:underline">
                      <Plus className="h-3.5 w-3.5" /> Add
                    </button>
                  </div>
                </div>
                {subtasks.length > 0 && (
                  <div className="space-y-2">
                    {subtasks.map((st, i) => (
                      <div
                        key={i}
                        className="group flex items-center justify-between rounded-xl border border-white/10 bg-slate-900/30 p-3"
                      >
                        <span className="flex-1 text-sm text-slate-300">{st.text}</span>
                        <button
                          onClick={() => removeSubtask(i)}
                          className="text-slate-500 opacity-0 transition-opacity hover:text-red-500 group-hover:opacity-100"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </section>

              {/* Attachments */}
              <section className="mb-6">
                <AttachmentSection
                  attachments={attachments}
                  onAdd={addAttachment}
                  onDelete={removeAttachment}
                />
              </section>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between border-t border-slate-200 bg-slate-50 px-8 py-4 dark:border-white/10 dark:bg-slate-900/50">
              <div className="flex items-center gap-4 text-slate-500">
                <span className="flex items-center gap-1 text-xs">
                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                  Public
                </span>
                <span className="flex items-center gap-1 text-xs">
                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
                  Notifications On
                </span>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={onClose}
                  className="rounded-lg px-4 py-2 text-sm font-semibold text-red-500 transition-colors hover:bg-red-500/10"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="rounded-xl bg-primary px-6 py-2.5 text-sm font-bold text-white transition-all hover:shadow-lg hover:shadow-primary/20 disabled:opacity-70"
                >
                  {submitting ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" /> Creating...
                    </span>
                  ) : (
                    "Assign Task"
                  )}
                </button>
              </div>
            </div>
          </>
        )}
        <div id="portal-root" className="relative z-[9999]" />
      </div>

      {/* Animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px) scale(0.98); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </div>
  );
}
