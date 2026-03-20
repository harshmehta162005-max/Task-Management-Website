export function TagsHeader({ onCreate }: { onCreate: () => void }) {
  return (
    <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">Tags</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">Create and manage tags used across tasks.</p>
      </div>
      <button
        onClick={onCreate}
        className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-primary/90"
      >
        Create tag
      </button>
    </div>
  );
}
