"use client";

import { useState } from "react";
import { CreditCard } from "lucide-react";
import { UpdatePaymentModal } from "./UpdatePaymentModal";

type Props = {
  brand: string;
  last4: string;
  expMonth: number;
  expYear: number;
};

export function PaymentMethodCard({ brand, last4, expMonth, expYear }: Props) {
  const [open, setOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const handleSave = () => {
    setToast("Payment method updated (UI only)");
    setOpen(false);
    setTimeout(() => setToast(null), 1500);
  };

  return (
    <section className="relative rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-[#0f172a]">
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <CreditCard className="h-5 w-5" />
        </div>
        <div>
          <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">Payment</p>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Payment method</h2>
        </div>
      </div>
      <div className="mb-6 flex items-center gap-4 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-800 dark:bg-[#0f172a]/60">
        <div className="flex h-10 w-14 items-center justify-center rounded-lg bg-slate-200 text-xs font-black text-slate-700 dark:bg-slate-700 dark:text-white">
          {brand.toUpperCase()}
        </div>
        <div className="space-y-1">
          <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
            {brand} •••• {last4}
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Expires {String(expMonth).padStart(2, "0")}/{expYear}
          </p>
        </div>
      </div>
      <button
        onClick={() => setOpen(true)}
        className="w-full rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200"
      >
        Update payment method
      </button>

      <UpdatePaymentModal open={open} onClose={() => setOpen(false)} onSave={handleSave} />
      {toast && (
        <div className="absolute bottom-4 right-4 rounded-xl bg-slate-900 px-4 py-2 text-xs font-semibold text-white shadow-lg">
          {toast}
        </div>
      )}
    </section>
  );
}
