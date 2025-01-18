"use client";
import { useState, useEffect } from "react";
import { Lead } from "@/interfaces/interfaces";
import { api } from "@/lib/api";
import { useRouter } from "next/navigation";
import LeadDetails from "@/components/LeadDetails";
import LeadForm from "@/components/LeadForm";
import { FaPlus, FaFilter, FaSort } from "react-icons/fa";

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [filters, setFilters] = useState({
    status: "",
    score: "",
    dateRange: "30",
  });
  const [sortConfig, setSortConfig] = useState({
    key: "createdAt",
    direction: "desc",
  });

  const router = useRouter();

  const fetchLeads = async () => {
    try {
      setError(null);
      const response = await api.get("/leads", {
        params: {
          ...filters,
          sort: `${sortConfig.key},${sortConfig.direction}`,
        },
      });

      if (response.data?.success) {
        setLeads(response.data.data);
      } else {
        setError("Failed to fetch leads");
      }
    } catch (error: any) {
      console.error("Error fetching leads:", error);
      if (error.response?.status === 401) {
        router.push("/login");
      } else {
        setError("Failed to fetch leads. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, [filters, sortConfig]);

  const handleCreateLead = async (data: any) => {
    try {
      setError(null);
      await api.post("/leads", data);
      fetchLeads();
      setShowCreateModal(false);
    } catch (error: any) {
      console.error("Error creating lead:", error);
      setError("Failed to create lead. Please try again.");
    }
  };

  const handleSort = (key: string) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "new":
        return "bg-blue-100 text-blue-800";
      case "contacted":
        return "bg-yellow-100 text-yellow-800";
      case "qualified":
        return "bg-green-100 text-green-800";
      case "converted":
        return "bg-purple-100 text-purple-800";
      case "lost":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-blue-600";
    if (score >= 40) return "text-yellow-600";
    return "text-red-600";
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Lead Management</h1>
        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-600"
        >
          <FaPlus /> New Lead
        </button>
      </div>

      {/* Filters */}
      <div className="mb-6 flex gap-4 bg-white p-4 rounded-lg shadow">
        <select
          value={filters.status}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, status: e.target.value }))
          }
          className="border rounded px-3 py-2"
        >
          <option value="">All Statuses</option>
          <option value="new">New</option>
          <option value="contacted">Contacted</option>
          <option value="qualified">Qualified</option>
          <option value="converted">Converted</option>
          <option value="lost">Lost</option>
        </select>

        <select
          value={filters.score}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, score: e.target.value }))
          }
          className="border rounded px-3 py-2"
        >
          <option value="">All Scores</option>
          <option value="high">High (80+)</option>
          <option value="medium">Medium (60-79)</option>
          <option value="low">Low (&lt;60)</option>
        </select>

        <select
          value={filters.dateRange}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, dateRange: e.target.value }))
          }
          className="border rounded px-3 py-2"
        >
          <option value="7">Last 7 days</option>
          <option value="30">Last 30 days</option>
          <option value="90">Last 90 days</option>
          <option value="all">All time</option>
        </select>
      </div>

      {/* Leads Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort("leadNo")}
              >
                Lead No. <FaSort className="inline" />
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort("customer.name")}
              >
                Customer <FaSort className="inline" />
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort("score")}
              >
                Score <FaSort className="inline" />
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Assigned To
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort("nextFollowUpDate")}
              >
                Next Follow-up <FaSort className="inline" />
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {leads.map((lead) => (
              <tr key={lead.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">{lead.lead_no}</td>
                <td className="px-6 py-4">
                  <div className="text-sm font-medium text-gray-900">
                    {lead.customer.name}
                  </div>
                  <div className="text-sm text-gray-500">
                    {lead.customer.phone}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${getStatusColor(
                      lead.status
                    )}`}
                  >
                    {lead.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={`font-medium ${getScoreColor(lead.score)}`}>
                    {lead.score}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900">{lead.staff.name}</div>
                  <div className="text-sm text-gray-500">
                    {lead.staff.username}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {lead.nextFollowUpDate
                    ? new Date(lead.nextFollowUpDate).toLocaleDateString()
                    : "-"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <button
                    onClick={() => setSelectedLead(lead)}
                    className="text-blue-600 hover:text-blue-900 mr-3"
                  >
                    View Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Lead Details Modal */}
      {selectedLead && (
        <LeadDetails
          lead={selectedLead}
          onClose={() => setSelectedLead(null)}
          onUpdate={fetchLeads}
        />
      )}

      {/* Lead Form Modal */}
      <LeadForm
        open={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleCreateLead}
      />

      {error && (
        <div className="mt-4 p-4 bg-red-100 text-red-700 rounded-lg">
          {error}
        </div>
      )}
    </div>
  );
}
