import { useState } from "react";
import { SlidersHorizontal, X } from "lucide-react";
import { DateRangePicker } from "./DateRangePicker";
import { Select } from "@/components/ui/Select";

export type TaskListFilters = {
  status: string;
  priority: string;
  assignee: string;
  tag: string;
  dueFrom: string;
  dueTo: string;
  q?: string;
};

type Props = {
  filters: TaskListFilters;
  onChange: (next: Partial<TaskListFilters>) => void;
  availableTags?: string[];
  availableAssignees?: { id: string; name: string }[];
};

export function TaskFiltersPopover({ filters, onChange, availableTags, availableAssignees = [] }: Props) {
  const [open, setOpen] = useState(false);

  const apply = (patch: Partial<TaskListFilters>) => {
    onChange(patch);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((p) => !p)}
        className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-600 shadow-sm transition hover:border-primary/40 hover:text-primary dark:border-slate-700 dark:bg-[#111827] dark:text-slate-200"
      >
        <SlidersHorizontal className="h-4 w-4" />
        Filters
      </button>

      {open ? (
        <div className="absolute right-0 z-30 mt-2 w-72 rounded-2xl border border-slate-200 bg-white p-3 shadow-xl dark:border-slate-700 dark:bg-[#0f172a]">
          <div className="mb-2 flex items-center justify-between">
            <p className="text-sm font-semibold text-slate-900 dark:text-white">Filters</p>
            <button onClick={() => setOpen(false)} className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-white/10">
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="space-y-3 text-sm">
            <SelectField
              label="Status"
              value={filters.status}
              options={["", "TODO", "IN_PROGRESS", "BLOCKED", "DONE"]}
              onChange={(v) => apply({ status: v })}
            />
            <SelectField
              label="Priority"
              value={filters.priority}
              options={["", "URGENT", "HIGH", "MEDIUM", "LOW"]}
              onChange={(v) => apply({ priority: v })}
            />
            <SelectField
              label="Assignee"
              value={filters.assignee}
              options={[
                { value: "", label: "Any" },
                ...availableAssignees.map(a => ({ value: a.id, label: a.name }))
              ]}
              onChange={(v) => apply({ assignee: v })}
            />
            <SelectField
              label="Tag"
              value={filters.tag}
              options={["", ...(availableTags || ["Design", "Backend", "Bug", "Marketing", "QA", "Dev", "Infra", "Mobile", "Legal"])]}
              onChange={(v) => apply({ tag: v })}
            />
            <DateRangePicker
              from={filters.dueFrom}
              to={filters.dueTo}
              onChange={(from, to) => apply({ dueFrom: from, dueTo: to })}
            />
          </div>
        </div>
      ) : null}
    </div>
  );
}

function SelectField({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: (string | { value: string; label: string })[];
  onChange: (v: string) => void;
}) {
  return (
    <label className="flex flex-col gap-1 text-slate-600 dark:text-slate-200">
      <span className="text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">{label}</span>
      <Select
        value={value}
        onChange={onChange}
        options={options.map((opt) => 
          typeof opt === "string" 
            ? { value: opt, label: opt === "" ? "Any" : opt.replace("_", " ") }
            : opt
        )}
        size="sm"
        portal={false}
      />
    </label>
  );
}
