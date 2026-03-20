"use client";

import { X } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils/cn";

type Props = {
  open: boolean;
  workspaceName: string;
  onClose: () => void;
  onConfirm: () => void;
};

export function DeleteWorkspaceModal({ open, workspaceName, onClose, onConfirm }: Props) {
  const [confirmText, setConfirmText] = useState("");
  if (!open) return null;

  const match = confirmText.trim() === workspaceName;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white shadow-xl dark:border-slate-800 dark:bg-[#0f172a]">
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4 dark:border-slate-800">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Delete workspace</h3>
          <button
            className="rounded-lg p-1 text-slate-500 hover:bg-slate-100 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-white/5"
            onClick={onClose}
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="space-y-4 px-5 py-5 text-sm text-slate-600 dark:text-slate-300">
          <p>
            This action cannot be undone. This will permanently delete{" "}
            <span className="font-semibold text-slate-900 dark:text-white">{workspaceName}</span> and all of its data.
          </p>
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-500 uppercase">Type workspace name to confirm</label>
            <input
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-red-500 focus:ring-2 focus:ring-red-100 dark:border-slate-700 dark:bg-[#111827] dark:text-slate-100 dark:focus:border-red-400 dark:focus:ring-red-500/20"
              placeholder={workspaceName}
            />
          </div>
        </div>
        <div className="flex items-center justify-end gap-2 border-t border-slate-200 px-5 py-4 dark:border-slate-800">
          <button
            onClick={onClose}
            className="rounded-xl px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-white/5"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              if (!match) return;
              onConfirm();
              onClose();
              setConfirmText("");
            }}
            className={cn(
              "rounded-xl px-4 py-2 text-sm font-semibold text-white shadow-sm",
              match
                ? "bg-red-500 hover:bg-red-600"
                : "cursor-not-allowed bg-red-400/70 text-white/80 hover:bg-red-400/70"
            )}
            disabled={!match}
          >
            Delete workspace
          </button>
        </div>
      </div>
    </div>
  );
}
