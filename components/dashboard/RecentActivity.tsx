import { ActivityItem } from "./ActivityItem";

type Activity = {
  actor: string;
  action: string;
  time: string;
  entity: string;
  href: string;
  avatar: string;
};

type Props = {
  items: Activity[];
};

export function RecentActivity({ items }: Props) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-[#111827]">
      <h2 className="mb-6 text-lg font-bold text-slate-900 dark:text-white">Recent Activity</h2>
      <div className="relative space-y-6 before:absolute before:left-3 before:top-2 before:bottom-2 before:w-[1px] before:bg-slate-200 dark:before:bg-white/10">
        {items.slice(0, 10).map((item) => (
          <ActivityItem key={item.time + item.actor + item.entity} {...item} />
        ))}
      </div>
    </div>
  );
}
