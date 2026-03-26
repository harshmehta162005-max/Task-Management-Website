"use client";

import { Bell, Menu, PlusCircle, ChevronDown, UserRound, LogOut, Settings, User } from "lucide-react";
import { useEffect, useRef, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { useClerk } from "@clerk/nextjs";
import { useShell } from "./useShell";
import { GlobalSearchTrigger } from "./GlobalSearchTrigger";
import { QuickCreateMenu } from "./QuickCreateMenu";
import { useCurrentUser } from "@/components/providers/UserProvider";
import { SearchProvider } from "@/components/search/SearchProvider";
import { GlobalCommandPalette } from "@/components/search/GlobalCommandPalette";

export function TopBar() {
  const { setMobileOpen } = useShell();
  const { user } = useCurrentUser();
  const { signOut } = useClerk();
  const router = useRouter();
  const params = useParams<{ workspaceSlug?: string }>();
  const workspaceSlug = params?.workspaceSlug ?? "workspace";
  const [notifyOpen, setNotifyOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const notifyRef = useRef<HTMLDivElement>(null);
  const userRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (notifyRef.current && !notifyRef.current.contains(e.target as Node)) setNotifyOpen(false);
      if (userRef.current && !userRef.current.contains(e.target as Node)) setUserOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    async function loadNotifications() {
      try {
        const res = await fetch("/api/notifications");
        if (res.ok) {
          const data = await res.json();
          setNotifications(data.slice(0, 5)); // Keep only top 5 for the popup
          setUnreadCount(data.filter((n: any) => !n.isRead).length);
        }
      } catch (err) {
        // Non-critical
      }
    }
    loadNotifications();
    const interval = setInterval(loadNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  const markAllRead = useCallback(async () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    setUnreadCount(0);
    try {
      await fetch("/api/notifications/read-all", { method: "POST" });
    } catch (err) {
      console.error(err);
    }
  }, []);

  const handleNotificationClick = async (n: any) => {
    setNotifyOpen(false);
    if (!n.isRead) {
      setNotifications((prev) => prev.map((item) => (item.id === n.id ? { ...item, isRead: true } : item)));
      setUnreadCount((c) => Math.max(0, c - 1));
      fetch("/api/notifications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: n.id }),
      }).catch(console.error);
    }
    if (n.link) {
      router.push(n.link);
    }
  };

  const firstName = user?.name?.split(" ")[0] ?? "User";
  const initials = user?.name
    ? user.name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase()
    : "?";

  return (
    <SearchProvider>
      <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200 bg-white/80 px-4 backdrop-blur-md dark:border-slate-800 dark:bg-background-dark/80 md:px-6">
        <div className="flex items-center gap-4">
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-slate-100 dark:hover:bg-slate-800 md:hidden"
            onClick={() => setMobileOpen(true)}
            aria-label="Open navigation"
          >
            <Menu className="h-5 w-5" />
          </button>
          <GlobalSearchTrigger />
        </div>

        <div className="flex items-center gap-2">
          <QuickCreateMenu />

          <div className="relative" ref={notifyRef}>
            <button
              type="button"
              className="relative inline-flex h-10 w-10 items-center justify-center rounded-xl text-slate-500 transition-colors hover:bg-slate-100 dark:hover:bg-slate-800"
              aria-label="Notifications"
              onClick={() => setNotifyOpen((v) => !v)}
            >
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="absolute right-2.5 top-2.5 inline-flex size-2 rounded-full bg-primary ring-2 ring-white dark:ring-background-dark" />
              )}
            </button>
            {notifyOpen && (
              <div className="absolute right-0 mt-2 w-80 rounded-2xl border border-slate-200 bg-white p-2 shadow-2xl ring-1 ring-black/5 dark:border-slate-700 dark:bg-[#0f172a] z-40">
                <div className="flex items-center justify-between px-2 pt-1 pb-2">
                  <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">Notifications</span>
                  {unreadCount > 0 && (
                    <button onClick={markAllRead} className="text-xs font-semibold text-primary hover:underline">
                      Mark all read
                    </button>
                  )}
                </div>
                <div className="flex flex-col gap-1">
                  {notifications.length === 0 ? (
                    <div className="py-6 text-center text-sm text-slate-500 dark:text-slate-400">
                      No notifications yet
                    </div>
                  ) : (
                    notifications.map((n) => (
                      <button
                        key={n.id}
                        onClick={() => handleNotificationClick(n)}
                        className={`flex flex-col items-start gap-1 rounded-xl p-2.5 text-left transition hover:bg-slate-50 dark:hover:bg-slate-800/50 ${
                          !n.isRead ? "bg-primary/5 dark:bg-primary/10" : ""
                        }`}
                      >
                        <div className="flex w-full items-start justify-between gap-2">
                          <span className={`text-sm ${!n.isRead ? "font-semibold text-slate-900 dark:text-white" : "font-medium text-slate-700 dark:text-slate-200"}`}>
                            {n.title}
                          </span>
                          {!n.isRead && <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />}
                        </div>
                        <span className="text-xs text-slate-500 dark:text-slate-400">{n.createdAt}</span>
                      </button>
                    ))
                  )}
                </div>
                <button
                  onClick={() => {
                    setNotifyOpen(false);
                    router.push(`/${workspaceSlug}/notifications`);
                  }}
                  className="mt-2 block w-full rounded-xl px-3 py-2 text-center text-sm font-semibold text-slate-600 transition hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800/50"
                >
                  View all notifications
                </button>
              </div>
            )}
          </div>

          <div className="mx-2 hidden h-8 w-px bg-slate-200 dark:bg-slate-800 sm:block" />

          <div className="relative" ref={userRef}>
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-1.5 py-1 pr-3 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
              aria-label="User menu"
              onClick={() => setUserOpen((v) => !v)}
            >
              <span className="flex size-8 items-center justify-center overflow-hidden rounded-full bg-slate-300">
                {user?.avatarUrl ? (
                  <img src={user.avatarUrl} alt={user.name ?? "User"} className="h-full w-full object-cover" />
                ) : (
                  <span className="text-xs font-bold text-primary">{initials}</span>
                )}
              </span>
              <span className="hidden sm:block">{firstName}</span>
              <ChevronDown className="h-4 w-4 text-slate-400" />
            </button>
            {userOpen && (
              <div className="absolute right-0 mt-2 w-48 rounded-2xl border border-slate-200 bg-white p-2 shadow-2xl ring-1 ring-black/5 dark:border-slate-700 dark:bg-[#0f172a] z-40">
                <button
                  className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
                  onClick={() => {
                    setUserOpen(false);
                    router.push("/profile");
                  }}
                >
                  <User className="h-4 w-4" /> Profile
                </button>
                <button
                  className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
                  onClick={() => {
                    setUserOpen(false);
                    router.push(`/${workspaceSlug}/settings`);
                  }}
                >
                  <Settings className="h-4 w-4" /> Settings
                </button>
                <button
                  className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-red-500 transition hover:bg-red-50 dark:hover:bg-red-500/10"
                  onClick={async () => {
                    await signOut();
                    router.push("/login");
                  }}
                >
                  <LogOut className="h-4 w-4" /> Log out
                </button>
              </div>
            )}
          </div>
        </div>
      </header>
      <GlobalCommandPalette />
    </SearchProvider>
  );
}

