import { cn } from "@/lib/utils/cn";
import { User, FolderOpen, Building2, Bot } from "lucide-react";
import type { NotificationCategory } from "./types";

const CATEGORY_TABS: { key: "ALL" | NotificationCategory; label: string; icon: typeof User }[] = [
  { key: "ALL", label: "All", icon: User },
  { key: "personal", label: "Personal", icon: User },
  { key: "project", label: "Project", icon: FolderOpen },
  { key: "workspace", label: "Workspace", icon: Building2 },
  { key: "ai", label: "AI", icon: Bot },
];

export type FilterType = "ALL" | NotificationCategory;

type Props = {
  active: FilterType;
  unreadOnly: boolean;
  onChange: (type: FilterType) => void;
  onToggleUnread: (val: boolean) => void;
};

export function NotificationFilters({ active, unreadOnly, onChange, onToggleUnread }: Props) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex gap-2 overflow-x-auto pb-1">
        {CATEGORY_TABS.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.key}
              onClick={() => onChange(tab.key)}
              className={cn(
                "inline-flex shrink-0 items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-medium border transition-colors",
                active === tab.key
                  ? "bg-primary text-white border-primary"
                  : "bg-white text-slate-600 border-slate-200 hover:border-primary hover:text-primary dark:bg-[#111827] dark:text-slate-300 dark:border-slate-700"
              )}
            >
              <Icon className="h-3.5 w-3.5" />
              {tab.label}
            </button>
          );
        })}
      </div>

      <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm dark:border-slate-800 dark:bg-[#111827]">
        <div>
          <p className="text-sm font-semibold text-slate-900 dark:text-white">Unread only</p>
          <p className="text-xs text-slate-500 dark:text-slate-400">Hide notifications you've already seen.</p>
        </div>
        <button
          type="button"
          role="switch"
          aria-checked={unreadOnly}
          onClick={() => onToggleUnread(!unreadOnly)}
          className={cn(
            "relative inline-flex h-6 w-11 items-center rounded-full transition focus:outline-none focus:ring-2 focus:ring-primary/40",
            unreadOnly ? "bg-primary" : "bg-slate-300 dark:bg-slate-700"
          )}
        >
          <span
            className={cn(
              "inline-block h-4 w-4 transform rounded-full bg-white transition",
              unreadOnly ? "translate-x-5" : "translate-x-1"
            )}
          />
        </button>
      </div>
    </div>
  );
}
