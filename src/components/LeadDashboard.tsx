import { useState } from "react";
import { Lead, LeadStatus } from "@/interfaces/interfaces";
import { FaPlus } from "react-icons/fa";
import LeadDetails from "./LeadDetails";
import LeadForm from "./LeadForm";

interface LeadDashboardProps {
    leads: Lead[];
    onLeadUpdate: (leadData: Partial<Lead>, leadId?: string) => Promise<boolean>;
}

export default function LeadDashboard({ leads = [], onLeadUpdate }: LeadDashboardProps) {
    const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleCreateLead = async (leadData: Partial<Lead>) => {
        const success = await onLeadUpdate(leadData);
        if (success) {
            setShowCreateModal(false);
        }
    };

    const handleLeadUpdate = async (leadData: Partial<Lead>) => {
        if (!selectedLead) return;
        const success = await onLeadUpdate(leadData, selectedLead.id);
        if (success) {
            setSelectedLead(null);
        }
    };

    const getStatusColor = (status: LeadStatus) => {
        switch (status) {
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

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Lead Management</h1>
                <button
                    onClick={() => setShowCreateModal(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700"
                >
                    <FaPlus /> New Lead
                </button>
            </div>

            {/* Leads Table */}
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Name
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Email
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Phone
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Source
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {leads.map((lead) => (
                                <tr
                                    key={lead.id}
                                    className="hover:bg-gray-50 cursor-pointer"
                                    onClick={() => setSelectedLead(lead)}
                                >
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900">
                                            {lead.name}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm text-gray-900">{lead.email}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm text-gray-900">{lead.phone}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(lead.status)}`}>
                                            {lead.status.charAt(0).toUpperCase() + lead.status.slice(1)}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm text-gray-900">{lead.source}</div>
                                    </td>
                                </tr>
                            ))}
                            {leads.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                                        No leads found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Lead Details Modal */}
            {selectedLead && (
                <LeadDetails
                    lead={selectedLead}
                    onClose={() => setSelectedLead(null)}
                    onUpdate={handleLeadUpdate}
                />
            )}

            {/* Lead Form Modal */}
            {showCreateModal && (
                <LeadForm
                    open={true}
                    onClose={() => setShowCreateModal(false)}
                    onSubmit={handleCreateLead}
                />
            )}

            {error && (
                <div className="mt-4 p-4 bg-red-100 text-red-700 rounded-lg">
                    {error}
                </div>
            )}
        </div>
    );
} 