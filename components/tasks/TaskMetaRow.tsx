import { DrawerPriority, DrawerStatus } from "./task-drawer/types";
import { Select } from "@/components/ui/Select";
import { DatePicker } from "@/components/ui/DatePicker";

type Props = {
  status: DrawerStatus;
  priority: DrawerPriority;
  dueDate?: string | null;
  onStatusChange: (s: DrawerStatus) => void;
  onPriorityChange: (p: DrawerPriority) => void;
  onDueChange: (value: string | null) => void;
  readOnly?: boolean;
};

const statusOptions: DrawerStatus[] = ["TODO", "IN_PROGRESS", "BLOCKED", "DONE"];
const priorityOptions: DrawerPriority[] = ["LOW", "MEDIUM", "HIGH", "URGENT"];

export function TaskMetaRow({ status, priority, dueDate, onStatusChange, onPriorityChange, onDueChange, readOnly = false }: Props) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
      <Field label="Status">
        <Select
          value={status}
          onChange={(val) => { if (!readOnly) onStatusChange(val as DrawerStatus) }}
          options={statusOptions.map((s) => ({ value: s, label: labelize(s) }))}
          disabled={readOnly}
          portal={false}
        />
      </Field>
      <Field label="Priority">
        <Select
          value={priority}
          onChange={(val) => { if (!readOnly) onPriorityChange(val as DrawerPriority) }}
          options={priorityOptions.map((p) => ({ value: p, label: labelize(p) }))}
          disabled={readOnly}
          portal={false}
        />
      </Field>
      <Field label="Due date">
        <DatePicker
          date={dueDate ? new Date(dueDate) : undefined}
          onChange={(val) => { if (!readOnly) onDueChange(val ? val.toISOString() : null) }}
          disabled={readOnly ? true : { before: new Date(new Date().setHours(0,0,0,0)) }}
          className="w-full"
        />
      </Field>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1">
      <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">{label}</p>
      {children}
    </div>
  );
}

function labelize(text: string) {
  return text.replace("_", " ").replace(/\b\w/g, (c) => c.toUpperCase());
}
