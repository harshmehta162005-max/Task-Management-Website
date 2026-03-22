"use client";

import { Bell, Menu, PlusCircle, ChevronDown, UserRound, LogOut, Settings, User } from "lucide-react";
import { useEffect, useRef, useState } from "react";
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

  const notifications = [
    { id: "1", title: "Design review at 4 PM", time: "10m ago" },
    { id: "2", title: "Alice mentioned you in Brand Kit", time: "32m ago" },
    { id: "3", title: "2 tasks are due today", time: "1h ago" },
  ];

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
              <span className="absolute right-2.5 top-2.5 inline-flex size-2 rounded-full bg-primary ring-2 ring-white dark:ring-background-dark" />
            </button>
            {notifyOpen && (
              <div className="absolute right-0 mt-2 w-72 rounded-2xl border border-slate-200 bg-white p-2 shadow-2xl ring-1 ring-black/5 dark:border-slate-700 dark:bg-[#0f172a] z-40">
                <div className="px-2 pb-2 text-sm font-semibold text-slate-700 dark:text-slate-100">Notifications</div>
                <div className="divide-y divide-slate-200 dark:divide-slate-800">
                  {notifications.map((n) => (
                    <div key={n.id} className="py-2 px-2 text-sm text-slate-700 dark:text-slate-200">
                      <div className="font-semibold">{n.title}</div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">{n.time}</div>
                    </div>
                  ))}
                </div>
                <button className="mt-2 w-full rounded-xl px-3 py-2 text-sm font-semibold text-primary hover:bg-primary/10">
                  Mark all read
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

