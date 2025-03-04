// middleware/auth-middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Get token from Authorization header
  const authHeader = request.headers.get("Authorization");
  const token = authHeader?.startsWith("Bearer ")
    ? authHeader.substring(7)
    : null;

  const isAuthPage = request.nextUrl.pathname.startsWith("/login");
  const isDashboardPage = request.nextUrl.pathname.startsWith("/dashboard");

  // If no token and trying to access protected route, redirect to login
  if (!token && isDashboardPage) {
    return NextResponse.redirect(new URL("/login-super-admin", request.url));
  }

  // If has token and trying to access login page, redirect to dashboard
  if (token && isAuthPage) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // For protected routes, clone the request and add the token
  if (isDashboardPage && token) {
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("Authorization", `Bearer ${token}`);

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  }

  return NextResponse.next();
}

// Configure which routes to run middleware on
export const config = {
  matcher: ["/dashboard/:path*", "/login-super-admin"],
};
