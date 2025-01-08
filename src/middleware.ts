import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const isAuthenticated = request.cookies.get("authToken");

  if (!isAuthenticated && path !== "/login") {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (isAuthenticated && path === "/login") {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
