import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

// Global middleware to control top-level routing behavior.
// Here we ensure that hitting the root ("/") always goes to "/admin".
export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // When anyone visits "/", immediately redirect to "/admin"
  if (pathname === "/") {
    const url = req.nextUrl.clone();
    url.pathname = "/admin";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

// Limit middleware to only run on the root path.
export const config = {
  matcher: ["/"],
};


