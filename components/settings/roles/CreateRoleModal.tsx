"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { RoleItem } from "./rolesData";
import { Select } from "@/components/ui/Select";

type Props = {
  open: boolean;
  roles: RoleItem[];
  onClose: () => void;
  onCreate: (role: { name: string; description: string; cloneFrom?: string }) => void;
};

export function CreateRoleModal({ open, roles, onClose, onCreate }: Props) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [cloneFrom, setCloneFrom] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (open) {
      setName("");
      setDescription("");
      setCloneFrom(undefined);
    }
  }, [open]);

  if (!open) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white shadow-xl dark:border-slate-800 dark:bg-[#0f172a]">
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4 dark:border-slate-800">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Create role</h3>
          <button
            className="rounded-lg p-1 text-slate-500 hover:bg-slate-100 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-white/5"
            onClick={onClose}
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="space-y-4 px-5 py-5">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-900 dark:text-white">Role name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Analyst"
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-slate-700 dark:bg-[#111827] dark:text-slate-100"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-900 dark:text-white">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              onInput={(e) => {
                e.currentTarget.style.height = 'auto';
                e.currentTarget.style.height = `${e.currentTarget.scrollHeight}px`;
              }}
              rows={3}
              placeholder="What can members with this role do?"
              className="resize-none overflow-hidden w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-slate-700 dark:bg-[#111827] dark:text-slate-100"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-900 dark:text-white">Clone permissions from</label>
            <Select
              value={cloneFrom ?? ""}
              onChange={(val) => setCloneFrom(val || undefined)}
              options={[{ value: "", label: "None" }, ...roles.map((r) => ({ value: r.id, label: r.name }))]}
              portal={false}
            />
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
              onCreate({ name: name.trim(), description: description.trim(), cloneFrom });
              onClose();
            }}
            disabled={!name.trim()}
            className="rounded-xl bg-primary px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:bg-primary/60"
          >
            Create role
          </button>
        </div>
      </div>
    </div>
  );
}
