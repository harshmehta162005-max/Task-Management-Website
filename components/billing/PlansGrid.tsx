"use client";

import { PlanCard } from "./PlanCard";

type Plan = {
  id: string;
  name: string;
  price: string;
  period?: string;
  features: string[];
  highlighted?: boolean;
  badge?: string;
  ctaLabel: string;
  disabled?: boolean;
};

type Props = {
  plans: Plan[];
  onSelect: (id: string) => void;
};

export function PlansGrid({ plans, onSelect }: Props) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-[#0f172a]">
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">💳</div>
        <div>
          <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">Plans</p>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Available plans</h2>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {plans.map((plan) => (
          <PlanCard key={plan.id} {...plan} onSelect={() => onSelect(plan.id)} />
        ))}
      </div>
    </section>
  );
}
