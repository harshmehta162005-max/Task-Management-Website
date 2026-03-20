"use client";

import Link from "next/link";
import { usePathname, useParams } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  ShieldCheck,
  Tags as TagsIcon,
  Bell,
  Workflow,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";

type NavItem = {
  label: string;
  suffix: string;
  icon: React.ReactNode;
};

const items: NavItem[] = [
  { label: "Workspace Profile", suffix: "", icon: <LayoutDashboard className="h-4 w-4" /> },
  { label: "Members", suffix: "/members", icon: <Users className="h-4 w-4" /> },
  { label: "Roles", suffix: "/roles", icon: <ShieldCheck className="h-4 w-4" /> },
  { label: "Tags", suffix: "/tags", icon: <TagsIcon className="h-4 w-4" /> },
  { label: "Notifications", suffix: "/notifications", icon: <Bell className="h-4 w-4" /> },
  { label: "Automations", suffix: "/automations", icon: <Workflow className="h-4 w-4" /> },
];

export function SettingsNav() {
  const pathname = usePathname();
  const { workspaceSlug } = useParams<{ workspaceSlug: string }>();

  return (
    <nav className="flex flex-col gap-1">
      {items.map((item) => {
        const href = `/${workspaceSlug}/settings${item.suffix}`;
        const isActive =
          pathname === href ||
          (item.suffix === "" && pathname === `/${workspaceSlug}/settings`) ||
          (item.suffix !== "" && pathname?.startsWith(href));
        return (
          <Link
            key={item.suffix || "root"}
            href={href}
            className={cn(
              "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-colors",
              isActive
                ? "bg-primary text-white shadow-sm"
                : "text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-white/5"
            )}
          >
            <span
              className={cn(
                "flex h-8 w-8 items-center justify-center rounded-lg border",
                isActive
                  ? "border-primary/40 bg-primary/20 text-white"
                  : "border-slate-200 bg-white text-slate-500 dark:border-slate-700 dark:bg-slate-900"
              )}
            >
              {item.icon}
            </span>
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
