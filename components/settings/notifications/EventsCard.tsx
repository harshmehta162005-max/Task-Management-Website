"use client";

import { BellRing } from "lucide-react";
import { cn } from "@/lib/utils/cn";

export type EventKey = "assignment" | "mention" | "dueSoon" | "comment" | "statusChange";

type Props = {
  values: Record<EventKey, boolean>;
  disabled?: boolean;
  onChange: (key: EventKey, value: boolean) => void;
};

const EVENTS: { key: EventKey; label: string; desc: string }[] = [
  { key: "assignment", label: "Assignments", desc: "When someone assigns a task to you." },
  { key: "mention", label: "Mentions", desc: "When you’re @mentioned in a discussion." },
  { key: "dueSoon", label: "Due soon", desc: "Upcoming deadlines for tasks you own or follow." },
  { key: "comment", label: "Comments", desc: "New comments on tasks you follow." },
  { key: "statusChange", label: "Status changes", desc: "Task status updates on items you own." },
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
        {EVENTS.map((evt) => (
          <div
            key={evt.key}
            className="flex items-start justify-between gap-3 rounded-xl border border-slate-100 px-4 py-3 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-white/5"
          >
            <div className="pr-3">
              <p className="text-sm font-semibold text-slate-900 dark:text-white">{evt.label}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">{evt.desc}</p>
            </div>
            <Toggle
              enabled={values[evt.key]}
              disabled={disabled}
              onChange={(v) => onChange(evt.key, v)}
            />
          </div>
        ))}
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
