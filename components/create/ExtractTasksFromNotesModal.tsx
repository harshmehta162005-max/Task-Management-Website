"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { X, Wand2 } from "lucide-react";
import { ProposedTasksList } from "./ProposedTasksList";
import { Select } from "@/components/ui/Select";
import { useParams } from "next/navigation";
import { Loader2, Plus } from "lucide-react";

type Props = {
  open: boolean;
  onClose: () => void;
};

export function ExtractTasksFromNotesModal({ open, onClose }: Props) {
  const params = useParams<{ workspaceSlug: string }>();
  const ws = params?.workspaceSlug ?? "workspace";

  const [notes, setNotes] = useState("");
  const [projects, setProjects] = useState<{ id: string; name: string }[]>([]);
  const [projectId, setProjectId] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [tasks, setTasks] = useState<{ id: string; title: string; priority: string; approved: boolean }[]>([]);
  const [mounted, setMounted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open || !ws || ws === "workspace") return;
    fetch(`/api/projects?workspaceSlug=${ws}`)
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setProjects(data.map((p: any) => ({ id: p.id, name: p.name })));
          setProjectId(data[0].id);
        }
      })
      .catch(() => {});
  }, [open, ws]);

  useEffect(() => {
    if (!open) {
      setNotes("");
      setTasks([]);
      setLoading(false);
      setIsCreating(false);
      setError(null);
    }
  }, [open]);

  useEffect(() => {
    setTasks([]);
  }, [notes, projectId]);

  useEffect(() => setMounted(true), []);

  const extract = async () => {
    if (!notes.trim() || !projectId) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/tasks/extract", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ workspaceSlug: ws, notes: notes.trim() }),
      });
      if (!res.ok) {
        throw new Error(await res.text());
      }
      const data = await res.json();
      if (!data.tasks || data.tasks.length === 0) {
        setError("No tasks found in notes.");
      } else {
        setTasks(
          data.tasks.map((t: any, i: number) => ({
            id: `extracted-${i}`,
            title: t.title,
            priority: t.priority || "MEDIUM",
            approved: true,
          }))
        );
      }
    } catch (err: any) {
      setError("Failed to extract: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const createTasks = async () => {
    const approvedTasks = tasks.filter((t) => t.approved);
    if (approvedTasks.length === 0) return;
    
    setIsCreating(true);
    try {
      for (const t of approvedTasks) {
        await fetch("/api/tasks", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            workspaceSlug: ws,
            projectId,
            title: t.title,
            priority: t.priority,
          }),
        });
      }
      window.dispatchEvent(new CustomEvent("personal-task-created"));
      onClose();
    } catch (err) {
      setError("Failed to create tasks.");
    } finally {
      setIsCreating(false);
    }
  };

  const approveAll = () => setTasks((prev) => prev.map((t) => ({ ...t, approved: true })));
  const toggle = (id: string) => setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, approved: !t.approved } : t)));

  if (!open || !mounted) return null;

  return createPortal(
    <div className="fixed inset-0 z-[80] flex items-start justify-center overflow-y-auto bg-black/60 px-4 py-10 backdrop-blur-sm sm:items-center">
      
      {/* 1. Removed overflow-hidden */}
      <div className="relative w-full max-w-2xl rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-[#0f172a]">
        
        {/* 2. Added rounded-t-2xl */}
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4 dark:border-slate-800 rounded-t-2xl">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Paste notes → Extract tasks</h3>
          <button onClick={onClose} className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5">
            <X className="h-5 w-5" />
          </button>
        </div>
        
        {/* 3. Removed max-h-[70vh] overflow-y-auto */}
        <div className="space-y-4 px-5 py-4">
          <div>
            <label className="text-sm font-semibold text-slate-600 dark:text-slate-300">Meeting notes / transcript</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={5}
              className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm shadow-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-slate-700 dark:bg-[#0f172a] dark:text-slate-100"
              placeholder="Paste your meeting notes…"
            />
          </div>
          <div>
            <label className="text-sm font-semibold text-slate-600 dark:text-slate-300">Target project</label>
            <Select
              value={projectId}
              onChange={setProjectId}
              options={projects.map((p) => ({ value: p.id, label: p.name }))}
              portal={false}
            />
          </div>
          <ProposedTasksList tasks={tasks} onToggle={toggle} onApproveAll={approveAll} />
        </div>
        
        {/* 4. Added rounded-b-2xl */}
        <div className="flex items-center justify-between border-t border-slate-200 bg-slate-50 px-5 py-4 text-sm dark:border-slate-800 dark:bg-[#0f172a]/60 rounded-b-2xl">
          <div className="flex items-center gap-2">
            {error && <span className="text-red-500 font-semibold">{error}</span>}
            <span className="text-xs text-slate-500 dark:text-slate-400">
              AI typically extracts tasks in &lt; 2 seconds
            </span>
          </div>
          {tasks.length > 0 ? (
            <button
              onClick={createTasks}
              disabled={isCreating}
              className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2 font-semibold text-white shadow-lg shadow-indigo-500/20 hover:bg-indigo-700 disabled:opacity-60"
            >
              {isCreating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
              {isCreating ? "Creating..." : `Create ${tasks.filter(t => t.approved).length} Tasks`}
            </button>
          ) : (
            <button
              onClick={extract}
              disabled={loading || !notes.trim()}
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2 font-semibold text-white shadow-lg shadow-primary/20 hover:bg-primary/90 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Wand2 className="h-4 w-4" />}
              {loading ? "Extracting…" : "Extract"}
            </button>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}