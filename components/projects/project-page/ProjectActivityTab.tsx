"use client";

import { useEffect, useState } from "react";
import { Filter, Loader2 } from "lucide-react";
import { ActivityFeed } from "./ActivityFeed";

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

export function ProjectActivityTab({ projectId, workspaceSlug }: Props) {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(
          `/api/projects/${projectId}/activity?workspaceSlug=${workspaceSlug}`
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
  }, [projectId, workspaceSlug]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm dark:border-slate-800 dark:bg-[#111827]">
        <div>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Project activity</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">Recent updates from your team.</p>
        </div>
        <button className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-600 shadow-sm transition hover:border-primary/40 hover:text-primary dark:border-slate-700 dark:bg-[#0f172a] dark:text-slate-200">
          <Filter className="h-4 w-4" />
          All activity
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center rounded-2xl border border-slate-200 bg-white p-8 dark:border-slate-800 dark:bg-[#0f172a]">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
      ) : activities.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center dark:border-slate-800 dark:bg-[#0f172a]">
          <p className="text-sm text-slate-500">No activity yet. Create tasks to see activity here.</p>
        </div>
      ) : (
        <ActivityFeed items={activities} />
      )}
    </div>
  );
}
