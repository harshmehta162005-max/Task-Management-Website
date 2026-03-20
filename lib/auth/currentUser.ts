import { currentUser, auth } from "@clerk/nextjs/server";

/**
 * Get the full Clerk user object for the current request.
 * Returns null if not authenticated.
 */
export async function getCurrentUser() {
  const user = await currentUser();
  return user;
}

/**
 * Get just the user ID for the current request.
 * Returns null if not authenticated.
 */
export async function getUserId() {
  const { userId } = await auth();
  return userId;
}

/**
 * Require authentication — throws/redirects if not authenticated.
 * Use in Server Components or API routes.
 */
export async function requireAuth() {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthorized");
  }
  return userId;
}
