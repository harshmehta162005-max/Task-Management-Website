"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { ActivityFeed } from "./ActivityFeed";
import { Select } from "@/components/ui/Select";

type Activity = {
  id: string;
  avatar: string;
  actor: string;
  action: string;
  time: string;
  badge?: string;
};

type Props = {
  projectId: string;
  workspaceSlug: string;
};

const FILTER_OPTIONS = [
  { value: "all", label: "All Activity" },
  { value: "comments", label: "Comments" },
  { value: "tasks_created", label: "Tasks Created" },
  { value: "tasks_completed", label: "Tasks Completed" },
  { value: "notes_created", label: "Notes Created" },
];

export function ProjectActivityTab({ projectId, workspaceSlug }: Props) {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const res = await fetch(
          `/api/projects/${projectId}/activity?workspaceSlug=${workspaceSlug}&filter=${filter}`
        );
        if (res.ok) {
          const data = await res.json();
          setActivities(data);
        }
      } catch {
        // silent
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [projectId, workspaceSlug, filter]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm dark:border-slate-800 dark:bg-[#111827]">
        <div>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Project activity</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">Recent updates from your team.</p>
        </div>
        <div className="w-48">
          <Select
            value={filter}
            onChange={setFilter}
            options={FILTER_OPTIONS}
            portal={false}
          />
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center rounded-2xl border border-slate-200 bg-white p-8 dark:border-slate-800 dark:bg-[#0f172a]">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
      ) : activities.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center dark:border-slate-800 dark:bg-[#0f172a]">
          <p className="text-sm text-slate-500">No activity here.</p>
        </div>
      ) : (
        <ActivityFeed items={activities} />
      )}
    </div>
  );
}
