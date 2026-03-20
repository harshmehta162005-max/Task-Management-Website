type TaskDraft = { id: string; title: string; approved: boolean };

type Props = {
  tasks: TaskDraft[];
  onToggle: (id: string) => void;
  onApproveAll: () => void;
};

export function ProposedTasksList({ tasks, onToggle, onApproveAll }: Props) {
  if (!tasks.length) return null;
  return (
    <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-4 dark:border-slate-700 dark:bg-[#0f172a]/50">
      <div className="mb-3 flex items-center justify-between">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
          Proposed Tasks ({tasks.length})
        </p>
        <button
          onClick={onApproveAll}
          className="text-xs font-semibold text-primary hover:text-primary/80"
          type="button"
        >
          Approve all
        </button>
      </div>
      <div className="space-y-2">
        {tasks.map((t) => (
          <label
            key={t.id}
            className="flex items-start gap-3 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm dark:border-slate-700 dark:bg-[#0f172a]"
          >
            <input
              type="checkbox"
              checked={t.approved}
              onChange={() => onToggle(t.id)}
              className="mt-1 h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary dark:border-slate-600"
            />
            <span className={t.approved ? "text-slate-900 dark:text-slate-100" : "text-slate-500 dark:text-slate-400"}>
              {t.title}
            </span>
          </label>
        ))}
      </div>
    </div>
  );
}
