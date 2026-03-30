import { NextRequest } from "next/server";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { handleApiError } from "@/lib/workspace/resolveWorkspace";

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { newPassword } = body;

    if (!newPassword || newPassword.length < 8) {
      return Response.json(
        { error: "Password must be at least 8 characters long" },
        { status: 400 }
      );
    }

    const client = await clerkClient();
    await client.users.updateUser(userId, { password: newPassword });

    return Response.json({ success: true, message: "Password updated successfully" });
  } catch (error: any) {
    if (error.errors && error.errors.length > 0) {
      // Return the exact Clerk error message (e.g., password matches previous)
      return Response.json({ error: error.errors[0].message }, { status: 400 });
    }
    return handleApiError(error);
  }
}
