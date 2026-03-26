"use client";

import { SettingsNav } from "./SettingsNav";

export function SettingsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-[260px_1fr]">
      <aside className="space-y-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">Settings</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Manage workspace profile and configuration.
          </p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm dark:border-slate-800 dark:bg-[#0f172a]">
          <SettingsNav />
        </div>
      </aside>
      <section className="min-w-0 space-y-8">{children}</section>
    </div>
  );
}
