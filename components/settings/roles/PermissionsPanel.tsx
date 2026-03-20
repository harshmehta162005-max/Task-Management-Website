"use client";

import { useMemo, useState } from "react";
import { PermissionGroup, RoleItem } from "./rolesData";
import { PermissionToggleRow } from "./PermissionToggleRow";
import { ShieldAlert } from "lucide-react";
import { cn } from "@/lib/utils/cn";

type Props = {
  role: RoleItem;
  permissionGroups: PermissionGroup[];
  state: Record<string, boolean>;
  onToggle: (key: string, value: boolean) => void;
  onSave: () => void;
};

export function PermissionsPanel({ role, permissionGroups, state, onToggle, onSave }: Props) {
  const [saving, setSaving] = useState(false);
  const disabled = role.isSystem;

  const dirty = useMemo(() => {
    // In UI-only context, consider dirty when user toggles; here we infer by presence of temp saving flag.
    return true;
  }, []);

  const handleSave = () => {
    if (disabled) return;
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      onSave();
    }, 500);
  };

  return (
    <div className="space-y-6 rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-[#0f172a]">
      <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4 dark:border-slate-800">
        <div>
          <p className="text-sm text-slate-500 dark:text-slate-400">Editing role</p>
          <h3 className="text-xl font-semibold text-slate-900 dark:text-white">{role.name}</h3>
        </div>
        <button
          onClick={handleSave}
          disabled={disabled || saving}
          className={cn(
            "rounded-xl px-4 py-2 text-sm font-semibold text-white shadow-sm transition",
            disabled
              ? "cursor-not-allowed bg-slate-300 text-slate-600 dark:bg-slate-700 dark:text-slate-400"
              : "bg-primary hover:bg-primary/90"
          )}
        >
          {saving ? "Saving…" : "Save changes"}
        </button>
      </div>

      {role.isSystem && (
        <div className="flex items-start gap-3 border-b border-amber-200/40 bg-amber-50 px-6 py-4 dark:border-amber-500/30 dark:bg-amber-500/10">
          <ShieldAlert className="h-4 w-4 text-amber-600 dark:text-amber-400 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-amber-700 dark:text-amber-300">System role permissions are locked.</p>
            <p className="text-xs text-amber-700/80 dark:text-amber-300/80">
              Default roles are secured; duplicate to customize.
            </p>
          </div>
        </div>
      )}

      <div className="space-y-10 px-6 pb-6 pt-2">
        {permissionGroups.map((group) => (
          <div key={group.key} className="space-y-3">
            <h4 className="text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
              {group.label}
            </h4>
            <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
              {group.permissions.map((perm) => (
                <PermissionToggleRow
                  key={perm.key}
                  label={perm.label}
                  description={perm.description}
                  checked={Boolean(state[perm.key])}
                  disabled={disabled}
                  onChange={(val) => onToggle(perm.key, val)}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
