import { Rocket } from "lucide-react";
import type { FormEvent } from "react";

type Props = {
  name: string;
  description: string;
  onChange: (field: "name" | "description", value: string) => void;
  onSkip: () => void;
  onSubmit: (e: FormEvent) => void;
  isSubmitting?: boolean;
};

export function CreateProjectStep({ name, description, onChange, onSkip, onSubmit, isSubmitting }: Props) {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#111827] p-8 shadow-2xl">
      <div className="mb-8">
        <div className="mb-2 flex items-center gap-3">
          <span className="material-symbols-outlined rounded-xl bg-primary/10 p-2 text-primary"></span>
          <h3 className="text-2xl font-bold text-white">Create your first project</h3>
        </div>
        <p className="text-slate-400">
          Projects are where your team manages work, stores documents, and tracks progress towards goals.
        </p>
      </div>

      <form className="space-y-6" onSubmit={onSubmit}>
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-200">
            Project Name <span className="text-primary">*</span>
          </label>
          <input
            required
            value={name}
            onChange={(e) => onChange("name", e.target.value)}
            placeholder="e.g., Marketing Launch 2024"
            className="w-full rounded-xl border border-white/10 bg-background-dark px-4 py-3 text-slate-100 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary"
            type="text"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-200">Description</label>
          <textarea
            value={description}
            onChange={(e) => onChange("description", e.target.value)}
            rows={4}
            placeholder="Briefly describe the project scope and objectives..."
            className="w-full resize-none rounded-xl border border-white/10 bg-background-dark px-4 py-3 text-slate-100 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary"
          />
        </div>
        <div className="flex items-center justify-between pt-4">
          <button
            type="button"
            onClick={onSkip}
            className="px-6 py-3 text-sm font-semibold text-slate-400 transition hover:text-slate-200"
          >
            Skip for now
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-xl bg-primary px-8 py-3 text-sm font-semibold text-white shadow-lg shadow-primary/20 transition hover:bg-primary/90 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Creating..." : "Create Project"}
          </button>
        </div>
      </form>
    </div>
  );
}
