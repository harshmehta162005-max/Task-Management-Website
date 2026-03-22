
"use client";

import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { X, Calendar, Flag } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { DrawerAssignee } from "@/components/tasks/task-drawer/types";
import { cn } from "@/lib/utils/cn";
import { Select } from "@/components/ui/Select";

type Props = {
  open: boolean;
  onClose: () => void;
};

type Project = { id: string; name: string };

export function CreateTaskModal({ open, onClose }: Props) {
  const router = useRouter();
  const params = useParams<{ workspaceSlug: string }>();
  const ws = params?.workspaceSlug ?? "workspace";
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const [title, setTitle] = useState("");
  const [projectId, setProjectId] = useState("");
  const [assigneeIds, setAssigneeIds] = useState<string[]>([]);
  const [due, setDue] = useState("");
  const [priority, setPriority] = useState<"LOW" | "MEDIUM" | "HIGH">("MEDIUM");
  const [toast, setToast] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [projects, setProjects] = useState<Project[]>([]);
  const [members, setMembers] = useState<DrawerAssignee[]>([]);
  const [fetching, setFetching] = useState(false);

  useEffect(() => {
    if (!open || !ws || ws === "workspace") return;
    async function load() {
      setFetching(true);
      try {
        const [projRes, memberRes] = await Promise.all([
          fetch(`/api/projects?workspaceSlug=${ws}`),
          fetch(`/api/workspaces/${ws}/members`)
        ]);
        if (projRes.ok) {
          const data = await projRes.json();
          setProjects(data.map((p: any) => ({ id: p.id, name: p.name })));
          if (data.length > 0 && !projectId) setProjectId(data[0].id);
        }
        if (memberRes.ok) {
          const data = await memberRes.json();
          const mems = (data.members || data).map((m: any) => ({
            id: m.id,
            name: m.name || "User",
            avatarUrl: m.avatarUrl || ""
          }));
          setMembers(mems);
        }
      } catch {
        // quiet fail
      } finally {
        setFetching(false);
      }
    }
    load();
  }, [open, ws, projectId]);

  const toggleAssignee = (id: string) => {
    setAssigneeIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const assignees = useMemo(() => members.filter((m) => assigneeIds.includes(m.id)), [assigneeIds]);

  const handleSubmit = async () => {
    if (!title.trim() || !projectId || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          workspaceSlug: ws,
          projectId,
          title: title.trim(),
          priority,
          dueDate: due || null,
          assigneeIds: assigneeIds.length > 0 ? assigneeIds : undefined
        }),
      });

      if (res.ok) {
        setToast("Task created");
        const data = await res.json();
        setTimeout(() => {
          router.push(`/${ws}/projects/${projectId}?taskId=${data.id}`);
          setToast(null);
          onClose();
          setTitle("");
          setAssigneeIds([]);
          setDue("");
          setPriority("MEDIUM");
        }, 600);
      } else {
        setToast("Failed to create task");
      }
    } catch {
      setToast("Error creating task");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!open || !mounted) return null;

  return createPortal(
    <div className="fixed inset-0 z-[80] flex items-start justify-center overflow-y-auto bg-black/60 px-4 py-10 backdrop-blur-sm sm:items-center">

      {/* Removed overflow-hidden */}
      <div className="relative w-full max-w-lg rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-[#0f172a]">

        {/* Added rounded-t-2xl */}
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4 dark:border-slate-800 rounded-t-2xl">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Create Task</h3>
          <button onClick={onClose} className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Removed max-h-[70vh] overflow-y-auto */}
        <div className="space-y-4 px-5 py-4">
          <div>
            <label className="text-sm font-semibold text-slate-600 dark:text-slate-300">Title</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Design system update"
              className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm shadow-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-slate-700 dark:bg-[#0f172a] dark:text-slate-100"
            />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="text-sm font-semibold text-slate-600 dark:text-slate-300">Project</label>
              <Select
                value={projectId}
                onChange={setProjectId}
                options={projects.map((p) => ({ value: p.id, label: p.name }))}
                portal={false}
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-slate-600 dark:text-slate-300">Assignees</label>
              <div className="mt-2 flex flex-wrap gap-2">
                {members.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => toggleAssignee(m.id)}
                    className={cn(
                      "inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold",
                      assigneeIds.includes(m.id)
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-slate-200 text-slate-600 dark:border-slate-700 dark:text-slate-300"
                    )}
                  >
                    {m.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="text-sm font-semibold text-slate-600 dark:text-slate-300">Due date</label>
              <div className="mt-2 flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm dark:border-slate-700 dark:bg-[#0f172a]">
                <Calendar className="h-4 w-4 text-slate-400" />
                <input
                  type="date"
                  value={due}
                  onChange={(e) => setDue(e.target.value)}
                  className="w-full bg-transparent outline-none"
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-semibold text-slate-600 dark:text-slate-300">Priority</label>
              <div className="mt-2 flex gap-2">
                {(["LOW", "MEDIUM", "HIGH"] as const).map((p) => (
                  <button
                    key={p}
                    onClick={() => setPriority(p)}
                    className={cn(
                      "flex-1 rounded-lg border px-3 py-2 text-xs font-bold transition",
                      priority === p
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-slate-200 text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-white/5"
                    )}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Added rounded-b-2xl */}
        <div className="flex items-center justify-end gap-3 border-t border-slate-200 bg-slate-50 px-5 py-4 dark:border-slate-800 dark:bg-[#0f172a]/60 rounded-b-2xl">
          <button
            onClick={onClose}
            className="rounded-xl px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-white/5"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="rounded-xl bg-primary px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-primary/20 hover:bg-primary/90 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Creating..." : "Create task"}
          </button>
        </div>
        {toast && (
          <div className="absolute bottom-4 right-4 rounded-xl bg-emerald-500 px-4 py-3 text-sm font-semibold text-white shadow-xl">
            {toast}
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}