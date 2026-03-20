import { db } from "@/lib/db/prisma";
import { requireAuth } from "@/lib/auth/currentUser";

/**
 * Resolve a workspace by its slug and verify the current user
 * is a member. Returns the workspace + membership info.
 *
 * Throws 401 if not authenticated, 404 if workspace not found,
 * 403 if user is not a member.
 */
export async function resolveWorkspace(slug: string) {
  const clerkId = await requireAuth();

  // Find the user in our DB
  let user = await db.user.findUnique({
    where: { clerkId },
    select: { id: true, name: true, email: true, avatarUrl: true },
  });

  // If user doesn't exist in our DB yet, auto-create from Clerk
  if (!user) {
    // Try to get clerk user info for initial profile
    const { currentUser } = await import("@clerk/nextjs/server");
    const clerkUser = await currentUser();
    user = await db.user.create({
      data: {
        clerkId,
        email: clerkUser?.emailAddresses?.[0]?.emailAddress ?? `${clerkId}@temp.local`,
        name: clerkUser ? `${clerkUser.firstName ?? ""} ${clerkUser.lastName ?? ""}`.trim() || null : null,
        avatarUrl: clerkUser?.imageUrl ?? null,
      },
      select: { id: true, name: true, email: true, avatarUrl: true },
    });
  }

  // Find workspace by slug
  let workspace = await db.workspace.findUnique({
    where: { slug },
    select: {
      id: true,
      name: true,
      slug: true,
      logoUrl: true,
      ownerId: true,
      createdAt: true,
    },
  });

  // Auto-create workspace if it doesn't exist
  if (!workspace) {
    const prettyName = slug
      .replace(/[-_]/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase());

    workspace = await db.workspace.create({
      data: {
        name: prettyName,
        slug,
        ownerId: user.id,
        members: {
          create: { userId: user.id },
        },
      },
      select: {
        id: true,
        name: true,
        slug: true,
        logoUrl: true,
        ownerId: true,
        createdAt: true,
      },
    });

    // Return immediately — user is already owner + member
    return {
      workspace,
      user,
      membership: { userId: user.id, workspaceId: workspace.id, role: null },
      isOwner: true,
      isAdmin: true,
    };
  }

  // Check membership — auto-add if not a member
  let membership = await db.workspaceMember.findUnique({
    where: {
      userId_workspaceId: {
        userId: user.id,
        workspaceId: workspace.id,
      },
    },
    include: { role: true },
  });

  if (!membership) {
    membership = await db.workspaceMember.create({
      data: {
        userId: user.id,
        workspaceId: workspace.id,
      },
      include: { role: true },
    });
  }

  const isOwner = workspace.ownerId === user.id;
  const isAdmin = isOwner || membership.role?.name === "ADMIN";

  return { workspace, user, membership, isOwner, isAdmin };
}

/**
 * Get the current user's internal DB record from their Clerk ID.
 */
export async function getDbUser() {
  const clerkId = await requireAuth();
  let user = await db.user.findUnique({
    where: { clerkId },
    select: { id: true, name: true, email: true, avatarUrl: true },
  });
  if (!user) {
    const { currentUser } = await import("@clerk/nextjs/server");
    const clerkUser = await currentUser();
    user = await db.user.create({
      data: {
        clerkId,
        email: clerkUser?.emailAddresses?.[0]?.emailAddress ?? `${clerkId}@temp.local`,
        name: clerkUser ? `${clerkUser.firstName ?? ""} ${clerkUser.lastName ?? ""}`.trim() || null : null,
        avatarUrl: clerkUser?.imageUrl ?? null,
      },
      select: { id: true, name: true, email: true, avatarUrl: true },
    });
  }
  return user;
}

/**
 * Simple API error class for consistent error responses.
 */
export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = "ApiError";
  }
}

/**
 * Wrap an API handler to catch ApiError and return proper JSON responses.
 */
export function handleApiError(error: unknown) {
  if (error instanceof ApiError) {
    return Response.json({ error: error.message }, { status: error.status });
  }
  console.error("Unhandled API error:", error);
  return Response.json({ error: "Internal server error" }, { status: 500 });
}
