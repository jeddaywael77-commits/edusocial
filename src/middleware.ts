import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const protectedRoutes = [
  "/feed",
  "/profile",
  "/messages",
  "/notifications",
  "/friends",
  "/groups",
  "/courses",
  "/calendar",
  "/marketplace",
  "/documents",
  "/badges",
  "/leaderboard",
  "/live",
  "/ai",
  "/results",
  "/settings",
];

const authRoutes = ["/login", "/register"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if user has an access token
  const hasToken = request.cookies.get("access_token");

  // Redirect authenticated users away from auth pages
  if (hasToken && authRoutes.some((route) => pathname.startsWith(route))) {
    return NextResponse.redirect(new URL("/feed", request.url));
  }

  // Redirect unauthenticated users to login
  const isProtected = protectedRoutes.some(
    (route) => pathname === route || pathname.startsWith(route + "/")
  );

  if (isProtected && !hasToken) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|public).*)",
  ],
};
