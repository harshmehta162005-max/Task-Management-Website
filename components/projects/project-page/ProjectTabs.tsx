import { cn } from "@/lib/utils/cn";

const tabs: { key: TabKey; label: string }[] = [
  { key: "board", label: "Board" },
  { key: "list", label: "List" },
  { key: "calendar", label: "Calendar" },
  { key: "activity", label: "Activity" },
  { key: "insights", label: "Insights" },
];

export type TabKey = "board" | "list" | "calendar" | "activity" | "insights";

type Props = {
  currentTab: TabKey;
  onChange: (tab: TabKey) => void;
};

export function ProjectTabs({ currentTab, onChange }: Props) {
  return (
    <div className="overflow-x-auto border-b border-slate-200 dark:border-white/10">
      <div className="flex min-w-max items-center gap-2">
        {tabs.map((tab) => {
          const active = currentTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => onChange(tab.key)}
              className={cn(
                "relative px-3 pb-3 text-sm font-semibold text-slate-500 transition-colors hover:text-slate-800 dark:text-slate-300 dark:hover:text-white",
                active && "text-primary dark:text-primary"
              )}
            >
              {tab.label}
              {active ? (
                <span className="absolute inset-x-0 bottom-0 h-0.5 rounded-full bg-primary" />
              ) : null}
            </button>
          );
        })}
      </div>
    </div>
  );
}

