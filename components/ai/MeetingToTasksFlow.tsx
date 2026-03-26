"use client";

import { useState } from "react";
import { ClipboardEdit, Loader2 } from "lucide-react";
import { ProposedTasksPreview } from "./ProposedTasksPreview";
import { Select } from "@/components/ui/Select";

type Proposed = {
  id: string;
  title: string;
  assignee?: string;
  due?: string;
  duplicate?: boolean;
};

type Props = {
  workspaceId: string;
  projects: { id: string; name: string }[];
};

export function MeetingToTasksFlow({ workspaceId, projects }: Props) {
  const [notes, setNotes] = useState("");
  const [projectId, setProjectId] = useState(projects[0]?.id ?? "");
  const [proposed, setProposed] = useState<Proposed[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Keep projectId in sync if projects list changes
  if (projects.length > 0 && !projectId && projects[0]?.id) {
    setProjectId(projects[0].id);
  }

  const extract = async () => {
    if (!notes.trim() || !projectId || !workspaceId) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/ai/meeting-to-tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ workspaceId, notes, projectId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed to extract tasks");
      setProposed(data.tasks ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const approve = async (id: string) => {
    const task = proposed.find((t) => t.id === id);
    if (!task || !projectId) return;
    // Create the task via API
    try {
      await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectId,
          title: task.title,
          status: "TODO",
          priority: "MEDIUM",
        }),
      });
    } catch {
      // silently ignore — task still removed from proposed list
    }
    setProposed((p) => p.filter((t) => t.id !== id));
  };

  const reject = (id: string) => setProposed((p) => p.filter((t) => t.id !== id));

  const approveAll = async () => {
    for (const task of proposed.filter((t) => !t.duplicate)) {
      await approve(task.id);
    }
    setProposed([]);
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-[#111827]">
      <div className="mb-4 flex items-center gap-3">
        <div className="rounded-lg bg-emerald-500/10 p-2 text-emerald-500">
          <ClipboardEdit className="h-4 w-4" />
        </div>
        <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Meeting to tasks</h3>
      </div>
      <div className="space-y-3">
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={4}
          placeholder="Paste meeting notes…"
          className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-slate-700 dark:bg-[#0f172a] dark:text-slate-100"
        />
        <div className="flex flex-col gap-1">
          <label className="text-[11px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
            Target project
          </label>
          <Select
            value={projectId}
            onChange={setProjectId}
            options={projects.map((p) => ({ value: p.id, label: p.name }))}
            portal={false}
          />
        </div>
        {error && (
          <p className="text-xs text-red-500">{error}</p>
        )}
        <button
          onClick={extract}
          disabled={loading || !notes.trim() || !workspaceId}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 disabled:opacity-50 dark:bg-white dark:text-slate-900"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
          {loading ? "Extracting…" : "Extract tasks"}
        </button>

        <ProposedTasksPreview
          tasks={proposed}
          onApprove={approve}
          onReject={reject}
          onApproveAll={approveAll}
        />
      </div>
    </div>
  );
}
