import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Define the middleware matcher using the new format
export const middleware = (request: NextRequest) => {
  const { pathname } = request.nextUrl;
  const isAuthenticated = request.cookies.has('authToken');

  // Public paths that don't require authentication
  const publicPaths = ['/login'];

  // Check if the path is public
  const isPublicPath = publicPaths.includes(pathname);

  // Redirect to login if trying to access protected route without authentication
  if (!isAuthenticated && !isPublicPath) {
    const loginUrl = new URL('/login', request.url);
    return NextResponse.redirect(loginUrl);
  }

  // Redirect to dashboard if trying to access login while authenticated
  if (isAuthenticated && isPublicPath) {
    const dashboardUrl = new URL('/dashboard', request.url);
    return NextResponse.redirect(dashboardUrl);
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

// New middleware configuration format
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
