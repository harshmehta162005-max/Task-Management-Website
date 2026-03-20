"use client";

import { X } from "lucide-react";

type Props = {
  open: boolean;
  tagName: string;
  onClose: () => void;
  onConfirm: () => void;
};

export function DeleteTagDialog({ open, tagName, onClose, onConfirm }: Props) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white shadow-xl dark:border-slate-800 dark:bg-[#0f172a]">
        <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3 dark:border-slate-800">
          <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Delete tag</h3>
          <button
            className="rounded-lg p-1 text-slate-500 hover:bg-slate-100 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-white/5"
            onClick={onClose}
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="space-y-3 px-4 py-4 text-sm text-slate-600 dark:text-slate-300">
          <p>
            Delete <span className="font-semibold text-slate-900 dark:text-white">{tagName}</span>? Tasks will keep tag
            history but the tag will become unavailable going forward.
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
            className="rounded-xl bg-red-500 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-red-600"
          >
            Delete tag
          </button>
        </div>
      </div>
    </div>
  );
}
