"use client";

import { cn } from "@/lib/utils/cn";

type Props = {
  planName: string;
  status: "Active" | "Trial" | "Past due";
  price: string;
  nextBillingDate: string;
  onManage?: () => void;
  onCancel?: () => void;
};

const statusColor: Record<Props["status"], string> = {
  Active: "bg-emerald-500/10 text-emerald-600 border-emerald-500/30",
  Trial: "bg-amber-500/10 text-amber-600 border-amber-500/30",
  "Past due": "bg-red-500/10 text-red-600 border-red-500/30",
};

export function CurrentPlanCard({ planName, status, price, nextBillingDate, onManage, onCancel }: Props) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-[#0f172a]">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="mb-2 flex items-center gap-2">
            <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100">{planName} Plan</h3>
            <span className={cn("rounded-full border px-2.5 py-0.5 text-[11px] font-semibold", statusColor[status])}>
              {status}
            </span>
          </div>
          <p className="text-slate-500 dark:text-slate-400">{price}</p>
        </div>
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">₹</div>
      </div>

      <div className="mt-6 space-y-3">
        <div className="flex justify-between text-sm text-slate-600 dark:text-slate-300">
          <span>Next billing date</span>
          <span className="font-semibold text-slate-900 dark:text-slate-100">{nextBillingDate}</span>
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-2 sm:flex-row">
        <button
          onClick={onManage}
          className="inline-flex flex-1 items-center justify-center rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-sm shadow-primary/20 transition hover:bg-primary/90"
        >
          Manage plan
        </button>
        <button
          onClick={onCancel}
          className="inline-flex flex-1 items-center justify-center rounded-xl border border-red-500/40 px-4 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-500/5"
        >
          Cancel subscription
        </button>
      </div>
    </section>
  );
}
