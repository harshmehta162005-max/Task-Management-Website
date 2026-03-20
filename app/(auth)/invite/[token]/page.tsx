"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AlertTriangle, LogIn, UserPlus } from "lucide-react";
import { InviteCard } from "@/components/auth/InviteCard";
import { WorkspaceCardPreview } from "@/components/auth/WorkspaceCardPreview";
import { InviteCardSkeleton } from "@/components/auth/InviteCardSkeleton";
import { cn } from "@/lib/utils/cn";

type Status = "loading" | "valid" | "expired" | "already_member" | "unauthenticated";

const workspace = {
  name: "Acme Corp",
  slug: "acme-inc.teamos.com",
  logoUrl:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuADUhRBOogzcdODyX7-A86mgFNFPLmERTEQy_0fgIWUR4CBaSN61r0bfFRJmTo9I44uMjHZ69_B4HG4sD0t6wWKUQenxZzbnZ_EpZNSZLv3B3Kk2DrO6sCWnUMud0rk_lQp1HA8qzB3f0SJabc0BgsELllJeZYoGreji_EnFaXpl3Fem2fM1eKm7uKJ0Nl2Timi6KFDebeJ9vjABoyzObSBWnV2tptlvBJfJVe-tQzTKMETWeOyxJ4WuLkq5FfuNAylfzpcukhYCJ-U",
};
const inviter = { name: "Alex", email: "alex@example.com" };
const role: "MEMBER" | "MANAGER" = "MANAGER";

export default function InvitePage() {
  const router = useRouter();
  const [status, setStatus] = useState<Status>("loading");

  useEffect(() => {
    // simulate fetch
    const t = setTimeout(() => setStatus("valid"), 600);
    return () => clearTimeout(t);
  }, []);

  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background-dark px-4 py-6 text-slate-100">
        <InviteCardSkeleton />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background-light px-4 py-6 text-slate-900 dark:bg-background-dark dark:text-slate-100">
      <InviteCard>
        {status === "valid" && (
          <>
            <div className="space-y-2 text-center">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">You&apos;ve been invited</h2>
              <p className="text-sm leading-relaxed text-slate-500 dark:text-slate-400">
                <span className="font-medium text-slate-700 dark:text-slate-200">
                  {inviter.name} ({inviter.email})
                </span>{" "}
                has invited you to join their workspace on TeamOS.
              </p>
            </div>

            <WorkspaceCardPreview name={workspace.name} slug={workspace.slug} role={role} logoUrl={workspace.logoUrl} />

            <div className="flex flex-col gap-3">
              <button
                type="button"
                className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary text-white font-bold shadow-lg shadow-primary/25 transition hover:bg-primary/90"
                onClick={() => router.push("/workspace-selector")}
              >
                Accept Invite
              </button>
              <button
                type="button"
                className="h-12 w-full rounded-xl border border-slate-200 text-slate-600 transition hover:bg-slate-100 dark:border-white/10 dark:text-slate-400 dark:hover:bg-white/5"
                onClick={() => router.push("/login")}
              >
                Decline
              </button>
            </div>

            <div className="space-y-1 border-t border-slate-200 pt-6 text-sm text-slate-500 dark:border-white/5 dark:text-slate-400">
              <details className="group">
                <summary className="flex cursor-pointer list-none items-center justify-between rounded-lg p-3 transition hover:bg-slate-50 dark:hover:bg-white/5">
                  <div className="flex items-center gap-3">
                    <AlertTriangle className="h-4 w-4 text-slate-400" />
                    <span className="font-medium text-slate-700 dark:text-slate-300">Invite link expired?</span>
                  </div>
                  <span className="material-symbols-outlined text-slate-400 transition-transform group-open:rotate-180">
                    expand_more
                  </span>
                </summary>
                <div className="px-12 pb-3 text-xs leading-normal">
                  This invitation link is valid for 7 days. If it has expired, please request a new invitation from your
                  workspace administrator.
                </div>
              </details>
              <details className="group">
                <summary className="flex cursor-pointer list-none items-center justify-between rounded-lg p-3 transition hover:bg-slate-50 dark:hover:bg-white/5">
                  <div className="flex items-center gap-3">
                    <LogIn className="h-4 w-4 text-slate-400" />
                    <span className="font-medium text-slate-700 dark:text-slate-300">Already a member?</span>
                  </div>
                  <span className="material-symbols-outlined text-slate-400 transition-transform group-open:rotate-180">
                    expand_more
                  </span>
                </summary>
                <div className="px-12 pb-3 text-xs leading-normal">
                  If you are already part of this workspace, simply log in to your account. You&apos;ll be redirected to your
                  dashboard.
                </div>
              </details>
            </div>
          </>
        )}

        {status === "expired" && (
          <InviteState
            title="Invite link expired"
            description="Ask an admin to resend your invite."
            primaryLabel="Back to login"
            onPrimary={() => router.push("/login")}
          />
        )}

        {status === "already_member" && (
          <InviteState
            title="You’re already in this workspace"
            primaryLabel="Open workspace"
            onPrimary={() => router.push(`/${workspace.slug}/dashboard`)}
          />
        )}

        {status === "unauthenticated" && (
          <InviteState
            title="Sign in to accept invite"
            description="You’ll return here after signing in."
            primaryLabel="Sign in"
            secondaryLabel="Create account"
            onPrimary={() => router.push("/login")}
            onSecondary={() => router.push("/signup")}
          />
        )}
      </InviteCard>
    </div>
  );
}

type InviteStateProps = {
  title: string;
  description?: string;
  primaryLabel: string;
  secondaryLabel?: string;
  onPrimary: () => void;
  onSecondary?: () => void;
};

function InviteState({ title, description, primaryLabel, secondaryLabel, onPrimary, onSecondary }: InviteStateProps) {
  return (
    <div className="space-y-6 text-center">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">{title}</h2>
        {description ? <p className="text-sm leading-relaxed text-slate-500 dark:text-slate-400">{description}</p> : null}
      </div>
      <div className={cn("flex flex-col gap-3", secondaryLabel ? "" : "items-center")}>
        <button
          type="button"
          onClick={onPrimary}
          className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary text-white font-bold shadow-lg shadow-primary/25 transition hover:bg-primary/90"
        >
          {primaryLabel}
        </button>
        {secondaryLabel && onSecondary ? (
          <button
            type="button"
            onClick={onSecondary}
            className="h-12 w-full rounded-xl border border-slate-200 text-slate-600 transition hover:bg-slate-100 dark:border-white/10 dark:text-slate-400 dark:hover:bg-white/5"
          >
            {secondaryLabel}
          </button>
        ) : null}
      </div>
    </div>
  );
}
