"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Loader2, Plus, X, Upload, Trash2, Bold, Italic, List, Link2, Code } from "lucide-react";

type Project = { id: string; name: string };
type Member = { id: string; name: string; avatarUrl: string };

export default function AssignTaskPage() {
  const { workspaceSlug } = useParams<{ workspaceSlug: string }>();
  const router = useRouter();

  // Form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [projectId, setProjectId] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [status, setStatus] = useState<"TODO" | "IN_PROGRESS">("TODO");
  const [priority, setPriority] = useState<"LOW" | "MEDIUM" | "HIGH" | "URGENT">("MEDIUM");
  const [selectedAssignees, setSelectedAssignees] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>(["Design"]);
  const [newTag, setNewTag] = useState("");
  const [showTagInput, setShowTagInput] = useState(false);
  const [subtasks, setSubtasks] = useState<{ text: string; done: boolean }[]>([]);
  const [newSubtask, setNewSubtask] = useState("");

  // Data from API
  const [projects, setProjects] = useState<Project[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch projects and members
  useEffect(() => {
    async function load() {
      try {
        const [projRes, memberRes] = await Promise.all([
          fetch(`/api/projects?workspaceSlug=${workspaceSlug}`),
          fetch(`/api/workspaces/${workspaceSlug}/members`),
        ]);
        if (projRes.ok) {
          const data = await projRes.json();
          setProjects(data.map((p: { id: string; name: string }) => ({ id: p.id, name: p.name })));
        }
        if (memberRes.ok) {
          const data = await memberRes.json();
          const mems = (data.members || data).map((m: { id: string; name: string; avatarUrl: string }) => ({
            id: m.id,
            name: m.name || "User",
            avatarUrl: m.avatarUrl || "",
          }));
          setMembers(mems);
        }
      } catch {
        // silent
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [workspaceSlug]);

  const toggleAssignee = (id: string) => {
    setSelectedAssignees((prev) =>
      prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id]
    );
  };

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag("");
      setShowTagInput(false);
    }
  };

  const removeTag = (tag: string) => setTags(tags.filter((t) => t !== tag));

  const addSubtask = () => {
    if (newSubtask.trim()) {
      setSubtasks([...subtasks, { text: newSubtask.trim(), done: false }]);
      setNewSubtask("");
    }
  };

  const removeSubtask = (idx: number) => setSubtasks(subtasks.filter((_, i) => i !== idx));

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
          dueDate: dueDate || null,
          assigneeIds: selectedAssignees.length > 0 ? selectedAssignees : undefined,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Failed to create task");
        setSubmitting(false);
        return;
      }

      router.push(`/${workspaceSlug}/my-tasks`);
    } catch {
      setError("Failed to create task. Please try again.");
      setSubmitting(false);
    }
  };

  const priorityConfig = {
    LOW: { label: "Low", active: "bg-slate-500/10 border-slate-500/30 text-slate-400", inactive: "bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-border-dark text-slate-500" },
    MEDIUM: { label: "Medium", active: "bg-amber-500/10 border-amber-500/30 text-amber-500", inactive: "bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-border-dark text-slate-500" },
    HIGH: { label: "High", active: "bg-orange-500/10 border-orange-500/30 text-orange-500", inactive: "bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-border-dark text-slate-500" },
    URGENT: { label: "Urgent", active: "bg-red-500/10 border-red-500/30 text-red-500", inactive: "bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-border-dark text-slate-500" },
  };

  const TAG_COLORS = [
    "bg-primary/10 text-primary border-primary/20",
    "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
    "bg-amber-500/10 text-amber-500 border-amber-500/20",
    "bg-rose-500/10 text-rose-500 border-rose-500/20",
    "bg-sky-500/10 text-sky-500 border-sky-500/20",
    "bg-purple-500/10 text-purple-500 border-purple-500/20",
  ];

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[800px] px-6 py-12">
      {/* Header */}
      <header className="mb-10 flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Assign Task
          </h1>
          <p className="mt-1 text-slate-500 dark:text-slate-400">
            Add a new task to your workspace
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="rounded-xl bg-slate-200 px-6 py-3 font-semibold text-slate-700 transition-colors hover:bg-slate-300 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="flex items-center gap-2 rounded-xl bg-primary px-6 py-3 font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-70"
          >
            {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
            Assign Task
          </button>
        </div>
      </header>

      {/* Error */}
      {error && (
        <div className="mb-6 rounded-xl border border-red-500/30 bg-red-500/10 px-5 py-3 text-sm text-red-400">
          {error}
        </div>
      )}

      {/* Main Form Card */}
      <main className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl dark:border-border-dark dark:bg-surface-dark">
        <div className="custom-scrollbar max-h-[70vh] space-y-8 overflow-y-auto p-8">
          {/* Task Title */}
          <section>
            <label className="mb-2 block text-sm font-semibold uppercase tracking-wider text-slate-400">
              Task Title
            </label>
            <input
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-5 py-4 text-xl font-medium outline-none transition-all placeholder:text-slate-400 focus:border-transparent focus:ring-2 focus:ring-primary dark:border-border-dark dark:bg-slate-900/50 dark:placeholder:text-slate-600"
              placeholder="e.g. Redesign landing page hero section"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </section>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* Project Selection */}
            <section>
              <label className="mb-2 block text-sm font-semibold uppercase tracking-wider text-slate-400">
                Project
              </label>
              <div className="relative">
                <select
                  className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 px-5 py-3.5 outline-none transition-all focus:ring-2 focus:ring-primary dark:border-border-dark dark:bg-slate-900/50"
                  value={projectId}
                  onChange={(e) => setProjectId(e.target.value)}
                >
                  <option value="">Select a project</option>
                  {projects.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
                <svg className="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </section>

            {/* Due Date */}
            <section>
              <label className="mb-2 block text-sm font-semibold uppercase tracking-wider text-slate-400">
                Due Date
              </label>
              <input
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-5 py-3 outline-none transition-all focus:ring-2 focus:ring-primary dark:border-border-dark dark:bg-slate-900/50"
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
            </section>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* Status */}
            <section>
              <label className="mb-2 block text-sm font-semibold uppercase tracking-wider text-slate-400">
                Status
              </label>
              <div className="flex gap-2">
                <button
                  onClick={() => setStatus("TODO")}
                  className={`flex flex-1 items-center justify-center gap-2 rounded-lg border py-2 font-medium transition ${
                    status === "TODO"
                      ? "border-primary/30 bg-primary/10 text-primary"
                      : "border-slate-200 bg-slate-100 text-slate-500 dark:border-border-dark dark:bg-slate-800"
                  }`}
                >
                  To Do
                </button>
                <button
                  onClick={() => setStatus("IN_PROGRESS")}
                  className={`flex flex-1 items-center justify-center gap-2 rounded-lg border py-2 font-medium transition ${
                    status === "IN_PROGRESS"
                      ? "border-primary/30 bg-primary/10 text-primary"
                      : "border-slate-200 bg-slate-100 text-slate-500 dark:border-border-dark dark:bg-slate-800"
                  }`}
                >
                  Active
                </button>
              </div>
            </section>

            {/* Priority */}
            <section>
              <label className="mb-2 block text-sm font-semibold uppercase tracking-wider text-slate-400">
                Priority
              </label>
              <div className="flex gap-2">
                {(["LOW", "MEDIUM", "HIGH", "URGENT"] as const).map((p) => (
                  <button
                    key={p}
                    onClick={() => setPriority(p)}
                    className={`flex-1 rounded-lg border py-2 font-medium transition ${
                      priority === p ? priorityConfig[p].active : priorityConfig[p].inactive
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
            <label className="mb-2 block text-sm font-semibold uppercase tracking-wider text-slate-400">
              Description
            </label>
            <div className="overflow-hidden rounded-xl border border-slate-200 dark:border-border-dark">
              <div className="flex gap-1 border-b border-slate-200 bg-slate-50 p-2 dark:border-border-dark dark:bg-slate-800/50">
                <button className="rounded p-1.5 text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700"><Bold className="h-4 w-4" /></button>
                <button className="rounded p-1.5 text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700"><Italic className="h-4 w-4" /></button>
                <button className="rounded p-1.5 text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700"><List className="h-4 w-4" /></button>
                <button className="rounded p-1.5 text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700"><Link2 className="h-4 w-4" /></button>
                <button className="ml-auto rounded p-1.5 text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700"><Code className="h-4 w-4" /></button>
              </div>
              <textarea
                className="w-full resize-none border-none bg-transparent p-4 text-slate-300 outline-none placeholder:text-slate-600 focus:ring-0"
                placeholder="Write detailed task requirements..."
                rows={5}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
          </section>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            {/* Assignees */}
            <section>
              <label className="mb-3 block text-sm font-semibold uppercase tracking-wider text-slate-400">
                Assignees
              </label>
              <div className="flex flex-wrap items-center gap-2">
                {members.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => toggleAssignee(m.id)}
                    className={`flex h-10 w-10 items-center justify-center rounded-full border-2 text-sm font-bold transition ${
                      selectedAssignees.includes(m.id)
                        ? "border-primary bg-primary/20 text-primary"
                        : "border-slate-600 bg-slate-800/50 text-slate-400 hover:border-slate-500"
                    }`}
                    title={m.name}
                  >
                    {m.avatarUrl ? (
                      <img src={m.avatarUrl} alt={m.name} className="h-full w-full rounded-full object-cover" />
                    ) : (
                      m.name.charAt(0).toUpperCase()
                    )}
                  </button>
                ))}
                {members.length === 0 && (
                  <p className="text-sm text-slate-500">No members yet</p>
                )}
              </div>
            </section>

            {/* Tags */}
            <section>
              <label className="mb-3 block text-sm font-semibold uppercase tracking-wider text-slate-400">
                Tags
              </label>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag, i) => (
                  <span
                    key={tag}
                    className={`flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-bold ${TAG_COLORS[i % TAG_COLORS.length]}`}
                  >
                    {tag}
                    <X className="h-3 w-3 cursor-pointer" onClick={() => removeTag(tag)} />
                  </span>
                ))}
                {showTagInput ? (
                  <div className="flex items-center gap-1">
                    <input
                      className="w-24 rounded-full border border-slate-700 bg-slate-800 px-3 py-1 text-xs outline-none focus:border-primary"
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && addTag()}
                      autoFocus
                      placeholder="Tag name"
                    />
                    <button onClick={addTag} className="text-primary">
                      <Plus className="h-3 w-3" />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setShowTagInput(true)}
                    className="flex items-center gap-1 rounded-full border border-slate-700 bg-slate-800 px-3 py-1 text-xs font-bold text-slate-400 transition-colors hover:text-white"
                  >
                    <Plus className="h-3 w-3" /> Add Tag
                  </button>
                )}
              </div>
            </section>
          </div>

          {/* Subtasks */}
          <section>
            <div className="mb-4 flex items-center justify-between">
              <label className="text-sm font-semibold uppercase tracking-wider text-slate-400">
                Subtasks ({subtasks.length})
              </label>
              <div className="flex items-center gap-2">
                <input
                  className="w-48 rounded-lg border border-border-dark bg-slate-900/30 px-3 py-1.5 text-sm outline-none placeholder:text-slate-600 focus:border-primary"
                  value={newSubtask}
                  onChange={(e) => setNewSubtask(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addSubtask()}
                  placeholder="Add a subtask..."
                />
                <button onClick={addSubtask} className="flex items-center gap-1 text-xs font-bold text-primary hover:underline">
                  <Plus className="h-4 w-4" /> Add
                </button>
              </div>
            </div>
            <div className="space-y-3">
              {subtasks.map((st, i) => (
                <div
                  key={i}
                  className="group flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 p-3.5 dark:border-border-dark dark:bg-slate-900/30"
                >
                  <span className={`flex-1 ${st.done ? "text-slate-500 line-through" : "text-slate-700 dark:text-slate-300"}`}>
                    {st.text}
                  </span>
                  <button
                    onClick={() => removeSubtask(i)}
                    className="text-slate-500 opacity-0 transition-opacity hover:text-red-500 group-hover:opacity-100"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
              {subtasks.length === 0 && (
                <p className="text-center text-sm text-slate-500">No subtasks yet</p>
              )}
            </div>
          </section>

          {/* Attachments */}
          <section>
            <label className="mb-4 block text-sm font-semibold uppercase tracking-wider text-slate-400">
              Attachments
            </label>
            <div className="flex cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/50 p-10 transition-colors hover:bg-slate-100 dark:border-border-dark dark:bg-slate-900/20 dark:hover:bg-slate-900/40">
              <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Upload className="h-6 w-6" />
              </div>
              <p className="text-center font-semibold text-slate-700 dark:text-slate-200">
                Click to upload or drag and drop
              </p>
              <p className="text-center text-xs text-slate-500">SVG, PNG, JPG or GIF (max. 800x400px)</p>
            </div>
          </section>
        </div>

        {/* Footer Action */}
        <div className="flex items-center justify-between border-t border-slate-200 bg-slate-50 p-6 dark:border-border-dark dark:bg-slate-900/50">
          <div className="flex items-center gap-4 text-slate-500">
            <span className="flex items-center gap-1 text-xs">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
              Public
            </span>
            <span className="flex items-center gap-1 text-xs">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
              Notifications On
            </span>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="rounded-lg border border-transparent px-4 py-2 font-semibold text-red-500 transition-colors hover:border-red-500/30 hover:text-red-400"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="rounded-xl bg-primary px-8 py-3 font-bold text-white transition-all hover:shadow-lg hover:shadow-primary/20 disabled:opacity-70"
            >
              {submitting ? "Creating..." : "Assign Task"}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
