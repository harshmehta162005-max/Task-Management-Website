"use client";

import { Bell, Mail } from "lucide-react";
import { cn } from "@/lib/utils/cn";

type Props = {
  inAppEnabled: boolean;
  emailEnabled: boolean;
  onToggleInApp: (value: boolean) => void;
  onToggleEmail: (value: boolean) => void;
};

export function ChannelsCard({ inAppEnabled, emailEnabled, onToggleInApp, onToggleEmail }: Props) {
  return (
    <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-[#0f172a]">
      <div className="flex items-center gap-3">
        <Bell className="h-5 w-5 text-primary" />
        <div>
          <p className="text-lg font-semibold text-slate-900 dark:text-white">Channels</p>
          <p className="text-sm text-slate-500 dark:text-slate-400">Where you’ll receive notifications.</p>
        </div>
      </div>

      <div className="space-y-3">
        <ChannelRow
          title="In-app notifications"
          description="Alerts inside the web and mobile apps."
          icon={<Bell className="h-4 w-4" />}
          enabled={inAppEnabled}
          onToggle={onToggleInApp}
        />
        <ChannelRow
          title="Email notifications"
          description="Emails sent to your account address."
          icon={<Mail className="h-4 w-4" />}
          enabled={emailEnabled}
          onToggle={onToggleEmail}
        />
      </div>
    </div>
  );
}

type RowProps = {
  title: string;
  description: string;
  icon: React.ReactNode;
  enabled: boolean;
  onToggle: (v: boolean) => void;
};

function ChannelRow({ title, description, icon, enabled, onToggle }: RowProps) {
  return (
    <div className="flex items-start justify-between gap-3 rounded-xl border border-slate-100 bg-slate-50 px-4 py-3 dark:border-slate-800 dark:bg-[#0d1422]">
      <div className="flex items-start gap-3">
        <div className="mt-1 flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">{icon}</div>
        <div>
          <p className="text-sm font-semibold text-slate-900 dark:text-white">{title}</p>
          <p className="text-xs text-slate-500 dark:text-slate-400">{description}</p>
        </div>
      </div>
      <Toggle enabled={enabled} onChange={onToggle} />
    </div>
  );
}

function Toggle({ enabled, onChange, disabled }: { enabled: boolean; onChange: (v: boolean) => void; disabled?: boolean }) {
  return (
    <button
      type="button"
      onClick={() => !disabled && onChange(!enabled)}
      className={cn(
        "relative h-6 w-11 rounded-full transition",
        enabled ? "bg-primary" : "bg-slate-300 dark:bg-slate-700",
        disabled && "cursor-not-allowed opacity-60"
      )}
      aria-pressed={enabled}
      aria-disabled={disabled}
    >
      <span
        className={cn(
          "absolute top-1/2 h-4 w-4 -translate-y-1/2 rounded-full bg-white shadow transition",
          enabled ? "right-1" : "left-1"
        )}
      />
    </button>
  );
}
