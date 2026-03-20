"use client";

import { useMemo, useState } from "react";
import { BillingHeader } from "@/components/billing/BillingHeader";
import { CurrentPlanCard } from "@/components/billing/CurrentPlanCard";
import { SeatUsageCard } from "@/components/billing/SeatUsageCard";
import { PaymentMethodCard } from "@/components/billing/PaymentMethodCard";
import { PlansGrid } from "@/components/billing/PlansGrid";
import { InvoicesCard } from "@/components/billing/InvoicesCard";
import { BillingSkeleton } from "@/components/billing/BillingSkeleton";
import { useParams } from "next/navigation";

const billingData = {
  currentPlan: "Pro",
  status: "Active" as const,
  pricePerSeat: "₹499 / user / month",
  nextBillingDate: "Oct 24, 2026",
  seatsUsed: 8,
  seatsTotal: 10,
  activeMembers: 7,
  invitedMembers: 1,
};

const paymentMethod = {
  brand: "Visa",
  last4: "4242",
  expMonth: 12,
  expYear: 2026,
};

const plans = [
  {
    id: "free",
    name: "Free",
    price: "₹0",
    period: "/mo",
    features: ["2 users", "1 GB storage", "Community support", "Single workspace"],
    ctaLabel: "Downgrade",
  },
  {
    id: "pro",
    name: "Pro",
    price: "₹499",
    period: "/mo",
    features: ["Up to 10 users", "50 GB storage", "Priority support", "Custom domains", "Advanced analytics"],
    highlighted: true,
    badge: "Most popular",
    ctaLabel: "Current plan",
    disabled: true,
  },
  {
    id: "business",
    name: "Business",
    price: "₹1200",
    period: "/mo",
    features: ["Unlimited users", "500 GB storage", "24/7 support", "SSO & Security", "API access"],
    ctaLabel: "Upgrade",
  },
];

const invoices = [
  { id: "INV-001", date: "Sep 24, 2025", amount: "₹4,990", status: "Paid" as const },
  { id: "INV-002", date: "Aug 24, 2025", amount: "₹4,990", status: "Paid" as const },
  { id: "INV-003", date: "Jul 24, 2025", amount: "₹4,990", status: "Paid" as const },
];

export default function BillingPage() {
  const params = useParams<{ workspaceSlug: string }>();
  const ws = params.workspaceSlug;
  const [loading] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const handlePlanAction = (id: string) => {
    setToast(`Plan action triggered: ${id} (UI only)`);
    setTimeout(() => setToast(null), 1200);
  };

  const handleDownload = (id: string) => {
    setToast(`Invoice ${id} download (UI only)`);
    setTimeout(() => setToast(null), 1200);
  };

  const membersHref = useMemo(() => `/${ws}/settings/members`, [ws]);

  if (loading) return <BillingSkeleton />;

  return (
    <main className="mx-auto max-w-6xl px-4 py-8 space-y-6">
      <BillingHeader />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div className="space-y-6 lg:col-span-5">
          <CurrentPlanCard
            planName={billingData.currentPlan}
            status={billingData.status}
            price={billingData.pricePerSeat}
            nextBillingDate={billingData.nextBillingDate}
          />
          <SeatUsageCard
            seatsUsed={billingData.seatsUsed}
            seatsTotal={billingData.seatsTotal}
            activeMembers={billingData.activeMembers}
            invitedMembers={billingData.invitedMembers}
            membersHref={membersHref}
          />
          <PaymentMethodCard {...paymentMethod} />
        </div>
        <div className="space-y-6 lg:col-span-7">
          <PlansGrid
            plans={plans}
            onSelect={(id) => handlePlanAction(id)}
          />
          <InvoicesCard invoices={invoices} onDownload={handleDownload} />
        </div>
      </div>
      {toast && (
        <div className="fixed bottom-6 right-6 rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-xl">
          {toast}
        </div>
      )}
    </main>
  );
}
