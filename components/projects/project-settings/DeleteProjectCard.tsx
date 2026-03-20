import { AlertTriangle } from "lucide-react";

type Props = {
  onDelete: () => void;
  isManager: boolean;
};

export function DeleteProjectCard({ onDelete, isManager }: Props) {
  return (
    <section className="rounded-2xl border border-red-500/30 bg-red-500/5 p-6 shadow-sm dark:border-red-500/30 dark:bg-red-500/10">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-red-500" />
          <div>
            <h2 className="text-lg font-semibold text-red-600 dark:text-red-400">Danger Zone</h2>
            <p className="text-sm text-red-500 dark:text-red-300">
              Permanently delete this project and all data. This cannot be undone.
            </p>
          </div>
        </div>
        {isManager ? (
          <button
            onClick={onDelete}
            className="rounded-xl bg-red-500 px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-red-600"
          >
            Delete project
          </button>
        ) : (
          <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">Manager access required</span>
        )}
      </div>
    </section>
  );
}
