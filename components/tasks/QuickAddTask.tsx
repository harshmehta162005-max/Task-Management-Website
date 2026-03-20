"use client";

import { useState } from "react";
import { Plus } from "lucide-react";

type Props = {
  onAdd: (title: string) => void;
};

export function QuickAddTask({ onAdd }: Props) {
  const [title, setTitle] = useState("");

  const handleAdd = () => {
    if (!title.trim()) return;
    onAdd(title.trim());
    setTitle("");
  };

  return (
    <div className="mt-3 rounded-xl border border-dashed border-slate-200 bg-white/70 px-3 py-2.5 dark:border-slate-800 dark:bg-slate-900/40">
      <div className="flex items-center gap-3 text-slate-500">
        <Plus className="h-5 w-5" />
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAdd()}
          placeholder="Add task to Today..."
          className="flex-1 border-none bg-transparent p-0 text-sm outline-none placeholder:text-slate-400"
        />
        <button
          type="button"
          onClick={handleAdd}
          className="rounded-lg px-3 py-1 text-xs font-semibold text-primary transition hover:bg-primary/10"
        >
          Add
        </button>
      </div>
    </div>
  );
}
