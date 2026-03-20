import { useMemo } from "react";
import { CalendarIcon, Flag } from "lucide-react";
import { Select } from "@/components/ui/Select";

type Assignee = { email: string; role: string };
type Props = {
  title: string;
  description: string;
  dueDate: string;
  priority: "Low" | "Medium" | "High" | "Urgent";
  assignee?: string;
  assignees: Assignee[];
  onChange: (field: string, value: string) => void;
  onSkip: () => void;
  onSubmit: () => void;
};

const priorities: Array<Props["priority"]> = ["Low", "Medium", "High", "Urgent"];

export function CreateFirstTaskStep({
  title,
  description,
  dueDate,
  priority,
  assignee,
  assignees,
  onChange,
  onSkip,
  onSubmit,
}: Props) {
  const hasAssignees = assignees.length > 0;

  const priorityColor = useMemo(() => {
    switch (priority) {
      case "Urgent":
        return "text-red-400";
      case "High":
        return "text-orange-400";
      case "Medium":
        return "text-amber-300";
      default:
        return "text-slate-300";
    }
  }, [priority]);

  return (
    <div className="rounded-2xl border border-white/10 bg-[#111827] p-8 shadow-2xl">
      <div className="mb-8">
        <div className="mb-2 flex items-center gap-3">
          <span className="material-symbols-outlined rounded-xl bg-primary/10 p-2 text-primary"></span>
          <h3 className="text-2xl font-bold text-white">Create your first task</h3>
        </div>
        <p className="text-slate-400">Add a starter task to get moving.</p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-200">Task title *</label>
          <input
            value={title}
            onChange={(e) => onChange("title", e.target.value)}
            placeholder="e.g., Draft launch brief"
            className="w-full rounded-xl border border-white/10 bg-background-dark px-4 py-3 text-slate-100 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary"
            required
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-200">Description</label>
          <textarea
            value={description}
            onChange={(e) => onChange("description", e.target.value)}
            rows={3}
            placeholder="What needs to be done?"
            className="w-full resize-none rounded-xl border border-white/10 bg-background-dark px-4 py-3 text-slate-100 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary"
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-200">Due date</label>
            <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-background-dark px-3 py-3 text-sm text-slate-200 focus-within:border-blue-500">
              <CalendarIcon className="h-4 w-4 text-slate-500" />
              <input
                type="date"
                value={dueDate}
                onChange={(e) => onChange("dueDate", e.target.value)}
                className="flex-1 bg-transparent border-none outline-none focus:ring-0"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-200">Priority</label>
            <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-background-dark px-3 py-3 text-sm text-slate-200">
              <Flag className={`h-4 w-4 ${priorityColor}`} />
              <Select
                value={priority}
                onChange={(v) => onChange("priority", v)}
                options={priorities.map((p) => ({ value: p, label: p }))}
                className="flex-1"
                portal={false}
              />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-200">Assignee</label>
          <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-background-dark px-3 py-3 text-sm text-slate-200">
            <Select
              value={assignee ?? ""}
              onChange={(v) => onChange("assignee", v)}
              options={[
                { value: "", label: hasAssignees ? "Unassigned" : "Assign later" },
                ...assignees.map((a) => ({ value: a.email, label: `${a.email} (${a.role})` })),
              ]}
              className="flex-1"
              portal={false}
            />
          </div>
          {!hasAssignees && (
            <p className="text-xs text-slate-500">Invite members first to assign tasks, or assign later.</p>
          )}
        </div>

        <div className="flex items-center justify-between pt-4">
          <button
            type="button"
            onClick={onSkip}
            className="px-6 py-3 text-sm font-semibold text-slate-400 transition hover:text-slate-200"
          >
            Skip
          </button>
          <button
            type="button"
            onClick={onSubmit}
            className="rounded-xl bg-primary px-8 py-3 text-sm font-semibold text-white shadow-lg shadow-primary/20 transition hover:bg-primary/90 active:scale-[0.98]"
          >
            Create task & finish
          </button>
        </div>
      </div>
    </div>
  );
}
