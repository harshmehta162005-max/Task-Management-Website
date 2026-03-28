import { NextRequest } from "next/server";
import { resolvePermissions } from "@/lib/rbac/checkPermission";
import { handleApiError, ApiError } from "@/lib/workspace/resolveWorkspace";

/**
 * GET /api/workspaces/[workspaceId]/permissions
 *
 * Returns the current user's permission keys for this workspace.
 * Frontend uses this to adapt UI (hide/show buttons).
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ workspaceId: string }> }
) {
  try {
    const { workspaceId: slug } = await params;
    if (!slug) throw new ApiError(400, "Workspace slug is required");

    const ctx = await resolvePermissions(slug);

    return Response.json({
      permissions: ctx.permissions,
      isOwner: ctx.isOwner,
      role: (ctx.membership as Record<string, unknown>).role ?? null,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
