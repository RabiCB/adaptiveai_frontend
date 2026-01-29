import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Public routes accessible without login
const PUBLIC_ROUTES = ["/auth/login", "/auth/register"];

// Routes that REQUIRE authentication
const PROTECTED_ROUTES = ["/"];

export function proxy(request: NextRequest) {
  const authCookie = request.cookies.get("auth_session");
  const { pathname } = request.nextUrl;

  const isPublicRoute = PUBLIC_ROUTES.some((route) =>
    pathname.startsWith(route)
  );

  const isProtectedRoute = PROTECTED_ROUTES.some((route) =>
    pathname === route || pathname.startsWith(`${route}/`)
  );

  // 🚫 Not logged in → trying to access protected routes
  if (!authCookie && isProtectedRoute) {
    const loginUrl = new URL("/auth/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 🚫 Logged in → trying to access login/register
  if (authCookie && isPublicRoute) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
