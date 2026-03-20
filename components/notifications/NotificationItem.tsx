import Link from "next/link";
import { Bell, AtSign, AlertTriangle, CheckCircle2, MessageCircle, Clock } from "lucide-react";
import type { ComponentType } from "react";
import { Notification } from "./types";
import { cn } from "@/lib/utils/cn";

const typeIcon: Record<Notification["type"], ComponentType<{ className?: string }>> = {
  MENTION: AtSign,
  ASSIGNED: CheckCircle2,
  DUE_SOON: Clock,
  COMMENT: MessageCircle,
  SYSTEM: AlertTriangle,
};

export function NotificationItem({ notification, onOpen }: { notification: Notification; onOpen: (id: string) => void }) {
  const Icon = typeIcon[notification.type] ?? Bell;

  return (
    <Link
      href={notification.link}
      onClick={(e) => {
        e.preventDefault();
        onOpen(notification.id);
      }}
      className={cn(
        "flex gap-4 border-b border-slate-100 px-5 py-4 transition hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800/40",
        !notification.isRead && "bg-primary/5 dark:bg-primary/10"
      )}
    >
      <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-primary dark:bg-slate-800">
        <Icon className="h-5 w-5" />
      </div>
      <div className="flex flex-1 flex-col gap-1">
        <div className="flex items-start justify-between gap-2">
          <p className="text-sm font-semibold text-slate-900 dark:text-white">{notification.title}</p>
          <span className="text-[11px] font-medium uppercase tracking-wide text-slate-400 dark:text-slate-500">
            {notification.createdAt}
          </span>
        </div>
        <p className="text-sm text-slate-500 line-clamp-2 dark:text-slate-400">{notification.message}</p>
      </div>
      <div className="flex items-center">
        {!notification.isRead ? <span className="h-2.5 w-2.5 rounded-full bg-primary" /> : null}
      </div>
    </Link>
  );
}
