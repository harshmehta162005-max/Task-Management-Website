"use client";

import { useState } from "react";

export function PasswordCard() {
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const disabled = !current || next.length < 8 || next !== confirm;

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-[#0f172a]">
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">🔒</div>
        <div>
          <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">Security</p>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Password</h2>
        </div>
      </div>
      <div className="space-y-4 max-w-xl">
        <Field label="Current password">
          <input
            type="password"
            value={current}
            onChange={(e) => setCurrent(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm shadow-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-slate-700 dark:bg-[#0f172a] dark:text-slate-100"
          />
        </Field>
        <Field label="New password">
          <input
            type="password"
            value={next}
            onChange={(e) => setNext(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm shadow-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-slate-700 dark:bg-[#0f172a] dark:text-slate-100"
          />
        </Field>
        <Field label="Confirm new password">
          <input
            type="password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm shadow-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-slate-700 dark:bg-[#0f172a] dark:text-slate-100"
          />
        </Field>
        <p className="text-xs text-slate-500 dark:text-slate-400">Use at least 8 characters.</p>
        <button
          disabled={disabled}
          className="rounded-xl bg-primary px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-primary/20 transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          Update password
        </button>
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
