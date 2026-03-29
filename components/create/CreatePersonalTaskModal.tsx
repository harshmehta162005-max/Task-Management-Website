"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { X, Calendar, Flag } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { cn } from "@/lib/utils/cn";
import { Select } from "@/components/ui/Select";

type Props = {
  open: boolean;
  onClose: () => void;
};

type Project = { id: string; name: string };

export function CreatePersonalTaskModal({ open, onClose }: Props) {
  const router = useRouter();
  const params = useParams<{ workspaceSlug: string }>();
  const ws = params?.workspaceSlug ?? "workspace";
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [projectId, setProjectId] = useState("none");
  const [status, setStatus] = useState<"TODO" | "IN_PROGRESS" | "DONE">("TODO");
  const [due, setDue] = useState("");
  const [priority, setPriority] = useState<"LOW" | "MEDIUM" | "HIGH" | "URGENT">("MEDIUM");
  const [toast, setToast] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [projects, setProjects] = useState<Project[]>([]);
  const [fetching, setFetching] = useState(false);

  useEffect(() => {
    if (!open || !ws || ws === "workspace") return;
    async function load() {
      setFetching(true);
      try {
        const projRes = await fetch(`/api/projects?workspaceSlug=${ws}`);
        if (projRes.ok) {
          const data = await projRes.json();
          setProjects(data.map((p: any) => ({ id: p.id, name: p.name })));
        }
      } catch {
        // quiet fail
      } finally {
        setFetching(false);
      }
    }
    load();
  }, [open, ws]);

  const handleSubmit = async () => {
    if (!title.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          workspaceSlug: ws,
          projectId, // 'none' translates to private Personal Task in backend
          title: title.trim(),
          description: description.trim() ? description.trim() : null,
          status,
          priority,
          dueDate: due || null,
          assigneeIds: [], // Backend auto-assigns creator
        }),
      });

      if (res.ok) {
        setToast("Task created");
        const data = await res.json();
        
        // Dispatch custom event so the 'My Tasks' dashboard can instantly reload its task list
        window.dispatchEvent(new CustomEvent("personal-task-created"));
        
        setTimeout(() => {
          setToast(null);
          onClose();
          setTitle("");
          setDescription("");
          setProjectId("none");
          setStatus("TODO");
          setPriority("MEDIUM");
          setDue("");
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

  const projectOptions = [
    { value: "none", label: "None (Personal Task)" },
    ...projects.map((p) => ({ value: p.id, label: p.name }))
  ];

  return createPortal(
    <div className="fixed inset-0 z-[80] flex items-start justify-center overflow-y-auto bg-black/60 px-4 py-10 backdrop-blur-sm sm:items-center">
      <div className="relative w-full max-w-lg rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-[#0f172a]">
        
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4 dark:border-slate-800 rounded-t-2xl">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Create Personal Task</h3>
          <button onClick={onClose} className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-4 px-5 py-4">
          <div>
            <label className="text-sm font-semibold text-slate-600 dark:text-slate-300">Title</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Schedule doctor appointment"
              className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm shadow-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-700 dark:bg-[#151a23] dark:text-slate-100"
            />
          </div>

          <div>
            <label className="text-sm font-semibold text-slate-600 dark:text-slate-300">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add optional notes here..."
              rows={3}
              className="mt-2 w-full resize-none rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm shadow-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-700 dark:bg-[#151a23] dark:text-slate-100"
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="text-sm font-semibold text-slate-600 dark:text-slate-300">Project</label>
              <div className="mt-2">
                <Select
                  value={projectId}
                  onChange={setProjectId}
                  options={projectOptions}
                  portal={false}
                />
              </div>
            </div>
            
            <div>
              <label className="text-sm font-semibold text-slate-600 dark:text-slate-300">Initial Status</label>
              <div className="mt-2">
                 <Select
                  value={status}
                  onChange={(val) => setStatus(val as any)}
                  options={[
                    { value: "TODO", label: "To Do" },
                    { value: "IN_PROGRESS", label: "In Progress" },
                  ]}
                  portal={false}
                />
              </div>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="text-sm font-semibold text-slate-600 dark:text-slate-300">Due date</label>
              <div className="mt-2 flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm shadow-sm dark:border-slate-700 dark:bg-[#151a23]">
                <Calendar className="h-4 w-4 text-slate-400" />
                <div className="relative flex-1">
                  <input
                    type="date"
                    value={due}
                    onChange={(e) => setDue(e.target.value)}
                    className="w-full bg-transparent outline-none dark:text-slate-200 [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:inset-0 [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:cursor-pointer"
                  />
                </div>
              </div>
            </div>
            <div>
              <label className="text-sm font-semibold text-slate-600 dark:text-slate-300">Priority</label>
              <div className="mt-2 flex gap-1">
                {(["LOW", "MEDIUM", "HIGH", "URGENT"] as const).map((p) => (
                  <button
                    key={p}
                    onClick={() => setPriority(p)}
                    className={cn(
                      "flex-1 rounded-lg border px-2 py-2 text-[10px] sm:text-[11px] font-bold transition",
                      priority === p
                        ? "border-indigo-500 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400"
                        : "border-slate-200 text-slate-500 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-white/5"
                    )}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 border-t border-slate-200 bg-slate-50 px-5 py-4 dark:border-slate-800 dark:bg-[#10141d] rounded-b-2xl">
          <button
            onClick={onClose}
            className="rounded-xl px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-200 dark:text-slate-300 dark:hover:bg-white/10 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting || !title.trim()}
            className="rounded-xl bg-indigo-600 px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-indigo-600/30 hover:bg-indigo-700 disabled:opacity-70 disabled:cursor-not-allowed transition-all"
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
