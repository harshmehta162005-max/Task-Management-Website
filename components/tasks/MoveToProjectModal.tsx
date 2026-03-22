"use client";

import { useEffect, useState } from "react";
import { X, Folder, Loader2, Check } from "lucide-react";

type Project = { id: string; name: string };

type Props = {
  open: boolean;
  onClose: () => void;
  taskId: string;
  currentProjectId?: string;
  workspaceSlug: string;
  onMoved: (projectName: string) => void;
};

export function MoveToProjectModal({
  open,
  onClose,
  taskId,
  currentProjectId,
  workspaceSlug,
  onMoved,
}: Props) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [moving, setMoving] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    setLoading(true);
    fetch(`/api/projects?workspaceSlug=${workspaceSlug}`)
      .then((r) => r.json())
      .then((data) => setProjects(Array.isArray(data) ? data : []))
      .catch(() => setProjects([]))
      .finally(() => setLoading(false));
  }, [open, workspaceSlug]);

  const handleMove = async (projectId: string, projectName: string) => {
    setMoving(projectId);
    try {
      const res = await fetch(`/api/tasks/${taskId}/move`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectId, workspaceSlug }),
      });
      if (res.ok) {
        onMoved(projectName);
      }
    } catch {
      // silent
    } finally {
      setMoving(null);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-white/10 dark:bg-[#0f172a]">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">Move to Project</h3>
          <button onClick={onClose} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5">
            <X className="h-5 w-5" />
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-10">
            <Loader2 className="h-6 w-6 animate-spin text-slate-400" />
          </div>
        ) : projects.length === 0 ? (
          <p className="py-8 text-center text-sm text-slate-500">No projects found.</p>
        ) : (
          <div className="max-h-72 space-y-1 overflow-y-auto">
            {projects.map((p) => {
              const isCurrent = p.id === currentProjectId;
              return (
                <button
                  key={p.id}
                  disabled={isCurrent || moving !== null}
                  onClick={() => handleMove(p.id, p.name)}
                  className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition ${
                    isCurrent
                      ? "cursor-default bg-slate-100 text-slate-400 dark:bg-white/5 dark:text-slate-500"
                      : "text-slate-700 hover:bg-primary/10 hover:text-primary dark:text-slate-200 dark:hover:bg-primary/10"
                  }`}
                >
                  <Folder className="h-4 w-4 flex-shrink-0" />
                  <span className="flex-1 truncate">{p.name}</span>
                  {isCurrent && (
                    <span className="flex items-center gap-1 text-xs text-primary">
                      <Check className="h-3 w-3" /> Current
                    </span>
                  )}
                  {moving === p.id && <Loader2 className="h-4 w-4 animate-spin" />}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
