import { useState } from "react";
import { AutomationActionsMenu } from "./AutomationActionsMenu";
import { cn } from "@/lib/utils/cn";

export type TriggerConfig = {
  type: string;
  statusTo?: string;
  dueDays?: number;
  staleDays?: number;
  scope: "Workspace" | "Project";
  projectId?: string;
};

export type ActionConfig = {
  inApp: boolean;
  email: boolean;
  activity: boolean;
  recipient: { id: string; name: string } | string; // support old strings for fallback
};

export type Automation = {
  id: string;
  name: string;
  trigger: TriggerConfig;
  action: ActionConfig;
  enabled: boolean;
};

type Props = {
  automation: Automation;
  onToggle: (id: string, value: boolean) => void;
  onEdit: (id: string) => void;
  onDuplicate: (id: string) => void;
  onDelete: (id: string) => void;
};

/* ── Hover Tooltip ───────────────────────────────────────────── */
function HoverTip({ text, children }: { text: string; children: React.ReactNode }) {
  const [show, setShow] = useState(false);

  return (
    <span
      className="relative inline-flex max-w-full"
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      {children}
      {show && text && (
        <span className="pointer-events-none absolute bottom-full left-1/2 z-50 mb-2 -translate-x-1/2 whitespace-nowrap rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-800 shadow-lg dark:border-slate-700 dark:bg-[#1e293b] dark:text-slate-100">
          {text}
          <span className="absolute -bottom-1 left-1/2 h-2 w-2 -translate-x-1/2 rotate-45 border-b border-r border-slate-200 bg-white dark:border-slate-700 dark:bg-[#1e293b]" />
        </span>
      )}
    </span>
  );
}

export function AutomationRow({ automation, onToggle, onEdit, onDuplicate, onDelete }: Props) {
  const buildTriggerSummary = (t: TriggerConfig) => {
    const statusMap: Record<string, string> = {
      TODO: "To Do",
      IN_PROGRESS: "In Progress",
      IN_REVIEW: "In Review",
      DONE: "Done",
      BLOCKED: "Blocked",
      CANCELLED: "Cancelled"
    };
    if (t.type === "status") return `When status changes to ${statusMap[t.statusTo || "BLOCKED"] || t.statusTo}`;
    if (t.type === "due") return `When due date is within ${t.dueDays || 2} days`;
    if (t.type === "stale") return `No updates for ${t.staleDays || 5} days`;
    if (t.type === "weekly") return "Every Friday at 9:00 AM";
    return "When event occurs";
  };

  const buildActionSummary = (a: ActionConfig) => {
    const parts = [];
    if (a.inApp) parts.push("Notify in-app");
    if (a.email) parts.push("Send email");
    if (a.activity) parts.push("Post to activity");
    const actionsStr = parts.join(" + ") || "No action selected";
    const recipientName = typeof a.recipient === "string" ? a.recipient : a.recipient?.name || "Unknown";
    return `${actionsStr} • ${recipientName}`;
  };

  return (
    <tr className="transition-colors hover:bg-slate-50/80 dark:hover:bg-white/[0.03]">
      <td className="px-4 py-3">
        <HoverTip text={automation.name}>
          <span className="block truncate font-semibold text-slate-900 dark:text-white">
            {automation.name}
          </span>
        </HoverTip>
      </td>
      <td className="px-4 py-3">
        <HoverTip text={buildTriggerSummary(automation.trigger)}>
          <span className="block truncate text-slate-600 dark:text-slate-300">
            {buildTriggerSummary(automation.trigger)}
          </span>
        </HoverTip>
      </td>
      <td className="px-4 py-3">
        <HoverTip text={buildActionSummary(automation.action)}>
          <span className="block truncate text-slate-600 dark:text-slate-300">
            {buildActionSummary(automation.action)}
          </span>
        </HoverTip>
      </td>
      <td className="px-4 py-3">
        <span
          className={cn(
            "inline-flex whitespace-nowrap rounded-md px-2 py-1 text-[10px] font-bold uppercase",
            automation.trigger.scope === "Workspace"
              ? "bg-primary/10 text-primary"
              : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300"
          )}
        >
          {automation.trigger.scope}
        </span>
      </td>
      <td className="px-4 py-3">
        <button
          onClick={() => onToggle(automation.id, !automation.enabled)}
          className={cn("relative h-5 w-10 rounded-full transition", automation.enabled ? "bg-primary" : "bg-slate-300 dark:bg-slate-700")}
        >
          <span
            className={cn(
              "absolute top-1/2 h-4 w-4 -translate-y-1/2 rounded-full bg-white shadow transition",
              automation.enabled ? "right-1" : "left-1"
            )}
          />
        </button>
      </td>
      <td className="px-4 py-3 pr-6 text-right">
        <div className="flex justify-end">
          <AutomationActionsMenu
            onEdit={() => onEdit(automation.id)}
            onDuplicate={() => onDuplicate(automation.id)}
            onDelete={() => onDelete(automation.id)}
          />
        </div>
      </td>
    </tr>
  );
}
