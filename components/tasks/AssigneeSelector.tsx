"use client";

import { useMemo, useState, useEffect, useRef } from "react";
import { Plus, X, Search } from "lucide-react";
import { DrawerAssignee } from "./task-drawer/types";

type Props = {
  assignees: DrawerAssignee[];
  workspaceMembers: DrawerAssignee[];
  onChange: (next: DrawerAssignee[]) => void;
  readOnly?: boolean;
  excludeUserIds?: string[];
};

export function AssigneeSelector({ assignees, workspaceMembers, onChange, readOnly = false, excludeUserIds = [] }: Props) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const currentIds = useMemo(() => new Set(assignees.map((a) => a.id)), [assignees]);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
        setSearch("");
      }
    }
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  const filteredMembers = useMemo(() => {
    const q = search.toLowerCase();
    return workspaceMembers.filter((m) => {
      const name = m.name || "Unknown Member";
      return name.toLowerCase().includes(q) && !currentIds.has(m.id) && !excludeUserIds.includes(m.id);
    });
  }, [workspaceMembers, search, currentIds, excludeUserIds]);

  const addAssignee = (member: DrawerAssignee) => {
    if (currentIds.has(member.id)) return;
    onChange([...assignees, member]);
    setSearch("");
    setOpen(false);
  };

  const removeAssignee = (id: string) => {
    onChange(assignees.filter((a) => a.id !== id));
  };

  return (
    <div className="space-y-3">
      <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
        Assignees ({assignees.length})
      </p>

      {/* Show assigned members as chips with X to remove — matching Blocking section style */}
      {assignees.length === 0 ? (
        <p className="text-xs text-slate-500 dark:text-slate-400">No assignees yet.</p>
      ) : (
        <div className="space-y-2">
          {assignees.map((a) => (
            <div
              key={a.id}
              className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2 text-sm dark:bg-white/5"
            >
              <div className="flex items-center gap-2">
                {a.avatar ? (
                  <img src={a.avatar} alt={a.name} className="h-6 w-6 rounded-full object-cover" />
                ) : (
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-[10px] font-bold text-primary">
                    {(a.name ? a.name.charAt(0) : "U").toUpperCase()}
                  </div>
                )}
                <p className="font-semibold text-slate-800 dark:text-slate-100">{a.name}</p>
              </div>
              {!readOnly && (
                <button
                  onClick={() => removeAssignee(a.id)}
                  className="ml-2 rounded-md p-1 text-slate-400 transition-colors hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-900/20"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Add button + search popup — matching Blocking section style */}
      {!readOnly && (
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setOpen((v) => !v)}
            className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-500 transition hover:text-primary dark:bg-white/5 dark:text-slate-300"
          >
            <Plus className="h-3.5 w-3.5" /> Add
          </button>

          {open && (
            <div className="absolute z-20 mt-2 w-64 rounded-2xl bg-white p-3 shadow-xl dark:bg-[#111827] border border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2 border-b border-slate-200 pb-2 dark:border-slate-800">
                <Search className="h-4 w-4 text-slate-400" />
                <input
                  autoFocus
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search team members..."
                  className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400 border-0 focus:ring-0 dark:text-white"
                />
              </div>
              <div className="mt-2 max-h-48 overflow-y-auto space-y-1 pr-1 custom-scrollbar">
                {filteredMembers.length === 0 ? (
                  <p className="px-2 py-3 text-center text-xs text-slate-500 dark:text-slate-400">No members found</p>
                ) : (
                  filteredMembers.map(m => (
                    <button
                      key={m.id}
                      onClick={() => addAssignee(m)}
                      className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-sm transition hover:bg-slate-50 dark:hover:bg-white/5"
                    >
                      {m.avatar ? (
                        <img src={m.avatar} alt={m.name || "User"} className="h-6 w-6 rounded-full object-cover" />
                      ) : (
                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-[10px] font-bold text-primary">
                          {(m.name ? m.name.charAt(0) : "U").toUpperCase()}
                        </div>
                      )}
                      <span className="font-medium text-slate-700 dark:text-slate-200">{m.name || "Unknown Member"}</span>
                    </button>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
