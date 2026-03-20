"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams, useParams } from "next/navigation";
import { ActivityHeader } from "@/components/activity/ActivityHeader";
import { ActivityFilters } from "@/components/activity/ActivityFilters";
import { ActivityFeed } from "@/components/activity/ActivityFeed";
import { ActivitySkeleton } from "@/components/activity/ActivitySkeleton";
import { ActivityEmptyState } from "@/components/activity/ActivityEmptyState";
import type { ActivityLogItem, ActivityItemType } from "@/components/activity/types";

type Filters = {
  q?: string;
  type?: ActivityItemType | "";
  actor?: string;
  project?: string;
  from?: string;
  to?: string;
};

export default function ActivityPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = useParams<{ workspaceSlug: string }>();
  const ws = params.workspaceSlug;

  const [filters, setFilters] = useState<Filters>(() => parseFilters(searchParams));
  const [items, setItems] = useState<ActivityLogItem[]>([]);
  const [actors, setActors] = useState<{ label: string; value: string }[]>([]);
  const [projects, setProjects] = useState<{ label: string; value: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<string | null>(null);

  // Fetch activity from API
  useEffect(() => {
    async function load() {
      try {
        const sp = new URLSearchParams();
        sp.set("workspaceSlug", ws);
        if (filters.type) sp.set("type", filters.type);
        if (filters.actor) sp.set("actor", filters.actor);
        if (filters.q) sp.set("q", filters.q);

        const res = await fetch(`/api/activity?${sp.toString()}`);
        if (!res.ok) throw new Error("Failed to load");
        const data = await res.json();

        setItems(data.items ?? []);
        setActors((data.actors ?? []).map((a: { id: string; name: string }) => ({ label: a.name, value: a.id })));
        setProjects((data.projects ?? []).map((p: { id: string; label: string }) => ({ label: p.label, value: p.id })));
      } catch (err) {
        console.error("Error loading activity:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [ws, filters.type, filters.actor, filters.q]);

  useEffect(() => {
    setFilters(parseFilters(searchParams));
  }, [searchParams]);

  const updateFilters = (next: Filters) => {
    setFilters(next);
    const sp = new URLSearchParams();
    if (next.q) sp.set("q", next.q);
    if (next.type) sp.set("type", next.type);
    if (next.actor) sp.set("actor", next.actor);
    if (next.project) sp.set("project", next.project);
    if (next.from) sp.set("from", next.from);
    if (next.to) sp.set("to", next.to);
    router.replace(`?${sp.toString()}`, { scroll: false });
  };

  const clearFilters = () => updateFilters({});

  const filteredItems = useMemo(() => {
    let result = items;
    if (filters.project) {
      result = result.filter((item) => {
        if (item.target.kind === "member") return true;
        const pid = item.target.kind === "task" ? item.target.projectId : item.target.id;
        return pid === filters.project;
      });
    }
    return result;
  }, [items, filters.project]);

  const handleExport = () => {
    setToast("Export CSV (UI only)");
    setTimeout(() => setToast(null), 1200);
  };

  const handleLoadMore = () => {
    // Pagination would go here
  };

  if (loading) return <ActivitySkeleton />;

  return (
    <main className="mx-auto max-w-6xl space-y-6 px-4 py-8">
      <ActivityHeader onExport={handleExport} projectActivityHref={`/${ws}/projects`} />

      <ActivityFilters
        value={filters}
        onChange={updateFilters}
        onClear={clearFilters}
        actors={actors}
        projects={projects}
        types={typesOptions}
      />

      {filteredItems.length ? (
        <ActivityFeed items={filteredItems} onLoadMore={handleLoadMore} hasMore={false} workspaceSlug={ws} />
      ) : (
        <ActivityEmptyState onClear={clearFilters} />
      )}

      {toast && (
        <div className="fixed bottom-6 right-6 rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-xl">
          {toast}
        </div>
      )}
    </main>
  );
}

const typesOptions = [
  { label: "Tasks", value: "tasks" },
  { label: "Projects", value: "projects" },
  { label: "Members", value: "members" },
  { label: "Settings", value: "settings" },
  { label: "Automations", value: "automations" },
  { label: "Security", value: "security" },
];

function parseFilters(sp: URLSearchParams): Filters {
  return {
    q: sp.get("q") || undefined,
    type: (sp.get("type") as ActivityItemType) || undefined,
    actor: sp.get("actor") || undefined,
    project: sp.get("project") || undefined,
    from: sp.get("from") || undefined,
    to: sp.get("to") || undefined,
  };
}
