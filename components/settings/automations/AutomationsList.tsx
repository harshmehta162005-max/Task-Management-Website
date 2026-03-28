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
    <div className="w-full">
      <table className="w-full table-fixed text-left text-sm">
        <colgroup>
          <col style={{ width: "22%" }} />
          <col style={{ width: "22%" }} />
          <col style={{ width: "26%" }} />
          <col style={{ width: "10%" }} />
          <col style={{ width: "10%" }} />
          <col style={{ width: "10%" }} />
        </colgroup>
        <thead className="border-b border-slate-200 bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:border-slate-800 dark:bg-[#0d1422] dark:text-slate-400">
          <tr>
            <th className="px-4 py-3">Automation</th>
            <th className="px-4 py-3">Trigger</th>
            <th className="px-4 py-3">Action</th>
            <th className="px-4 py-3">Scope</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3 pr-6 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
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
  );
}
