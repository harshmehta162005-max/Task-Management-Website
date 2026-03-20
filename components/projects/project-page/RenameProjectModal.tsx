import { useState } from "react";
import { X } from "lucide-react";

type Props = {
  open: boolean;
  currentName: string;
  onSave: (name: string) => void;
  onClose: () => void;
};

export function RenameProjectModal({ open, currentName, onSave, onClose }: Props) {
  const [name, setName] = useState(currentName);
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-white/10 dark:bg-[#111827]">
        <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3 dark:border-white/10">
          <h3 className="text-base font-semibold text-slate-900 dark:text-white">Rename project</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-white">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="space-y-2 px-4 py-4">
          <label className="text-sm font-medium text-slate-700 dark:text-slate-200">Project name</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-white/10 dark:bg-[#0f172a] dark:text-white"
            placeholder="Enter a new name"
          />
        </div>
        <div className="flex justify-end gap-2 border-t border-slate-200 bg-slate-50 px-4 py-3 dark:border-white/10 dark:bg-[#0f172a]/50">
          <button onClick={onClose} className="rounded-xl px-4 py-2 text-sm font-semibold text-slate-600 hover:text-slate-900 dark:text-slate-200 dark:hover:text-white">
            Cancel
          </button>
          <button
            onClick={() => onSave(name)}
            className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-primary/90"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

