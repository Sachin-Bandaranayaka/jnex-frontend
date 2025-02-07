"use client";

import { useState, useEffect } from "react";
import { Customer } from "@/interfaces/interfaces";
import { api } from "@/lib/api";
import { useRouter } from "next/navigation";
import CustomerDashboard from "@/components/CustomerDashboard";
import { useAuth } from "@/context/authContext";

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchCustomers();
    }
  }, [user]);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get("/api/customers");
      // Check if response.data is an array, if not, check if it's nested
      const customersData = Array.isArray(response.data)
        ? response.data
        : response.data?.data || [];
      setCustomers(customersData);
      console.log("Customers data:", customersData); // Debug log
    } catch (err: any) {
      console.error("Failed to fetch customers:", err);
      if (err.response?.status === 401) {
        // router.push('/login');
      } else {
        setError(err.message || "Failed to fetch customers. Please try again.");
      }
      setCustomers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCustomerUpdate = async (
    customerData: Partial<Customer>,
    customerId?: string
  ) => {
    try {
      if (customerId) {
        await api.put(`/api/customers/${customerId}`, customerData);
      } else {
        await api.post("/api/customers", customerData);
      }
      await fetchCustomers();
      return true;
    } catch (error) {
      console.error("Error saving customer:", error);
      setError("Failed to save customer");
      return false;
    }
  };

  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p>Please log in to view customers</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p>Loading customers...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <CustomerDashboard
        customers={customers}
        onCustomerUpdate={handleCustomerUpdate}
      />
    </div>
  );
}
