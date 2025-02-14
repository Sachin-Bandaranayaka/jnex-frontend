"use client";

import Link from "next/link";
import Cookies from "js-cookie";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { decodeJWT } from "@/middleware";

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [userRole, setUserRole] = useState<string | null>(null);

  // Decode the JWT token to get the user's role
  useEffect(() => {
    const token = Cookies.get("accessToken");
    console.log("Current token:", token);

    if (!token) {
      console.log("No token found, redirecting to login");
      // router.push("/login");
      return;
    }

    try {
      const user = decodeJWT(token);
      console.log("Decoded user:", user);

      if (!user) {
        console.error("Failed to decode user from token");
        Cookies.remove("accessToken", { path: "/" });
        // router.push("/login");
        return;
      }

      setUserRole(user.role || null);
    } catch (error) {
      console.error("Error decoding token:", error);
      Cookies.remove("accessToken", { path: "/" });
      //  router.push("/login");
    }
  }, [router]);

  const handleLogout = () => {
    console.log("Logout clicked");
    Cookies.remove("accessToken", { path: "/" });
    router.push("/login");
  };

  const linkClass = (href: string): string => {
    const baseClass =
      "block py-2.5 px-4 rounded transition duration-200 text-gray-300";
    return `${baseClass} ${
      pathname === href
        ? "bg-gray-700 text-white"
        : "hover:bg-gray-700 hover:text-white"
    }`;
  };

  return (
    <div className="bg-gray-900 text-gray-300 w-64 space-y-6 py-7 px-2 min-h-screen">
      <div className="text-2xl font-semibold text-white px-4">
        Admin Dashboard
      </div>
      <nav className="space-y-2">
        <Link href="/dashboard" className={linkClass("/dashboard")}>
          Dashboard
        </Link>
        {userRole === "admin" && (
          <Link
            href="/dashboard/users"
            className={linkClass("/dashboard/users")}
          >
            User Management
          </Link>
        )}
        <Link href="/dashboard/leads" className={linkClass("/dashboard/leads")}>
          Lead Management
        </Link>
        <Link
          href="/dashboard/customers"
          className={linkClass("/dashboard/customers")}
        >
          Customer Management
        </Link>
        <Link
          href="/dashboard/products"
          className={linkClass("/dashboard/products")}
        >
          Product Management
        </Link>
        <Link href="/dashboard/tasks" className={linkClass("/dashboard/tasks")}>
          My Tasks
        </Link>
        <Link
          href="/dashboard/orders"
          className={linkClass("/dashboard/orders")}
        >
          Order Management
        </Link>
        <div className="w-full flex justify-center items-center">
          <button
            onClick={handleLogout}
            className="block font-bold mt-10 py-2.5 px-4 rounded transition duration-200 bg-red-600 hover:bg-red-700 text-white"
            type="button"
          >
            Logout
          </button>
        </div>
      </nav>
    </div>
  );
}
