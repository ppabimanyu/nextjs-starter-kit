import { NextResponse, NextRequest } from "next/server";

// This function can be marked `async` if using `await` inside
export function proxy(request: NextRequest) {
  if (request.nextUrl.pathname === "/auth") {
    return NextResponse.redirect(new URL("/auth/sign-in", request.url));
  }
}

export const config = {};
