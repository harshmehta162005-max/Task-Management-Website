"use client";

import { Calendar } from "lucide-react";

type ProfileIdentityCardProps = {
  name: string;
  email: string;
  avatarUrl: string | null;
  workspaceRole: string;
  joinedAt?: string;
};

export function ProfileIdentityCard({
  name,
  email,
  avatarUrl,
  workspaceRole,
  joinedAt,
}: ProfileIdentityCardProps) {
  const initials = name
    ? name
        .split(" ")
        .map((w) => w[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "?";

  const joinedDate = joinedAt
    ? new Date(joinedAt).toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
      })
    : null;

  return (
    <div className="profile-identity-card group relative overflow-hidden rounded-2xl border border-slate-700/40 bg-[#111827]/60 backdrop-blur-xl">
      {/* Indigo gradient top edge */}
      <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-[#5048e5] to-transparent opacity-60" />
      {/* Ambient glow */}
      <div className="pointer-events-none absolute -top-20 left-1/2 h-40 w-80 -translate-x-1/2 rounded-full bg-[#5048e5]/8 blur-3xl" />

      <div className="relative flex flex-col items-start gap-6 p-8 sm:flex-row sm:items-center sm:justify-between">
        {/* Left — Avatar + Info */}
        <div className="flex items-center gap-6">
          {/* Avatar */}
          <div className="relative flex-shrink-0">
            <div className="absolute -inset-1 rounded-full bg-gradient-to-br from-[#5048e5]/40 to-[#5048e5]/10 blur-md" />
            <div className="relative flex h-20 w-20 items-center justify-center overflow-hidden rounded-full bg-[#191f2f] ring-2 ring-[#5048e5]/50">
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt={name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <span className="text-2xl font-bold tracking-tight text-[#c3c0ff]">
                  {initials}
                </span>
              )}
            </div>
          </div>

          {/* Name & Email */}
          <div className="min-w-0">
            <h1 className="truncate text-2xl font-bold tracking-tight text-[#dce2f7]">
              {name}
            </h1>
            <p className="mt-1 truncate text-sm text-[#918fa1]">{email}</p>
            {joinedDate && (
              <div className="mt-2 flex items-center gap-1.5 text-xs text-[#918fa1]/70">
                <Calendar className="h-3 w-3" />
                <span>Joined {joinedDate}</span>
              </div>
            )}
          </div>
        </div>

        {/* Right — Role Badge */}
        <div className="flex-shrink-0">
          <span className="inline-flex items-center rounded-full bg-[#5048e5]/15 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-[#c3c0ff]">
            {workspaceRole}
          </span>
        </div>
      </div>
    </div>
  );
}
