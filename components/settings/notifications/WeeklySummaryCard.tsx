"use client";

import { CalendarClock } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { Select } from "@/components/ui/Select";

type Props = {
  enabled: boolean;
  day: string;
  time: string;
  onToggle: (v: boolean) => void;
  onDayChange: (day: string) => void;
  onTimeChange: (time: string) => void;
};

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
const TIMES = ["08:00", "09:00", "10:00", "13:00", "18:00"];

export function WeeklySummaryCard({ enabled, day, time, onToggle, onDayChange, onTimeChange }: Props) {
  return (
    <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-[#0f172a]">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <CalendarClock className="h-5 w-5 text-primary" />
          <div>
            <p className="text-lg font-semibold text-slate-900 dark:text-white">Weekly summary</p>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Receive a digest of activity and risky tasks once a week.
            </p>
          </div>
        </div>
        <Toggle enabled={enabled} onChange={onToggle} />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field
          label="Delivery day"
          value={day}
          onChange={onDayChange}
          disabled={!enabled}
          options={DAYS.map((d) => ({ value: d, label: d }))}
        />
        <Field
          label="Time"
          value={time}
          onChange={onTimeChange}
          disabled={!enabled}
          options={TIMES.map((t) => ({ value: t, label: t }))}
        />
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  options,
  disabled,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  disabled?: boolean;
}) {
  return (
    <div className="space-y-2">
      <label className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">{label}</label>
      <Select
        value={value}
        onChange={onChange}
        options={options}
        className={cn(disabled && "opacity-60 pointer-events-none")}
        portal={false}
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
