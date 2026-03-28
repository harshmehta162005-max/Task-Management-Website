"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { SettingsLayout } from "@/components/settings/SettingsLayout";
import { RolesList } from "@/components/settings/roles/RolesList";
import { PermissionsPanel } from "@/components/settings/roles/PermissionsPanel";
import { PERMISSION_GROUPS } from "@/components/settings/roles/rolesData";
import { CreateRoleModal } from "@/components/settings/roles/CreateRoleModal";
import { EditRoleModal } from "@/components/settings/roles/EditRoleModal";
import { DeleteRoleDialog } from "@/components/settings/roles/DeleteRoleDialog";
import { useRoles } from "@/lib/hooks/useRoles";
import { useToast } from "@/components/ui/Toast";

/* ── helpers ────────────────────────────────────────────── */

/** Convert a permissions string[] from the DB to a toggle-state Record. */
function permsToState(perms: string[]): Record<string, boolean> {
  const st: Record<string, boolean> = {};
  perms.forEach((p) => {
    st[p] = true;
  });
  return st;
}

/** Convert a toggle-state Record back to a permissions string[]. */
function stateToPerms(state: Record<string, boolean>): string[] {
  return Object.keys(state).filter((k) => state[k]);
}

/* ── page ───────────────────────────────────────────────── */

