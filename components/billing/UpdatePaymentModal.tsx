"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils/cn";

type Props = {
  open: boolean;
  onClose: () => void;
  onSave?: (card: { number: string; exp: string; cvc: string }) => void;
};

export function UpdatePaymentModal({ open, onClose, onSave }: Props) {
  const [number, setNumber] = useState("");
  const [exp, setExp] = useState("");
  const [cvc, setCvc] = useState("");
  const disabled = number.length < 12 || !exp || cvc.length < 3;

  useEffect(() => {
    if (!open) {
      setNumber("");
      setExp("");
      setCvc("");
    }
  }, [open]);

  if (!open) return null;

  const handleSave = () => {
    if (disabled) return;
    onSave?.({ number, exp, cvc });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4 py-10">
      <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-[#0f172a]">
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4 dark:border-slate-800">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Update payment method</h3>
          <button onClick={onClose} className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="space-y-4 px-5 py-4">
          <Field label="Card number">
            <input
              value={number}
              onChange={(e) => setNumber(e.target.value)}
              placeholder="4242 4242 4242 4242"
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm shadow-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-slate-700 dark:bg-[#0f172a] dark:text-slate-100"
            />
          </Field>
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Expiry (MM/YY)">
              <input
                value={exp}
                onChange={(e) => setExp(e.target.value)}
                placeholder="12/26"
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm shadow-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-slate-700 dark:bg-[#0f172a] dark:text-slate-100"
              />
            </Field>
            <Field label="CVC">
              <input
                value={cvc}
                onChange={(e) => setCvc(e.target.value)}
                placeholder="123"
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm shadow-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-slate-700 dark:bg-[#0f172a] dark:text-slate-100"
              />
            </Field>
          </div>
        </div>
        <div className="flex items-center justify-end gap-3 border-t border-slate-200 px-5 py-4 dark:border-slate-800">
          <button
            onClick={onClose}
            className="rounded-xl px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-white/5"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={disabled}
            className={cn(
              "rounded-xl bg-primary px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-primary/20 transition hover:bg-primary/90",
              disabled && "opacity-60"
            )}
          >
            Save
          </button>
        </div>
      </div>
    </div>
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
