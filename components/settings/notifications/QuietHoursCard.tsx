"use client";

import { Moon } from "lucide-react";
import { cn } from "@/lib/utils/cn";

type Props = {
  enabled: boolean;
  start: string;
  end: string;
  timezone: string;
  onToggle: (v: boolean) => void;
  onChange: (field: "start" | "end", value: string) => void;
};

export function QuietHoursCard({ enabled, start, end, timezone, onToggle, onChange }: Props) {
  return (
    <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-[#0f172a]">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Moon className="h-5 w-5 text-primary" />
          <div>
            <p className="text-lg font-semibold text-slate-900 dark:text-white">Quiet hours</p>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Mute non-critical notifications during a set time window.
            </p>
          </div>
        </div>
        <Toggle enabled={enabled} onChange={onToggle} />
      </div>

      <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-end">
        <TimeField
          label="Start"
          value={start}
          disabled={!enabled}
          onChange={(v) => onChange("start", v)}
        />
        <span className="text-slate-400">→</span>
        <TimeField
          label="End"
          value={end}
          disabled={!enabled}
          onChange={(v) => onChange("end", v)}
        />
      </div>
      <p className="text-xs text-slate-500 dark:text-slate-400">Timezone: {timezone}</p>
    </div>
  );
}

function TimeField({
  label,
  value,
  onChange,
  disabled,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  disabled?: boolean;
}) {
  return (
    <div className="w-full space-y-2">
      <label className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">{label}</label>
      <input
        type="time"
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
        className={cn(
          "w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-slate-700 dark:bg-[#111827] dark:text-slate-100",
          disabled && "cursor-not-allowed opacity-60"
        )}
      />
    </div>
  );
}

function Toggle({ enabled, onChange }: { enabled: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!enabled)}
      className={cn("relative h-6 w-11 rounded-full transition", enabled ? "bg-primary" : "bg-slate-300 dark:bg-slate-700")}
      aria-pressed={enabled}
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
