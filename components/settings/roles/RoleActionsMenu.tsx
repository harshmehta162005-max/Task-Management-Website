"use client";

import { MoreVertical, Copy, Pencil, Trash } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils/cn";

type Props = {
  isSystem: boolean;
  onEdit: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
};

export function RoleActionsMenu({ isSystem, onEdit, onDuplicate, onDelete }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-white/5"
      >
        <MoreVertical className="h-4 w-4" />
      </button>
      {open && (
        <div className="absolute right-0 z-10 mt-2 w-40 rounded-xl border border-slate-200 bg-white py-1 shadow-lg dark:border-slate-700 dark:bg-[#0f172a]">
          <button
            onClick={() => {
              onEdit();
              setOpen(false);
            }}
            className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-white/5"
          >
            <Pencil className="h-4 w-4" /> Edit
          </button>
          <button
            onClick={() => {
              onDuplicate();
              setOpen(false);
            }}
            className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-white/5"
          >
            <Copy className="h-4 w-4" /> Duplicate
          </button>
          <button
            disabled={isSystem}
            onClick={() => {
              if (isSystem) return;
              onDelete();
              setOpen(false);
            }}
            className={cn(
              "flex w-full items-center gap-2 px-3 py-2 text-left text-sm hover:bg-red-50 dark:hover:bg-red-500/10",
              isSystem ? "cursor-not-allowed text-slate-400" : "text-red-500"
            )}
          >
            <Trash className="h-4 w-4" /> Delete
          </button>
        </div>
      )}
    </div>
  );
}
