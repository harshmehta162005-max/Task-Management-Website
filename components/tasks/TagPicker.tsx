"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Check, Plus, Search, X } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import type { WorkspaceTag } from "./task-drawer/types";
import { ColorPalettePicker } from "@/components/settings/tags/ColorPalettePicker";

type Props = {
  selectedTags: WorkspaceTag[];
  workspaceTags: WorkspaceTag[];
  onChange: (tags: WorkspaceTag[]) => void;
  canManageTags?: boolean;
  onTagCreated?: (tag: WorkspaceTag) => void;
  readOnly?: boolean;
  workspaceId?: string;
  workspaceSlug?: string;
};

export function TagPicker({
  selectedTags,
  workspaceTags,
  onChange,
  canManageTags = false,
  onTagCreated,
  readOnly = false,
  workspaceId,
  workspaceSlug,
}: Props) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [createName, setCreateName] = useState("");
  const [createColor, setCreateColor] = useState("#6366f1");
  const [creating, setCreating] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  // Debounced search value
  const [debouncedSearch, setDebouncedSearch] = useState("");
  useEffect(() => {
    debounceRef.current = setTimeout(() => setDebouncedSearch(search), 200);
    return () => clearTimeout(debounceRef.current);
  }, [search]);

  // Close on click outside
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
        setShowCreate(false);
        setSearch("");
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  // Focus search on open
  useEffect(() => {
    if (open) searchRef.current?.focus();
  }, [open]);

  const selectedIds = useMemo(() => new Set(selectedTags.map((t) => t.id)), [selectedTags]);

  const filtered = useMemo(() => {
    const q = debouncedSearch.toLowerCase().trim();
    if (!q) return workspaceTags;
    return workspaceTags.filter((t) => t.name.toLowerCase().includes(q));
  }, [workspaceTags, debouncedSearch]);

  const toggleTag = useCallback(
    (tag: WorkspaceTag) => {
      if (selectedIds.has(tag.id)) {
        onChange(selectedTags.filter((t) => t.id !== tag.id));
      } else {
        onChange([...selectedTags, tag]);
      }
    },
    [selectedTags, selectedIds, onChange]
  );

  const removeTag = useCallback(
    (tagId: string) => {
      onChange(selectedTags.filter((t) => t.id !== tagId));
    },
    [selectedTags, onChange]
  );

  const handleCreate = useCallback(async () => {
    if (!createName.trim() || !workspaceId || !workspaceSlug) return;
    setCreating(true);
    try {
      const res = await fetch(`/api/workspaces/${workspaceId}/tags`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: createName.trim(),
          color: createColor,
          workspaceSlug,
        }),
      });
      if (res.ok) {
        const newTag: WorkspaceTag & { usageCount: number } = await res.json();
        const tag: WorkspaceTag = { id: newTag.id, name: newTag.name, color: newTag.color };
        onTagCreated?.(tag);
        // Auto-select the new tag
        onChange([...selectedTags, tag]);
        setCreateName("");
        setCreateColor("#6366f1");
        setShowCreate(false);
      } else {
        const data = await res.json();
        alert(data.error || "Failed to create tag");
      }
    } catch {
      alert("Failed to create tag");
    } finally {
      setCreating(false);
    }
  }, [createName, createColor, workspaceId, workspaceSlug, selectedTags, onChange, onTagCreated]);

  return (
    <div className="space-y-2" ref={containerRef}>
      <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
        Tags
      </p>

      {/* Selected tag chips */}
      <div className="flex flex-wrap items-center gap-2">
        {selectedTags.map((tag) => (
          <span
            key={tag.id}
            className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold"
            style={{
              color: tag.color,
              backgroundColor: `${tag.color}1a`,
              borderColor: `${tag.color}33`,
            }}
          >
            <span
              className="inline-block h-2 w-2 rounded-full"
              style={{ backgroundColor: tag.color, boxShadow: `0 0 6px ${tag.color}80` }}
            />
            {tag.name}
            {!readOnly && (
              <button
                onClick={() => removeTag(tag.id)}
                className="ml-0.5 rounded-full p-0.5 transition hover:bg-black/10 dark:hover:bg-white/10"
              >
                <X className="h-3 w-3" />
              </button>
            )}
          </span>
        ))}

        {/* Add tag button */}
        {!readOnly && (
          <button
            onClick={() => setOpen(!open)}
            className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-500 transition hover:bg-slate-200 dark:bg-white/5 dark:text-slate-300 dark:hover:bg-white/10"
          >
            <Plus className="h-3.5 w-3.5" />
            Add tag
          </button>
        )}
      </div>

      {/* Picker popup */}
      {open && !readOnly && (
        <div className="relative z-50">
          <div
            className="absolute left-0 top-0 w-72 rounded-2xl border border-slate-200 bg-white shadow-xl dark:border-slate-700 dark:bg-[#0f172a]"
            style={{ animation: "tagPickerIn 0.15s ease-out" }}
          >
            {/* Search */}
            <div className="border-b border-slate-200 p-3 dark:border-slate-700">
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  ref={searchRef}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search tags..."
                  className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-slate-600 dark:bg-[#111827] dark:text-slate-100"
                />
              </div>
            </div>

            {/* Tag list */}
            <div className="max-h-56 overflow-y-auto p-1.5" style={{ scrollbarWidth: "thin" }}>
              {filtered.length === 0 ? (
                <p className="px-3 py-4 text-center text-xs text-slate-400">
                  {search ? "No tags found" : "No tags yet"}
                </p>
              ) : (
                filtered.map((tag) => {
                  const isSelected = selectedIds.has(tag.id);
                  return (
                    <button
                      key={tag.id}
                      onClick={() => toggleTag(tag)}
                      className={cn(
                        "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition",
                        isSelected
                          ? "bg-primary/5 dark:bg-primary/10"
                          : "hover:bg-slate-50 dark:hover:bg-white/5"
                      )}
                    >
                      {/* Color indicator */}
                      <span
                        className="h-3 w-3 flex-shrink-0 rounded-full"
                        style={{
                          backgroundColor: tag.color,
                          boxShadow: `0 0 8px ${tag.color}60`,
                        }}
                      />
                      {/* Tag name */}
                      <span className="flex-1 font-medium text-slate-800 dark:text-slate-200">
                        {tag.name}
                      </span>
                      {/* Checkbox indicator */}
                      <span
                        className={cn(
                          "flex h-5 w-5 items-center justify-center rounded-md border-2 transition",
                          isSelected
                            ? "border-primary bg-primary text-white"
                            : "border-slate-300 dark:border-slate-600"
                        )}
                      >
                        {isSelected && <Check className="h-3 w-3" />}
                      </span>
                    </button>
                  );
                })
              )}
            </div>

            {/* Create new tag (permission gated) */}
            {canManageTags && (
              <div className="border-t border-slate-200 dark:border-slate-700">
                {showCreate ? (
                  <div className="space-y-3 p-3">
                    <input
                      value={createName}
                      onChange={(e) => setCreateName(e.target.value)}
                      placeholder="Tag name..."
                      autoFocus
                      className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-slate-600 dark:bg-[#111827] dark:text-slate-100"
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && createName.trim()) handleCreate();
                      }}
                    />
                    <ColorPalettePicker value={createColor} onChange={setCreateColor} />
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => {
                          setShowCreate(false);
                          setCreateName("");
                        }}
                        className="rounded-lg px-3 py-1.5 text-xs font-semibold text-slate-500 hover:bg-slate-100 dark:hover:bg-white/5"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleCreate}
                        disabled={!createName.trim() || creating}
                        className="rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition hover:bg-primary/90 disabled:opacity-50"
                      >
                        {creating ? "Creating..." : "Create"}
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => setShowCreate(true)}
                    className="flex w-full items-center gap-2 px-4 py-3 text-sm font-semibold text-primary transition hover:bg-slate-50 dark:hover:bg-white/5"
                  >
                    <Plus className="h-4 w-4" />
                    Create new tag
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Animation keyframes */}
      <style jsx>{`
        @keyframes tagPickerIn {
          from {
            opacity: 0;
            transform: translateY(-6px) scale(0.97);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
      `}</style>
    </div>
  );
}
