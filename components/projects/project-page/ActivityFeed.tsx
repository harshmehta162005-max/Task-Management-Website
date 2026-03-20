import { ActivityItem } from "./ActivityItem";

type Activity = {
  id: string;
  avatar: string;
  actor: string;
  action: string;
  time: string;
  badge?: string;
};

type Props = {
  items: Activity[];
};

export function ActivityFeed({ items }: Props) {
  return (
    <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-[#0f172a]">
      {items.map((item) => (
        <ActivityItem key={item.id} {...item} />
      ))}
    </div>
  );
}

