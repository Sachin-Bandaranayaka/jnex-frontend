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
import { Lead } from '@/interfaces/interfaces';
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
    onSubmit: (lead: any) => void;
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
    const [formData, setFormData] = useState({
        cus_phone: '',
        product_code: '',
        staff_user: '',
        notes: '',
        status: 'new',
        score: 0,
        next_follow_up_date: '',
    });

    const [customers, setCustomers] = useState<Customer[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [staff, setStaff] = useState<Staff[]>([]);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (initialData) {
            setFormData({
                cus_phone: initialData.customer?.phone || '',
                product_code: initialData.product?.code || '',
                staff_user: initialData.staff?.username || '',
                notes: initialData.notes || '',
                status: initialData.status || 'new',
                score: initialData.score || 0,
                next_follow_up_date: initialData.next_follow_up_date || '',
            });
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
        } finally {
            setLoading(false);
        }
    };

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.cus_phone) {
            newErrors.cus_phone = 'Customer is required';
        }
        if (!formData.product_code) {
            newErrors.product_code = 'Product is required';
        }
        if (!formData.staff_user) {
            newErrors.staff_user = 'Staff member is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validateForm()) {
            onSubmit(formData);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name as string]: value,
        }));
        if (errors[name as string]) {
            setErrors((prev) => ({
                ...prev,
                [name as string]: '',
            }));
        }
    };

    if (loading) {
        return null;
    }

    return (
        <ClientOnly>
            <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
                <DialogTitle>
                    {isEdit ? 'Edit Lead' : 'Add New Lead'}
                </DialogTitle>
                <form onSubmit={handleSubmit}>
                    <DialogContent>
                        <Box display="flex" flexDirection="column" gap={2}>
                            <FormControl fullWidth error={!!errors.cus_phone}>
                                <InputLabel>Customer</InputLabel>
                                <Select
                                    name="cus_phone"
                                    value={formData.cus_phone}
                                    onChange={handleChange}
                                    label="Customer"
                                >
                                    {Array.isArray(customers) && customers.map((customer: Customer) => (
                                        <MenuItem key={customer.phone} value={customer.phone}>
                                            {customer.name} ({customer.phone})
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>

                            <FormControl fullWidth error={!!errors.product_code}>
                                <InputLabel>Product</InputLabel>
                                <Select
                                    name="product_code"
                                    value={formData.product_code}
                                    onChange={handleChange}
                                    label="Product"
                                >
                                    {Array.isArray(products) && products.map((product: Product) => (
                                        <MenuItem key={product.code} value={product.code}>
                                            {product.name} ({product.code})
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>

                            <FormControl fullWidth error={!!errors.staff_user}>
                                <InputLabel>Assigned To</InputLabel>
                                <Select
                                    name="staff_user"
                                    value={formData.staff_user}
                                    onChange={handleChange}
                                    label="Assigned To"
                                >
                                    {Array.isArray(staff) && staff.map((user: Staff) => (
                                        <MenuItem key={user.username} value={user.username}>
                                            {user.name} ({user.username})
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>

                            <TextField
                                name="notes"
                                label="Notes"
                                value={formData.notes}
                                onChange={handleChange}
                                multiline
                                rows={3}
                            />

                            <FormControl fullWidth>
                                <InputLabel>Status</InputLabel>
                                <Select
                                    name="status"
                                    value={formData.status}
                                    onChange={handleChange}
                                    label="Status"
                                >
                                    <MenuItem value="new">New</MenuItem>
                                    <MenuItem value="contacted">Contacted</MenuItem>
                                    <MenuItem value="qualified">Qualified</MenuItem>
                                    <MenuItem value="converted">Converted</MenuItem>
                                    <MenuItem value="lost">Lost</MenuItem>
                                </Select>
                            </FormControl>

                            <TextField
                                name="score"
                                label="Score"
                                type="number"
                                value={formData.score}
                                onChange={handleChange}
                                inputProps={{ min: 0, max: 100 }}
                            />

                            <TextField
                                name="next_follow_up_date"
                                label="Next Follow-up Date"
                                type="date"
                                value={formData.next_follow_up_date}
                                onChange={handleChange}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                            />
                        </Box>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={onClose}>Cancel</Button>
                        <Button type="submit" variant="contained" color="primary">
                            {isEdit ? 'Update' : 'Create'}
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>
        </ClientOnly>
    );
};

export default LeadForm; 