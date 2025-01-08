"use client";

import Link from "next/link";
import Cookies from "js-cookie";
import { usePathname } from "next/navigation";

export default function Sidebar() {
  const pathname = usePathname();

  const linkClass = (href: string) =>
    `block py-2.5 px-4 rounded transition duration-200 ${
      pathname === href ? "bg-gray-700" : "hover:bg-gray-700"
    }`;

  return (
    <div className="bg-gray-800 text-white w-64 space-y-6 py-7 px-2">
      <div className="text-2xl font-semibold text-white px-4">
        Admin Dashboard
      </div>
      <nav>
        <Link href="/dashboard" className={linkClass("/dashboard")}>
          Dashboard
        </Link>
        <Link href="/dashboard/users" className={linkClass("/dashboard/users")}>
          User Management
        </Link>
        <Link
          href="/dashboard/orders"
          className={linkClass("/dashboard/orders")}
        >
          Order Management
        </Link>
        <div className="w-full flex justify-center items-center">
          <button
            onClick={() => {
              console.log("Logout clicked");
              Cookies.remove("authToken", { path: "/" });
              window.location.href = "/login";
            }}
            className="block font-bold mt-10 py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700 border border-white "
          >
            Logout
          </button>
        </div>
      </nav>
    </div>
  );
}
