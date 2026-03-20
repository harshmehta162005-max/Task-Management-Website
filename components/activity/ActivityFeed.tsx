"use client";

import { ActivityLogItem } from "./types";
import { ActivityItem } from "./ActivityItem";

type Props = {
  items: ActivityLogItem[];
  onLoadMore?: () => void;
  hasMore?: boolean;
  workspaceSlug: string;
};

export function ActivityFeed({ items, onLoadMore, hasMore, workspaceSlug }: Props) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-[#0f172a]">
      <div className="divide-y divide-slate-200 dark:divide-slate-800">
        {items.map((item) => (
          <ActivityItem key={item.id} item={item} workspaceSlug={workspaceSlug} />
        ))}
      </div>
      <div className="flex items-center justify-between border-t border-slate-200 px-4 py-3 text-xs text-slate-500 dark:border-slate-800 dark:text-slate-400">
        <span>Showing {items.length} events</span>
        {hasMore && (
          <button
            onClick={onLoadMore}
            className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-white/5"
          >
            Load more
          </button>
        )}
      </div>
    </section>
  );
}
