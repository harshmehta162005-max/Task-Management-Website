"use client";

import { useState, useRef, useEffect } from "react";
import { Plus } from "lucide-react";

type Props = {
  onAdd: (title: string) => void;
};

export function QuickAddTask({ onAdd }: Props) {
  const [title, setTitle] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleResize = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  useEffect(() => {
    handleResize();
  }, [title]);

  const handleAdd = () => {
    if (!title.trim()) return;
    onAdd(title.trim());
    setTitle("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  return (
    <div className="mt-3 rounded-xl border border-dashed border-slate-200 bg-white/70 px-3 py-2.5 dark:border-slate-800 dark:bg-slate-900/40">
      <div className="flex items-start gap-3 text-slate-500">
        <Plus className="h-5 w-5 mt-0.5 shrink-0" />
        <textarea
          ref={textareaRef}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleAdd();
            }
          }}
          placeholder="Add personal task to Today..."
          rows={1}
          className="flex-1 resize-none overflow-hidden border-none bg-transparent p-0 text-sm outline-none focus:ring-0 placeholder:text-slate-400"
          style={{ minHeight: "20px" }}
        />
        <button
          type="button"
          onClick={handleAdd}
          className="rounded-lg px-3 py-1 text-xs font-semibold text-primary transition hover:bg-primary/10 shrink-0"
        >
          Add
        </button>
      </div>
    </div>
  );
}
