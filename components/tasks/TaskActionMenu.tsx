"use client";

import { useState } from "react";
import { MoreVertical, Copy, Layers, FolderPlus, Trash } from "lucide-react";
import { cn } from "@/lib/utils/cn";

type Props = {
  onCopy?: () => void;
  onDuplicate?: () => void;
  onMove?: () => void;
  onDelete?: () => void;
  isManager?: boolean;
};

export function TaskActionMenu({ onCopy, onDuplicate, onMove, onDelete, isManager = true }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-white/5"
      >
        <MoreVertical className="h-5 w-5" />
      </button>
      {open && (
        <div className="absolute right-0 z-10 mt-2 w-48 rounded-xl border border-slate-200 bg-white py-1 shadow-lg dark:border-slate-700 dark:bg-[#0f172a]">
          <MenuItem icon={<Copy className="h-4 w-4" />} label="Copy link" onClick={onCopy} />
          <MenuItem icon={<FolderPlus className="h-4 w-4" />} label="Move to project" onClick={onMove} />
          <MenuItem icon={<Layers className="h-4 w-4" />} label="Duplicate" onClick={onDuplicate} />
          <MenuItem
            icon={<Trash className="h-4 w-4" />}
            label="Delete"
            disabled={!isManager}
            danger
            onClick={onDelete}
          />
        </div>
      )}
    </div>
  );
}

function MenuItem({
  icon,
  label,
  onClick,
  disabled,
  danger,
}: {
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
  disabled?: boolean;
  danger?: boolean;
}) {
  return (
    <button
      onClick={() => {
        if (disabled) return;
        onClick?.();
      }}
      className={cn(
        "flex w-full items-center gap-2 px-3 py-2 text-left text-sm transition hover:bg-slate-50 dark:hover:bg-white/5",
        danger ? "text-red-500" : "text-slate-700 dark:text-slate-200",
        disabled && "cursor-not-allowed opacity-50"
      )}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}
