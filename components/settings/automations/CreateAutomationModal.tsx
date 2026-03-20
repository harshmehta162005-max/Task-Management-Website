"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { Automation } from "./AutomationRow";
import { AutomationTemplateKey } from "./TemplatesRow";
import { Select } from "@/components/ui/Select";

type Props = {
  open: boolean;
  templatesPrefill?: AutomationTemplateKey | null;
  onClose: () => void;
  onCreate: (automation: Omit<Automation, "id" | "enabled">) => void;
};

const projects = [
  { id: "p1", name: "Mobile Redesign" },
  { id: "p2", name: "API Documentation" },
  { id: "p3", name: "Growth Experiments" },
];

export function CreateAutomationModal({ open, templatesPrefill, onClose, onCreate }: Props) {
  const [name, setName] = useState("");
  const [scope, setScope] = useState<"Workspace" | "Project">("Workspace");
  const [projectId, setProjectId] = useState(projects[0].id);
  const [triggerType, setTriggerType] = useState("status");
  const [statusTo, setStatusTo] = useState("Blocked");
  const [dueDays, setDueDays] = useState(2);
  const [staleDays, setStaleDays] = useState(5);
  const [actions, setActions] = useState({
    inApp: true,
    email: true,
    activity: false,
  });
  const [recipient, setRecipient] = useState("Project managers");

  useEffect(() => {
    if (!open) return;
    // Prefill from template
    if (templatesPrefill === "blocked") {
      setName("Blocked task alert");
      setTriggerType("status");
      setStatusTo("Blocked");
      setActions({ inApp: true, email: true, activity: true });
      setRecipient("Project managers");
    } else if (templatesPrefill === "dueSoon") {
      setName("Due soon reminder");
      setTriggerType("due");
      setDueDays(2);
      setActions({ inApp: true, email: true, activity: false });
      setRecipient("Assignee");
    } else if (templatesPrefill === "stale") {
      setName("Stale task nudge");
      setTriggerType("stale");
      setStaleDays(5);
      setActions({ inApp: true, email: false, activity: true });
      setRecipient("Assignee");
    } else if (templatesPrefill === "weekly") {
      setName("Weekly project summary");
      setTriggerType("weekly");
      setActions({ inApp: false, email: true, activity: true });
      setRecipient("Workspace admins");
    } else {
      setName("");
      setTriggerType("status");
      setActions({ inApp: true, email: true, activity: false });
    }
  }, [open, templatesPrefill]);

  if (!open) return null;

  const buildTriggerSummary = () => {
    if (triggerType === "status") return `When status changes to ${statusTo}`;
    if (triggerType === "due") return `When due date is within ${dueDays} days`;
    if (triggerType === "stale") return `No updates for ${staleDays} days`;
    if (triggerType === "weekly") return "Every Friday at 9:00 AM";
    return "When event occurs";
  };

  const buildActionSummary = () => {
    const parts = [];
    if (actions.inApp) parts.push("Notify in-app");
    if (actions.email) parts.push("Send email");
    if (actions.activity) parts.push("Post to activity");
    return parts.join(" + ") || "No action selected";
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 backdrop-blur-sm">
      <div className="w-full max-w-2xl rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-[#0f172a]">
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4 dark:border-slate-800">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Create automation</h3>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-slate-500 hover:bg-slate-100 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-white/5"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="grid gap-5 px-5 py-5">
          <Field label="Name">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-slate-700 dark:bg-[#111827] dark:text-slate-100"
              placeholder="e.g. Blocked alert for managers"
            />
          </Field>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Scope">
              <Select
                value={scope}
                onChange={(v) => setScope(v as "Workspace" | "Project")}
                options={[
                  { value: "Workspace", label: "Workspace" },
                  { value: "Project", label: "Project" },
                ]}
                portal={false}
              />
            </Field>
            {scope === "Project" && (
              <Field label="Project">
                <Select
                  value={projectId}
                  onChange={setProjectId}
                  options={projects.map((p) => ({ value: p.id, label: p.name }))}
                  portal={false}
                />
              </Field>
            )}
          </div>

          <Field label="Trigger">
            <div className="grid gap-3 sm:grid-cols-2">
              <Select
                value={triggerType}
                onChange={setTriggerType}
                options={[
                  { value: "status", label: "Status changes" },
                  { value: "due", label: "Due date approaching" },
                  { value: "stale", label: "No update in X days" },
                  { value: "weekly", label: "Weekly schedule" },
                ]}
                portal={false}
              />
              {triggerType === "status" && (
                <input
                  value={statusTo}
                  onChange={(e) => setStatusTo(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-slate-700 dark:bg-[#111827] dark:text-slate-100"
                  placeholder="e.g. Blocked"
                />
              )}
              {triggerType === "due" && (
                <input
                  type="number"
                  min={1}
                  value={dueDays}
                  onChange={(e) => setDueDays(Number(e.target.value))}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-slate-700 dark:bg-[#111827] dark:text-slate-100"
                  placeholder="Days before due"
                />
              )}
              {triggerType === "stale" && (
                <input
                  type="number"
                  min={1}
                  value={staleDays}
                  onChange={(e) => setStaleDays(Number(e.target.value))}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-slate-700 dark:bg-[#111827] dark:text-slate-100"
                  placeholder="Days since last update"
                />
              )}
            </div>
          </Field>

          <Field label="Actions">
            <div className="grid gap-2">
              <CheckboxRow
                label="Send in-app notification"
                checked={actions.inApp}
                onChange={(v) => setActions((a) => ({ ...a, inApp: v }))}
              />
              <CheckboxRow
                label="Send email"
                checked={actions.email}
                onChange={(v) => setActions((a) => ({ ...a, email: v }))}
              />
              <CheckboxRow
                label="Post to activity feed"
                checked={actions.activity}
                onChange={(v) => setActions((a) => ({ ...a, activity: v }))}
              />
            </div>
          </Field>

          <Field label="Recipients">
            <Select
              value={recipient}
              onChange={setRecipient}
              options={[
                { value: "Assignee", label: "Assignee" },
                { value: "Project managers", label: "Project managers" },
                { value: "Workspace admins", label: "Workspace admins" },
              ]}
              portal={false}
            />
          </Field>
        </div>

        <div className="flex items-center justify-end gap-2 border-t border-slate-200 px-5 py-4 dark:border-slate-800">
          <button
            onClick={onClose}
            className="rounded-xl px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-white/5"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onCreate({
                name: name.trim() || "New automation",
                scope,
                trigger: buildTriggerSummary(),
                action: `${buildActionSummary()} • ${recipient}`,
              });
              onClose();
            }}
            className="rounded-xl bg-primary px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-primary/90"
          >
            Create automation
          </button>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <label className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">{label}</label>
      {children}
    </div>
  );
}

function CheckboxRow({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-900 shadow-sm transition hover:border-primary/40 dark:border-slate-700 dark:bg-[#0d1422] dark:text-slate-100">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary dark:border-slate-600"
      />
      {label}
    </label>
  );
}
