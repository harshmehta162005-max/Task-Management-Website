"use client";

import { SettingsLayout } from "@/components/settings/SettingsLayout";
import { NotificationPreferencesForm } from "@/components/settings/notifications/NotificationPreferencesForm";

export default function SettingsNotificationsPage() {
  return (
    <main className="min-h-screen px-4 py-8 text-slate-900 dark:text-slate-100 sm:px-6 lg:px-8">
      <SettingsLayout>
        <div className="space-y-6">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">Notifications</h1>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Choose what you want to be notified about.
              </p>
            </div>
          </div>

          <NotificationPreferencesForm />
        </div>
      </SettingsLayout>
    </main>
  );
}
