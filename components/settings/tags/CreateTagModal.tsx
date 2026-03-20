"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { ColorPalettePicker } from "./ColorPalettePicker";
import { TagChip } from "./TagChip";

type TagInput = { name: string; color: string };

type Props = {
  open: boolean;
  initial?: TagInput;
  onClose: () => void;
  onSave: (tag: TagInput) => void;
  mode?: "create" | "edit";
};

const DEFAULT_COLOR = "#6366f1";

export function CreateTagModal({ open, initial, onClose, onSave, mode = "create" }: Props) {
  const [name, setName] = useState(initial?.name ?? "");
  const [color, setColor] = useState(initial?.color ?? DEFAULT_COLOR);

  useEffect(() => {
    if (open) {
      setName(initial?.name ?? "");
      setColor(initial?.color ?? DEFAULT_COLOR);
    }
  }, [open, initial]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-[#0f172a]">
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4 dark:border-slate-800">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
            {mode === "edit" ? "Edit tag" : "Create tag"}
          </h3>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-white/5"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-4 px-5 py-5">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-900 dark:text-white">Tag name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Documentation"
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-slate-700 dark:bg-[#111827] dark:text-slate-100"
            />
          </div>

          <div className="space-y-3">
            <label className="text-sm font-semibold text-slate-900 dark:text-white">Tag color</label>
            <ColorPalettePicker value={color} onChange={setColor} />
          </div>

          <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-4 text-center dark:border-slate-700 dark:bg-[#0d1422]">
            <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400">Preview</p>
            <div className="mt-2 inline-flex">
              <TagChip label={name || "New tag"} color={color} />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 border-t border-slate-200 px-5 py-4 dark:border-slate-800">
          <button
            onClick={onClose}
            className="rounded-xl px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-white/5"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onSave({ name: name.trim() || "New tag", color });
              onClose();
            }}
            disabled={!name.trim()}
            className="rounded-xl bg-primary px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:bg-primary/60"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
