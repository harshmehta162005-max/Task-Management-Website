"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
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
    personal: true,
    project: true,
    workspace: true,
    ai: true,
  },
  weeklySummary: { enabled: true, day: "Friday", time: "09:00" },
  quietHours: { enabled: false, start: "22:00", end: "08:00", timezone: "UTC" },
};

/** Map API response fields → PreferencesState */
function apiToState(api: Record<string, unknown>): PreferencesState {
  return {
    inAppEnabled: (api.inAppEnabled as boolean) ?? true,
    emailEnabled: (api.emailEnabled as boolean) ?? true,
    events: {
      personal: (api.notifyCategoryPersonal as boolean) ?? true,
      project: (api.notifyCategoryProject as boolean) ?? true,
      workspace: (api.notifyCategoryWorkspace as boolean) ?? true,
      ai: (api.notifyCategoryAi as boolean) ?? true,
    },
    weeklySummary: {
      enabled: (api.weeklySummaryEnabled as boolean) ?? true,
      day: (api.weeklySummaryDay as string) ?? "Friday",
      time: (api.weeklySummaryTime as string) ?? "09:00",
    },
    quietHours: {
      enabled: (api.quietHoursEnabled as boolean) ?? false,
      start: (api.quietHoursStart as string) ?? "22:00",
      end: (api.quietHoursEnd as string) ?? "08:00",
      timezone: (api.quietHoursTimezone as string) ?? "UTC",
    },
  };
}

/** Map PreferencesState → API PATCH body */
function stateToApi(state: PreferencesState): Record<string, unknown> {
  return {
    inAppEnabled: state.inAppEnabled,
    emailEnabled: state.emailEnabled,
    notifyCategoryPersonal: state.events.personal,
    notifyCategoryProject: state.events.project,
    notifyCategoryWorkspace: state.events.workspace,
    notifyCategoryAi: state.events.ai,
    weeklySummaryEnabled: state.weeklySummary.enabled,
    weeklySummaryDay: state.weeklySummary.day,
    weeklySummaryTime: state.weeklySummary.time,
    quietHoursEnabled: state.quietHours.enabled,
    quietHoursStart: state.quietHours.start,
    quietHoursEnd: state.quietHours.end,
    quietHoursTimezone: state.quietHours.timezone,
  };
}

export function NotificationPreferencesForm() {
  const [prefs, setPrefs] = useState<PreferencesState>(INITIAL_PREFS);
  const [serverPrefs, setServerPrefs] = useState<PreferencesState>(INITIAL_PREFS);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch settings on mount
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/user/notification-settings");
        if (!res.ok) throw new Error("Failed to load settings");
        const data = await res.json();
        if (cancelled) return;
        const state = apiToState(data);
        setPrefs(state);
        setServerPrefs(state);
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : "Failed to load settings");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const dirty = useMemo(() => JSON.stringify(prefs) !== JSON.stringify(serverPrefs), [prefs, serverPrefs]);

  const toggleEvent = useCallback((key: EventKey, value: boolean) => {
    setPrefs((p) => ({ ...p, events: { ...p.events, [key]: value } }));
  }, []);

  const toggleChannel = useCallback((channel: "inAppEnabled" | "emailEnabled", value: boolean) => {
    setPrefs((p) => ({ ...p, [channel]: value }));
  }, []);

  const save = useCallback(async () => {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/user/notification-settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(stateToApi(prefs)),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to save");
      }
      const data = await res.json();
      const newState = apiToState(data);
      setPrefs(newState);
      setServerPrefs(newState);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save settings");
    } finally {
      setSaving(false);
    }
  }, [prefs]);

  if (loading) return <PreferencesSkeleton />;

  return (
    <div className="space-y-6">
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-600 dark:border-red-900 dark:bg-red-950 dark:text-red-400">
          {error}
        </div>
      )}

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
