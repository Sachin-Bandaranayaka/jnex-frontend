'use client';

import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Box,
} from '@mui/material';
import { Lead, LeadStatus } from '@/interfaces/interfaces';
import { api } from '@/lib/api';
import ClientOnly from './ClientOnly';

interface Customer {
    phone: string;
    name: string;
}

interface Product {
    code: string;
    name: string;
}

interface Staff {
    username: string;
    name: string;
}

interface LeadFormProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (data: Partial<Lead>) => void;
    initialData?: Lead;
    isEdit?: boolean;
}

const LeadForm: React.FC<LeadFormProps> = ({
    open,
    onClose,
    onSubmit,
    initialData,
    isEdit = false,
}) => {
    const [formData, setFormData] = useState<Partial<Lead>>(
        initialData || {
            name: '',
            email: '',
            phone: '',
            status: 'new' as LeadStatus,
            source: '',
            notes: '',
        }
    );

    const [customers, setCustomers] = useState<Customer[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [staff, setStaff] = useState<Staff[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (initialData) {
            setFormData(initialData);
        }
        fetchData();
    }, [initialData]);

    const fetchData = async () => {
        try {
            const [customersRes, productsRes, staffRes] = await Promise.all([
                api.get('/customers'),
                api.get('/products'),
                api.get('/users'),
            ]);

            if (customersRes.data?.data) {
                setCustomers(customersRes.data.data);
            }
            if (productsRes.data?.data) {
                setProducts(productsRes.data.data);
            }
            if (staffRes.data?.data) {
                setStaff(staffRes.data.data);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name as string]: value,
        }));
    };

    if (!open) return null;

    return (
        <ClientOnly>
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-lg p-6 max-w-md w-full">
                    <h2 className="text-xl font-bold mb-4">
                        {isEdit ? 'Edit Lead' : 'New Lead'}
                    </h2>

                    {error && (
                        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Name
                            </label>
                            <input
                                type="text"
                                value={formData.name || ''}
                                onChange={handleChange}
                                name="name"
                                className="mt-1 block w-full border rounded-md shadow-sm p-2"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Email
                            </label>
                            <input
                                type="email"
                                value={formData.email || ''}
                                onChange={handleChange}
                                name="email"
                                className="mt-1 block w-full border rounded-md shadow-sm p-2"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Phone
                            </label>
                            <input
                                type="tel"
                                value={formData.phone || ''}
                                onChange={handleChange}
                                name="phone"
                                className="mt-1 block w-full border rounded-md shadow-sm p-2"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Status
                            </label>
                            <select
                                value={formData.status || 'new'}
                                onChange={handleChange}
                                name="status"
                                className="mt-1 block w-full border rounded-md shadow-sm p-2"
                            >
                                <option value="new">New</option>
                                <option value="contacted">Contacted</option>
                                <option value="qualified">Qualified</option>
                                <option value="converted">Converted</option>
                                <option value="lost">Lost</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Source
                            </label>
                            <input
                                type="text"
                                value={formData.source || ''}
                                onChange={handleChange}
                                name="source"
                                className="mt-1 block w-full border rounded-md shadow-sm p-2"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Notes
                            </label>
                            <textarea
                                value={formData.notes || ''}
                                onChange={handleChange}
                                name="notes"
                                rows={4}
                                className="mt-1 block w-full border rounded-md shadow-sm p-2"
                            />
                        </div>

                        <div className="flex justify-end gap-2">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-4 py-2 text-gray-600 hover:text-gray-800"
                                disabled={loading}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                                disabled={loading}
                            >
                                {loading ? 'Saving...' : isEdit ? 'Update' : 'Create Lead'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </ClientOnly>
    );
};

export default LeadForm; 