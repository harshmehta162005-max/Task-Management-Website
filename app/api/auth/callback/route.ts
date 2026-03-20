import { NextRequest, NextResponse } from "next/server";

// Clerk handles OAuth callbacks internally.
// This route exists as a redirect target for OAuth flows.
// After Clerk processes the OAuth result, the user is redirected
// to the appropriate afterSignIn/afterSignUp URL.

export async function GET(request: NextRequest) {
  // Clerk's middleware handles the actual OAuth callback processing.
  // If a user lands here directly, redirect them to workspace-selector.
  return NextResponse.redirect(new URL("/workspace-selector", request.url));
}
