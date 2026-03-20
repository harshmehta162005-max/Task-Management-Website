import { Automation } from "./AutomationRow";
import { AutomationRow } from "./AutomationRow";
import { AutomationsEmptyState } from "./AutomationsEmptyState";

type Props = {
  automations: Automation[];
  onToggle: (id: string, value: boolean) => void;
  onEdit: (id: string) => void;
  onDuplicate: (id: string) => void;
  onDelete: (id: string) => void;
};

export function AutomationsList({ automations, onToggle, onEdit, onDuplicate, onDelete }: Props) {
  if (!automations.length) {
    return <AutomationsEmptyState onCreate={() => onEdit("new")} />;
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-[#0f172a]">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:bg-[#0d1422] dark:text-slate-400">
            <tr>
              <th className="px-6 py-3">Automation</th>
              <th className="px-6 py-3">Trigger</th>
              <th className="px-6 py-3">Action</th>
              <th className="px-6 py-3">Scope</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
            {automations.map((automation) => (
              <AutomationRow
                key={automation.id}
                automation={automation}
                onToggle={onToggle}
                onEdit={onEdit}
                onDuplicate={onDuplicate}
                onDelete={onDelete}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
