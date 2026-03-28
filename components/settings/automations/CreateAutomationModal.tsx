"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { Automation } from "./AutomationRow";
import { AutomationTemplateKey } from "./TemplatesRow";
import { Select } from "@/components/ui/Select";

type Project = { id: string; name: string };
type Role = { id: string; name: string };

type Props = {
  open: boolean;
  projects: Project[];
  roles: Role[];
  templatesPrefill?: AutomationTemplateKey | null;
  initial?: Automation | null;
  onClose: () => void;
  onSave: (data: {
    name: string;
    trigger: any;
    action: any;
  }) => void;
};

export function CreateAutomationModal({ open, projects, roles, templatesPrefill, initial, onClose, onSave }: Props) {
  const [name, setName] = useState("");
  const [scope, setScope] = useState<"Workspace" | "Project">("Workspace");
  const [projectId, setProjectId] = useState("");
  const [triggerType, setTriggerType] = useState("status");
  const [statusTo, setStatusTo] = useState("BLOCKED");
  const [dueDays, setDueDays] = useState(2);
  const [staleDays, setStaleDays] = useState(5);
  const [actions, setActions] = useState({
    inApp: true,
    email: true,
    activity: false,
  });
  const [recipient, setRecipient] = useState<{id: string, name: string}>({ id: "Assignee", name: "Assignee" });

  useEffect(() => {
    if (!open) return;

    if (projects.length > 0 && !projectId) {
      setProjectId(projects[0].id);
    }

    if (initial) {
      // Edit mode
      setName(initial.name);
      setScope(initial.trigger.scope);
      if (initial.trigger.projectId) setProjectId(initial.trigger.projectId);
      setTriggerType(initial.trigger.type || "status");
      if (initial.trigger.statusTo) setStatusTo(initial.trigger.statusTo);
      if (initial.trigger.dueDays) setDueDays(initial.trigger.dueDays);
      if (initial.trigger.staleDays) setStaleDays(initial.trigger.staleDays);
      setActions({
        inApp: initial.action.inApp,
        email: initial.action.email,
        activity: initial.action.activity,
      });
      // Fallback if old automation has a string recipient
      if (typeof initial.action.recipient === "string") {
        setRecipient({ id: initial.action.recipient, name: initial.action.recipient });
      } else {
        setRecipient(initial.action.recipient || { id: "Assignee", name: "Assignee" });
      }
    } else if (templatesPrefill === "blocked") {
      setName("Blocked task alert");
      setTriggerType("status");
      setStatusTo("BLOCKED");
      setActions({ inApp: true, email: true, activity: true });
      const firstRole = roles.length > 0 ? roles[0] : { id: "Assignee", name: "Assignee" };
      setRecipient(firstRole);
    } else if (templatesPrefill === "dueSoon") {
      setName("Due soon reminder");
      setTriggerType("due");
      setDueDays(2);
      setActions({ inApp: true, email: true, activity: false });
      setRecipient({ id: "Assignee", name: "Assignee" });
    } else if (templatesPrefill === "stale") {
      setName("Stale task nudge");
      setTriggerType("stale");
      setStaleDays(5);
      setActions({ inApp: true, email: false, activity: true });
      setRecipient({ id: "Assignee", name: "Assignee" });
    } else if (templatesPrefill === "weekly") {
      setName("Weekly project summary");
      setTriggerType("weekly");
      setActions({ inApp: false, email: true, activity: true });
      const firstRole = roles.length > 0 ? roles[0] : { id: "Assignee", name: "Assignee" };
      setRecipient(firstRole);
    } else {
      setName("");
      setTriggerType("status");
      setActions({ inApp: true, email: true, activity: false });
    }
  }, [open, templatesPrefill, initial, projects]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 backdrop-blur-sm">
      <div className="w-full max-w-2xl rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-[#0f172a]">
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4 dark:border-slate-800">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
            {initial ? "Edit automation" : "Create automation"}
          </h3>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-slate-500 hover:bg-slate-100 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-white/5"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="grid gap-5 px-5 py-5 max-h-[70vh] overflow-y-auto">
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
            {scope === "Project" ? (
              projects.length > 0 ? (
                <Field label="Project">
                  <Select
                    value={projectId}
                    onChange={setProjectId}
                    options={projects.map((p) => ({ value: p.id, label: p.name }))}
                    portal={false}
                  />
                </Field>
              ) : (
                <Field label="Project">
                  <div className="px-3 py-2 text-sm text-amber-600 bg-amber-50 rounded-xl dark:bg-amber-500/10">No projects available.</div>
                </Field>
              )
            ) : null}
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
                <Select
                  value={statusTo}
                  onChange={setStatusTo}
                  options={[
                    { value: "TODO", label: "To Do" },
                    { value: "IN_PROGRESS", label: "In Progress" },
                    { value: "IN_REVIEW", label: "In Review" },
                    { value: "DONE", label: "Done" },
                    { value: "BLOCKED", label: "Blocked" },
                    { value: "CANCELLED", label: "Cancelled" },
                  ]}
                  portal={false}
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
              value={recipient.id}
              onChange={(id) => {
                const isAssignee = id === "Assignee";
                if (isAssignee) {
                  setRecipient({ id: "Assignee", name: "Assignee" });
                } else {
                  const role = roles.find((r) => r.id === id);
                  if (role) setRecipient({ id: role.id, name: role.name });
                }
              }}
              options={[
                { value: "Assignee", label: "Assignee" },
                ...roles.map((r) => ({ value: r.id, label: r.name })),
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
              onSave({
                name: name.trim() || "New automation",
                trigger: {
                  type: triggerType,
                  statusTo: triggerType === "status" ? statusTo : undefined,
                  dueDays: triggerType === "due" ? dueDays : undefined,
                  staleDays: triggerType === "stale" ? staleDays : undefined,
                  scope,
                  projectId: scope === "Project" ? projectId : undefined,
                },
                action: {
                  inApp: actions.inApp,
                  email: actions.email,
                  activity: actions.activity,
                  recipient,
                },
              });
              onClose();
            }}
            className="rounded-xl bg-primary px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-primary/90"
            disabled={scope === "Project" && !projectId}
          >
            {initial ? "Save changes" : "Create automation"}
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
