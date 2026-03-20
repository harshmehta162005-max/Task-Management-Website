"use client";

import { useMemo, useState } from "react";
import { ChannelsCard } from "./ChannelsCard";
import { EventsCard, EventKey } from "./EventsCard";
import { WeeklySummaryCard } from "./WeeklySummaryCard";
import { QuietHoursCard } from "./QuietHoursCard";
import { PreferencesSkeleton } from "./PreferencesSkeleton";

export type PreferencesState = {
  inAppEnabled: boolean;
  emailEnabled: boolean;
  events: Record<EventKey, boolean>;
  weeklySummary: { enabled: boolean; day: string; time: string };
  quietHours: { enabled: boolean; start: string; end: string; timezone: string };
};

const INITIAL_PREFS: PreferencesState = {
  inAppEnabled: true,
  emailEnabled: true,
  events: {
    assignment: true,
    mention: true,
    dueSoon: false,
    comment: true,
    statusChange: true,
  },
  weeklySummary: { enabled: true, day: "Friday", time: "09:00" },
  quietHours: { enabled: false, start: "22:00", end: "08:00", timezone: "UTC" },
};

export function NotificationPreferencesForm() {
  const [prefs, setPrefs] = useState<PreferencesState>(INITIAL_PREFS);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loading] = useState(false);

  const dirty = useMemo(() => JSON.stringify(prefs) !== JSON.stringify(INITIAL_PREFS), [prefs]);

  const toggleEvent = (key: EventKey, value: boolean) => {
    setPrefs((p) => ({ ...p, events: { ...p.events, [key]: value } }));
  };

  const toggleChannel = (channel: "inAppEnabled" | "emailEnabled", value: boolean) => {
    setPrefs((p) => ({ ...p, [channel]: value }));
  };

  const save = () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 1600);
    }, 600);
  };

  if (loading) return <PreferencesSkeleton />;

  return (
    <div className="space-y-6">
      <ChannelsCard
        inAppEnabled={prefs.inAppEnabled}
        emailEnabled={prefs.emailEnabled}
        onToggleInApp={(v) => toggleChannel("inAppEnabled", v)}
        onToggleEmail={(v) => toggleChannel("emailEnabled", v)}
      />

      <EventsCard values={prefs.events} disabled={!prefs.emailEnabled} onChange={toggleEvent} />

      <WeeklySummaryCard
        enabled={prefs.weeklySummary.enabled}
        day={prefs.weeklySummary.day}
        time={prefs.weeklySummary.time}
        onToggle={(v) => setPrefs((p) => ({ ...p, weeklySummary: { ...p.weeklySummary, enabled: v } }))}
        onDayChange={(day) => setPrefs((p) => ({ ...p, weeklySummary: { ...p.weeklySummary, day } }))}
        onTimeChange={(time) => setPrefs((p) => ({ ...p, weeklySummary: { ...p.weeklySummary, time } }))}
      />

      <QuietHoursCard
        enabled={prefs.quietHours.enabled}
        start={prefs.quietHours.start}
        end={prefs.quietHours.end}
        timezone={prefs.quietHours.timezone}
        onToggle={(v) => setPrefs((p) => ({ ...p, quietHours: { ...p.quietHours, enabled: v } }))}
        onChange={(field, value) =>
          setPrefs((p) => ({ ...p, quietHours: { ...p.quietHours, [field]: value } }))
        }
      />

      <div className="flex items-center justify-end gap-3">
        {saved && <span className="text-xs font-semibold text-emerald-500">Preferences saved</span>}
        <button
          onClick={save}
          disabled={!dirty || saving}
          className="inline-flex items-center rounded-xl bg-primary px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:bg-primary/60"
        >
          {saving ? "Saving…" : "Save changes"}
        </button>
      </div>
    </div>
  );
}
