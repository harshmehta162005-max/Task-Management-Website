"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Folder, User, CheckSquare, Clock, X } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useSearch } from "./SearchProvider";
import { SearchInput } from "./SearchInput";
import { SearchResults, ResultItem } from "./SearchResults";
import { cn } from "@/lib/utils/cn";

export function GlobalCommandPalette() {
  const { open, setOpen } = useSearch();
  const router = useRouter();
  const params = useParams<{ workspaceSlug: string }>();
  const ws = params?.workspaceSlug ?? "workspace";
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);

  // focus input when opened
  useEffect(() => {
    if (open) {
      const t = setTimeout(() => inputRef.current?.focus(), 10);
      return () => clearTimeout(t);
    }
    setQuery("");
    setActiveIndex(0);
  }, [open]);

  // close on escape
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, setOpen]);

  // click outside to close
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open, setOpen]);

  const tasks = useMemo(
    () => [
      { id: "task_1", title: "Fix mobile nav crash", projectId: "mobile-app", status: "IN_PROGRESS", dueDate: "Tomorrow" },
      { id: "task_2", title: "Draft Q4 roadmap", projectId: "strategy", status: "TODO", dueDate: "Friday" },
      { id: "task_3", title: "Design empty state", projectId: "design-system", status: "DONE", dueDate: "Yesterday" },
    ],
    []
  );
  const projects = useMemo(
    () => [
      { id: "mobile-app", name: "Mobile App" },
      { id: "design-system", name: "Design System" },
      { id: "strategy", name: "Strategy & Ops" },
    ],
    []
  );
  const members = useMemo(
    () => [
      { id: "alex", name: "Alex Rivera", email: "alex@acme.com" },
      { id: "sarah", name: "Sarah Chen", email: "sarah@acme.com" },
      { id: "marcus", name: "Marcus Wright", email: "marcus@acme.com" },
    ],
    []
  );

  const filteredItems: ResultItem[] = useMemo(() => {
    const q = query.toLowerCase();
    const match = (text: string) => text.toLowerCase().includes(q);
    const items: ResultItem[] = [];

    tasks
      .filter((t) => match(t.title))
      .forEach((t) =>
        items.push({
          id: `task-${t.id}`,
          title: t.title,
          subtitle: `Status: ${t.status}`,
          icon: <CheckSquare className="h-4 w-4" />,
          group: "Tasks",
          active: false,
          onSelect: () => {
            router.push(`/${ws}/projects/${t.projectId}?taskId=${t.id}`);
            setOpen(false);
          },
        })
      );

    projects
      .filter((p) => match(p.name))
      .forEach((p) =>
        items.push({
          id: `project-${p.id}`,
          title: p.name,
          subtitle: "Project",
          icon: <Folder className="h-4 w-4" />,
          group: "Projects",
          active: false,
          onSelect: () => {
            router.push(`/${ws}/projects/${p.id}`);
            setOpen(false);
          },
        })
      );

    members
      .filter((m) => match(m.name) || match(m.email))
      .forEach((m) =>
        items.push({
          id: `member-${m.id}`,
          title: m.name,
          subtitle: m.email,
          icon: <User className="h-4 w-4" />,
          group: "Members",
          active: false,
          onSelect: () => {
            router.push(`/${ws}/settings/members?memberId=${m.id}`);
            setOpen(false);
          },
        })
      );

    return items;
  }, [members, projects, query, router, setOpen, tasks, ws]);

  // reset active index on open/query change
  useEffect(() => {
    setActiveIndex(0);
  }, [query, open]);

  const itemsWithActive = filteredItems.map((item, idx) => ({ ...item, active: idx === activeIndex }));

  const recent: ResultItem[] = useMemo(
    () => [
      {
        id: "recent-project",
        title: "Mobile App",
        subtitle: "Project",
        icon: <Folder className="h-4 w-4" />,
        group: "Projects",
        active: activeIndex === 0,
        onSelect: () => {
          router.push(`/${ws}/projects/mobile-app`);
          setOpen(false);
        },
      },
      {
        id: "recent-task",
        title: "Fix mobile nav crash",
        subtitle: "Task · Mobile App",
        icon: <Clock className="h-4 w-4" />,
        group: "Tasks",
        active: activeIndex === 1,
        onSelect: () => {
          router.push(`/${ws}/projects/mobile-app?taskId=task_1`);
          setOpen(false);
        },
      },
      {
        id: "recent-member",
        title: "Sarah Chen",
        subtitle: "Member",
        icon: <User className="h-4 w-4" />,
        group: "Members",
        active: activeIndex === 2,
        onSelect: () => {
          router.push(`/${ws}/settings/members?memberId=sarah`);
          setOpen(false);
        },
      },
    ],
    [activeIndex, router, setOpen, ws]
  );

  const selectable = query ? itemsWithActive : recent;

  // arrow key navigation + enter
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveIndex((prev) => (selectable.length ? (prev + 1) % selectable.length : 0));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveIndex((prev) => (selectable.length ? (prev - 1 + selectable.length) % selectable.length : 0));
      } else if (e.key === "Enter") {
        if (selectable[activeIndex]) {
          e.preventDefault();
          selectable[activeIndex].onSelect();
        }
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [activeIndex, open, selectable]);

  const content = useMemo(
    () => (
      <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 backdrop-blur-sm px-3 py-16 sm:px-4 md:py-20">
        <div
          ref={containerRef}
          className={cn(
            "w-full max-w-2xl rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-[#0f172a]",
            "ring-1 ring-white/40 dark:ring-white/5"
          )}
          role="dialog"
          aria-modal="true"
        >
          <div className="flex items-center gap-2 border-b border-slate-200 px-4 py-3 dark:border-slate-800">
            <SearchInput
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search tasks, projects, members…"
              aria-label="Global search"
            />
            <button
              onClick={() => setOpen(false)}
              className="hidden h-10 w-10 items-center justify-center rounded-xl text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-white/5 sm:flex"
              aria-label="Close command palette"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="max-h-[60vh] overflow-y-auto p-3">
            <SearchResults items={itemsWithActive} recent={recent} query={query} />
          </div>

          <div className="flex items-center justify-between border-t border-slate-200 px-4 py-3 text-[11px] font-medium text-slate-500 dark:border-slate-800 dark:text-slate-400">
            <div className="flex items-center gap-3">
              <kbd className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-[10px] font-semibold text-slate-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
                Enter
              </kbd>
              <span>to select</span>
            </div>
            <div className="flex items-center gap-3">
              <kbd className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-[10px] font-semibold text-slate-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
                Esc
              </kbd>
              <span>to close</span>
            </div>
          </div>
        </div>
      </div>
    ),
    [activeIndex, itemsWithActive, query, recent, setOpen]
  );

  if (!open) return null;
  if (typeof document === "undefined") return null;
  return createPortal(content, document.body);
}
