"use client";

import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Bell,
  Bot,
  CheckSquare,
  ChevronLeft,
  ChevronRight,
  FolderOpen,
  LayoutDashboard,
  Settings,
  Sparkles,
  MoreVertical,
} from "lucide-react";
import { useShell } from "./useShell";
import { WorkspaceSwitcher } from "./WorkspaceSwitcher";
import { useCurrentUser } from "@/components/providers/UserProvider";
import { cn } from "@/lib/utils/cn";

type SidebarProps = {
  variant?: "desktop" | "mobile";
};

export function Sidebar({ variant = "desktop" }: SidebarProps) {
  const { collapsed, toggleCollapsed } = useShell();
  const { user } = useCurrentUser();
  const params = useParams<{ workspaceSlug: string }>();
  const pathname = usePathname();
  const isDesktop = variant === "desktop";
  const widthClass = isDesktop ? (collapsed ? "w-[76px]" : "w-[280px]") : "w-[280px] max-w-[90vw]";

  const [unreadCount, setUnreadCount] = useState(0);

  // Fetch unread notification count
  useEffect(() => {
    async function fetchCount() {
      try {
        const res = await fetch("/api/notifications/unread-count");
        if (res.ok) {
          const data = await res.json();
          setUnreadCount(data.count ?? 0);
        }
      } catch {
        // Non-critical
      }
    }
    fetchCount();
    // Poll every 30 seconds
    const interval = setInterval(fetchCount, 30000);
    return () => clearInterval(interval);
  }, []);

  const NAV_ITEMS = [
    { label: "Dashboard", icon: LayoutDashboard, href: `/${params.workspaceSlug}/dashboard` },
    { label: "My Tasks", icon: CheckSquare, href: `/${params.workspaceSlug}/my-tasks` },
    { label: "Projects", icon: FolderOpen, href: `/${params.workspaceSlug}/projects` },
    { label: "AI Assistant", icon: Sparkles, href: `/${params.workspaceSlug}/ai` },
    { label: "Notifications", icon: Bell, href: `/${params.workspaceSlug}/notifications` },
    { label: "Settings", icon: Settings, href: `/${params.workspaceSlug}/settings` },
  ];

  const initials = user?.name
    ? user.name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase()
    : "?";

  return (
    <aside
      className={cn(
        "sidebar-transition z-50 flex h-dvh shrink-0 flex-col border-r border-slate-200 bg-white dark:border-slate-800 dark:bg-background-dark",
        isDesktop ? "sticky top-0 transition-[width] duration-200" : "overflow-hidden rounded-r-2xl",
        widthClass
      )}
    >
      <div className={cn("p-4", collapsed && isDesktop && "px-3")}>
        <WorkspaceSwitcher collapsed={collapsed && isDesktop} />
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-4">
        <div className={cn("pb-2 px-2 text-[10px] font-bold uppercase tracking-wider text-slate-400", collapsed && "hidden")}>
          Main Menu
        </div>
        {NAV_ITEMS.map((item) => {
          const active = pathname.startsWith(item.href);
          return (
            <Link
              key={item.label}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-colors",
                active
                  ? "bg-primary text-white hover:bg-primary/90"
                  : "text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
              )}
            >
              <item.icon className="h-5 w-5 shrink-0" />
              {!collapsed && <span className="nav-label truncate">{item.label}</span>}
              {item.label === "Notifications" && unreadCount > 0 && (
                collapsed ? (
                  <span className="absolute right-2 top-1 h-2 w-2 rounded-full bg-red-500" />
                ) : (
                  <span className="ml-auto inline-flex min-w-[20px] items-center justify-center rounded-full bg-red-500 px-1.5 py-0.5 text-[10px] font-bold text-white">
                    {unreadCount > 99 ? "99+" : unreadCount}
                  </span>
                )
              )}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto border-t border-slate-200 p-4 dark:border-slate-800">
        <Link
          href="/profile"
          className="group flex items-center gap-3 rounded-xl p-2 transition-colors hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          <div className="flex size-10 items-center justify-center overflow-hidden rounded-full bg-slate-300 text-white ring-2 ring-primary/20 dark:bg-slate-700">
            {user?.avatarUrl ? (
              <img src={user.avatarUrl} alt={user.name ?? "User"} className="h-full w-full object-cover" />
            ) : (
              <span className="text-sm font-bold text-primary">{initials}</span>
            )}
          </div>
          {!collapsed && (
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-bold">{user?.name ?? "Loading…"}</p>
              <p className="truncate text-xs text-slate-500">{user?.email ?? ""}</p>
            </div>
          )}
          {!collapsed && <MoreVertical className="h-4 w-4 text-slate-400" />}
        </Link>

        {isDesktop && (
          <button
            type="button"
            onClick={toggleCollapsed}
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl py-2 text-xs font-bold text-slate-500 transition-colors hover:text-primary"
          >
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
            {!collapsed && <span className="nav-label">Collapse Sidebar</span>}
          </button>
        )}
      </div>
    </aside>
  );
}
