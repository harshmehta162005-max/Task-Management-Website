"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { DrawerSubtask } from "./task-drawer/types";

type Props = {
  subtasks: DrawerSubtask[];
  onChange: (subs: DrawerSubtask[]) => void;
  readOnly?: boolean;   // full readOnly — can't do anything
  canCreate?: boolean;  // whether user can create new subtasks (owner only)
};

export function SubtasksSection({ subtasks, onChange, readOnly = false, canCreate = true }: Props) {
  const [input, setInput] = useState("");

  // Toggle checkbox — allowed for both owner and assigned members (unless fully readOnly)
  const toggle = (id: string) => {
    if (readOnly) return;
    onChange(subtasks.map((s) => (s.id === id ? { ...s, completed: !s.completed } : s)));
  };

  // Remove subtask
  const remove = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (readOnly || !canCreate) return;
    onChange(subtasks.filter((s) => s.id !== id));
  };

  // Add new subtask — only allowed if canCreate is true
  const add = () => {
    const title = input.trim();
    if (!title) return;
    onChange([...subtasks, { id: crypto.randomUUID(), title, completed: false }]);
    setInput("");
  };

  return (
    <div className="space-y-3">
      <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
        Subtasks ({subtasks.filter((s) => s.completed).length}/{subtasks.length})
      </p>
      <div className="space-y-2">
        {subtasks.map((s) => (
          <label
            key={s.id}
            className="flex items-center gap-3 rounded-xl bg-slate-50 px-3 py-2 text-sm dark:bg-white/5"
          >
            <input
              type="checkbox"
              checked={s.completed}
              onChange={() => toggle(s.id)}
              disabled={readOnly}
              className="h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary dark:border-slate-600 disabled:opacity-50 disabled:cursor-not-allowed"
            />
            <span className={`flex-1 ${s.completed ? "text-slate-400 line-through" : "text-slate-800 dark:text-slate-100"}`}>
              {s.title}
            </span>
            {canCreate && !readOnly && (
               <button 
                 onClick={(e) => remove(s.id, e)}
                 className="ml-2 rounded-md p-1 text-slate-400 transition-colors hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-900/20"
               >
                 <X className="h-4 w-4" />
               </button>
            )}
          </label>
        ))}
        {/* Only show add input if canCreate is true (owner only) */}
        {canCreate && !readOnly && (
          <div className="flex items-center gap-2 rounded-xl bg-slate-50 px-3 py-2 text-sm dark:bg-white/5">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  add();
                }
              }}
              placeholder="Add subtask..."
              className="border-0 focus:ring-0 w-full bg-transparent outline-none placeholder:text-slate-400 dark:placeholder:text-slate-500 text-slate-900 dark:text-slate-100"
            />
            <button onClick={add} className="text-primary text-xs font-semibold">
              Add
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
