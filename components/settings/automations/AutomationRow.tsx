import { AutomationActionsMenu } from "./AutomationActionsMenu";
import { cn } from "@/lib/utils/cn";

export type Automation = {
  id: string;
  name: string;
  trigger: string;
  action: string;
  scope: "Workspace" | "Project";
  enabled: boolean;
};

type Props = {
  automation: Automation;
  onToggle: (id: string, value: boolean) => void;
  onEdit: (id: string) => void;
  onDuplicate: (id: string) => void;
  onDelete: (id: string) => void;
};

export function AutomationRow({ automation, onToggle, onEdit, onDuplicate, onDelete }: Props) {
  return (
    <tr className="hover:bg-slate-50 dark:hover:bg-white/5">
      <td className="px-6 py-4 text-sm font-semibold text-slate-900 dark:text-white">{automation.name}</td>
      <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-300">{automation.trigger}</td>
      <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-300">{automation.action}</td>
      <td className="px-6 py-4">
        <span
          className={cn(
            "rounded-md px-2 py-1 text-[10px] font-bold uppercase",
            automation.scope === "Workspace"
              ? "bg-primary/10 text-primary"
              : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300"
          )}
        >
          {automation.scope}
        </span>
      </td>
      <td className="px-6 py-4">
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
      <td className="px-6 py-4 text-right">
        <AutomationActionsMenu
          onEdit={() => onEdit(automation.id)}
          onDuplicate={() => onDuplicate(automation.id)}
          onDelete={() => onDelete(automation.id)}
        />
      </td>
    </tr>
  );
}
