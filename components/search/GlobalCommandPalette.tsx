"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Folder, User, CheckSquare, Clock, X, Loader2, Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { AssignTaskModal } from "@/components/dashboard/AssignTaskModal";
import { CreateProjectModalWrapper } from "@/components/create/CreateProjectModalWrapper";
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
  const [loading, setLoading] = useState(false);
  const [fetchedResults, setFetchedResults] = useState<ResultItem[]>([]);
  const [recent, setRecent] = useState<ResultItem[]>([]);
  const [createType, setCreateType] = useState<"task" | "project" | null>(null);

  // load recents from localStorage once
  useEffect(() => {
    try {
      if (typeof window !== "undefined") {
        const stored = localStorage.getItem(`recent_searches_${ws}`);
        if (stored) {
          // Re-hydrate functions are impossible from JSON, so we just rebuild the ResultItem structure
          const parsed = JSON.parse(stored);
          const rebuilt: ResultItem[] = parsed.map((item: any) => ({
            ...item,
            icon: item.group === "Projects" ? <Folder className="h-4 w-4" /> : item.group === "Tasks" ? <Clock className="h-4 w-4" /> : <User className="h-4 w-4" />,
            onSelect: () => handleSelect(item),
          }));
          setRecent(rebuilt);
        }
      }
    } catch { }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ws]);

  const saveRecent = (item: ResultItem) => {
    try {
      const stored = localStorage.getItem(`recent_searches_${ws}`);
      let parsed = stored ? JSON.parse(stored) : [];
      // remove duplicate
      parsed = parsed.filter((p: any) => p.id !== item.id);

      // strip non-serializable jsx and function
      const serializable = {
        id: item.id,
        title: item.title,
        subtitle: item.subtitle,
        group: item.group,
        url: (item as any).url,
      };

      parsed.unshift(serializable);
      parsed = parsed.slice(0, 5); // Keep top 5
      localStorage.setItem(`recent_searches_${ws}`, JSON.stringify(parsed));

      const rebuilt: ResultItem[] = parsed.map((item: any) => ({
        ...item,
        icon: item.group === "Projects" ? <Folder className="h-4 w-4" /> : item.group === "Tasks" ? <Clock className="h-4 w-4" /> : <User className="h-4 w-4" />,
        onSelect: () => handleSelect(item),
      }));
      setRecent(rebuilt);
    } catch { }
  };

  const handleSelect = (item: any) => {
    saveRecent(item);
    if (item.url) router.push(item.url);
    setOpen(false);
  };

  // Debounced API fetch
  useEffect(() => {
    if (!query) {
      setFetchedResults([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const delay = setTimeout(async () => {
      let items: ResultItem[] = [];
      try {
        const res = await fetch(`/api/workspaces/${ws}/search?q=${encodeURIComponent(query)}`);
        if (!res.ok) throw new Error();
        const data = await res.json();

        data.projects?.forEach((p: any) => {
          items.push({
            id: `project-${p.id}`,
            title: p.name,
            subtitle: "Project",
            icon: <Folder className="h-4 w-4" />,
            group: "Projects",
            active: false,
            url: `/${ws}/projects/${p.id}`,
            onSelect: function () { handleSelect(this) },
          } as any);
        });

        data.tasks?.forEach((t: any) => {
          items.push({
            id: `task-${t.id}`,
            title: t.title,
            subtitle: `Status: ${t.status} • Project: ${t.projectName}`,
            icon: <CheckSquare className="h-4 w-4" />,
            group: "Tasks",
            active: false,
            url: `/${ws}/projects/${t.projectId}?taskId=${t.id}`,
            onSelect: function () { handleSelect(this) },
          } as any);
        });

        data.members?.forEach((m: any) => {
          items.push({
            id: `member-${m.id}`,
            title: m.name || m.email,
            subtitle: m.email,
            icon: <User className="h-4 w-4" />,
            group: "Members",
            active: false,
            url: `/${ws}/settings/members?memberId=${m.id}`,
            onSelect: function () { handleSelect(this) },
          } as any);
        });
      } catch {
        // silently fail search
      } finally {
        // Always add the Create Actions at the bottom
        const actions: any[] = [
          {
            id: "create-action-task",
            title: `Create task "${query}"`,
            subtitle: "Personal Task",
            icon: <Plus className="h-4 w-4" />,
            group: "Actions",
            active: false,
            onSelect: () => setCreateType("task"),
          },
          {
            id: "create-action-project",
            title: `Create project "${query}"`,
            subtitle: "Workspace Project",
            icon: <Plus className="h-4 w-4" />,
            group: "Actions",
            active: false,
            onSelect: () => setCreateType("project"),
          }
        ];

        setFetchedResults([...items, ...actions]);
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(delay);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, ws]);

  // Handle Focus, Esc, Click Outside
  useEffect(() => {
    if (open) {
      const t = setTimeout(() => inputRef.current?.focus(), 10);
      return () => clearTimeout(t);
    }
    setQuery("");
    setActiveIndex(0);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, setOpen]);

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

  // reset active index on empty query or new results
  useEffect(() => {
    setActiveIndex(0);
  }, [query, open, fetchedResults]);


  const selectable = query ? fetchedResults : recent;

  const selectableWithActive = selectable.map((item, idx) => ({
    ...item,
    active: idx === activeIndex,
  }));

  // arrow key navigation + enter
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveIndex((prev) => (selectableWithActive.length ? (prev + 1) % selectableWithActive.length : 0));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveIndex((prev) => (selectableWithActive.length ? (prev - 1 + selectableWithActive.length) % selectableWithActive.length : 0));
      } else if (e.key === "Enter") {
        if (selectableWithActive[activeIndex]) {
          e.preventDefault();
          selectableWithActive[activeIndex].onSelect();
        }
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [activeIndex, open, selectableWithActive]);

  const content = useMemo(
    () => (
      <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 backdrop-blur-sm px-3 py-16 sm:px-4 md:py-20">
        <div
          ref={containerRef}
          className={cn(
            "flex max-h-fit w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl ring-1 ring-white/40 dark:border-slate-800 dark:bg-[#0f172a] dark:ring-white/5",
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
            {loading && <Loader2 className="h-4 w-4 animate-spin text-slate-400" />}
            <button
              onClick={() => setOpen(false)}
              className="hidden h-10 w-10 items-center justify-center rounded-xl text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-white/5 sm:flex"
              aria-label="Close command palette"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-3">
            <SearchResults
              items={query ? selectableWithActive : []}
              recent={!query ? selectableWithActive : []}
              query={query}
              onCreateTask={() => { setCreateType("task"); setOpen(false); }}
              onCreateProject={() => { setCreateType("project"); setOpen(false); }}
            />
          </div>

          <div className="flex items-center justify-between border-t border-slate-200 bg-slate-50/50 px-4 py-3 text-[11px] font-medium text-slate-500 dark:border-slate-800 dark:bg-slate-900/50 dark:text-slate-400">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1.5">
                <kbd className="rounded-lg border border-slate-200 bg-white px-1.5 py-0.5 text-[10px] font-semibold text-slate-500 shadow-sm dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
                  Enter
                </kbd>
                <span>to select</span>
              </span>
              <span className="flex items-center gap-1.5">
                <kbd className="rounded-lg border border-slate-200 bg-white px-1.5 py-0.5 text-[10px] font-semibold text-slate-500 shadow-sm dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
                  ↓↑
                </kbd>
                <span>to navigate</span>
              </span>
            </div>

            <div className="flex items-center gap-3">
              <kbd className="rounded-lg border border-slate-200 bg-white px-1.5 py-0.5 text-[10px] font-semibold text-slate-500 shadow-sm dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
                Esc
              </kbd>
              <span>to close</span>
            </div>
          </div>
        </div>
      </div>
    ),
    [selectableWithActive, query, setOpen, loading]
  );

  // if neither is open, don't render anything globally
  if (!open && !createType) return null;
  if (typeof document === "undefined") return null;

  return (
    <>
      {open && createPortal(content, document.body)}
      <AssignTaskModal workspaceSlug={ws} open={createType === "task"} onClose={() => { setCreateType(null); setOpen(false); }} initialTitle={query} />
      <CreateProjectModalWrapper open={createType === "project"} onClose={() => { setCreateType(null); setOpen(false); }} initialName={query} />
    </>
  );
}
