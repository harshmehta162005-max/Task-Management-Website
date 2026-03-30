import { redirect } from "next/navigation";
import { db } from "@/lib/db/prisma";
import { currentUser } from "@clerk/nextjs/server";

export default async function GlobalProfileRedirect() {
  const clerkUser = await currentUser();
  if (!clerkUser) {
    redirect("/sign-in");
  }

  // Find user and their workspaces
  const user = await db.user.findUnique({
    where: { clerkId: clerkUser.id },
    include: {
      workspaceMembers: {
        include: { workspace: true },
        take: 1,
        orderBy: { joinedAt: "desc" },
      },
    },
  });

  if (user?.workspaceMembers[0]) {
    redirect(`/${user.workspaceMembers[0].workspace.slug}/profile`);
  }

  redirect("/onboarding");
}
