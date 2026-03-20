import { Notification } from "./types";
import { NotificationItem } from "./NotificationItem";
import { NotificationsEmptyState } from "./NotificationsEmptyState";

type Props = {
  notifications: Notification[];
  onOpen: (id: string) => void;
};

export function NotificationsList({ notifications, onOpen }: Props) {
  if (!notifications.length) return <NotificationsEmptyState />;

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-[#111827]">
      {notifications.map((n) => (
        <NotificationItem key={n.id} notification={n} onOpen={onOpen} />
      ))}
    </div>
  );
}

