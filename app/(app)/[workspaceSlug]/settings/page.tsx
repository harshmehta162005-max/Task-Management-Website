"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { SettingsLayout } from "@/components/settings/SettingsLayout";
import { WorkspaceProfileForm } from "@/components/settings/WorkspaceProfileForm";
import { DangerZone } from "@/components/settings/DangerZone";

export default function SettingsPage() {
  const { workspaceSlug } = useParams<{ workspaceSlug: string }>();
  const [workspace, setWorkspace] = useState<{ name: string; slug: string; logoUrl: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/workspaces/${workspaceSlug}`);
        if (!res.ok) throw new Error("Failed to load");
        const data = await res.json();
        setWorkspace({ name: data.name, slug: data.slug, logoUrl: data.logoUrl ?? "" });
      } catch (err) {
        console.error("Error loading workspace:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [workspaceSlug]);

  if (loading || !workspace) {
    return (
      <main className="min-h-screen px-4 py-8 text-slate-900 dark:text-slate-100 sm:px-6 lg:px-8">
        <SettingsLayout>
          <div className="animate-pulse space-y-4">
            <div className="h-8 w-48 rounded bg-slate-200 dark:bg-slate-700" />
            <div className="h-64 rounded-2xl bg-slate-200 dark:bg-slate-700" />
          </div>
        </SettingsLayout>
      </main>
    );
  }

  return (
    <main className="min-h-screen px-4 py-8 text-slate-900 dark:text-slate-100 sm:px-6 lg:px-8">
      <SettingsLayout>
        <WorkspaceProfileForm initialWorkspace={workspace} />
        <DangerZone workspaceName={workspace.name} workspaceSlug={workspace.slug} isAdmin={true} />
      </SettingsLayout>
    </main>
  );
}
