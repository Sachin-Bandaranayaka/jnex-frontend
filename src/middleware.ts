import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const isAuthenticated = request.cookies.get("authToken");

  // --------- Commented out for now ----------

  // Redirect unauthenticated users to the login page
  // if (!isAuthenticated && path !== "/login") {
  //   console.log("Redirecting to login");
  //   return NextResponse.redirect(new URL("/login", request.url));
  // }

  // Redirect authenticated users to the dashboard
  if (isAuthenticated && path === "/login") {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Restrict access to "/dashboard/users" for non-admin users
  if (isAuthenticated && path === "/dashboard/users") {
    const authToken = isAuthenticated.value;
    const user = decodeJWT(authToken);

    if (user.role !== "admin")
      return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export function decodeJWT(token: string) {
  try {
    const payload = JSON.parse(
      Buffer.from(token.split(".")[1], "base64").toString()
    );
    return payload;
  } catch (error) {
    console.error("Failed to decode JWT:", error);
    return null;
  }
}

export const matcher = ["/((?!api|_next/static|_next/image|favicon.ico).*)"];
