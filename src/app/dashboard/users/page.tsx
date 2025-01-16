"use client";
import { useAuth } from "@/context/authContext";
import api from "@/lib/api";
import { useEffect, useState } from "react";
import Table from "@/components/common/Table";
import { User } from "@/interfaces/interfaces";
import Select from "@/components/common/Select";

export default function UserManagement() {
  const { authToken } = useAuth();

  const [users, setUsers] = useState<User[]>([]);
  const [roleFilter, setRoleFilter] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("");

  useEffect(() => {
    // Fetch Users
    const fetchUsers = async () => {
      try {
        const response = await api.get(`/users`, {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });
        if (response.status === 200) {
          setUsers(response.data);
        } else {
          console.error("Failed to fetch users:", response);
        }
      } catch (error) {
        console.error("Failed to fetch users:", error);
      }
    };

    if (authToken) {
      fetchUsers();
    }
  }, [authToken]);

  // Define columns for the table
  const columns = [
    { key: "username", header: "Username" },
    { key: "role", header: "Role" },
    { key: "name", header: "Name" },
    { key: "email", header: "Email" },
    { key: "phone", header: "Telephone" },
    { key: "address", header: "Address" },
    { key: "is_deleted", header: "Status" },
    { key: "created_at", header: "Created At" },
    { key: "updated_at", header: "Last Updated At" },
  ];

  // Transform leads data to match the table structure
  const tableData = users.map((user) => ({
    username: user.username,
    role: user.role,
    name: user.name,
    email: user.email,
    phone: user.phone,
    address: user.address,
    is_deleted: user.is_deleted ? "Deleted" : "Active",
    created_at: new Date(user.created_at)
      .toLocaleString([], {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      })
      .replace(/\//g, "-"),
    updated_at: new Date(user.updated_at)
      .toLocaleString([], {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      })
      .replace(/\//g, "-"),
  }));

  // Filter users based on role and status
  const filteredData = tableData.filter((user) => {
    const matchesRole = roleFilter ? user.role === roleFilter : true;
    const matchesStatus = statusFilter
      ? user.is_deleted === statusFilter
      : true;
    return matchesRole && matchesStatus;
  });

  const roles = [
    { value: "admin", label: "Admin" },
    { value: "user", label: "User" },
  ];

  const statuses = [
    { value: "Active", label: "Active" },
    { value: "Deleted", label: "Deleted" },
  ];

  return (
    <div className="p-4 text-black">
      <h1 className="text-2xl font-bold">User Management</h1>

      {/* Users Table */}
      <div className="my-5">
        <p className="mb-2">All Users</p>

        {/* Filter Controls */}
        <div className="my-4 flex gap-4">
          <Select
            options={roles}
            value={roleFilter}
            onChange={setRoleFilter}
            placeholder="All Roles"
            className="bg-btnSelect"
          />
          <Select
            options={statuses}
            value={statusFilter}
            onChange={setStatusFilter}
            placeholder="All Statuses"
          />
        </div>

        <Table columns={columns} data={filteredData} />
      </div>
    </div>
  );
}
