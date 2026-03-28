import { NextRequest } from "next/server";
import { db } from "@/lib/db/prisma";
import { handleApiError, ApiError } from "@/lib/workspace/resolveWorkspace";
import { checkPermission } from "@/lib/rbac/checkPermission";
import { P_SETTINGS_PROFILE } from "@/lib/rbac/permissions";

type Params = { params: Promise<{ workspaceId: string; automationId: string }> };

export async function PATCH(req: NextRequest, { params }: Params) {
  try {
    const { workspaceId, automationId } = await params;
    const body = await req.json();
    const { name, description, trigger, action, enabled, workspaceSlug } = body;

    if (!workspaceSlug) throw new ApiError(400, "workspaceSlug is required");

    await checkPermission(workspaceSlug, P_SETTINGS_PROFILE);

    // Make sure it belongs to the workspace
    const existing = await db.automation.findUnique({ where: { id: automationId } });
    if (!existing || existing.workspaceId !== workspaceId) {
      throw new ApiError(404, "Automation not found");
    }

    const updated = await db.automation.update({
      where: { id: automationId },
      data: {
        ...(name !== undefined && { name: name.trim() }),
        ...(description !== undefined && { description }),
        ...(trigger !== undefined && { trigger }),
        ...(action !== undefined && { action }),
        ...(enabled !== undefined && { enabled }),
      },
    });

    return Response.json(updated);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(req: NextRequest, { params }: Params) {
  try {
    const { workspaceId, automationId } = await params;
    const slug = req.nextUrl.searchParams.get("workspaceSlug");

    if (!slug) throw new ApiError(400, "workspaceSlug is required");

    await checkPermission(slug, P_SETTINGS_PROFILE);

    const existing = await db.automation.findUnique({ where: { id: automationId } });
    if (!existing || existing.workspaceId !== workspaceId) {
      throw new ApiError(404, "Automation not found");
    }

    await db.automation.delete({
      where: { id: automationId },
    });

    return Response.json({ success: true });
  } catch (error) {
    return handleApiError(error);
  }
}