export default function SettingsRolesPage() {
  const { workspaceSlug } = useParams<{ workspaceSlug: string }>();
  const isAdmin = true;
  const { showToast } = useToast();

  const { roles, isLoading, mutate } = useRoles(workspaceSlug);

  const [selectedId, setSelectedId] = useState<string | null>(null);

  /* ─── Permission state tracking ─── */
  // toggleState: the current toggle values the user is seeing right now.
  const [toggleState, setToggleState] = useState<Record<string, Record<string, boolean>>>({});
  // originalSnapshot: the permissions as they were when the user opened/saved this role.
  const [originalSnapshot, setOriginalSnapshot] = useState<Record<string, string[]>>({});
  // Is a save in-flight for this role?
  const [savingId, setSavingId] = useState<string | null>(null);

  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  /* ─── Auto-select first role ─── */
  useEffect(() => {
    if (roles.length > 0 && !selectedId) {
      setSelectedId(roles[0].id);
    }
  }, [roles, selectedId]);

  /* ─── Initialize snapshots when roles load / change ─── */
  useEffect(() => {
    roles.forEach((r) => {
      const perms = (r.permissions as string[]) ?? [];
      // Only set snapshot if we haven't already (i.e. first load or new role from mutate)
      setOriginalSnapshot((prev) => {
        if (prev[r.id]) return prev; // already have it
        return { ...prev, [r.id]: perms };
      });
    });
  }, [roles]);

  const selectedRole = useMemo(() => roles.find((r) => r.id === selectedId), [roles, selectedId]);

  /* ─── Current toggle state for selected role ─── */
  const selectedPerms = useMemo(() => {
    if (!selectedId) return {};
    // If user has toggled something, use their state
    if (toggleState[selectedId]) return toggleState[selectedId];
    // Otherwise derive from the role's DB permissions
    if (!selectedRole) return {};
    return permsToState((selectedRole.permissions as string[]) ?? []);
  }, [selectedId, toggleState, selectedRole]);

  /* ─── Original snapshot for dirty comparison ─── */
  const selectedOriginal = useMemo(() => {
    if (!selectedId) return [];
    return originalSnapshot[selectedId] ?? ((selectedRole?.permissions as string[]) ?? []);
  }, [selectedId, originalSnapshot, selectedRole]);

  /* ─── Toggle handler ─── */
  const handleToggle = useCallback(
    (key: string, value: boolean) => {
      if (!selectedId) return;
      setToggleState((prev) => ({
        ...prev,
        [selectedId]: { ...(prev[selectedId] ?? selectedPerms), [key]: value },
      }));
    },
    [selectedId, selectedPerms]
  );

  /* ─── Save with OPTIMISTIC UI ─── */
  const handleSave = useCallback(async () => {
    if (!selectedId) return;

    const newPerms = stateToPerms(selectedPerms);
    const oldPerms = [...selectedOriginal]; // snapshot for rollback
    const oldToggle = { ...selectedPerms }; // current toggle for rollback

    // Step 1 — Optimistic update: stamp new snapshot immediately
    setOriginalSnapshot((prev) => ({ ...prev, [selectedId]: newPerms }));
    // Clear toggle override (UI already shows correct state via snapshot)
    setToggleState((prev) => {
      const next = { ...prev };
      delete next[selectedId];
      return next;
    });

    // Step 2 — Show saving state
    setSavingId(selectedId);

    // Step 3 — Fire API in background
    try {
      const res = await fetch(`/api/workspaces/${workspaceSlug}/roles/${selectedId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ permissions: newPerms }),
      });

      if (!res.ok) {
        throw new Error(`Status ${res.status}`);
      }

      // Step 3 success — toast + keep optimistic state
      showToast("success", "Role permissions updated successfully");

      // Silently mutate SWR cache to sync global state (no refetch visible)
      mutate(
        (current) =>
          current?.map((r) =>
            r.id === selectedId ? { ...r, permissions: newPerms } : r
          ),
        false // revalidate = false → no network refetch
      );
    } catch (e) {
      // Step 4 — Failure: revert to old snapshot
      console.error("Save permissions failed:", e);
      setOriginalSnapshot((prev) => ({ ...prev, [selectedId]: oldPerms }));
      setToggleState((prev) => ({ ...prev, [selectedId]: oldToggle }));
      showToast("error", "Failed to update permissions. Please try again.");
    } finally {
      setSavingId(null);
    }
  }, [selectedId, selectedPerms, selectedOriginal, workspaceSlug, showToast, mutate]);

  /* ─── Create role ─── */
  const createRole = async (data: { name: string; description: string; cloneFrom?: string }) => {
    try {
      const res = await fetch(`/api/workspaces/${workspaceSlug}/roles`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        console.error("Create role failed:", res.status, err);
        showToast("error", "Failed to create role.");
        return;
      }
      showToast("success", `Role "${data.name}" created`);
      mutate();
    } catch (e) {
      console.error(e);
      showToast("error", "Failed to create role.");
    }
  };

  /* ─── Edit role name/description ─── */
  const editRole = async (update: { id: string; name: string; description: string }) => {
    try {
      const res = await fetch(`/api/workspaces/${workspaceSlug}/roles/${update.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: update.name, description: update.description }),
      });
      if (!res.ok) {
        showToast("error", "Failed to update role.");
        return;
      }
      showToast("success", `Role "${update.name}" updated`);
      mutate();
    } catch (e) {
      console.error(e);
      showToast("error", "Failed to update role.");
    }
  };

  /* ─── Duplicate role ─── */
  const duplicateRole = async (id: string) => {
    const source = roles.find((r) => r.id === id);
    if (!source) return;
    try {
      const res = await fetch(`/api/workspaces/${workspaceSlug}/roles`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: `${source.name} Copy`,
          description: source.description || "",
          cloneFrom: id,
        }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        console.error("Duplicate role failed:", res.status, err);
        showToast("error", "Failed to duplicate role.");
        return;
      }
      showToast("success", `Role "${source.name}" duplicated`);
      mutate();
    } catch (e) {
      console.error(e);
      showToast("error", "Failed to duplicate role.");
    }
  };

  /* ─── Delete role ─── */
  const deleteRole = async (id: string) => {
    try {
      const res = await fetch(`/api/workspaces/${workspaceSlug}/roles/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        console.error("Delete role failed:", res.status, err);
        showToast("error", "Failed to delete role.");
        return;
      }
      showToast("success", "Role deleted");
      setSelectedId(null);
      // Clean up state for deleted role
      setToggleState((prev) => {
        const next = { ...prev };
        delete next[id];
        return next;
      });
      setOriginalSnapshot((prev) => {
        const next = { ...prev };
        delete next[id];
        return next;
      });
      mutate();
    } catch (e) {
      console.error(e);
      showToast("error", "Failed to delete role.");
    }
  };

  /* ─── Loading skeleton ─── */
  if (isLoading || !roles.length) {
    return (
      <main className="min-h-screen px-4 py-8 text-slate-900 dark:text-slate-100 sm:px-6 lg:px-8">
        <SettingsLayout>
          <div className="animate-pulse space-y-4">
            <div className="h-8 w-32 rounded bg-slate-200 dark:bg-slate-700" />
            <div className="h-96 rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-[#0f172a]" />
          </div>
        </SettingsLayout>
      </main>
    );
  }

  return (
    <main className="min-h-screen px-4 py-8 text-slate-900 dark:text-slate-100 sm:px-6 lg:px-8">
      <SettingsLayout>
        <div className="flex flex-col gap-6">
          <header className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">
                Roles &amp; Permissions
              </h1>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Control what members can do in this workspace.
              </p>
            </div>
            <button
              onClick={() => setCreateOpen(true)}
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-primary/90"
            >
              Create role
            </button>
          </header>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[360px_1fr]">
            <div className="space-y-3">
              <p className="px-1 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                Available roles
              </p>
              <RolesList
                roles={roles}
                selectedId={selectedId ?? ""}
                isAdmin={isAdmin}
                onSelect={setSelectedId}
                onEdit={(id) => {
                  setSelectedId(id);
                  setEditOpen(true);
                }}
                onDuplicate={duplicateRole}
                onDelete={(id) => {
                  setSelectedId(id);
                  setDeleteOpen(true);
                }}
              />
            </div>

            {selectedRole && (
              <PermissionsPanel
                role={selectedRole}
                permissionGroups={PERMISSION_GROUPS}
                state={selectedPerms}
                originalPerms={selectedOriginal}
                saving={savingId === selectedId}
                onToggle={handleToggle}
                onSave={handleSave}
              />
            )}
          </div>
        </div>
      </SettingsLayout>

      <CreateRoleModal
        open={createOpen}
        roles={roles}
        onClose={() => setCreateOpen(false)}
        onCreate={createRole}
      />
      <EditRoleModal
        open={editOpen}
        role={roles.find((r) => r.id === selectedId)}
        onClose={() => setEditOpen(false)}
        onSave={editRole}
      />
      <DeleteRoleDialog
        open={deleteOpen}
        roleName={roles.find((r) => r.id === selectedId)?.name || ""}
        onClose={() => setDeleteOpen(false)}
        onConfirm={() => selectedId && deleteRole(selectedId)}
      />
    </main>
  );
}
