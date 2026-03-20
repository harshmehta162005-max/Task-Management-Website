"use client";

import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { DateRangePicker } from "./DateRangePicker";
import type { ActivityItemType } from "./types";
import { Select } from "@/components/ui/Select";

type Option = { label: string; value: string };

type FilterState = {
  q?: string;
  type?: ActivityItemType | "";
  actor?: string;
  project?: string;
  from?: string;
  to?: string;
};

type Props = {
  value: FilterState;
  onChange: (next: FilterState) => void;
  actors: Option[];
  projects: Option[];
  types: Option[];
  onClear: () => void;
};

export function ActivityFilters({ value, onChange, actors, projects, types, onClear }: Props) {
  const [local, setLocal] = useState<FilterState>(value);

  useEffect(() => setLocal(value), [value]);

  const update = (patch: Partial<FilterState>) => {
    const next = { ...local, ...patch };
    setLocal(next);
    onChange(next);
  };

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-[#0f172a]">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-6">
        <div className="relative lg:col-span-2">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            value={local.q || ""}
            onChange={(e) => update({ q: e.target.value || undefined })}
            placeholder="Search activity..."
            className="w-full rounded-xl border border-slate-200 bg-white px-9 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-slate-700 dark:bg-[#0f172a] dark:text-slate-100"
          />
        </div>
        <Select
          value={local.type || ""}
          onChange={(v) => update({ type: (v as ActivityItemType) || undefined })}
          options={[{ value: "", label: "All types" }, ...types]}
        />
        <Select
          value={local.actor || ""}
          onChange={(v) => update({ actor: v || undefined })}
          options={[{ value: "", label: "All actors" }, ...actors]}
        />
        <Select
          value={local.project || ""}
          onChange={(v) => update({ project: v || undefined })}
          options={[{ value: "", label: "All projects" }, ...projects]}
        />
        <DateRangePicker
          from={local.from}
          to={local.to}
          onChange={(r) => update(r)}
        />
        <button
          onClick={onClear}
          className="rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-white/5"
        >
          Clear filters
        </button>
      </div>
    </section>
  );
}
