import { useState } from "react";
import { Search, User, Flag, X } from "lucide-react";
import { Select } from "@/components/ui/Select";

type Props = {
  onSearchChange: (v: string) => void;
  onAssigneeChange: (v: string) => void;
  onPriorityChange: (v: string) => void;
  availableAssignees?: { id: string; name: string }[];
};

export function KanbanFilterBar({ onSearchChange, onAssigneeChange, onPriorityChange, availableAssignees = [] }: Props) {
  const [search, setSearch] = useState("");
  const [assignee, setAssignee] = useState("");
  const [priority, setPriority] = useState("");

  const clear = () => {
    setSearch("");
    setAssignee("");
    setPriority("");
    onSearchChange("");
    onAssigneeChange("");
    onPriorityChange("");
  };

  return (
    <div className="mb-4 flex flex-wrap items-center gap-3 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm dark:border-slate-800 dark:bg-[#0f172a]">
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            onSearchChange(e.target.value);
          }}
          placeholder="Search tasks..."
          className="w-56 rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-slate-700 dark:bg-[#111827] dark:text-slate-100"
        />
      </div>

      <Select
        value={assignee}
        onChange={(v) => {
          setAssignee(v);
          onAssigneeChange(v);
        }}
        options={[
          { value: "", label: "Assignee" },
          ...availableAssignees.map(a => ({ value: a.id, label: a.name }))
        ]}
        className="w-40"
        portal={false}
      />

      <Select
        value={priority}
        onChange={(v) => {
          setPriority(v);
          onPriorityChange(v);
        }}
        options={[
          { value: "", label: "Priority" },
          { value: "URGENT", label: "Urgent" },
          { value: "HIGH", label: "High" },
          { value: "MEDIUM", label: "Medium" },
          { value: "LOW", label: "Low" },
        ]}
        className="w-36"
        portal={false}
      />

      {(search || assignee || priority) && (
        <button
          onClick={clear}
          className="inline-flex items-center gap-1 rounded-xl px-3 py-2 text-sm font-semibold text-slate-500 transition hover:text-primary"
        >
          <X className="h-4 w-4" />
          Clear
        </button>
      )}
    </div>
  );
}
