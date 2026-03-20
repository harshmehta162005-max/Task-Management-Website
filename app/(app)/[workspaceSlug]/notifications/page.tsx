"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { MarkAllReadButton } from "@/components/notifications/MarkAllReadButton";
import { NotificationFilters, FilterType } from "@/components/notifications/NotificationFilters";
import { NotificationsList } from "@/components/notifications/NotificationsList";
import { NotificationsSkeleton } from "@/components/notifications/NotificationsSkeleton";
import type { Notification } from "@/components/notifications/types";

export default function NotificationsPage() {
  const { workspaceSlug } = useParams<{ workspaceSlug: string }>();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [filter, setFilter] = useState<FilterType>("ALL");
  const [unreadOnly, setUnreadOnly] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fetch notifications from API
  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/notifications");
        if (!res.ok) throw new Error("Failed to load");
        const data = await res.json();
        setNotifications(data);
      } catch (err) {
        console.error("Error loading notifications:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const filtered = useMemo(() => {
    return notifications.filter((n) => {
      const typeMatch = filter === "ALL" || n.type === filter;
      const unreadMatch = !unreadOnly || !n.isRead;
      return typeMatch && unreadMatch;
    });
  }, [notifications, filter, unreadOnly]);

  const markAllRead = async () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    try {
      await fetch("/api/notifications/read-all", { method: "POST" });
    } catch (err) {
      console.error("Failed to mark all as read:", err);
    }
  };

  const openNotification = async (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)));
    try {
      await fetch("/api/notifications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
    } catch (err) {
      console.error("Failed to mark notification as read:", err);
    }
  };

  return (
    <main className="min-h-screen px-4 py-8 text-slate-900 dark:text-slate-100 sm:px-6 lg:px-8">
      <header className="mb-6 flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">Notifications</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Workspace {workspaceSlug}</p>
        </div>
        <MarkAllReadButton onClick={markAllRead} disabled={notifications.every((n) => n.isRead)} />
      </header>

      <NotificationFilters
        active={filter}
        unreadOnly={unreadOnly}
        onChange={setFilter}
        onToggleUnread={setUnreadOnly}
      />

      <div className="mt-6">
        {loading ? <NotificationsSkeleton /> : <NotificationsList notifications={filtered} onOpen={openNotification} />}
      </div>
    </main>
  );
}
