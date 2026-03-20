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
  group: "Tasks" | "Projects" | "Members";
  active: boolean;
  onSelect: () => void;
  onHover?: (id: string) => void;
};

type Props = {
  items: ResultItem[];
  recent: ResultItem[];
  query: string;
};

export function SearchResults({ items, recent, query }: Props) {
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

  if (!items.length) {
    return <SearchEmptyState query={query} />;
  }

  const groups: ("Tasks" | "Projects" | "Members")[] = ["Tasks", "Projects", "Members"];

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
