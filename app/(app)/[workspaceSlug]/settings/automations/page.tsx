"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { SettingsLayout } from "@/components/settings/SettingsLayout";
import { AutomationsHeader } from "@/components/settings/automations/AutomationsHeader";
import { TemplatesRow, AutomationTemplateKey } from "@/components/settings/automations/TemplatesRow";
import { AutomationsList } from "@/components/settings/automations/AutomationsList";
import { AutomationsSkeleton } from "@/components/settings/automations/AutomationsSkeleton";
import { CreateAutomationModal } from "@/components/settings/automations/CreateAutomationModal";
import type { Automation } from "@/components/settings/automations/AutomationRow";
import { Search, Filter, ShieldAlert } from "lucide-react";
import { Select } from "@/components/ui/Select";

type Project = { id: string; name: string };
type Role = { id: string; name: string };

export default function SettingsAutomationsPage() {
  const { workspaceSlug } = useParams<{ workspaceSlug: string }>();
  
  const [automations, setAutomations] = useState<Automation[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "enabled" | "disabled">("all");
  
  const [loading, setLoading] = useState(true);
  const [workspaceId, setWorkspaceId] = useState("");
  const [hasPermission, setHasPermission] = useState(true);

  const [openModal, setOpenModal] = useState(false);
  const [templatePrefill, setTemplatePrefill] = useState<AutomationTemplateKey | null>(null);
  const [editingAutomation, setEditingAutomation] = useState<Automation | null>(null);

  useEffect(() => {
    async function init() {
      try {
        // 1. Get workspace ID
        const wsRes = await fetch(`/api/workspaces/${workspaceSlug}`);
        if (!wsRes.ok) return;
        const wsData = await wsRes.json();
        const wsId = wsData.id;
        setWorkspaceId(wsId);

        // 2. Check permissions (Settings Profile / Admin required)
        const permsRes = await fetch(`/api/workspaces/${workspaceSlug}/permissions`);
        if (permsRes.ok) {
          const perms = await permsRes.json();
          // We map automations to settings.profile or settings.workspace basically
          const canManage = perms.permissions?.includes("settings.profile") ?? false;
          setHasPermission(canManage);
          if (!canManage) {
            setLoading(false);
            return;
          }
        }

        // 3. Fetch Automations
        const autoRes = await fetch(`/api/workspaces/${wsId}/automations?workspaceSlug=${workspaceSlug}`);
        if (autoRes.ok) {
          const data = await autoRes.json();
          setAutomations(data);
        }

        // 4. Fetch Projects for the dropdown
        const projectsRes = await fetch(`/api/projects?workspaceSlug=${workspaceSlug}`);
        if (projectsRes.ok) {
          const data = await projectsRes.json();
          setProjects(data.map((p: any) => ({ id: p.id, name: p.name })));
        }

        // 5. Fetch Workspace Roles for the recipient dropdown
        const rolesRes = await fetch(`/api/workspaces/${workspaceSlug}/roles`);
        if (rolesRes.ok) {
          const data = await rolesRes.json();
          setRoles(data.map((r: any) => ({ id: r.id, name: r.name })));
        }
      } catch {
        // silently fail and show empty lists
      } finally {
        setLoading(false);
      }
    }
    init();
  }, [workspaceSlug]);

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    return automations.filter((a) => {
      // Create a display string just for searching
      const triggerStr = JSON.stringify(a.trigger).toLowerCase();
      const actionStr = JSON.stringify(a.action).toLowerCase();
      const matchesQuery = !q || a.name.toLowerCase().includes(q) || triggerStr.includes(q) || actionStr.includes(q);
        
      const matchesFilter =
        statusFilter === "all" ||
        (statusFilter === "enabled" && a.enabled) ||
        (statusFilter === "disabled" && !a.enabled);
      return matchesQuery && matchesFilter;
    });
  }, [automations, query, statusFilter]);

  const handleSave = async (data: { name: string; trigger: any; action: any }) => {
    if (editingAutomation) {
      // Update
      const res = await fetch(`/api/workspaces/${workspaceId}/automations/${editingAutomation.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, workspaceSlug }),
      });
      if (res.ok) {
        const updated = await res.json();
        setAutomations((prev) => prev.map((a) => (a.id === updated.id ? updated : a)));
      }
    } else {
      // Create
      const res = await fetch(`/api/workspaces/${workspaceId}/automations`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, workspaceSlug, enabled: true }),
      });
      if (res.ok) {
        const created = await res.json();
        setAutomations((prev) => [created, ...prev]);
      }
    }
  };

  const handleToggle = async (id: string, value: boolean) => {
    // Optimistic UI
    setAutomations((prev) => prev.map((a) => (a.id === id ? { ...a, enabled: value } : a)));
    
    // Background async update
    await fetch(`/api/workspaces/${workspaceId}/automations/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ enabled: value, workspaceSlug }),
    });
  };

  const handleDuplicate = async (id: string) => {
    const source = automations.find((a) => a.id === id);
    if (!source) return;
    
    const res = await fetch(`/api/workspaces/${workspaceId}/automations`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: `${source.name} Copy`,
        trigger: source.trigger,
        action: source.action,
        enabled: source.enabled,
        workspaceSlug,
      }),
    });
    
    if (res.ok) {
      const created = await res.json();
      setAutomations((prev) => [created, ...prev]);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this automation?")) return;
    
    setAutomations((prev) => prev.filter((a) => a.id !== id));
    await fetch(`/api/workspaces/${workspaceId}/automations/${id}?workspaceSlug=${workspaceSlug}`, {
      method: "DELETE",
    });
  };

  if (loading) {
    return (
      <main className="min-h-screen px-4 py-8 text-slate-900 dark:text-slate-100 sm:px-6 lg:px-8">
        <SettingsLayout>
          <div className="flex flex-col gap-6">
             <AutomationsHeader onCreate={() => {}} />
             <AutomationsSkeleton />
          </div>
        </SettingsLayout>
      </main>
    );
  }

  if (!hasPermission) {
    return (
      <main className="min-h-screen px-4 py-8 text-slate-900 dark:text-slate-100 sm:px-6 lg:px-8">
        <SettingsLayout>
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-red-500/10">
              <ShieldAlert className="h-8 w-8 text-red-500" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Access Denied</h2>
            <p className="mt-2 max-w-sm text-sm text-slate-500 dark:text-slate-400">
              You don&apos;t have permission to manage automations. Contact your workspace administrator to request access.
            </p>
          </div>
        </SettingsLayout>
      </main>
    );
  }

  return (
    <main className="min-h-screen px-4 py-8 text-slate-900 dark:text-slate-100 sm:px-6 lg:px-8">
      <SettingsLayout>
        <div className="flex flex-col gap-6">
          <AutomationsHeader
            onCreate={() => {
              setEditingAutomation(null);
              setTemplatePrefill(null);
              setOpenModal(true);
            }}
          />

          <TemplatesRow
            onUse={(key) => {
              setEditingAutomation(null);
              setTemplatePrefill(key);
              setOpenModal(true);
            }}
          />

          <div className="rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-[#0f172a]">
            <div className="flex flex-col gap-3 border-b border-slate-200 p-4 sm:flex-row sm:items-center sm:justify-between dark:border-slate-800">
              <div className="relative w-full sm:w-80">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search automations..."
                  className="w-full rounded-xl border border-slate-200 bg-white pl-10 pr-3 py-2.5 text-sm text-slate-900 shadow-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-slate-700 dark:bg-[#0f172a] dark:text-slate-100"
                />
              </div>
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-slate-400" />
                <Select
                  value={statusFilter}
                  onChange={(val) => setStatusFilter(val as any)}
                  options={[
                    { value: "all", label: "All" },
                    { value: "enabled", label: "Enabled" },
                    { value: "disabled", label: "Disabled" },
                  ]}
                  size="sm"
                  portal={false}
                  className="w-36"
                />
              </div>
            </div>

            <AutomationsList
              automations={filtered}
              onToggle={handleToggle}
              onEdit={(id) => {
                const auto = automations.find((a) => a.id === id);
                if (auto) {
                  setEditingAutomation(auto);
                  setTemplatePrefill(null);
                  setOpenModal(true);
                }
              }}
              onDuplicate={handleDuplicate}
              onDelete={handleDelete}
            />
          </div>
        </div>
      </SettingsLayout>

      <CreateAutomationModal
        open={openModal}
        projects={projects}
        roles={roles}
        templatesPrefill={templatePrefill}
        initial={editingAutomation}
        onClose={() => setOpenModal(false)}
        onSave={handleSave}
      />
    </main>
  );
}
