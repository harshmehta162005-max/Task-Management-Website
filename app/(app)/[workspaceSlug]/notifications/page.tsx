"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
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

  // Fetch notifications
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

  // Trigger workspace computed notifications for admins
  useEffect(() => {
    async function checkWorkspace() {
      try {
        const res = await fetch("/api/dashboard?workspaceSlug=" + workspaceSlug);
        if (!res.ok) return;
        const data = await res.json();
        if (data.workspaceId) {
          await fetch("/api/notifications/check-workspace", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ workspaceId: data.workspaceId }),
          });
        }
      } catch {
        // Non-critical
      }
    }
    if (workspaceSlug) checkWorkspace();
  }, [workspaceSlug]);

  // Filter by category instead of type
  const filtered = useMemo(() => {
    return notifications.filter((n) => {
      const categoryMatch = filter === "ALL" || n.category === filter;
      const unreadMatch = !unreadOnly || !n.isRead;
      return categoryMatch && unreadMatch;
    });
  }, [notifications, filter, unreadOnly]);

  const unreadCount = useMemo(() => notifications.filter((n) => !n.isRead).length, [notifications]);

  const markAllRead = useCallback(async () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    try {
      await fetch("/api/notifications/read-all", { method: "POST" });
    } catch (err) {
      console.error("Failed to mark all as read:", err);
    }
  }, []);

  const openNotification = useCallback(async (id: string) => {
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
  }, []);

  return (
    <main className="min-h-screen px-4 py-8 text-slate-900 dark:text-slate-100 sm:px-6 lg:px-8">
      <header className="mb-6 flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">Notifications</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {unreadCount > 0 ? `${unreadCount} unread` : "All caught up"} · {workspaceSlug}
          </p>
        </div>
        <MarkAllReadButton onClick={markAllRead} disabled={unreadCount === 0} />
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
