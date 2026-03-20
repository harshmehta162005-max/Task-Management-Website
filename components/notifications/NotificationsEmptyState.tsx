import Link from "next/link";
import { Bell } from "lucide-react";

export function NotificationsEmptyState() {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white px-8 py-16 text-center shadow-sm dark:border-slate-700 dark:bg-[#111827]">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
        <Bell className="h-7 w-7" />
      </div>
      <h3 className="text-lg font-semibold text-slate-900 dark:text-white">You’re all caught up</h3>
      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">No notifications right now.</p>
      <Link
        href="/dashboard"
        className="mt-4 inline-flex items-center justify-center rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-primary/90"
      >
        Go to dashboard
      </Link>
    </div>
  );
}

