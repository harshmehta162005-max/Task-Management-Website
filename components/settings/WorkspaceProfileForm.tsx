"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { LogoUploader } from "./LogoUploader";
import { SlugInput } from "./SlugInput";
import { cn } from "@/lib/utils/cn";

type Workspace = {
  name: string;
  slug: string;
  logoUrl: string | null;
};

type Props = {
  initialWorkspace?: Workspace;
};

const DEFAULT_WORKSPACE: Workspace = {
  name: "Acme Workspace",
  slug: "acme-workspace",
  logoUrl: null,
};

export function WorkspaceProfileForm({ initialWorkspace = DEFAULT_WORKSPACE }: Props) {
  const router = useRouter();
  const [workspace, setWorkspace] = useState<Workspace>(initialWorkspace);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const dirty = useMemo(
    () =>
      workspace.name !== initialWorkspace.name ||
      workspace.slug !== initialWorkspace.slug ||
      workspace.logoUrl !== initialWorkspace.logoUrl,
    [workspace, initialWorkspace]
  );

  const handleSave = async () => {
    setSaving(true);
    setSaved(false);
    setError(null);

    try {
      const res = await fetch(`/api/workspaces/${initialWorkspace.slug}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: workspace.name,
          slug: workspace.slug,
          logoUrl: workspace.logoUrl,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to update workspace");
      }

      setSaved(true);
      setTimeout(() => setSaved(false), 2000);

      if (data.slug !== initialWorkspace.slug) {
        // Redirect completely to new slug using window.location to properly reload the active route context
        window.location.href = `/${data.slug}/settings`;
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    setWorkspace(initialWorkspace);
    setSaved(false);
  };

  return (
    <div className="space-y-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-[#0f172a]">
      <div className="space-y-1">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Workspace Profile</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          This information is shown across your workspace.
        </p>
      </div>

      <div className="flex flex-col gap-6 md:flex-row md:items-center">
        <LogoUploader value={workspace.logoUrl} onChange={(url) => setWorkspace((w) => ({ ...w, logoUrl: url }))} />
        <div className="space-y-2">
          <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">Workspace logo</p>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            PNG, JPG or SVG. Recommended at least 256×256. Drag & drop to replace.
          </p>
        </div>
      </div>

      <div className="grid gap-5">
        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-800 dark:text-slate-100">Workspace name</label>
          <input
            value={workspace.name}
            onChange={(e) => setWorkspace((w) => ({ ...w, name: e.target.value }))}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-slate-700 dark:bg-[#0f172a] dark:text-slate-100"
            placeholder="e.g. Product Design"
          />
        </div>

        <SlugInput
          value={workspace.slug}
          prefix="https://teamos.io/"
          onChange={(slug) => setWorkspace((w) => ({ ...w, slug }))}
          helper="Changing the slug updates the workspace URL. Use lowercase letters, numbers, and hyphens."
        />
      </div>

      <div className="flex flex-col gap-2">
        {error && <p className="text-sm font-semibold text-red-500">{error}</p>}
        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button
            type="button"
            onClick={handleReset}
            className="rounded-xl px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-white/5"
          >
            Reset
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={!dirty || saving}
            className={cn(
              "inline-flex items-center gap-2 rounded-xl px-5 py-2 text-sm font-semibold text-white shadow-sm transition",
              !dirty || saving ? "bg-primary/60 cursor-not-allowed" : "bg-primary hover:bg-primary/90"
            )}
          >
            {saving ? "Saving..." : "Save changes"}
          </button>
          {saved && <span className="text-xs font-semibold text-emerald-500">Saved</span>}
        </div>
      </div>
    </div>
  );
}
