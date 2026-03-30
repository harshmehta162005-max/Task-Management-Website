"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { Loader2, Folder, CheckCircle2, Clock, Activity, AlertTriangle, ShieldCheck, CreditCard, Box, User as UserIcon, KeyRound } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import Link from "next/link";
import { ResetPasswordModal } from "@/components/profile/ResetPasswordModal";

type ProfileData = {
  user: {
    id: string;
    name: string | null;
    email: string;
    avatarUrl: string | null;
    workspaceRole: string;
  };
  workspaces: {
    id: string;
    name: string;
    slug: string;
    logoUrl: string | null;
    role: string;
    memberProjectCount: number;
  }[];
  projects: {
    id: string;
    name: string;
    role: string;
    taskCount: number;
  }[];
  taskSnapshot: {
    todo: number;
    inProgress: number;
    completed: number;
    overdue: number;
  };
};

export default function ProfilePage() {
  const { workspaceSlug } = useParams<{ workspaceSlug: string }>();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<ProfileData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showAllWorkspaces, setShowAllWorkspaces] = useState(false);
  const [resetModalOpen, setResetModalOpen] = useState(false);

  const fetchProfile = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/workspaces/${workspaceSlug}/user-profile`);
      if (!res.ok) throw new Error("Failed to load profile data");
      const json = await res.json();
      setData(json);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, [workspaceSlug]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="px-4 py-8 md:px-8">
        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm dark:border-white/10 dark:bg-amber-500/10">
          <p className="text-slate-500 dark:text-amber-500">{error || "No data available"}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1200px] space-y-8 px-4 py-8 md:px-8">
      {/* 1. Profile Header (Compact Identity Card) */}
      <section className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-[#060e20]">
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-primary/5 blur-[80px]"></div>
        <div className="relative flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
          <div className="flex items-center gap-6">
            <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-white bg-slate-100 shadow-md ring-4 ring-primary/10 dark:border-[#0f1930] dark:bg-slate-800">
              {data.user.avatarUrl ? (
                <img src={data.user.avatarUrl} alt={data.user.name || "User"} className="h-full w-full object-cover" />
              ) : (
                <span className="text-2xl font-bold text-primary">
                  {data.user.name ? data.user.name.charAt(0).toUpperCase() : "?"}
                </span>
              )}
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                {data.user.name || "Unknown User"}
              </h1>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{data.user.email}</p>
              <div className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                <ShieldCheck className="h-3.5 w-3.5" />
                <span>Workspace {data.user.workspaceRole}</span>
              </div>
            </div>
          </div>
          <button
            onClick={() => setResetModalOpen(true)}
            className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700 shadow-sm transition hover:bg-slate-50 dark:border-white/10 dark:bg-[#111827] dark:text-slate-200 dark:hover:bg-slate-800"
          >
            <KeyRound className="h-4 w-4" />
            Change Password
          </button>
        </div>
      </section>

      {/* 4. My Task Snapshot (Hero Component) */}
      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-sm font-bold tracking-wider text-slate-400 uppercase">My Task Snapshot</h2>
          <Link href={`/${workspaceSlug}/my-tasks`} className="text-xs font-semibold text-primary hover:underline">
            View All Tasks &rarr;
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <StatCard title="Todo" value={data.taskSnapshot.todo} icon={<Folder className="h-5 w-5 text-indigo-500" />} color="indigo" />
          <StatCard title="In Progress" value={data.taskSnapshot.inProgress} icon={<Activity className="h-5 w-5 text-amber-500" />} color="amber" />
          <StatCard title="Completed" value={data.taskSnapshot.completed} icon={<CheckCircle2 className="h-5 w-5 text-emerald-500" />} color="emerald" />
          <StatCard title="Overdue" value={data.taskSnapshot.overdue} icon={<AlertTriangle className="h-5 w-5 text-rose-500" />} color="rose" />
        </div>
      </section>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* 2. Workspaces Enrolled */}
        <section>
          <h2 className="mb-4 text-sm font-bold tracking-wider text-slate-400 uppercase">Workspaces Enrolled</h2>
          <div className="grid gap-4">
            {data.workspaces.slice(0, showAllWorkspaces ? undefined : 4).map((ws) => (
              <button
                key={ws.id}
                onClick={() => router.push(`/${ws.slug}/dashboard`)}
                className="group relative flex w-full items-center gap-4 overflow-hidden rounded-xl border border-slate-200 bg-white p-4 text-left shadow-sm transition-all hover:border-primary/50 hover:shadow-md dark:border-white/5 dark:bg-[#091328] dark:hover:border-primary/20 dark:hover:bg-[#0f1930]"
              >
                {/* Glow Effect */}
                <div className="absolute inset-0 z-0 bg-gradient-to-br from-primary/0 to-primary/0 transition-all duration-300 group-hover:from-primary/5 group-hover:to-transparent" />
                
                <div className="relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800">
                  {ws.logoUrl ? (
                    <img src={ws.logoUrl} alt={ws.name} className="h-8 w-8 rounded object-cover" />
                  ) : (
                    <Box className="h-6 w-6 text-slate-500" />
                  )}
                </div>
                <div className="relative z-10 flex-1">
                  <h3 className="text-sm font-bold text-slate-900 group-hover:text-primary dark:text-slate-100">
                    {ws.name}
                  </h3>
                  <div className="mt-1 flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                    <span className="flex items-center gap-1">
                      <UserIcon className="h-3.5 w-3.5" />
                      {ws.role}
                    </span>
                    <span className="flex items-center gap-1">
                      <Folder className="h-3.5 w-3.5" />
                      {ws.memberProjectCount} Projects
                    </span>
                  </div>
                </div>
                {/* Current Workspace Indicator */}
                {ws.slug === workspaceSlug && (
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-500">
                    Active
                  </div>
                )}
              </button>
            ))}
          </div>
          {data.workspaces.length > 4 && (
            <button
              onClick={() => setShowAllWorkspaces(!showAllWorkspaces)}
              className="mt-4 w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 text-xs font-bold text-slate-500 transition hover:bg-slate-100 hover:text-slate-700 dark:border-white/5 dark:bg-slate-800/50 dark:hover:bg-slate-800"
            >
              {showAllWorkspaces ? "Show Less" : `View All ${data.workspaces.length} Workspaces`}
            </button>
          )}
        </section>

        {/* 3. Projects Enrolled */}
        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-bold tracking-wider text-slate-400 uppercase">Current Workspace Projects</h2>
            <Link href={`/${workspaceSlug}/projects`} className="text-xs font-semibold text-slate-500 hover:text-primary dark:text-slate-400">
              View All &rarr;
            </Link>
          </div>
          {data.projects.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-200 p-8 text-center dark:border-white/10">
              <p className="text-sm text-slate-500 dark:text-slate-400">You are not a member of any projects in this workspace yet.</p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {data.projects.slice(0, 4).map((p) => (
                <Link
                  key={p.id}
                  href={`/${workspaceSlug}/projects/${p.id}`}
                  className="group relative flex flex-col justify-between overflow-hidden rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary/50 hover:shadow-lg dark:border-white/5 dark:bg-[#091328] dark:hover:border-primary/30 dark:hover:bg-[#0f1930]"
                >
                  <div className="relative z-10 mb-4">
                    <h3 className="text-sm font-bold text-slate-900 group-hover:text-primary dark:text-slate-100">
                      {p.name}
                    </h3>
                  </div>
                  <div className="relative z-10 flex items-center justify-between">
                    <div className="inline-flex items-center gap-1.5 rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                      <UserIcon className="h-3.5 w-3.5" />
                      {p.role}
                    </div>
                    <div className="flex items-center gap-1 text-xs font-medium text-slate-500 dark:text-slate-400">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      {p.taskCount} tasks
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>
      </div>

      <ResetPasswordModal open={resetModalOpen} onClose={() => setResetModalOpen(false)} />
    </div>
  );
}

function StatCard({ title, value, icon, color }: { title: string; value: number; icon: React.ReactNode; color: "indigo" | "amber" | "emerald" | "rose" }) {
  const bgColors = {
    indigo: "bg-indigo-500/10 dark:bg-indigo-500/5",
    amber: "bg-amber-500/10 dark:bg-amber-500/5",
    emerald: "bg-emerald-500/10 dark:bg-emerald-500/5",
    rose: "bg-rose-500/10 dark:bg-rose-500/5",
  };
  
  const borderColors = {
    indigo: "border-indigo-500/20",
    amber: "border-amber-500/20",
    emerald: "border-emerald-500/20",
    rose: "border-rose-500/20",
  };

  const textColors = {
    indigo: "text-indigo-600 dark:text-indigo-400",
    amber: "text-amber-600 dark:text-amber-400",
    emerald: "text-emerald-600 dark:text-emerald-400",
    rose: "text-rose-600 dark:text-rose-400",
  };

  return (
    <div className={cn(
      "group relative overflow-hidden rounded-2xl border p-5 transition-all hover:-translate-y-1 hover:shadow-lg dark:hover:shadow-black/50",
      "bg-white dark:bg-[#060e20]",
      borderColors[color]
    )}>
      {/* Subtle Glow Backdrop */}
      <div className={cn("absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100", bgColors[color])} />
      
      <div className="relative z-10 flex items-center justify-between">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">{title}</span>
        {icon}
      </div>
      <div className={cn("relative z-10 mt-4 text-4xl font-black", textColors[color])}>
        {value}
      </div>
    </div>
  );
}
