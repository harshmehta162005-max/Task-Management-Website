"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { Plus, X, Search } from "lucide-react";
import { DrawerDependency, DrawerAssignee } from "./task-drawer/types";

type Props = {
  dependencies: { blockedBy: DrawerDependency[]; blocking: DrawerDependency[] };
  onChange: (next: { blockedBy: DrawerDependency[]; blocking: DrawerDependency[] }) => void;
  taskId?: string;
  workspaceMembers?: DrawerAssignee[];
  readOnly?: boolean;
};

export function DependenciesSection({ dependencies, onChange, taskId, workspaceMembers = [], readOnly = false }: Props) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
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
      return name.toLowerCase().includes(q) && !dependencies.blocking.some(b => b.id === m.id);
    });
  }, [workspaceMembers, search, dependencies.blocking]);

  const addBlocking = (member: DrawerAssignee) => {
    if (dependencies.blocking.some(b => b.id === member.id)) return;
    const entry: DrawerDependency = {
      id: member.id,
      title: member.name,
      status: "TODO",
    };
    onChange({
      ...dependencies,
      blocking: [...dependencies.blocking, entry],
    });
    setSearch("");
    setOpen(false);
  };

  const removeBlocking = (id: string) => {
    onChange({
      ...dependencies,
      blocking: dependencies.blocking.filter((d) => d.id !== id),
    });
  };

  return (
    <div className="space-y-3">
      <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
        Blocking ({dependencies.blocking.length})
      </p>

      {dependencies.blocking.length === 0 ? (
        <p className="text-xs text-slate-500 dark:text-slate-400">This task is not blocking others.</p>
      ) : (
        <div className="space-y-2">
          {dependencies.blocking.map((d) => (
            <div
              key={d.id}
              className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2 text-sm dark:bg-white/5"
            >
              <div className="flex-1">
                <p className="font-semibold text-slate-800 dark:text-slate-100">{d.title}</p>
              </div>
              {/* Bug Fix #2: X icon is ALWAYS visible, no opacity-0 / group-hover */}
              {!readOnly && (
                <button
                  onClick={() => removeBlocking(d.id)}
                  className="ml-2 rounded-md p-1 text-slate-400 transition-colors hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-900/20"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          ))}
        </div>
      )}

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
                     onClick={() => addBlocking(m)}
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
