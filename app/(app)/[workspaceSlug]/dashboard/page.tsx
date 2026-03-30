"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Plus } from "lucide-react";
import { AssignTaskModal } from "@/components/dashboard/AssignTaskModal";
import { StatsRow } from "@/components/dashboard/StatsRow";
import { MyTasksToday } from "@/components/dashboard/MyTasksToday";
import { WorkloadHeatmap } from "@/components/dashboard/WorkloadHeatmap";
import { ProjectsOverview } from "@/components/dashboard/ProjectsOverview";
import { RiskyTasksWidget } from "@/components/dashboard/RiskyTasksWidget";
import { AttentionPanel } from "@/components/dashboard/AttentionPanel";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { DashboardSkeleton } from "@/components/dashboard/DashboardSkeleton";
import { AlertTriangle, CheckCircle2, Activity, Calendar as CalendarIcon } from "lucide-react";

type DashboardData = {
  stats: { label: string; value: number }[];
  tasksToday: { id: string; title: string; project: string; priority: string; due: string }[];
  members: { name: string; load: number }[];
  projects: { id: string; name: string; description: string; progress: number; avatars: string[]; overdue: boolean; href: string }[];
  riskyAtRisk: { title: string; due: string; assignee: string }[];
  riskyStale: { title: string; due: string; assignee: string }[];
  attentionOverdue: { title: string; detail: string }[];
  attentionBlocked: { title: string; detail: string }[];
  attentionOverloaded: { name: string }[];
  activityItems: { actor: string; action: string; entity: string; href: string; time: string; avatar: string }[];
};

const STAT_ICONS = [CheckCircle2, AlertTriangle, Activity, CalendarIcon] as const;
const STAT_DELTAS = ["+0%", "-0%", "+0%", "+0%"] as const;
const STAT_COLORS = ["green", "red", "green", "green"] as const;

export default function DashboardPage() {
  const { workspaceSlug } = useParams<{ workspaceSlug: string }>();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<DashboardData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [taskModalOpen, setTaskModalOpen] = useState(false);

  const loadDashboard = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/dashboard?workspaceSlug=${workspaceSlug}`);
      if (!res.ok) throw new Error("Failed to load dashboard");
      const json = await res.json();
      setData(json);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, [workspaceSlug]);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  if (loading) {
    return <div className="px-4 py-6 md:px-6"><DashboardSkeleton /></div>;
  }

  if (error || !data) {
    return (
      <div className="px-4 py-6 md:px-6">
        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center dark:border-slate-700 dark:bg-[#111827]">
          <p className="text-slate-500">{error || "No data available"}</p>
        </div>
      </div>
    );
  }

  const stats = data.stats.map((s, i) => ({
    ...s,
    delta: STAT_DELTAS[i],
    deltaColor: STAT_COLORS[i],
    icon: STAT_ICONS[i],
  }));

  const isManagerView = data.attentionOverdue.length > 0 || data.attentionBlocked.length > 0 || data.attentionOverloaded.length > 0;

  return (
    <div className="space-y-6 px-4 py-6 md:px-6">
      <header className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">Dashboard</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Welcome back, here&apos;s what&apos;s happening today.</p>
        </div>
        <button
          onClick={() => setTaskModalOpen(true)}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-primary/20 transition hover:bg-primary/90"
        >
          <Plus className="h-4 w-4" />
          Create task
        </button>
      </header>

      <StatsRow stats={stats} />

      {/* Two independent columns — items stack vertically without cross-column height sync */}
      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12">
        {/* Left column */}
        <div className="flex flex-col gap-6 lg:col-span-7">
          <MyTasksToday tasks={data.tasksToday.map(t => ({
            ...t,
            priority: ({ URGENT: "Urgent", HIGH: "High", MEDIUM: "Medium", LOW: "Low" }[t.priority] ?? t.priority) as "Low" | "Medium" | "High" | "Urgent",
          }))} workspaceSlug={workspaceSlug} />
          <ProjectsOverview projects={data.projects} workspaceSlug={workspaceSlug} />
          {isManagerView && (
            <AttentionPanel overdue={data.attentionOverdue} blocked={data.attentionBlocked} overloaded={data.attentionOverloaded} />
          )}
          <RecentActivity items={data.activityItems} />
        </div>

        {/* Right column */}
        <div className="flex flex-col gap-6 lg:col-span-5">
          <WorkloadHeatmap members={data.members} href={`/${workspaceSlug}/settings/members`} />
          <RiskyTasksWidget atRisk={data.riskyAtRisk} stale={data.riskyStale} />
        </div>
      </div>

      <AssignTaskModal
        workspaceSlug={workspaceSlug}
        open={taskModalOpen}
        onClose={() => setTaskModalOpen(false)}
        onCreated={loadDashboard}
      />
    </div>
  );
}
