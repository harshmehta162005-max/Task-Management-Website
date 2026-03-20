"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils/cn";

type Props = {
  open: boolean;
  email: string;
  onClose: () => void;
  onConfirm: () => void;
};

export function DeleteAccountDialog({ open, email, onClose, onConfirm }: Props) {
  const [value, setValue] = useState("");

  useEffect(() => {
    if (!open) setValue("");
  }, [open]);

  if (!open) return null;

  const disabled = value.trim() !== email;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
      <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-[#0f172a]">
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4 dark:border-slate-800">
          <h3 className="text-lg font-semibold text-red-600 dark:text-red-400">Delete account</h3>
          <button onClick={onClose} className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="space-y-3 px-5 py-4">
          <p className="text-sm text-slate-600 dark:text-slate-300">
            This action is permanent. To confirm, type <span className="font-semibold">{email}</span> below.
          </p>
          <input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm shadow-sm outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 dark:border-slate-700 dark:bg-[#0f172a] dark:text-slate-100"
            placeholder={email}
          />
        </div>
        <div className="flex items-center justify-end gap-3 border-t border-slate-200 px-5 py-4 dark:border-slate-800">
          <button
            onClick={onClose}
            className="rounded-xl px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-white/5"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={disabled}
            className={cn(
              "rounded-xl bg-red-500 px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-red-500/20 transition hover:bg-red-600",
              disabled && "opacity-60"
            )}
          >
            Delete account
          </button>
        </div>
      </div>
    </div>
  );
}
