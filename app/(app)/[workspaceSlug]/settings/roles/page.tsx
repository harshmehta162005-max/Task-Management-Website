"use client";

import { useMemo, useState } from "react";
import { SettingsLayout } from "@/components/settings/SettingsLayout";
import { RolesList } from "@/components/settings/roles/RolesList";
import { PermissionsPanel } from "@/components/settings/roles/PermissionsPanel";
import {
  DEFAULT_ROLES,
  PERMISSION_GROUPS,
  RoleItem,
  RolePermissionState,
  defaultPermStateForRole,
} from "@/components/settings/roles/rolesData";
import { CreateRoleModal } from "@/components/settings/roles/CreateRoleModal";
import { EditRoleModal } from "@/components/settings/roles/EditRoleModal";
import { DeleteRoleDialog } from "@/components/settings/roles/DeleteRoleDialog";

export default function SettingsRolesPage() {
  const isAdmin = true;
  const [roles, setRoles] = useState<RoleItem[]>(DEFAULT_ROLES);
  const [selectedId, setSelectedId] = useState<string>(DEFAULT_ROLES[0].id);
  const [permState, setPermState] = useState<Record<string, RolePermissionState>>(() =>
    Object.fromEntries(DEFAULT_ROLES.map((r) => [r.id, defaultPermStateForRole(r)]))
  );
  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const selectedRole = useMemo(() => roles.find((r) => r.id === selectedId)!, [roles, selectedId]);
  const selectedPerms = permState[selectedId] ?? {};

  const handleToggle = (key: string, value: boolean) => {
    setPermState((prev) => ({
      ...prev,
      [selectedId]: { ...(prev[selectedId] ?? {}), [key]: value },
    }));
  };

  const handleSave = () => {
    // UI only; could show toast
  };

  const createRole = (data: { name: string; description: string; cloneFrom?: string }) => {
    const id = `r-${crypto.randomUUID()}`;
    const cloneSource = data.cloneFrom ? permState[data.cloneFrom] : undefined;
    setRoles((prev) => [...prev, { id, name: data.name, description: data.description, isSystem: false, memberCount: 0 }]);
    setPermState((prev) => ({
      ...prev,
      [id]: cloneSource ?? defaultPermStateForRole({ id, name: data.name, description: data.description, isSystem: false, memberCount: 0 }),
    }));
    setSelectedId(id);
  };

  const editRole = (update: { id: string; name: string; description: string }) => {
    setRoles((prev) => prev.map((r) => (r.id === update.id ? { ...r, name: update.name, description: update.description } : r)));
  };

  const duplicateRole = (id: string) => {
    const source = roles.find((r) => r.id === id);
    if (!source) return;
    const newId = `r-${crypto.randomUUID()}`;
    setRoles((prev) => [
      ...prev,
      {
        ...source,
        id: newId,
        name: `${source.name} Copy`,
        isSystem: false,
        memberCount: 0,
      },
    ]);
    setPermState((prev) => ({
      ...prev,
      [newId]: { ...(prev[id] ?? defaultPermStateForRole(source)) },
    }));
    setSelectedId(newId);
  };

  const deleteRole = (id: string) => {
    setRoles((prev) => prev.filter((r) => r.id !== id));
    setSelectedId((prevId) => (prevId === id ? DEFAULT_ROLES[0].id : prevId));
  };

  return (
    <main className="min-h-screen px-4 py-8 text-slate-900 dark:text-slate-100 sm:px-6 lg:px-8">
      <SettingsLayout>
        <div className="flex flex-col gap-6">
          <header className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">Roles &amp; Permissions</h1>
              <p className="text-sm text-slate-500 dark:text-slate-400">Control what members can do in this workspace.</p>
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
                selectedId={selectedId}
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

            <PermissionsPanel
              role={selectedRole}
              permissionGroups={PERMISSION_GROUPS}
              state={selectedPerms}
              onToggle={handleToggle}
              onSave={handleSave}
            />
          </div>
        </div>
      </SettingsLayout>

      <CreateRoleModal open={createOpen} roles={roles} onClose={() => setCreateOpen(false)} onCreate={createRole} />
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
        onConfirm={() => {
          deleteRole(selectedId);
        }}
      />
    </main>
  );
}
