import { Download } from "lucide-react";

type Invoice = {
  id: string;
  date: string;
  amount: string;
  status: "Paid" | "Open";
};

type Props = {
  invoice: Invoice;
  onDownload?: (id: string) => void;
};

const statusColor: Record<Invoice["status"], string> = {
  Paid: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
  Open: "bg-amber-500/10 text-amber-600 border-amber-500/20",
};

export function InvoiceRow({ invoice, onDownload }: Props) {
  return (
    <tr className="border-b border-slate-100 last:border-0 dark:border-slate-800">
      <td className="px-4 py-3 text-sm font-semibold text-slate-900 dark:text-slate-100">{invoice.id}</td>
      <td className="px-4 py-3 text-sm text-slate-500 dark:text-slate-400">{invoice.date}</td>
      <td className="px-4 py-3 text-sm font-semibold text-slate-900 dark:text-slate-100">{invoice.amount}</td>
      <td className="px-4 py-3">
        <span className={`inline-flex rounded-full border px-2 py-0.5 text-[11px] font-semibold ${statusColor[invoice.status]}`}>
          {invoice.status}
        </span>
      </td>
      <td className="px-4 py-3 text-right">
        <button
          onClick={() => onDownload?.(invoice.id)}
          className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-sm font-semibold text-slate-500 transition hover:text-primary"
        >
          <Download className="h-4 w-4" /> PDF
        </button>
      </td>
    </tr>
  );
}
