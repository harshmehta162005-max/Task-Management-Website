"use client";

import { BellRing, User, FolderOpen, Building2, Bot } from "lucide-react";
import { cn } from "@/lib/utils/cn";

export type EventKey = "personal" | "project" | "workspace" | "ai";

type Props = {
  values: Record<EventKey, boolean>;
  disabled?: boolean;
  onChange: (key: EventKey, value: boolean) => void;
};

const EVENTS: { key: EventKey; label: string; desc: string; icon: typeof User }[] = [
  { key: "personal", label: "Personal", desc: "Assignments, mentions, comments, status changes, and due dates.", icon: User },
  { key: "project", label: "Project", desc: "Task activity, member updates, and project risk alerts.", icon: FolderOpen },
  { key: "workspace", label: "Workspace", desc: "System notifications and workspace-level updates.", icon: Building2 },
  { key: "ai", label: "AI", desc: "AI-detected blockers, extracted tasks, and weekly summaries.", icon: Bot },
];

export function EventsCard({ values, disabled, onChange }: Props) {
  return (
    <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-[#0f172a]">
      <div className="flex items-center gap-3">
        <BellRing className="h-5 w-5 text-primary" />
        <div>
          <p className="text-lg font-semibold text-slate-900 dark:text-white">Events</p>
          <p className="text-sm text-slate-500 dark:text-slate-400">Choose which events trigger notifications.</p>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        {EVENTS.map((evt) => {
          const Icon = evt.icon;
          return (
            <div
              key={evt.key}
              className="flex items-start justify-between gap-3 rounded-xl border border-slate-100 px-4 py-3 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-white/5"
            >
              <div className="flex items-start gap-3 pr-3">
                <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Icon className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">{evt.label}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{evt.desc}</p>
                </div>
              </div>
              <Toggle
                enabled={values[evt.key]}
                disabled={disabled}
                onChange={(v) => onChange(evt.key, v)}
              />
            </div>
          );
        })}
      </div>
      {disabled && (
        <p className="text-xs font-semibold text-amber-600 dark:text-amber-400">Enable email to edit these preferences.</p>
      )}
    </div>
  );
}

function Toggle({ enabled, onChange, disabled }: { enabled: boolean; onChange: (v: boolean) => void; disabled?: boolean }) {
  return (
    <button
      type="button"
      onClick={() => !disabled && onChange(!enabled)}
      className={cn(
        "relative h-5 w-10 rounded-full transition",
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
