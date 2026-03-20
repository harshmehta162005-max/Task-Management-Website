import { ShieldCheck, Users } from "lucide-react";
import { RoleItem } from "./rolesData";
import { RoleActionsMenu } from "./RoleActionsMenu";
import { cn } from "@/lib/utils/cn";

type Props = {
  role: RoleItem;
  active: boolean;
  isAdmin: boolean;
  onSelect: () => void;
  onEdit: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
};

export function RoleCard({ role, active, isAdmin, onSelect, onEdit, onDuplicate, onDelete }: Props) {
  return (
    <div
      onClick={onSelect}
      className={cn(
        "group relative cursor-pointer rounded-2xl border p-4 shadow-sm transition",
        active
          ? "border-primary/60 bg-primary/5 shadow-primary/10"
          : "border-slate-200 bg-white hover:border-primary/30 dark:border-slate-800 dark:bg-[#0f172a] dark:hover:border-primary/30"
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h4 className="text-base font-semibold text-slate-900 dark:text-white">{role.name}</h4>
            {role.isSystem && (
              <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-semibold uppercase text-slate-500 dark:bg-white/5 dark:text-slate-300">
                <ShieldCheck className="h-3 w-3" /> System
              </span>
            )}
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2">{role.description}</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600 dark:bg-white/5 dark:text-slate-200">
            <Users className="h-3.5 w-3.5" /> {role.memberCount} members
          </span>
          {isAdmin && (
            <RoleActionsMenu
              isSystem={role.isSystem}
              onEdit={onEdit}
              onDuplicate={onDuplicate}
              onDelete={onDelete}
            />
          )}
        </div>
      </div>
    </div>
  );
}
