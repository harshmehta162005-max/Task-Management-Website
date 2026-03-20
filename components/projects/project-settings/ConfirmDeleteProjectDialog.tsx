"use client";

import { useState } from "react";
import { X, AlertTriangle } from "lucide-react";

type Props = {
  open: boolean;
  projectName: string;
  onClose: () => void;
  onConfirm: () => void;
};

export function ConfirmDeleteProjectDialog({ open, projectName, onClose, onConfirm }: Props) {
  const [text, setText] = useState("");
  if (!open) return null;
  const match = text.trim() === projectName;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white shadow-xl dark:border-slate-800 dark:bg-[#0f172a]">
        <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-red-500" />
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Delete project</h3>
          </div>
          <button
            className="rounded-lg p-1 text-slate-500 hover:bg-slate-100 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-white/5"
            onClick={onClose}
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="space-y-3 px-4 py-4 text-sm text-slate-600 dark:text-slate-300">
          <p>
            This will permanently delete{" "}
            <span className="font-semibold text-slate-900 dark:text-white">{projectName}</span> and all its data.
          </p>
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">
              Type the project name to confirm
            </label>
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-red-500 focus:ring-2 focus:ring-red-100 dark:border-slate-700 dark:bg-[#111827] dark:text-slate-100 dark:focus:border-red-400 dark:focus:ring-red-500/20"
              placeholder={projectName}
            />
          </div>
        </div>
        <div className="flex items-center justify-end gap-2 border-t border-slate-200 px-4 py-3 dark:border-slate-800">
          <button
            onClick={onClose}
            className="rounded-xl px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-white/5"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              if (!match) return;
              onConfirm();
              onClose();
              setText("");
            }}
            disabled={!match}
            className="rounded-xl bg-red-500 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-red-600 disabled:cursor-not-allowed disabled:bg-red-400/70"
          >
            Delete project
          </button>
        </div>
      </div>
    </div>
  );
}
