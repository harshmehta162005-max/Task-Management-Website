import { useMemo, useState } from "react";
import { cn } from "@/lib/utils/cn";

type Props = {
  initialName: string;
  initialDescription: string;
};

export function ProjectDetailsCard({ initialName, initialDescription }: Props) {
  const [name, setName] = useState(initialName);
  const [description, setDescription] = useState(initialDescription);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const dirty = useMemo(() => name !== initialName || description !== initialDescription, [name, description, initialName, initialDescription]);

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 1500);
    }, 500);
  };

  const handleReset = () => {
    setName(initialName);
    setDescription(initialDescription);
  };

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-[#0f172a]">
      <div className="mb-4 flex items-center gap-2">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">PD</div>
        <div>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Project Details</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">Name and description.</p>
        </div>
      </div>
      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-800 dark:text-slate-100">Project name</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-slate-700 dark:bg-[#111827] dark:text-slate-100"
            placeholder="Project name"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-800 dark:text-slate-100">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-slate-700 dark:bg-[#111827] dark:text-slate-100"
            placeholder="What is this project about?"
          />
        </div>
      </div>
      <div className="mt-5 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={handleReset}
          className="rounded-xl px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-white/5"
        >
          Reset
        </button>
        <button
          type="button"
          onClick={handleSave}
          disabled={!dirty || saving}
          className={cn(
            "rounded-xl px-5 py-2 text-sm font-semibold text-white shadow-sm transition",
            !dirty || saving ? "bg-primary/60 cursor-not-allowed" : "bg-primary hover:bg-primary/90"
          )}
        >
          {saving ? "Saving…" : "Save changes"}
        </button>
        {saved && <span className="text-xs font-semibold text-emerald-500">Saved</span>}
      </div>
    </section>
  );
}
