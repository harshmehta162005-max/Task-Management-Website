import { Building2, FolderKanban } from "lucide-react";

type Props = {
  onCreate: () => void;
};

export function WorkspaceEmptyState({ onCreate }: Props) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-2xl border border-white/10 bg-slate-900/40 p-10 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
        <FolderKanban className="h-6 w-6" />
      </div>
      <h3 className="text-lg font-semibold text-white">No workspaces yet</h3>
      <p className="text-sm text-slate-400">Create a workspace to start managing projects and tasks.</p>
      <button
        type="button"
        onClick={onCreate}
        className="mt-2 inline-flex items-center justify-center rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary/90"
      >
        Create workspace
      </button>
    </div>
  );
}
