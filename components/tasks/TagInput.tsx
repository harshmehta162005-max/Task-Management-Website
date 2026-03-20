"use client";

import { useMemo, useState } from "react";
import { X, Plus } from "lucide-react";
import { cn } from "@/lib/utils/cn";

type Props = {
  tags: string[];
  suggestions?: string[];
  onChange: (next: string[]) => void;
  readOnly?: boolean;
};

const defaultSuggestions = ["Design", "Backend", "Blocked", "High Impact", "QA", "Research"];

export function TagInput({ tags, suggestions = defaultSuggestions, onChange, readOnly = false }: Props) {
  const [input, setInput] = useState("");
  const [open, setOpen] = useState(false);

  const filtered = useMemo(() => {
    const q = input.toLowerCase();
    return suggestions.filter((s) => s.toLowerCase().includes(q) && !tags.includes(s));
  }, [input, suggestions, tags]);

  const addTag = (tag: string) => {
    if (readOnly) return;
    if (!tag.trim() || tags.includes(tag)) return;
    onChange([...tags, tag]);
    setInput("");
    setOpen(false);
  };

  const removeTag = (tag: string) => {
    if (readOnly) return;
    onChange(tags.filter((t) => t !== tag));
  };

  return (
    <div className="space-y-2">
      <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Tags</p>
      <div className="flex flex-wrap items-center gap-2">
        {tags.map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700 dark:bg-white/5 dark:text-slate-100"
          >
            {tag}
            {!readOnly && (
              <button onClick={() => removeTag(tag)} className="text-slate-400 hover:text-red-500">
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </span>
        ))}
        {!readOnly && (
          <div className="relative">
            <div className="flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-500 dark:bg-white/5 dark:text-slate-300">
              <Plus className="h-3.5 w-3.5" />
              <input
                value={input}
                onChange={(e) => {
                  setInput(e.target.value);
                  setOpen(true);
                }}
                onFocus={() => setOpen(true)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addTag(input.trim());
                  }
                }}
                placeholder="Add tag"
                className="border-0 focus:ring-0 bg-transparent outline-none placeholder:text-slate-400 dark:placeholder:text-slate-500"
              />
            </div>
            {open && filtered.length > 0 && (
              <div className="absolute z-10 mt-2 w-48 rounded-xl bg-slate-50 py-1 shadow-lg dark:bg-[#111827]">
                {filtered.map((s) => (
                  <button
                    key={s}
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => addTag(s)}
                    className="block w-full px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-white/5"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
