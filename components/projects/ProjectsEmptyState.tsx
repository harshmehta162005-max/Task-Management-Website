import { FolderKanban } from "lucide-react";

type Props = {
  onCreate: () => void;
};

export function ProjectsEmptyState({ onCreate }: Props) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-white p-10 text-center shadow-sm dark:border-slate-700 dark:bg-[#111827]">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
        <FolderKanban className="h-7 w-7" />
      </div>
      <h3 className="text-lg font-semibold text-slate-900 dark:text-white">No projects yet</h3>
      <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
        Create your first project to start organizing tasks.
      </p>
      <button
        onClick={onCreate}
        className="mt-4 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-primary/90"
      >
        Create project
      </button>
    </div>
  );
}

