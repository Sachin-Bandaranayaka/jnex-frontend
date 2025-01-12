"use client";
import { Lead } from "@/interfaces/interfaces";
import api from "@/lib/api";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/authContext";
import Table from "@/components/Table";
import * as XLSX from "xlsx";

export default function OrdersManagement() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const { authToken } = useAuth();

  // excel file headers and data
  const [headers, setHeaders] = useState<string[]>([]);
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    if (authToken) {
      fetchLeads();
    }
  }, [authToken]);

  // Fetch leads
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

  // Handle file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const binaryString = event.target?.result;
      if (binaryString) {
        const workbook = XLSX.read(binaryString, { type: "binary" });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];

        // Convert sheet to JSON
        const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

        // Extract headers (first row)
        const headers = jsonData[0] as string[];
        setHeaders(headers);

        // Extract data (second row)
        const rowData = jsonData[1] as any[];
        setData([rowData]);
      }
    };
    reader.readAsBinaryString(file);
  };

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

      <h1 className="text-2xl font-bold mb-4 mt-10">Import Lead</h1>
      <div className="mt-5">
        {/* File Input */}
        <input
          type="file"
          accept=".xlsx, .xls"
          onChange={handleFileUpload}
          className="mb-4"
        />
      </div>

      <div className="mt-5">
        {/* Display Extracted Data */}
        {headers.length > 0 && data.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold mb-2">Extracted Data</h2>
            <table className="min-w-full bg-white border border-gray-200">
              <thead>
                <tr>
                  {headers.map((header, index) => (
                    <th
                      key={index}
                      className="px-4 py-2 border border-gray-200 bg-gray-100 text-left text-sm font-medium text-gray-700"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.map((row, rowIndex) => (
                  <tr key={rowIndex}>
                    {row.map((cell: any, cellIndex: number) => (
                      <td
                        key={cellIndex}
                        className="px-4 py-2 border border-gray-200 text-sm text-gray-700"
                      >
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
