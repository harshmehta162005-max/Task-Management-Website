"use client";

import { InvoiceRow } from "./InvoiceRow";

type Invoice = {
  id: string;
  date: string;
  amount: string;
  status: "Paid" | "Open";
};

type Props = {
  invoices: Invoice[];
  onDownload?: (id: string) => void;
};

export function InvoicesCard({ invoices, onDownload }: Props) {
  const hasInvoices = invoices.length > 0;
  return (
    <section className="rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-[#0f172a]">
      <div className="flex items-center gap-3 border-b border-slate-200 px-6 py-4 dark:border-slate-800">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">📄</div>
        <div>
          <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">Invoices</p>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Billing history</h2>
        </div>
      </div>
      {hasInvoices ? (
        <div className="overflow-x-auto">
          <table className="min-w-full text-left">
            <thead className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
              <tr className="border-b border-slate-200 dark:border-slate-800">
                <th className="px-4 py-3">Invoice</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Amount</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((inv) => (
                <InvoiceRow key={inv.id} invoice={inv} onDownload={onDownload} />
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="px-6 py-10 text-center text-sm text-slate-500 dark:text-slate-400">No invoices yet.</div>
      )}
    </section>
  );
}
