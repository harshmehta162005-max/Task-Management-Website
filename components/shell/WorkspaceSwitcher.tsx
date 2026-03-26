import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { ChevronsUpDown, Grid2x2 } from "lucide-react";
import { cn } from "@/lib/utils/cn";

type Props = {
  collapsed?: boolean;
};

export function WorkspaceSwitcher({ collapsed = false }: Props) {
  const params = useParams<{ workspaceSlug?: string }>();
  const slug = params?.workspaceSlug;
  const [workspace, setWorkspace] = useState<{ name: string; logoUrl: string | null }>({
    name: slug ? slug.replace(/[-_]/g, " ") : "Loading...",
    logoUrl: null,
  });

  useEffect(() => {
    if (!slug) return;
    async function load() {
      try {
        const res = await fetch(`/api/workspaces/${slug}`);
        if (!res.ok) return;
        const data = await res.json();
        setWorkspace({ name: data.name, logoUrl: data.logoUrl });
      } catch {
        // fail silently, keep fallback
      }
    }
    load();
  }, [slug]);

  const fallbackInitial = workspace.name ? workspace.name.charAt(0).toUpperCase() : "?";

  return (
    <Link
      href="/workspace-selector"
      className={cn(
        "flex w-full items-center gap-3 rounded-xl border border-slate-200 bg-slate-100 px-3 py-2 text-left transition-colors hover:bg-slate-200 dark:border-primary/20 dark:bg-primary/10 dark:hover:bg-primary/20",
        collapsed && "justify-center px-2"
      )}
    >
      <span className="flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-primary text-white shadow-primary/30 shadow-sm">
        {workspace.logoUrl ? (
          <img src={workspace.logoUrl} alt={workspace.name} className="h-full w-full object-cover" />
        ) : (
          <span className="text-lg font-bold">{fallbackInitial}</span>
        )}
      </span>
      {!collapsed && (
        <span className="min-w-0 flex-1">
          <span className="block truncate text-sm font-semibold text-slate-900 dark:text-white capitalize">{workspace.name}</span>
          <span className="block truncate text-xs text-slate-500 dark:text-slate-400">Pro Workspace</span>
        </span>
      )}
      {!collapsed && <ChevronsUpDown className="h-4 w-4 text-slate-400" aria-hidden />}
    </Link>
  );
}
