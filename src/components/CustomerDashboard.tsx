import { useState } from "react";
import { Customer } from "@/interfaces/interfaces";
import { FaPlus } from "react-icons/fa";
import CustomerDetails from "./CustomerDetails";
import CustomerForm from "./CustomerForm";

interface CustomerDashboardProps {
    customers: Customer[];
    onCustomerUpdate: (customerData: Partial<Customer>, customerId?: string) => Promise<boolean>;
}

export default function CustomerDashboard({ customers = [], onCustomerUpdate }: CustomerDashboardProps) {
    const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleCreateCustomer = async (customerData: Partial<Customer>) => {
        const success = await onCustomerUpdate(customerData);
        if (success) {
            setShowCreateModal(false);
        }
    };

    const handleCustomerUpdate = async (customerData: Partial<Customer>) => {
        if (!selectedCustomer) return;
        const success = await onCustomerUpdate(customerData, selectedCustomer.id);
        if (success) {
            setSelectedCustomer(null);
        }
    };

    const getStatusColor = (status: 'active' | 'inactive'): string => {
        switch (status.toLowerCase()) {
            case "active":
                return "bg-green-100 text-green-800";
            case "inactive":
                return "bg-red-100 text-red-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Customer Management</h1>
                <button
                    onClick={() => setShowCreateModal(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700"
                >
                    <FaPlus /> New Customer
                </button>
            </div>

            {/* Customers Table */}
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
                                    Address
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Total Orders
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {Array.isArray(customers) && customers.map((customer) => (
                                <tr
                                    key={customer.id}
                                    className="hover:bg-gray-50 cursor-pointer"
                                    onClick={() => setSelectedCustomer(customer)}
                                >
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900">
                                            {customer?.name || 'N/A'}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm text-gray-900">{customer?.email || 'N/A'}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm text-gray-900">{customer?.phone || 'N/A'}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm text-gray-900">{customer?.address || 'N/A'}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(customer.status)}`}>
                                            {customer?.status?.charAt(0).toUpperCase() + customer?.status?.slice(1)}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm text-gray-900">{customer?.totalOrders ?? 0}</div>
                                    </td>
                                </tr>
                            ))}
                            {customers.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                                        No customers found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Customer Details Modal */}
            {selectedCustomer && (
                <CustomerDetails
                    customer={selectedCustomer}
                    onClose={() => setSelectedCustomer(null)}
                    onUpdate={handleCustomerUpdate}
                />
            )}

            {/* Customer Form Modal */}
            {showCreateModal && (
                <CustomerForm
                    open={true}
                    onClose={() => setShowCreateModal(false)}
                    onSubmit={handleCreateCustomer}
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