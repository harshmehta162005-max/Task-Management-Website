"use client";

import { useMemo, useState } from "react";
import { X, Search, UserPlus } from "lucide-react";

type Member = {
  id: string;
  name: string;
  email: string;
};

type Props = {
  open: boolean;
  workspaceMembers: Member[];
  onClose: () => void;
  onAdd: (members: Member[]) => void;
};

export function AddMembersModal({ open, workspaceMembers, onClose, onAdd }: Props) {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return workspaceMembers;
    return workspaceMembers.filter((m) => m.name.toLowerCase().includes(q) || m.email.toLowerCase().includes(q));
  }, [workspaceMembers, query]);

  if (!open) return null;

  const toggle = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const add = () => {
    onAdd(workspaceMembers.filter((m) => selected.has(m.id)));
    setSelected(new Set());
    setQuery("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-[#0f172a]">
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <UserPlus className="h-4 w-4" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900 dark:text-white">Add members</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">Search workspace members</p>
            </div>
          </div>
          <button
            className="rounded-lg p-1 text-slate-500 hover:bg-slate-100 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-white/5"
            onClick={onClose}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-4 px-5 py-4">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name or email"
              className="w-full rounded-xl border border-slate-200 bg-white pl-10 pr-3 py-2.5 text-sm text-slate-900 shadow-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-slate-700 dark:bg-[#111827] dark:text-slate-100"
            />
          </div>
          <div className="max-h-64 space-y-2 overflow-y-auto pr-1">
            {filtered.map((m) => {
              const checked = selected.has(m.id);
              return (
                <label
                  key={m.id}
                  className="flex cursor-pointer items-center justify-between gap-3 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm shadow-sm hover:border-primary/40 dark:border-slate-700 dark:bg-[#0d1422]"
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggle(m.id)}
                      className="h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary dark:border-slate-600"
                    />
                    <div>
                      <p className="font-semibold text-slate-900 dark:text-white">{m.name}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{m.email}</p>
                    </div>
                  </div>
                  {checked && <span className="text-xs font-semibold text-primary">Selected</span>}
                </label>
              );
            })}
            {!filtered.length && <p className="text-xs text-slate-500 dark:text-slate-400">No matches</p>}
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
            onClick={add}
            disabled={!selected.size}
            className="rounded-xl bg-primary px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:bg-primary/60"
          >
            Add members
          </button>
        </div>
      </div>
    </div>
  );
}
