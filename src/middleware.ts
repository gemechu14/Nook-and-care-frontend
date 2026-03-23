import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

// Global middleware for routing. Root "/" shows the landing page.
// Auth-protected routes (e.g. /admin) handle their own auth/redirect logic.
export function middleware(req: NextRequest) {
  return NextResponse.next();
}

export const config = {
  matcher: [],
};
