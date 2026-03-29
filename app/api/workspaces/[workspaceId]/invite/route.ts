import { NextRequest } from "next/server";
import { db } from "@/lib/db/prisma";
import { checkPermission } from "@/lib/rbac/checkPermission";
import { handleApiError, ApiError } from "@/lib/workspace/resolveWorkspace";
import { P_MEMBERS_INVITE } from "@/lib/rbac/permissions";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY || "re_dummy");
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

type Params = { params: Promise<{ workspaceId: string }> };

export async function POST(req: NextRequest, { params }: Params) {
  try {
    const { workspaceId: slug } = await params;
    if (!slug) throw new ApiError(400, "workspaceSlug is required");

    const ctx = await checkPermission(slug, P_MEMBERS_INVITE);

    const body = await req.json();
    const { email, role } = body;

    if (!email) throw new ApiError(400, "Email is required");

    // Check if user is already a member
    const existingMember = await db.workspaceMember.findFirst({
      where: {
        workspaceId: ctx.workspace.id,
        user: { email },
      },
    });
    if (existingMember) throw new ApiError(400, "User is already a member of this workspace");

    // Check if pending invite exists
    let invite = await db.workspaceInvite.findFirst({
      where: {
        workspaceId: ctx.workspace.id,
        email,
        status: "PENDING",
      },
    });

    if (invite) {
      // Just update the role and expiration
      invite = await db.workspaceInvite.update({
        where: { id: invite.id },
        data: {
          role: role || "MEMBER",
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
        },
      });
    } else {
      invite = await db.workspaceInvite.create({
        data: {
          email,
          workspaceId: ctx.workspace.id,
          inviterId: ctx.user.id,
          role: role || "MEMBER",
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
        },
      });
    }

    // Fire off the email via Resend
    const inviterName = ctx.user.name || ctx.user.email;
    const inviteLink = `${APP_URL}/invite/${invite.token}`;

    console.log(`\n📨 [DEV] Invite Link generated: ${inviteLink}\n`);

    try {
      await resend.emails.send({
        from: "onboarding@resend.dev",
        to: email,
        subject: `You have been invited to join ${ctx.workspace.name}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333; padding: 20px;">
            <h2 style="color: #0f172a;">Join ${ctx.workspace.name}</h2>
            <p><strong>${inviterName}</strong> has invited you to join the <strong>${ctx.workspace.name}</strong> workspace as a <strong>${role || "Member"}</strong>.</p>
            <p>Click the link below to accept the invitation and securely join the workspace.</p>
            <div style="margin: 30px 0;">
              <a href="${inviteLink}" style="background-color: #6366f1; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">Accept Invitation</a>
            </div>
            <p style="font-size: 14px; color: #64748b; margin-top: 20px;">If you don't want to join this workspace, you can safely ignore this email.</p>
          </div>
        `,
      });
      console.log(`Email successfully dispatched to ${email}`);
    } catch (emailError) {
      console.error("Failed to send email via Resend:", emailError);
    }

    // Activity log
    await db.activity.create({
      data: {
        action: `invited ${email}`,
        entityType: "WORKSPACE",
        entityId: ctx.workspace.id,
        actorId: ctx.user.id,
        workspaceId: ctx.workspace.id,
        metadata: { role: role || "MEMBER" },
      },
    });

    return Response.json(invite, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}

