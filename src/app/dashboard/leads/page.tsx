"use client";
import { Lead } from "@/interfaces/interfaces";
import api from "@/lib/api";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/authContext";
import Table from "@/components/Table";

export default function OrdersManagement() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const { authToken } = useAuth();

  useEffect(() => {
    if (authToken) {
      fetchLeads();
    }
  }, [authToken]);

  const fetchLeads = async () => {
    try {
      const response = await api.get(`/leads`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      if (response.status === 200) {
        setLeads(response.data);
      } else {
        console.error("Failed to fetch leads:", response);
      }
    } catch (error) {
      console.error("Failed to fetch leads:", error);
    }
  };

  // Define columns for the table
  const columns = [
    { key: "leadNo", header: "Lead No" },
    { key: "productCode", header: "Product Code" },
    { key: "customer.name", header: "Customer Name" },
    { key: "cusPhone", header: "Customer Phone" },
    { key: "customer.email", header: "Customer Email" },
    { key: "customer.address", header: "Customer Address" },
    { key: "other", header: "Other Information" },
    { key: "staff.username", header: "Assigned Employee" },
  ];

  // Transform leads data to match the table structure
  const tableData = leads.map((lead) => ({
    leadNo: lead.leadNo,
    productCode: lead.productCode,
    "customer.name": lead.customer.name,
    cusPhone: lead.cusPhone,
    "customer.email": lead.customer.email,
    "customer.address": lead.customer.address,
    other: lead.other,
    "staff.username": lead.staff.username,
  }));

  return (
    <div className="p-4 text-black">
      <h1 className="text-2xl font-bold">Lead Management</h1>
      <div className="mt-5 mb-2 flex justify-between items-center">
        <p className="">All Leads</p>
        <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
          Import Lead
        </button>
      </div>
      <Table columns={columns} data={tableData} />
    </div>
  );
}
