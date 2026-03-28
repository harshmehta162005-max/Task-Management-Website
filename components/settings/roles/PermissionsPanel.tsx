"use client";

import { useMemo } from "react";
import { PermissionGroup, RoleItem } from "./rolesData";
import { PermissionToggleRow } from "./PermissionToggleRow";
import { ShieldAlert } from "lucide-react";

type Props = {
  role: RoleItem;
  permissionGroups: PermissionGroup[];
  state: Record<string, boolean>;
  originalPerms: string[];
  saving: boolean;
  onToggle: (key: string, value: boolean) => void;
  onSave: () => void;
};

export function PermissionsPanel({
  role,
  permissionGroups,
  state,
  originalPerms,
  saving,
  onToggle,
  onSave,
}: Props) {
  // Owner role itself can't be edited (implicit full access).
  const disabled = role.name === "Owner";

  // Dirty = current toggle state differs from the original snapshot.
  const dirty = useMemo(() => {
    const original = [...originalPerms].sort();
    const current = Object.keys(state)
      .filter((k) => state[k])
      .sort();
    return JSON.stringify(original) !== JSON.stringify(current);
  }, [originalPerms, state]);

  return (
    <div className="min-w-0 space-y-6 rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-[#0f172a]">
      {/* ── Header ── */}
      <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4 dark:border-slate-800">
        <div>
          <p className="text-sm text-slate-500 dark:text-slate-400">Editing role</p>
          <h3 className="text-xl font-semibold text-slate-900 dark:text-white">{role.name}</h3>
        </div>
        {dirty && !disabled && (
          <button
            onClick={onSave}
            disabled={saving}
            className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-primary/90 disabled:opacity-60"
          >
            {saving ? "Saving…" : "Save changes"}
          </button>
        )}
      </div>

      {/* ── Owner lock banner ── */}
      {role.name === "Owner" && (
        <div className="flex items-start gap-3 border-b border-amber-200/40 bg-amber-50 px-6 py-4 dark:border-amber-500/30 dark:bg-amber-500/10">
          <ShieldAlert className="mt-0.5 h-4 w-4 text-amber-600 dark:text-amber-400" />
          <div>
            <p className="text-sm font-semibold text-amber-700 dark:text-amber-300">
              Owner has full access.
            </p>
            <p className="text-xs text-amber-700/80 dark:text-amber-300/80">
              Owner permissions cannot be restricted.
            </p>
          </div>
        </div>
      )}

      {/* ── Permission toggles ── */}
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
