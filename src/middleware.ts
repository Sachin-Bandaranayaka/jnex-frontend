import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const isAuthenticated = request.cookies.get("authToken");

  // Redirect unauthenticated users to the login page
  if (!isAuthenticated && path !== "/login") {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Redirect authenticated users to the dashboard
  if (isAuthenticated && path === "/login") {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Restrict access to "/dashboard/users" for non-admin users
  if (isAuthenticated && path === "/dashboard/users") {
    try {
      const token = isAuthenticated.value;
      const user = decodeJWT(token);
      if (user?.role !== "admin")
        return NextResponse.redirect(new URL("/dashboard", request.url));
    } catch (error) {
      console.error("Error decoding token:", error);
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  return NextResponse.next();
}

export function decodeJWT(token: string | undefined | null) {
  if (!token) {
    console.error("No token provided to decode");
    return null;
  }

  try {
    // Check if the token is a valid JWT format (contains two dots)
    if (!token.includes('.')) {
      console.error("Invalid token format - not a JWT");
      return null;
    }

    const base64Payload = token.split('.')[1];
    if (!base64Payload) {
      console.error("Invalid token format - no payload");
      return null;
    }

    // Add padding if needed
    const base64 = base64Payload.replace(/-/g, '+').replace(/_/g, '/');
    const padding = '='.repeat((4 - base64.length % 4) % 4);
    const jsonPayload = Buffer.from(base64 + padding, 'base64').toString();

    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error("Failed to decode JWT:", error);
    return null;
  }
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|assets|images|fonts|css|js).*)",
  ],
};
