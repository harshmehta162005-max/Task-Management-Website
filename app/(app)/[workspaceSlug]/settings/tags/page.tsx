"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { SettingsLayout } from "@/components/settings/SettingsLayout";
import { TagsHeader } from "@/components/settings/tags/TagsHeader";
import { TagsTable } from "@/components/settings/tags/TagsTable";
import { TagsSkeleton } from "@/components/settings/tags/TagsSkeleton";
import { CreateTagModal } from "@/components/settings/tags/CreateTagModal";
import { DeleteTagDialog } from "@/components/settings/tags/DeleteTagDialog";
import { TagItem } from "@/components/settings/tags/TagRow";
import { Search, ShieldAlert } from "lucide-react";

export default function SettingsTagsPage() {
  const { workspaceSlug } = useParams<{ workspaceSlug: string }>();
  const [tags, setTags] = useState<TagItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTag, setEditingTag] = useState<TagItem | null>(null);
  const [deleteTag, setDeleteTag] = useState<TagItem | null>(null);
  const [workspaceId, setWorkspaceId] = useState("");
  const [hasPermission, setHasPermission] = useState(true);

  // Load workspace ID, tags, and permissions
  useEffect(() => {
    async function load() {
      try {
        // Get workspace ID
        const wsRes = await fetch(`/api/workspaces/${workspaceSlug}`);
        if (!wsRes.ok) return;
        const wsData = await wsRes.json();
        const wsId = wsData.id;
        setWorkspaceId(wsId);

        // Check permissions
        const permsRes = await fetch(`/api/workspaces/${workspaceSlug}/permissions`);
        if (permsRes.ok) {
          const perms = await permsRes.json();
          const canManage = perms.permissions?.includes("settings.tags") ?? false;
          setHasPermission(canManage);
          if (!canManage) {
            setLoading(false);
            return;
          }
        }

        // Fetch tags
        const tagsRes = await fetch(`/api/workspaces/${wsId}/tags?workspaceSlug=${workspaceSlug}`);
        if (tagsRes.ok) {
          const data = await tagsRes.json();
          setTags(data.map((t: any) => ({
            id: t.id,
            name: t.name,
            color: t.color,
            usageCount: t.usageCount,
          })));
        }
      } catch {
        // silent
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [workspaceSlug]);

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return tags;
    return tags.filter((t) => t.name.toLowerCase().includes(q));
  }, [tags, query]);

  const saveTag = async (input: { name: string; color: string }) => {
    if (editingTag) {
      // Edit existing tag
      try {
        const res = await fetch(`/api/workspaces/${workspaceId}/tags/${editingTag.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: input.name, color: input.color, workspaceSlug }),
        });
        if (res.ok) {
          const updated = await res.json();
          setTags((prev) =>
            prev.map((t) => (t.id === editingTag.id ? { ...t, name: updated.name, color: updated.color } : t))
          );
        } else {
          const data = await res.json();
          alert(data.error || "Failed to update tag");
        }
      } catch {
        alert("Failed to update tag");
      }
    } else {
      // Create new tag
      try {
        const res = await fetch(`/api/workspaces/${workspaceId}/tags`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: input.name, color: input.color, workspaceSlug }),
        });
        if (res.ok) {
          const newTag = await res.json();
          setTags((prev) => [
            { id: newTag.id, name: newTag.name, color: newTag.color, usageCount: 0 },
            ...prev,
          ]);
        } else {
          const data = await res.json();
          alert(data.error || "Failed to create tag");
        }
      } catch {
        alert("Failed to create tag");
      }
    }
  };

  const removeTag = async (id: string) => {
    try {
      const res = await fetch(
        `/api/workspaces/${workspaceId}/tags/${id}?workspaceSlug=${workspaceSlug}`,
        { method: "DELETE" }
      );
      if (res.ok) {
        setTags((prev) => prev.filter((t) => t.id !== id));
      } else {
        const data = await res.json();
        alert(data.error || "Failed to delete tag");
      }
    } catch {
      alert("Failed to delete tag");
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen px-4 py-8 text-slate-900 dark:text-slate-100 sm:px-6 lg:px-8">
        <SettingsLayout>
          <TagsSkeleton />
        </SettingsLayout>
      </main>
    );
  }

  if (!hasPermission) {
    return (
      <main className="min-h-screen px-4 py-8 text-slate-900 dark:text-slate-100 sm:px-6 lg:px-8">
        <SettingsLayout>
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-red-500/10">
              <ShieldAlert className="h-8 w-8 text-red-500" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Access Denied</h2>
            <p className="mt-2 max-w-sm text-sm text-slate-500 dark:text-slate-400">
              You don&apos;t have permission to manage tags. Contact your workspace administrator to request access.
            </p>
          </div>
        </SettingsLayout>
      </main>
    );
  }

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
        usageCount={deleteTag?.usageCount ?? 0}
        onClose={() => setDeleteTag(null)}
        onConfirm={() => {
          if (deleteTag) removeTag(deleteTag.id);
        }}
      />
    </main>
  );
}
