import { NextRequest } from "next/server";
import { db } from "@/lib/db/prisma";
import { handleApiError, ApiError } from "@/lib/workspace/resolveWorkspace";
import { checkPermission, resolvePermissions } from "@/lib/rbac/checkPermission";
import { P_SETTINGS_PROFILE } from "@/lib/rbac/permissions";

type Params = { params: Promise<{ workspaceId: string }> };

export async function GET(req: NextRequest, { params }: Params) {
  try {
    const { workspaceId } = await params;
    const slug = req.nextUrl.searchParams.get("workspaceSlug");
    if (!slug) throw new ApiError(400, "workspaceSlug is required");

    await resolvePermissions(slug);

    const automations = await db.automation.findMany({
      where: { workspaceId },
      orderBy: { createdAt: "desc" },
    });

    return Response.json(automations);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(req: NextRequest, { params }: Params) {
  try {
    const { workspaceId } = await params;
    const body = await req.json();
    const { name, description, trigger, action, enabled, workspaceSlug } = body;

    if (!workspaceSlug) throw new ApiError(400, "workspaceSlug is required");
    if (!name?.trim()) throw new ApiError(400, "Automation name is required");
    if (!trigger || !action) throw new ApiError(400, "Trigger and Action configurations are required");

    // Require settings profile permission to create automations
    await checkPermission(workspaceSlug, P_SETTINGS_PROFILE);

    const automation = await db.automation.create({
      data: {
        name: name.trim(),
        description: description || null,
        trigger,
        action,
        enabled: enabled !== undefined ? enabled : true,
        workspaceId,
      },
    });

    return Response.json(automation, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
