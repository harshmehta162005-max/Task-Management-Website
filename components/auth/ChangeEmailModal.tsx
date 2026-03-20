import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils/cn";

type Props = {
  open: boolean;
  initialEmail: string;
  onClose: () => void;
  onSave: (email: string) => void;
};

export function ChangeEmailModal({ open, initialEmail, onClose, onSave }: Props) {
  const [value, setValue] = useState(initialEmail);

  useEffect(() => {
    if (open) setValue(initialEmail);
  }, [open, initialEmail]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-white/10 dark:bg-[#111827]">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Change email</h3>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-3">
          <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Email address</label>
          <input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            type="email"
            className={cn(
              "w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
            )}
            placeholder="you@example.com"
          />
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => {
              onSave(value);
              onClose();
            }}
            className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary/90"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
