"use client";

import { X, Archive } from "lucide-react";

type Props = {
  open: boolean;
  projectName: string;
  onClose: () => void;
  onConfirm: () => void;
};

export function ConfirmArchiveDialog({ open, projectName, onClose, onConfirm }: Props) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white shadow-xl dark:border-slate-800 dark:bg-[#0f172a]">
        <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <Archive className="h-4 w-4 text-amber-500" />
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Archive project?</h3>
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
            Archiving <span className="font-semibold text-slate-900 dark:text-white">{projectName}</span> will hide it
            from active lists. You can restore it later from archived projects.
          </p>
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
              onConfirm();
              onClose();
            }}
            className="rounded-xl bg-amber-500 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-amber-600"
          >
            Archive
          </button>
        </div>
      </div>
    </div>
  );
}
