"use client";

import { useMemo, useState } from "react";
import { cn } from "@/lib/utils/cn";

type Props = {
  initialName: string;
  initialEmail: string;
  onSave?: (name: string, email: string) => void;
};

export function ProfileInfoCard({ initialName, initialEmail, onSave }: Props) {
  const [name, setName] = useState(initialName);
  const [email, setEmail] = useState(initialEmail);

  const hasChanges = useMemo(() => name !== initialName || email !== initialEmail, [name, email, initialName, initialEmail]);

  const handleSave = () => {
    onSave?.(name, email);
  };

  const handleReset = () => {
    setName(initialName);
    setEmail(initialEmail);
  };

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-[#0f172a]">
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">✦</div>
        <div>
          <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">Profile</p>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Profile Information</h2>
        </div>
        {hasChanges && (
          <span className="ml-auto rounded-full bg-amber-100 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-amber-600 dark:bg-amber-500/10 dark:text-amber-300">
            Unsaved
          </span>
        )}
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <Field label="Full name">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm shadow-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-slate-700 dark:bg-[#0f172a] dark:text-slate-100"
            placeholder="Alex Thompson"
          />
        </Field>
        <Field label="Email address">
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm shadow-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-slate-700 dark:bg-[#0f172a] dark:text-slate-100"
            placeholder="alex@workspace.com"
            type="email"
          />
        </Field>
      </div>

      <div className="mt-6 flex gap-3">
        <button
          onClick={handleSave}
          disabled={!hasChanges}
          className={cn(
            "rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-primary/20 transition hover:bg-primary/90",
            !hasChanges && "opacity-60"
          )}
        >
          Save changes
        </button>
        <button
          onClick={handleReset}
          className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-white/5"
        >
          Reset
        </button>
      </div>
    </section>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">{label}</label>
      {children}
    </div>
  );
}
