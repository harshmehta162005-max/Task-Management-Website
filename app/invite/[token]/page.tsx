import { db } from "@/lib/db/prisma";
import { notFound } from "next/navigation";
import { currentUser } from "@clerk/nextjs/server";
import { AcceptButton } from "./AcceptButton";
import { Users } from "lucide-react";

export default async function InvitePage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;

  const invite = await db.workspaceInvite.findUnique({
    where: { token },
    include: {
      workspace: true,
      inviter: true,
    },
  });

  if (!invite) {
    return (
      <div className="flex min-h-[80vh] flex-col items-center justify-center p-4">
        <h1 className="text-3xl font-bold dark:text-white">Invite Not Found</h1>
        <p className="mt-2 text-slate-500">The invitation link is invalid or has expired.</p>
      </div>
    );
  }

  if (invite.status !== "PENDING" || new Date() > invite.expiresAt) {
    return (
      <div className="flex min-h-[80vh] flex-col items-center justify-center p-4">
        <h1 className="text-3xl font-bold dark:text-white">Expired Invitation</h1>
        <p className="mt-2 text-slate-500">This invite link is no longer valid or has already been accepted.</p>
      </div>
    );
  }

  const user = await currentUser();

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4 dark:bg-[#020817]">
      <div className="w-full max-w-md overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-[#0f172a]">
        
        {/* Decorative Top Beam */}
        <div className="h-2 w-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500" />
        
        <div className="p-8 text-center">
          <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-[1.5rem] bg-indigo-50 shadow-inner dark:bg-indigo-500/10">
            {invite.workspace.logoUrl ? (
              <img src={invite.workspace.logoUrl} alt="Workspace Logo" className="h-16 w-16 rounded-xl object-contain drop-shadow-md" />
            ) : (
              <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-100 text-3xl font-bold text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-500/30">
                {invite.workspace.name.charAt(0).toUpperCase()}
              </span>
            )}
          </div>
          
          <h1 className="mb-3 text-3xl font-black tracking-tight text-slate-900 dark:text-slate-100">
            Join {invite.workspace.name}
          </h1>
          
          <p className="mb-8 leading-relaxed text-slate-600 dark:text-slate-400">
            <span className="font-semibold text-slate-900 dark:text-slate-300">
              {invite.inviter.name || invite.inviter.email}
            </span>{" "}
            has invited you to collaborate in their workspace as a{" "}
            <span className="inline-flex items-center gap-1.5 rounded-md bg-indigo-50 px-2 py-0.5 font-semibold text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400">
              <Users className="h-3 w-3" />
              {invite.role}
            </span>.
          </p>

          <AcceptButton token={token} isAuthenticated={!!user} />
          
          <p className="mt-8 text-xs font-medium text-slate-400 dark:text-slate-500">
            By accepting, you agree to the Terms of Service. If you don't know the inviter, you can safely ignore this.
          </p>
        </div>
      </div>
    </div>
  );
}
