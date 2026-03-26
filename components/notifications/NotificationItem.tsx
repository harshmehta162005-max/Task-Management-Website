import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Bell, AtSign, AlertTriangle, CheckCircle2, MessageCircle, Clock,
  Plus, UserPlus, UserMinus, FileText, AlertOctagon, Bot, Sparkles, ListChecks,
  ArrowRightLeft,
} from "lucide-react";
import type { ComponentType } from "react";
import { Notification } from "./types";
import { cn } from "@/lib/utils/cn";

const typeIcon: Record<string, ComponentType<{ className?: string }>> = {
  MENTION: AtSign,
  ASSIGNED: UserPlus,
  COMMENT: MessageCircle,
  STATUS_CHANGE: ArrowRightLeft,
  DUE_SOON: Clock,
  SYSTEM: AlertTriangle,
  TASK_CREATED: Plus,
  TASK_COMPLETED: CheckCircle2,
  NOTE_ADDED: FileText,
  PROJECT_MEMBER_ADDED: UserPlus,
  PROJECT_MEMBER_REMOVED: UserMinus,
  PROJECT_AT_RISK: AlertOctagon,
  TASKS_OVERDUE_BULK: Clock,
  AI_BLOCKERS_DETECTED: AlertTriangle,
  AI_WEEKLY_SUMMARY: Sparkles,
  AI_TASKS_EXTRACTED: ListChecks,
};

const categoryColor: Record<string, string> = {
  personal: "bg-violet-100 text-violet-600 dark:bg-violet-900/30 dark:text-violet-400",
  project: "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400",
  workspace: "bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400",
  ai: "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400",
};

export function NotificationItem({ notification, onOpen }: { notification: Notification; onOpen: (id: string) => void }) {
  const Icon = typeIcon[notification.type] ?? Bell;
  const router = useRouter();

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    onOpen(notification.id);
    if (notification.link) {
      router.push(notification.link);
    }
  };

  return (
    <a
      href={notification.link || "#"}
      onClick={handleClick}
      className={cn(
        "flex gap-4 border-b border-slate-100 px-5 py-4 transition hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800/40 cursor-pointer",
        !notification.isRead && "bg-primary/5 dark:bg-primary/10"
      )}
    >
      <div className={cn(
        "mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl",
        categoryColor[notification.category] ?? "bg-slate-100 text-primary dark:bg-slate-800"
      )}>
        <Icon className="h-5 w-5" />
      </div>
      <div className="flex flex-1 flex-col gap-1">
        <div className="flex items-start justify-between gap-2">
          <p className="text-sm font-semibold text-slate-900 dark:text-white">{notification.title}</p>
          <span className="text-[11px] font-medium uppercase tracking-wide text-slate-400 dark:text-slate-500 shrink-0">
            {notification.createdAt}
          </span>
        </div>
        <p className="text-sm text-slate-500 line-clamp-2 dark:text-slate-400">{notification.message}</p>
        {notification.actorName && (
          <p className="mt-0.5 text-xs text-slate-400 dark:text-slate-500">by {notification.actorName}</p>
        )}
      </div>
      <div className="flex items-center">
        {!notification.isRead ? <span className="h-2.5 w-2.5 rounded-full bg-primary" /> : null}
      </div>
    </a>
  );
}
