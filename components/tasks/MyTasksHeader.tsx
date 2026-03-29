"use client";

import { useState, useRef, useEffect } from "react";
import {
  CalendarCheck,
  AlertTriangle,
  Loader2,
  Clock,
  CheckCircle2,
  Search,
  ChevronDown,
  Folder,
  Flag,
  Check,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { AnimatePresence, motion } from "framer-motion";

type SummaryStats = {
  dueToday: number;
  overdue: number;
  inProgress: number;
  waitingForYou: number;
  completedThisWeek: number;
};

type FilterTab = "all" | "dueToday" | "overdue" | "inProgress" | "waiting" | "completed" | "createdByMe";

type Props = {
  stats: SummaryStats;
  activeTab: FilterTab;
  onTabChange: (tab: FilterTab) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  projectFilter: string;
  onProjectFilterChange: (v: string) => void;
  priorityFilter: string;
  onPriorityFilterChange: (v: string) => void;
  projects: { id: string; name: string }[];
  onOpenCreateModal: () => void;
};

const SUMMARY_CARDS = [
  { key: "dueToday" as const, label: "Due Today", icon: CalendarCheck, color: "indigo" },
  { key: "overdue" as const, label: "Overdue", icon: AlertTriangle, color: "rose" },
  { key: "inProgress" as const, label: "In Progress", icon: Loader2, color: "blue" },
  { key: "waitingForYou" as const, label: "Waiting for You", icon: Clock, color: "amber" },
  { key: "completedThisWeek" as const, label: "Done This Week", icon: CheckCircle2, color: "emerald" },
] as const;

const COLOR_MAP: Record<string, { bg: string; text: string; glow: string }> = {
  indigo: {
    bg: "bg-indigo-500/10 dark:bg-indigo-500/15",
    text: "text-indigo-600 dark:text-indigo-400",
    glow: "shadow-[0_0_20px_rgba(99,102,241,0.12)]",
  },
  rose: {
    bg: "bg-rose-500/10 dark:bg-rose-500/15",
    text: "text-rose-600 dark:text-rose-400",
    glow: "shadow-[0_0_20px_rgba(244,63,94,0.12)]",
  },
  blue: {
    bg: "bg-blue-500/10 dark:bg-blue-500/15",
    text: "text-blue-600 dark:text-blue-400",
    glow: "shadow-[0_0_20px_rgba(59,130,246,0.12)]",
  },
  amber: {
    bg: "bg-amber-500/10 dark:bg-amber-500/15",
    text: "text-amber-600 dark:text-amber-400",
    glow: "shadow-[0_0_20px_rgba(245,158,11,0.12)]",
  },
  emerald: {
    bg: "bg-emerald-500/10 dark:bg-emerald-500/15",
    text: "text-emerald-600 dark:text-emerald-400",
    glow: "shadow-[0_0_20px_rgba(16,185,129,0.12)]",
  },
};

const TABS: { key: FilterTab; label: string }[] = [
  { key: "all", label: "All" },
  { key: "dueToday", label: "Due Today" },
  { key: "overdue", label: "Overdue" },
  { key: "inProgress", label: "In Progress" },
  { key: "waiting", label: "Waiting" },
  { key: "completed", label: "Completed" },
  { key: "createdByMe", label: "Created by Me" },
];

const PRIORITIES = [
  { value: "", label: "All Priorities", dot: "bg-slate-400" },
  { value: "URGENT", label: "Urgent", dot: "bg-red-500" },
  { value: "HIGH", label: "High", dot: "bg-rose-400" },
  { value: "MEDIUM", label: "Medium", dot: "bg-amber-400" },
  { value: "LOW", label: "Low", dot: "bg-blue-400" },
];

/* ── Custom Dropdown Component ── */
function FilterDropdown({
  value,
  onChange,
  options,
  icon: Icon,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string; dot?: string }[];
  icon: React.ComponentType<{ className?: string }>;
  placeholder: string;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const selected = options.find((o) => o.value === value);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "flex h-9 items-center gap-2 rounded-xl px-3 pr-8 text-xs font-semibold outline-none cursor-pointer transition-all duration-200",
          "bg-white/80 border border-slate-200/80 text-slate-600",
          "hover:border-slate-300 hover:bg-white hover:shadow-sm",
          "dark:bg-[#151a23]/90 dark:border-[#2a2f3d] dark:text-slate-300",
          "dark:hover:border-[#3a3f4d] dark:hover:bg-[#1a1f2e]",
          "backdrop-blur-sm",
          open && "ring-2 ring-indigo-500/25 border-indigo-300 dark:ring-indigo-500/20 dark:border-indigo-500/30"
        )}
        style={{ fontFamily: "Inter, sans-serif" }}
      >
        <Icon className="h-3.5 w-3.5 text-slate-400 dark:text-slate-500" />
        {selected?.dot && (
          <span className={cn("h-2 w-2 rounded-full", selected.dot)} />
        )}
        <span>{selected?.label ?? placeholder}</span>
        <ChevronDown
          className={cn(
            "absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400 transition-transform duration-200",
            open && "rotate-180"
          )}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -4, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.97 }}
            transition={{ duration: 0.15, ease: [0.4, 0, 0.2, 1] }}
            className={cn(
              "absolute right-0 top-full z-50 mt-2 min-w-[180px] overflow-hidden rounded-xl py-1.5",
              "bg-white border border-slate-200/80 shadow-xl shadow-black/5",
              "dark:bg-[#151a23] dark:border-[#2a2f3d] dark:shadow-black/40",
              "backdrop-blur-xl"
            )}
          >
            {options.map((opt) => {
              const isActive = opt.value === value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => {
                    onChange(opt.value);
                    setOpen(false);
                  }}
                  className={cn(
                    "flex w-full items-center gap-2.5 px-3.5 py-2 text-left text-xs font-medium transition-all duration-150",
                    isActive
                      ? "bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400"
                      : "text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-white/5"
                  )}
                  style={{ fontFamily: "Inter, sans-serif" }}
                >
                  {opt.dot && (
                    <span className={cn("h-2 w-2 shrink-0 rounded-full", opt.dot)} />
                  )}
                  <span className="flex-1">{opt.label}</span>
                  {isActive && (
                    <Check className="h-3.5 w-3.5 shrink-0 text-indigo-500 dark:text-indigo-400" />
                  )}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function MyTasksHeader({
  stats,
  activeTab,
  onTabChange,
  searchQuery,
  onSearchChange,
  projectFilter,
  onProjectFilterChange,
  priorityFilter,
  onPriorityFilterChange,
  projects,
  onOpenCreateModal,
}: Props) {
  const hour = new Date().getHours();
  let greeting = "Good evening";
  if (hour < 12) greeting = "Good morning";
  else if (hour < 17) greeting = "Good afternoon";

  const projectOptions = [
    { value: "", label: "All Projects" },
    ...projects.map((p) => ({ value: p.id, label: p.name })),
  ];

  return (
    <header className="mb-8 space-y-6">
      {/* ── Greeting ── */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100" style={{ fontFamily: "Manrope, sans-serif" }}>
            {greeting}
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400" style={{ fontFamily: "Inter, sans-serif" }}>
            Here&apos;s your briefing. Let&apos;s get things done.
          </p>
        </div>
        <button
          onClick={onOpenCreateModal}
          className="flex h-10 items-center gap-2 rounded-xl bg-indigo-600 px-4 text-sm font-semibold text-white shadow-md shadow-indigo-600/20 hover:bg-indigo-700 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
          style={{ fontFamily: "Inter, sans-serif" }}
        >
          <span className="text-[16px] leading-none">+</span>
          Personal Task
        </button>
      </div>

      {/* ── Summary Cards ── */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {SUMMARY_CARDS.map((card) => {
          const value = stats[card.key];
          const colors = COLOR_MAP[card.color];
          const Icon = card.icon;
          return (
            <button
              key={card.key}
              type="button"
              onClick={() => onTabChange(card.key === "completedThisWeek" ? "completed" : card.key === "waitingForYou" ? "waiting" : card.key)}
              className={cn(
                "group flex items-center gap-3 rounded-2xl px-4 py-3.5 transition-all duration-200",
                "bg-white/80 dark:bg-[#1e1e2d]/80",
                "hover:scale-[1.02] hover:shadow-lg",
                colors.glow,
                activeTab === (card.key === "completedThisWeek" ? "completed" : card.key === "waitingForYou" ? "waiting" : card.key)
                  && "ring-2 ring-indigo-500/40 dark:ring-indigo-400/30"
              )}
            >
              <div className={cn("flex h-10 w-10 items-center justify-center rounded-xl", colors.bg)}>
                <Icon className={cn("h-5 w-5", colors.text)} />
              </div>
              <div className="text-left">
                <p className="text-lg font-bold text-slate-900 dark:text-slate-100" style={{ fontFamily: "Manrope, sans-serif" }}>
                  {value}
                </p>
                <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400">{card.label}</p>
              </div>
            </button>
          );
        })}
      </div>

      {/* ── Smart Filters Bar ── */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Tabs */}
        <div className="flex flex-wrap gap-1 rounded-xl bg-slate-100/80 p-1 dark:bg-[#12121e]/80 backdrop-blur-sm border border-slate-200/60 dark:border-white/5">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => onTabChange(tab.key)}
              className={cn(
                "rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-all duration-200",
                activeTab === tab.key
                  ? "bg-white text-indigo-600 shadow-sm ring-1 ring-black/5 dark:bg-[#1e1e2d] dark:text-indigo-400 dark:ring-white/10"
                  : "text-slate-500 hover:text-slate-700 hover:bg-white/50 dark:text-slate-400 dark:hover:text-slate-200 dark:hover:bg-white/5"
              )}
              style={{ fontFamily: "Inter, sans-serif" }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search + Filters */}
        <div className="flex items-center gap-2.5">
          {/* Search Input */}
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-indigo-500 dark:group-focus-within:text-indigo-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search tasks..."
              className="h-9 w-52 rounded-xl bg-white/80 pl-9 pr-3 text-xs font-medium text-slate-700 outline-none transition-all duration-200 border border-slate-200/80 placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-500/25 focus:border-indigo-300 dark:bg-[#12121e]/80 dark:border-white/10 dark:text-slate-200 dark:placeholder:text-slate-500 dark:focus:ring-indigo-500/20 dark:focus:border-indigo-500/30 backdrop-blur-sm"
              style={{ fontFamily: "Inter, sans-serif" }}
            />
          </div>

          {/* Project Filter — Custom Dropdown */}
          <FilterDropdown
            value={projectFilter}
            onChange={onProjectFilterChange}
            options={projectOptions}
            icon={Folder}
            placeholder="All Projects"
          />

          {/* Priority Filter — Custom Dropdown */}
          <FilterDropdown
            value={priorityFilter}
            onChange={onPriorityFilterChange}
            options={PRIORITIES}
            icon={Flag}
            placeholder="All Priorities"
          />
        </div>
      </div>
    </header>
  );
}
