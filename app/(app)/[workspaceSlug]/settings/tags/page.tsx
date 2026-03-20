"use client";

import { useMemo, useState } from "react";
import { SettingsLayout } from "@/components/settings/SettingsLayout";
import { TagsHeader } from "@/components/settings/tags/TagsHeader";
import { TagsTable } from "@/components/settings/tags/TagsTable";
import { CreateTagModal } from "@/components/settings/tags/CreateTagModal";
import { DeleteTagDialog } from "@/components/settings/tags/DeleteTagDialog";
import { TagItem } from "@/components/settings/tags/TagRow";
import { Search } from "lucide-react";

const INITIAL_TAGS: TagItem[] = [
  { id: "t1", name: "Bug", color: "#ef4444", usageCount: 42 },
  { id: "t2", name: "Feature", color: "#6366f1", usageCount: 128 },
  { id: "t3", name: "Refactor", color: "#f59e0b", usageCount: 15 },
  { id: "t4", name: "Design", color: "#ec4899", usageCount: 64 },
  { id: "t5", name: "Research", color: "#06b6d4", usageCount: 21 },
];

export default function SettingsTagsPage() {
  const [tags, setTags] = useState<TagItem[]>(INITIAL_TAGS);
  const [query, setQuery] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTag, setEditingTag] = useState<TagItem | null>(null);
  const [deleteTag, setDeleteTag] = useState<TagItem | null>(null);

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return tags;
    return tags.filter((t) => t.name.toLowerCase().includes(q));
  }, [tags, query]);

  const saveTag = (input: { name: string; color: string }) => {
    if (editingTag) {
      setTags((prev) => prev.map((t) => (t.id === editingTag.id ? { ...t, ...input } : t)));
    } else {
      setTags((prev) => [
        { id: crypto.randomUUID(), name: input.name, color: input.color, usageCount: 0 },
        ...prev,
      ]);
    }
  };

  const removeTag = (id: string) => {
    setTags((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <main className="min-h-screen px-4 py-8 text-slate-900 dark:text-slate-100 sm:px-6 lg:px-8">
      <SettingsLayout>
        <div className="flex flex-col gap-6">
          <TagsHeader
            onCreate={() => {
              setEditingTag(null);
              setModalOpen(true);
            }}
          />

          <div className="rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-[#0f172a]">
            <div className="border-b border-slate-200 p-4 dark:border-slate-800">
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search tags..."
                  className="w-full rounded-xl border border-slate-200 bg-white pl-10 pr-3 py-2.5 text-sm text-slate-900 shadow-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-slate-700 dark:bg-[#0f172a] dark:text-slate-100"
                />
              </div>
            </div>
            <TagsTable
              tags={filtered}
              onCreate={() => {
                setEditingTag(null);
                setModalOpen(true);
              }}
              onEdit={(tag) => {
                setEditingTag(tag);
                setModalOpen(true);
              }}
              onDelete={(tag) => setDeleteTag(tag)}
            />
          </div>
        </div>
      </SettingsLayout>

      <CreateTagModal
        open={modalOpen}
        initial={editingTag ?? undefined}
        mode={editingTag ? "edit" : "create"}
        onClose={() => setModalOpen(false)}
        onSave={saveTag}
      />

      <DeleteTagDialog
        open={Boolean(deleteTag)}
        tagName={deleteTag?.name || ""}
        onClose={() => setDeleteTag(null)}
        onConfirm={() => {
          if (deleteTag) removeTag(deleteTag.id);
        }}
      />
    </main>
  );
}
