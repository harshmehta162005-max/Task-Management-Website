"use client";

import type { ReactNode } from "react";
import { SearchGroup } from "./SearchGroup";
import { SearchResultRow } from "./SearchResultRow";
import { SearchEmptyState } from "./SearchEmptyState";

export type ResultItem = {
  id: string;
  title: string;
  subtitle: string;
  icon: ReactNode;
  group: "Tasks" | "Projects" | "Members" | "Actions";
  active: boolean;
  onSelect: () => void;
  onHover?: (id: string) => void;
};

type Props = {
  items: ResultItem[];
  recent: ResultItem[];
  query: string;
  onCreateTask?: () => void;
  onCreateProject?: () => void;
};

export function SearchResults({ items, recent, query, onCreateTask, onCreateProject }: Props) {
  if (!query) {
    return (
      <div className="space-y-3">
        <p className="px-2 text-[11px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Recent</p>
        <div className="space-y-1">
          {recent.map((item) => (
            <SearchResultRow
              key={item.id}
              icon={item.icon}
              title={item.title}
              subtitle={item.subtitle}
              active={item.active}
              onClick={item.onSelect}
            />
          ))}
        </div>
      </div>
    );
  }

  // Check if we only have action items left (or nothing)
  const hasRealResults = items.some((i) => i.group !== "Actions");

  if (!hasRealResults) {
    return (
      <div className="space-y-4">
        <SearchEmptyState query={query} onCreateTask={onCreateTask} onCreateProject={onCreateProject} />
        {/* Render Actions for screen readers / keyboard accessibility */}
        {items.length > 0 && (
          <div className="opacity-0 h-0 overflow-hidden pointer-events-none">
            {items
              .filter((i) => i.group === "Actions")
              .map((item) => (
                <SearchResultRow
                  key={item.id}
                  icon={item.icon}
                  title={item.title}
                  subtitle={item.subtitle}
                  active={item.active}
                  onClick={item.onSelect}
                />
              ))}
          </div>
        )}
      </div>
    );
  }

  const groups: ("Tasks" | "Projects" | "Members" | "Actions")[] = ["Tasks", "Projects", "Members", "Actions"];

  return (
    <div className="space-y-4">
      {groups.map((group) => {
        const groupItems = items.filter((i) => i.group === group);
        if (!groupItems.length) return null;
        return (
          <SearchGroup key={group} title={group}>
            {groupItems.map((item) => (
              <SearchResultRow
                key={item.id}
                icon={item.icon}
                title={item.title}
                subtitle={item.subtitle}
                active={item.active}
                onClick={item.onSelect}
              />
            ))}
          </SearchGroup>
        );
      })}
    </div>
  );
}
