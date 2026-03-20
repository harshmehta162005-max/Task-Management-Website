"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { WorkspaceSelectorHeader } from "@/components/onboarding/WorkspaceSelectorHeader";
import { WorkspaceGrid } from "@/components/onboarding/WorkspaceGrid";
import { AutoRedirectBanner } from "@/components/onboarding/AutoRedirectBanner";
import type { Workspace } from "@/components/onboarding/WorkspaceCard";
import { useUser } from "@clerk/nextjs";

const ACCENT_COLORS = [
  "bg-indigo-500/20 text-indigo-400 border border-indigo-500/30",
  "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30",
  "bg-amber-500/20 text-amber-400 border border-amber-500/30",
  "bg-rose-500/20 text-rose-400 border border-rose-500/30",
  "bg-sky-500/20 text-sky-400 border border-sky-500/30",
  "bg-purple-500/20 text-purple-400 border border-purple-500/30",
];

export default function WorkspaceSelectorPage() {
  const router = useRouter();
  const { user } = useUser();
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);

  // Fetch real workspaces from API
  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/workspaces");
        if (!res.ok) throw new Error();
        const data = await res.json();
        setWorkspaces(
          data.map((ws: { name: string; slug: string; role: string }, i: number) => ({
            name: ws.name,
            slug: ws.slug,
            role: ws.role || "Member",
            initials: ws.name
              .split(" ")
              .map((w: string) => w[0])
              .join("")
              .slice(0, 2)
              .toUpperCase(),
            color: ACCENT_COLORS[i % ACCENT_COLORS.length],
          }))
        );
      } catch {
        console.error("Failed to load workspaces");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return workspaces;
    return workspaces.filter((ws) => ws.name.toLowerCase().includes(q) || ws.slug.toLowerCase().includes(q));
  }, [query, workspaces]);

  const handleSelect = (ws: Workspace) => {
    router.push(`/${ws.slug}/dashboard`);
  };

  const handleCreate = () => router.push("/create-workspace");

  const showRedirect = workspaces.length === 1;

  return (
    <div className="workspace-bg min-h-screen px-4 py-12 font-display text-slate-100">
      <div className="mx-auto flex w-full max-w-[900px] flex-col gap-8">
        {showRedirect && <AutoRedirectBanner message={workspaces[0]?.name ?? "workspace"} />}

        <WorkspaceSelectorHeader query={query} onQueryChange={setQuery} onCreate={handleCreate} />

        <WorkspaceGrid workspaces={filtered} loading={loading} onSelect={handleSelect} onCreate={handleCreate} />

        <div className="flex flex-col items-center justify-between gap-4 border-t border-slate-800/50 pt-8 text-sm text-slate-500 sm:flex-row">
          <p>
            Signed in as <span className="font-medium text-slate-300">{user?.primaryEmailAddress?.emailAddress ?? "loading..."}</span>
          </p>
          <div className="flex gap-6">
            <a className="text-slate-500 transition-colors hover:text-primary" href="#">
              Privacy Policy
            </a>
            <a className="text-slate-500 transition-colors hover:text-primary" href="#">
              Help Center
            </a>
            <a className="text-slate-500 transition-colors hover:text-primary" href="#">
              Log out
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
