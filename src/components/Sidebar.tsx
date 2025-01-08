"use client"; // Required for client-side hooks like usePathname

import Link from "next/link";
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
      </nav>
    </div>
  );
}
