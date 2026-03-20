"use client";

import { useParams, useRouter } from "next/navigation";
import { Select } from "@/components/ui/Select";

type Props = {
  timezone: string;
  language: string;
  onTimezoneChange: (tz: string) => void;
  onLanguageChange: (lang: string) => void;
};

const timezones = [
  "(GMT+05:30) India Standard Time - Kolkata",
  "(GMT+00:00) UTC",
  "(GMT-08:00) Pacific Time",
];

const languages = ["English (United States)", "Spanish", "French", "German"];

export function PreferencesCard({ timezone, language, onTimezoneChange, onLanguageChange }: Props) {
  const router = useRouter();
  const params = useParams<{ workspaceSlug?: string }>();
  const ws = params?.workspaceSlug ?? "workspace";

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-[#0f172a]">
      <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">⚙️</div>
          <div>
            <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">Preferences</p>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">App preferences</h2>
          </div>
        </div>
        <button
          onClick={() => router.push(`/${ws}/settings/notifications`)}
          className="inline-flex items-center gap-2 rounded-xl bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
        >
          🔔 Manage notifications
        </button>
      </div>
      <div className="grid gap-5 md:grid-cols-2">
        <Field label="Timezone">
          <Select
            value={timezone}
            onChange={(v) => onTimezoneChange(v)}
            options={timezones.map((tz) => ({ value: tz, label: tz }))}
            portal={false}
          />
        </Field>
        <Field label="Language">
          <Select
            value={language}
            onChange={(v) => onLanguageChange(v)}
            options={languages.map((lang) => ({ value: lang, label: lang }))}
            portal={false}
          />
        </Field>
      </div>
    </section>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">{label}</label>
      {children}
    </div>
  );
}
