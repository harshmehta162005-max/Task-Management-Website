"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { useRouter, useParams } from "next/navigation";

type Props = {
  open: boolean;
  onClose: () => void;
};

export function CreateProjectModalWrapper({ open, onClose }: Props) {
  const router = useRouter();
  const params = useParams<{ workspaceSlug: string }>();
  const ws = params?.workspaceSlug ?? "workspace";
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [toast, setToast] = useState<string | null>(null);

  const handleSubmit = () => {
    if (!name.trim()) return;
    setToast("Project created");
    const projectId = name.toLowerCase().replace(/\s+/g, "-") || "new-project";
    setTimeout(() => {
      setToast(null);
      onClose();
      router.push(`/${ws}/projects/${projectId}`);
      setName("");
      setDescription("");
    }, 600);
  };

  if (!open || !mounted) return null;

  return createPortal(
    <div className="fixed inset-0 z-[80] flex items-start justify-center overflow-y-auto bg-black/60 px-4 py-10 backdrop-blur-sm sm:items-center">
      <div className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-[#0f172a]">
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4 dark:border-slate-800">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Create Project</h3>
          <button onClick={onClose} className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="space-y-4 px-5 py-4 max-h-[70vh] overflow-y-auto">
          <div>
            <label className="text-sm font-semibold text-slate-600 dark:text-slate-300">Name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Project name"
              className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm shadow-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-slate-700 dark:bg-[#0f172a] dark:text-slate-100"
            />
          </div>
          <div>
            <label className="text-sm font-semibold text-slate-600 dark:text-slate-300">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm shadow-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-slate-700 dark:bg-[#0f172a] dark:text-slate-100"
              placeholder="Optional short description"
            />
          </div>
        </div>
        <div className="flex items-center justify-end gap-3 border-t border-slate-200 bg-slate-50 px-5 py-4 dark:border-slate-800 dark:bg-[#0f172a]/60">
          <button
            onClick={onClose}
            className="rounded-xl px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-white/5"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="rounded-xl bg-primary px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-primary/20 hover:bg-primary/90"
          >
            Create project
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
