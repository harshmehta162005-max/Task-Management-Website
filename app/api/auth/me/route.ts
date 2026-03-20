import { auth, currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { db } from "@/lib/db/prisma";

export async function GET() {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const clerkUser = await currentUser();
    if (!clerkUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const name =
      [clerkUser.firstName, clerkUser.lastName].filter(Boolean).join(" ") ||
      clerkUser.username ||
      "User";
    const email = clerkUser.emailAddresses[0]?.emailAddress ?? "";
    const avatarUrl = clerkUser.imageUrl ?? null;

    // Upsert user into the database
    const user = await db.user.upsert({
      where: { clerkId },
      update: { name, email, avatarUrl },
      create: { clerkId, name, email, avatarUrl },
    });

    return NextResponse.json({
      id: user.id,
      clerkId: user.clerkId,
      name: user.name,
      email: user.email,
      avatarUrl: user.avatarUrl,
      timezone: user.timezone,
      language: user.language,
    });
  } catch (error) {
    console.error("[GET /api/auth/me]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
