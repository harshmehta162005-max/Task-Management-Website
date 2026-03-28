"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "next/navigation";
import { SettingsLayout } from "@/components/settings/SettingsLayout";
import { InviteMemberCard } from "@/components/settings/members/InviteMemberCard";
import { useRoles } from "@/lib/hooks/useRoles";
import {
  MembersTable,
  Member,
} from "@/components/settings/members/MembersTable";
import {
  PendingInvitesList,
  Invite,
} from "@/components/settings/members/PendingInvitesList";
import { RemoveMemberDialog } from "@/components/settings/members/RemoveMemberDialog";
import { RevokeInviteDialog } from "@/components/settings/members/RevokeInviteDialog";
import { MembersEmptyState } from "@/components/settings/members/MembersEmptyState";
import { Search, Filter, ChevronDown, X } from "lucide-react";

export default function SettingsMembersPage() {
  const { workspaceSlug } = useParams<{ workspaceSlug: string }>();
  const { roles } = useRoles(workspaceSlug);
  const [members, setMembers] = useState<Member[]>([]);
  const [invites, setInvites] = useState<Invite[]>([]);
  const [query, setQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<string | "ALL">("ALL");
  const [filterOpen, setFilterOpen] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);
  const [removeId, setRemoveId] = useState<string | null>(null);
  const [revokeId, setRevokeId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Close filter dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(e.target as Node)) {
        setFilterOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Fetch members + invites from API
  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/workspaces/${workspaceSlug}/members?slug=${workspaceSlug}`);
        if (!res.ok) throw new Error("Failed to load");
        const data = await res.json();
        setMembers(data.members ?? []);
        setInvites(data.invites ?? []);
      } catch (err) {
        console.error("Error loading members:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [workspaceSlug]);

  const filteredMembers = useMemo(() => {
    let result = members;
    if (roleFilter !== "ALL") {
      result = result.filter((m) => m.role === roleFilter);
    }
    const q = query.toLowerCase().trim();
    if (q) {
      result = result.filter((m) => m.name.toLowerCase().includes(q) || m.email.toLowerCase().includes(q));
    }
    return result;
  }, [members, query, roleFilter]);

  const handleInvite = async (email: string, role: string) => {
    // Optimistic update
    const tempInvite = { id: crypto.randomUUID(), email, role, invitedAt: "just now" };
    setInvites((prev) => [tempInvite, ...prev]);
    try {
      await fetch(`/api/workspaces/${workspaceSlug}/invite`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, role }),
      });
    } catch (err) {
      console.error("Failed to send invite:", err);
    }
  };

  const handleChangeRole = async (id: string, role: string) => {
    setMembers((prev) => prev.map((m) => (m.id === id ? { ...m, role } : m)));
    try {
      await fetch(`/api/workspaces/${workspaceSlug}/members/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role }),
      });
    } catch (err) {
      console.error("Failed to change role:", err);
    }
  };

  const handleRemove = async (id: string) => {
    setMembers((prev) => prev.filter((m) => m.id !== id));
    try {
      await fetch(`/api/workspaces/${workspaceSlug}/members/${id}`, {
        method: "DELETE",
      });
    } catch (err) {
      console.error("Failed to remove member:", err);
    }
  };

  const handleResend = (id: string) => {
    setInvites((prev) =>
      prev.map((inv) => (inv.id === id ? { ...inv, invitedAt: "just now (resent)" } : inv))
    );
  };

  const handleRevoke = (id: string) => {
    setInvites((prev) => prev.filter((inv) => inv.id !== id));
  };

  if (loading) {
    return (
      <main className="min-h-screen px-4 py-8 text-slate-900 dark:text-slate-100 sm:px-6 lg:px-8">
        <SettingsLayout>
          <div className="animate-pulse space-y-4">
            <div className="h-8 w-32 rounded bg-slate-200 dark:bg-slate-700" />
            <div className="h-48 rounded-2xl bg-slate-200 dark:bg-slate-700" />
          </div>
        </SettingsLayout>
      </main>
    );
  }

  return (
    <main className="min-h-screen px-4 py-8 text-slate-900 dark:text-slate-100 sm:px-6 lg:px-8">
      <SettingsLayout>
        <div className="flex flex-col gap-6">
          <header className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">Members</h1>
              <p className="text-sm text-slate-500 dark:text-slate-400">Manage who has access to this workspace.</p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search members..."
                  className="w-full rounded-xl border border-slate-200 bg-white pl-9 pr-3 py-2.5 text-sm text-slate-900 shadow-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-slate-700 dark:bg-[#0f172a] dark:text-slate-100 sm:w-56"
                />
              </div>
              <div className="relative" ref={filterRef}>
                <button
                  onClick={() => setFilterOpen((v) => !v)}
                  className={`inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-sm font-semibold transition ${
                    roleFilter !== "ALL"
                      ? "border-primary/40 bg-primary/5 text-primary dark:border-primary/30 dark:bg-primary/10"
                      : "border-slate-200 text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-white/5"
                  }`}
                >
                  <Filter className="h-4 w-4" />
                  {roleFilter === "ALL" ? "Filter" : roleFilter}
                  {roleFilter !== "ALL" && (
                    <button
                      onClick={(e) => { e.stopPropagation(); setRoleFilter("ALL"); setFilterOpen(false); }}
                      className="ml-0.5 rounded p-0.5 hover:bg-primary/20"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  )}
                </button>
                {filterOpen && (
                  <div className="absolute right-0 top-10 z-50 w-40 rounded-xl border border-slate-200 bg-white py-1 shadow-xl dark:border-slate-700 dark:bg-[#0f172a]">
                    {["ALL", ...roles.map((r) => r.name)].map((r) => (
                      <button
                        key={r}
                        onClick={() => { setRoleFilter(r); setFilterOpen(false); }}
                        className={`flex w-full items-center px-3 py-2 text-left text-sm transition hover:bg-slate-50 dark:hover:bg-white/5 ${
                          roleFilter === r ? "font-semibold text-primary" : "text-slate-700 dark:text-slate-200"
                        }`}
                      >
                        {r === "ALL" ? "All roles" : r}
                        {roleFilter === r && <span className="ml-auto text-xs text-primary">✓</span>}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </header>

          <InviteMemberCard workspaceSlug={workspaceSlug} onInvite={handleInvite} />

          {filteredMembers.length ? (
            <MembersTable
              members={filteredMembers}
              isAdmin={true}
              workspaceSlug={workspaceSlug}
              onChangeRole={handleChangeRole}
              onRemove={(id) => setRemoveId(id)}
              onResend={handleResend}
              onRevoke={(id) => setRevokeId(id)}
            />
          ) : (
            <MembersEmptyState />
          )}

          <PendingInvitesList invites={invites} onResend={handleResend} onRevoke={(id) => setRevokeId(id)} />
        </div>
      </SettingsLayout>

      <RemoveMemberDialog
        open={Boolean(removeId)}
        memberName={members.find((m) => m.id === removeId)?.name || ""}
        onClose={() => setRemoveId(null)}
        onConfirm={() => removeId && handleRemove(removeId)}
      />

      <RevokeInviteDialog
        open={Boolean(revokeId)}
        email={invites.find((i) => i.id === revokeId)?.email || ""}
        onClose={() => setRevokeId(null)}
        onConfirm={() => revokeId && handleRevoke(revokeId)}
      />
    </main>
  );
}
