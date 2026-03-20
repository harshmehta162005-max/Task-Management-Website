"use client";

type Props = {
  title?: string;
  subtitle?: string;
};

export function BillingHeader({
  title = "Billing",
  subtitle = "Manage your subscription and invoices.",
}: Props) {
  return (
    <header className="space-y-1 pb-4">
      <h1 className="text-3xl font-semibold tracking-tight text-slate-900 dark:text-white">{title}</h1>
      <p className="text-slate-600 dark:text-slate-400">{subtitle}</p>
    </header>
  );
}
