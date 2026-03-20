"use client";

import { FeatureCard } from "./FeatureCard";
import {
  LayoutGrid,
  Zap,
  Users,
  BarChart3,
  Brain,
  Settings2,
} from "lucide-react";

const features = [
  {
    icon: <LayoutGrid className="w-6 h-6" />,
    title: "Project Management",
    description: "Glassmorphic planning boards designed for modern workflows and complex hierarchies.",
    accentColor: "#6366F1",
  },
  {
    icon: <Zap className="w-6 h-6" />,
    title: "Task Execution",
    description: "High-velocity execution engines that turn strategy into measurable daily outcomes.",
    accentColor: "#22D3EE",
  },
  {
    icon: <Users className="w-6 h-6" />,
    title: "Team Collaboration",
    description: "Seamless real-time syncing across continents with built-in presence and chat.",
    accentColor: "#ffffff",
  },
  {
    icon: <BarChart3 className="w-6 h-6" />,
    title: "Smart Insights",
    description: "Predictive data analytics that spot bottlenecks before they impact your delivery.",
    accentColor: "#6366F1",
  },
  {
    icon: <Brain className="w-6 h-6" />,
    title: "AI Assistance",
    description: "Generative agent support that drafts content, summarizes meetings, and organizes files.",
    accentColor: "#22D3EE",
  },
  {
    icon: <Settings2 className="w-6 h-6" />,
    title: "Automation",
    description: "No-code workflow triggers that handle the repetitive tasks so you can focus on creativity.",
    accentColor: "#ffffff",
  },
];

export function FeaturesGrid() {
  return (
    <section className="max-w-7xl mx-auto px-6 py-24">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature, i) => (
          <FeatureCard
            key={feature.title}
            icon={feature.icon}
            title={feature.title}
            description={feature.description}
            accentColor={feature.accentColor}
            index={i}
          />
        ))}
      </div>
    </section>
  );
}
