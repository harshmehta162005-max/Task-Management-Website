import { useState } from "react";
import { ClipboardEdit } from "lucide-react";
import { ProposedTasksPreview } from "./ProposedTasksPreview";
import { Select } from "@/components/ui/Select";

type Proposed = {
  id: string;
  title: string;
  assignee?: string;
  due?: string;
  duplicate?: boolean;
};

export function MeetingToTasksFlow() {
  const [notes, setNotes] = useState("");
  const [project, setProject] = useState("mobile");
  const [proposed, setProposed] = useState<Proposed[]>([]);

  const extract = () => {
    if (!notes.trim()) return;
    setProposed([
      { id: "p1", title: "Finalize login flow UI", assignee: "Alex Rivera", due: "Fri", duplicate: false },
      { id: "p2", title: "Send meeting follow-up", assignee: "Sarah Chen", due: "Tomorrow", duplicate: true },
      { id: "p3", title: "Create QA checklist", assignee: "Marcus Wright", due: "Mon", duplicate: false },
    ]);
  };

  const approve = (id: string) => setProposed((p) => p.filter((t) => t.id !== id));
  const reject = (id: string) => setProposed((p) => p.filter((t) => t.id !== id));
  const approveAll = () => setProposed([]);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-[#111827]">
      <div className="mb-4 flex items-center gap-3">
        <div className="rounded-lg bg-emerald-500/10 p-2 text-emerald-500">
          <ClipboardEdit className="h-4 w-4" />
        </div>
        <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Meeting to tasks</h3>
      </div>
      <div className="space-y-3">
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={4}
          placeholder="Paste meeting notes…"
          className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-slate-700 dark:bg-[#0f172a] dark:text-slate-100"
        />
        <div className="flex flex-col gap-1">
          <label className="text-[11px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
            Target project
          </label>
          <Select
            value={project}
            onChange={setProject}
            options={[
              { value: "mobile", label: "Mobile Redesign" },
              { value: "api", label: "API Documentation" },
              { value: "marketing", label: "Q4 Marketing" },
            ]}
            portal={false}
          />
        </div>
        <button
          onClick={extract}
          className="w-full rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 dark:bg-white dark:text-slate-900"
        >
          Extract tasks
        </button>

        <ProposedTasksPreview tasks={proposed} onApprove={approve} onReject={reject} onApproveAll={approveAll} />
      </div>
    </div>
  );
}
