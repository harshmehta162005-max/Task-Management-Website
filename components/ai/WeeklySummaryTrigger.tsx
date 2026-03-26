"use client";

import { useState } from "react";
import { Sparkles, Copy, Send, Loader2 } from "lucide-react";
import { Select } from "@/components/ui/Select";

type Props = {
  workspaceId: string;
  projects: { id: string; name: string }[];
};

export function WeeklySummaryTrigger({ workspaceId, projects }: Props) {
  const [projectId, setProjectId] = useState(projects[0]?.id ?? "");
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  // Keep projectId in sync if projects list changes
  if (projects.length > 0 && !projectId && projects[0]?.id) {
    setProjectId(projects[0].id);
  }

  const generate = async () => {
    if (!projectId || !workspaceId) return;
    setLoading(true);
    setError("");
    setSummary("");
    try {
      const res = await fetch("/api/ai/summarize-project", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ workspaceId, projectId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed to generate summary");
      setSummary(data.summary ?? "");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async () => {
    if (!summary) return;
    await navigator.clipboard.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const postToActivity = async () => {
    if (!summary || !workspaceId) return;
    try {
      await fetch("/api/activity", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          workspaceId,
          action: "posted_ai_summary",
          entityType: "project",
          entityId: projectId,
          metadata: { summary },
        }),
      });
    } catch {
      // silently ignore
    }
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-[#111827]">
      <div className="mb-4 flex items-center gap-3">
        <div className="rounded-lg bg-primary/10 p-2 text-primary">
          <Sparkles className="h-4 w-4" />
        </div>
        <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Weekly summary</h3>
      </div>
      <div className="space-y-3">
        <div className="flex flex-col gap-1">
          <label className="text-[11px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
            Project
          </label>
          <Select
            value={projectId}
            onChange={setProjectId}
            options={projects.map((p) => ({ value: p.id, label: p.name }))}
            portal={false}
          />
        </div>
        {error && <p className="text-xs text-red-500">{error}</p>}
        <button
          onClick={generate}
          disabled={loading || !workspaceId}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-primary/30 bg-primary/10 px-4 py-2 text-sm font-semibold text-primary transition hover:bg-primary/20 disabled:opacity-50"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
          {loading ? "Generating…" : "Generate summary"}
        </button>

        {summary ? (
          <div className="space-y-3 rounded-xl border border-dashed border-slate-300 bg-slate-50 p-3 text-sm text-slate-700 dark:border-slate-700 dark:bg-[#0f172a] dark:text-slate-200">
            <p className="leading-relaxed">{summary}</p>
            <div className="flex gap-2">
              <button
                onClick={postToActivity}
                className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:border-primary hover:text-primary dark:border-slate-700 dark:text-slate-200"
              >
                <Send className="h-3 w-3" />
                Post to activity
              </button>
              <button
                onClick={copyToClipboard}
                className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:border-primary hover:text-primary dark:border-slate-700 dark:text-slate-200"
              >
                <Copy className="h-3 w-3" />
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
