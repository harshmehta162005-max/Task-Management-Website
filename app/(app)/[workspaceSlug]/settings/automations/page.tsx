"use client";

import { useMemo, useState } from "react";
import { SettingsLayout } from "@/components/settings/SettingsLayout";
import { AutomationsHeader } from "@/components/settings/automations/AutomationsHeader";
import { TemplatesRow, AutomationTemplateKey } from "@/components/settings/automations/TemplatesRow";
import { AutomationsList } from "@/components/settings/automations/AutomationsList";
import { AutomationsSkeleton } from "@/components/settings/automations/AutomationsSkeleton";
import { CreateAutomationModal } from "@/components/settings/automations/CreateAutomationModal";
import type { Automation } from "@/components/settings/automations/AutomationRow";
import { Search, Filter } from "lucide-react";
import { Select } from "@/components/ui/Select";

const INITIAL_AUTOMATIONS: Automation[] = [
  {
    id: "a1",
    name: "Blocked task alert",
    trigger: "When status changes to Blocked",
    action: "Notify managers + Post to activity",
    scope: "Workspace",
    enabled: true,
  },
  {
    id: "a2",
    name: "Due soon reminder",
    trigger: "When due date is within 2 days",
    action: "Notify in-app + Send email to assignee",
    scope: "Project",
    enabled: false,
  },
];

export default function SettingsAutomationsPage() {
  const [automations, setAutomations] = useState<Automation[]>(INITIAL_AUTOMATIONS);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "enabled" | "disabled">("all");
  const [openModal, setOpenModal] = useState(false);
  const [templatePrefill, setTemplatePrefill] = useState<AutomationTemplateKey | null>(null);
  const [loading] = useState(false);

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    return automations.filter((a) => {
      const matchesQuery =
        !q ||
        a.name.toLowerCase().includes(q) ||
        a.trigger.toLowerCase().includes(q) ||
        a.action.toLowerCase().includes(q);
      const matchesFilter =
        statusFilter === "all" ||
        (statusFilter === "enabled" && a.enabled) ||
        (statusFilter === "disabled" && !a.enabled);
      return matchesQuery && matchesFilter;
    });
  }, [automations, query, statusFilter]);

  const handleCreate = (automation: Omit<Automation, "id" | "enabled">) => {
    setAutomations((prev) => [
      { ...automation, id: crypto.randomUUID(), enabled: true },
      ...prev,
    ]);
  };

  const handleToggle = (id: string, value: boolean) => {
    setAutomations((prev) => prev.map((a) => (a.id === id ? { ...a, enabled: value } : a)));
  };

  const handleDuplicate = (id: string) => {
    const source = automations.find((a) => a.id === id);
    if (!source) return;
    setAutomations((prev) => [
      { ...source, id: crypto.randomUUID(), name: `${source.name} Copy`, enabled: source.enabled },
      ...prev,
    ]);
  };

  const handleDelete = (id: string) => {
    setAutomations((prev) => prev.filter((a) => a.id !== id));
  };

  return (
    <main className="min-h-screen px-4 py-8 text-slate-900 dark:text-slate-100 sm:px-6 lg:px-8">
      <SettingsLayout>
        <div className="flex flex-col gap-6">
          <AutomationsHeader
            onCreate={() => {
              setTemplatePrefill(null);
              setOpenModal(true);
            }}
          />

          <TemplatesRow
            onUse={(key) => {
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
                />
              </div>
            </div>

            {loading ? (
              <AutomationsSkeleton />
            ) : (
              <AutomationsList
                automations={filtered}
                onToggle={handleToggle}
                onEdit={(id) => {
                  // For UI-only, reuse create modal prefilled not implemented; open blank
                  setTemplatePrefill(null);
                  setOpenModal(true);
                }}
                onDuplicate={handleDuplicate}
                onDelete={handleDelete}
              />
            )}
          </div>
        </div>
      </SettingsLayout>

      <CreateAutomationModal
        open={openModal}
        templatesPrefill={templatePrefill}
        onClose={() => setOpenModal(false)}
        onCreate={(a) => handleCreate(a)}
      />
    </main>
  );
}
