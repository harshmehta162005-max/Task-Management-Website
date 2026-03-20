"use client";

import { useEffect, useState, type ReactNode } from "react";
import { X } from "lucide-react";

type Props = {
  children: ReactNode;
  onExit: () => void;
  workspaceName?: string;
};

export function OnboardingLayout({ children, onExit, workspaceName }: Props) {
  const [displayName, setDisplayName] = useState(workspaceName || "");

  useEffect(() => {
    if (workspaceName) return;

    // Try sessionStorage first
    const slug = sessionStorage.getItem("onboarding_workspace_slug");
    if (slug) {
      const pretty = slug.replace(/[-_]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
      setDisplayName(pretty);
      return;
    }

    // Fallback: fetch the user's most recent workspace
    async function fetchWorkspace() {
      try {
        const res = await fetch("/api/workspaces");
        if (!res.ok) return;
        const data = await res.json();
        if (data.length > 0) {
          setDisplayName(data[0].name);
        }
      } catch {
        // silent
      }
    }
    fetchWorkspace();
  }, [workspaceName]);

  return (
    <div className="workspace-bg min-h-screen px-6 py-8 font-display text-slate-100 md:px-10">
      <div className="mx-auto flex w-full max-w-[1000px] items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary shadow-lg shadow-primary/25">
            <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
            </svg>
          </div>
          <h1 className="text-lg font-bold capitalize tracking-tight">{displayName || "Loading..."}</h1>
        </div>
        <button
          type="button"
          onClick={onExit}
          className="flex items-center gap-2.5 rounded-lg px-3 py-1.5 text-sm font-medium text-slate-400 transition hover:text-slate-200"
        >
          Exit onboarding
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-red-500/15 text-red-400 transition hover:bg-red-500/25 hover:text-red-300">
            <X className="h-3.5 w-3.5" strokeWidth={2.5} />
          </span>
        </button>
      </div>

      <main className="mx-auto flex w-full max-w-[1000px] flex-col gap-10 pt-8">{children}</main>
    </div>
  );
}
