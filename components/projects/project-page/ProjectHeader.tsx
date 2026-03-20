import { ReactNode } from "react";
import { Plus, Sparkles } from "lucide-react";

type Props = {
  name: string;
  description: string;
  onAddTask: () => void;
  onSummarize: () => void;
  settingsMenu: ReactNode;
};

export function ProjectHeader({ name, description, onAddTask, onSummarize, settingsMenu }: Props) {
  return (
    <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">{name}</h1>
        <p className="max-w-3xl text-sm text-slate-500 dark:text-slate-400">{description}</p>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <button
          onClick={onAddTask}
          className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-primary/20 transition hover:bg-primary/90"
        >
          <Plus className="h-4 w-4" />
          Add task
        </button>
        <button
          onClick={onSummarize}
          className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-primary/50 hover:text-primary dark:border-white/10 dark:bg-[#0f172a] dark:text-slate-200"
        >
          <Sparkles className="h-4 w-4" />
          Summarize project
        </button>
        {settingsMenu}
      </div>
    </div>
  );
}
