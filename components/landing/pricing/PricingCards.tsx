"use client";

import { PricingCard } from "./PricingCard";

const plans = [
  {
    name: "Free",
    description: "For individuals getting started.",
    monthly: "$0",
    yearly: "$0",
    features: ["Up to 3 projects", "Basic AI summaries", "1GB Cloud storage"],
    ctaLabel: "Get Started",
    ctaHref: "/signup",
    checkColor: "#22D3EE",
  },
  {
    name: "Pro",
    description: "For growing teams and creators.",
    monthly: "$29",
    yearly: "$23",
    features: [
      "Unlimited projects",
      "Advanced AI meeting notes",
      "Workload insights",
      "Priority support",
    ],
    ctaLabel: "Upgrade Now",
    ctaHref: "/signup",
    highlighted: true,
    badge: "Most Popular",
    checkColor: "#6366F1",
  },
  {
    name: "Business",
    description: "Full control for large scale.",
    monthly: "$79",
    yearly: "$63",
    features: [
      "Custom AI training",
      "Enterprise security (SSO)",
      "Dedicated account manager",
    ],
    ctaLabel: "Contact Sales",
    ctaHref: "/signup",
    checkColor: "#22D3EE",
  },
];

type PricingCardsProps = {
  isYearly: boolean;
};

export function PricingCards({ isYearly }: PricingCardsProps) {
  return (
    <section className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 mb-32 px-6">
      {plans.map((plan, i) => (
        <PricingCard
          key={plan.name}
          name={plan.name}
          description={plan.description}
          price={isYearly ? plan.yearly : plan.monthly}
          period="/mo"
          features={plan.features}
          ctaLabel={plan.ctaLabel}
          ctaHref={plan.ctaHref}
          highlighted={plan.highlighted}
          badge={plan.badge}
          checkColor={plan.checkColor}
          index={i}
        />
      ))}
    </section>
  );
}
