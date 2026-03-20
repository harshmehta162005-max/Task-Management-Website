import { useState } from "react";
import { X, Users } from "lucide-react";
import { NewProjectInput } from "./types";

type Props = {
  open: boolean;
  onClose: () => void;
  onSubmit: (input: NewProjectInput) => void;
};

export function CreateProjectModal({ open, onClose, onSubmit }: Props) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [members, setMembers] = useState<string>("alex@example.com, sarah@example.com");
  const disabled = name.trim().length < 3;

  if (!open) return null;

  const handleSubmit = () => {
    if (disabled) return;
    const parsedMembers = members
      .split(",")
      .map((m) => m.trim())
      .filter(Boolean);
    onSubmit({ name: name.trim(), description: description.trim(), members: parsedMembers });
    setName("");
    setDescription("");
    setMembers("");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm">
      <div className="w-full max-w-lg overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-white/10 dark:bg-[#111827]">
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4 dark:border-white/10">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">New Project</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 dark:hover:text-white">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-4 px-6 py-5">
          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-200">Project name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-white/10 dark:bg-[#0f172a] dark:text-white"
              placeholder="e.g. Website Overhaul"
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-200">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-white/10 dark:bg-[#0f172a] dark:text-white"
              placeholder="What is this project about?"
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-200">Add members (comma separated)</label>
            <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 dark:border-white/10 dark:bg-[#0f172a]">
              <Users className="h-4 w-4 text-slate-400" />
              <input
                value={members}
                onChange={(e) => setMembers(e.target.value)}
                className="w-full bg-transparent text-sm outline-none dark:text-white"
                placeholder="name@company.com"
              />
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">UI only – no emails will be sent.</p>
          </div>
        </div>

        <div className="flex justify-end gap-3 border-t border-slate-200 bg-slate-50 px-6 py-4 dark:border-white/10 dark:bg-[#0f172a]/40">
          <button
            onClick={onClose}
            className="rounded-xl px-4 py-2 text-sm font-semibold text-slate-600 transition hover:text-slate-900 dark:text-slate-200 dark:hover:text-white"
          >
            Cancel
          </button>
          <button
            disabled={disabled}
            onClick={handleSubmit}
            className="rounded-xl bg-primary px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Create project
          </button>
        </div>
      </div>
    </div>
  );
}

