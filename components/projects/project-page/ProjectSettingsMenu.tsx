import { useState } from "react";
import { MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils/cn";

type Props = {
  isManager: boolean;
  onRename: () => void;
  onManageMembers: () => void;
  onArchive: () => void;
  onDelete: () => void;
};

export function ProjectSettingsMenu({ isManager, onRename, onManageMembers, onArchive, onDelete }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((p) => !p)}
        className="rounded-xl border border-slate-200 bg-white p-2.5 text-slate-600 shadow-sm transition hover:border-primary/30 hover:text-primary dark:border-white/10 dark:bg-[#0f172a] dark:text-slate-300"
      >
        <MoreHorizontal className="h-4 w-4" />
      </button>
      {open ? (
        <div className="absolute right-0 mt-2 w-52 rounded-xl border border-slate-200 bg-white p-1.5 text-sm shadow-xl dark:border-white/10 dark:bg-[#0f172a]">
          <MenuItem label="Rename" onClick={() => { onRename(); setOpen(false); }} />
          <MenuItem label="Manage members" onClick={() => { onManageMembers(); setOpen(false); }} />
          <MenuItem label="Archive project" onClick={() => { onArchive(); setOpen(false); }} />
          {isManager ? (
            <MenuItem label="Delete project" danger onClick={() => { onDelete(); setOpen(false); }} />
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

function MenuItem({ label, danger, onClick }: { label: string; danger?: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex w-full items-center rounded-lg px-3 py-2 text-left font-medium text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-white/10",
        danger && "text-rose-500 dark:text-rose-400"
      )}
    >
      {label}
    </button>
  );
}

