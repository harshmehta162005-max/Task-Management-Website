"use client";

import { useState } from "react";
import { DeleteAccountDialog } from "./DeleteAccountDialog";

type Props = {
  email: string;
};

export function DeleteAccountCard({ email }: Props) {
  const [open, setOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const confirm = () => {
    setToast("Account deletion simulated (UI only)");
    setOpen(false);
    setTimeout(() => setToast(null), 2000);
  };

  return (
    <>
      <section className="rounded-2xl border border-red-500/30 bg-red-500/5 p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-red-600 dark:text-red-400">Danger Zone</h2>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Once you delete your account, there is no going back. Please be certain.
            </p>
          </div>
          <button
            onClick={() => setOpen(true)}
            className="rounded-xl bg-red-500 px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-red-500/20 transition hover:bg-red-600"
          >
            Delete account
          </button>
        </div>
      </section>
      <DeleteAccountDialog open={open} onClose={() => setOpen(false)} onConfirm={confirm} email={email} />
      {toast && (
        <div className="fixed bottom-6 right-6 rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white shadow-xl">
          {toast}
        </div>
      )}
    </>
  );
}
