import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils/cn";

export type Workspace = {
  name: string;
  slug: string;
  role: "Admin" | "Manager" | "Member";
  initials: string;
  color: string;
};

type Props = {
  workspace: Workspace;
  onSelect: (ws: Workspace) => void;
};

export function WorkspaceCard({ workspace, onSelect }: Props) {
  const roleVariant =
    workspace.role === "Admin"
      ? "bg-primary/10 text-primary"
      : workspace.role === "Manager"
        ? "bg-slate-800 text-slate-400"
        : "bg-slate-800 text-slate-400";

  return (
    <button
      type="button"
      onClick={() => onSelect(workspace)}
      className="group relative flex items-center gap-4 rounded-2xl border border-white/10 bg-slate-900/40 p-5 text-left transition-all hover:-translate-y-1 hover:border-primary/50 hover:bg-slate-900/60"
    >
      <div
        className={cn(
          "flex h-12 w-12 items-center justify-center rounded-xl border text-lg font-bold",
          workspace.color
        )}
      >
        {workspace.initials}
      </div>
      <div className="min-w-0 flex-1">
        <h3 className="truncate font-semibold text-slate-100">{workspace.name}</h3>
        <p className="truncate text-sm text-slate-500">{workspace.slug}</p>
      </div>
      <div className="flex items-center gap-3">
        <span className={cn("rounded px-2 py-1 text-[10px] font-bold uppercase tracking-wider", roleVariant)}>
          {workspace.role}
        </span>
        <ChevronRight className="h-5 w-5 text-slate-600 transition-colors group-hover:text-primary" />
      </div>
    </button>
  );
}
