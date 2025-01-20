"use client";

import { useState, useEffect } from 'react';
import { Box, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Chip } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import ClientOnly from '@/components/ClientOnly';
import { api } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

interface Customer {
    id: number;
    name: string;
    email: string;
    phone: string;
    address: string;
    status: 'active' | 'inactive' | string;
    totalOrders: number;
    createdAt: string;
}

export default function CustomersPage() {
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { user } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (user) {
            fetchCustomers();
        }
    }, [user]);

    const fetchCustomers = async () => {
        try {
            setLoading(true);
            const response = await api.get('/customers');
            if (response.data?.data) {
                setCustomers(response.data.data);
            } else {
                setCustomers([]);
            }
            setError(null);
        } catch (err: any) {
            console.error('Failed to fetch customers:', err);
            if (err.response?.status === 401) {
                router.push('/login');
            } else {
                setError('Failed to fetch customers. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status: string | undefined) => {
        if (!status) return 'default';
        return status.toLowerCase() === 'active' ? 'success' : 'error';
    };

    const formatStatus = (status: string | undefined) => {
        if (!status) return 'Unknown';
        return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
    };

    if (!user) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
                <Typography>Please log in to view customers</Typography>
            </Box>
        );
    }

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
                <Typography>Loading customers...</Typography>
            </Box>
        );
    }

    if (error) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
                <Typography color="error">{error}</Typography>
            </Box>
        );
    }

    return (
        <ClientOnly>
            <Box p={3}>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                    <Typography variant="h5" component="h1">
                        Customer Management
                    </Typography>
                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={<AddIcon />}
                        onClick={() => {/* TODO: Implement add customer */ }}
                    >
                        New Customer
                    </Button>
                </Box>

                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>ID</TableCell>
                                <TableCell>Name</TableCell>
                                <TableCell>Email</TableCell>
                                <TableCell>Phone</TableCell>
                                <TableCell>Address</TableCell>
                                <TableCell>Status</TableCell>
                                <TableCell>Total Orders</TableCell>
                                <TableCell>Created At</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {!Array.isArray(customers) || customers.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={8} align="center">
                                        No customers found
                                    </TableCell>
                                </TableRow>
                            ) : (
                                customers.map((customer) => (
                                    <TableRow key={customer.id}>
                                        <TableCell>{customer.id}</TableCell>
                                        <TableCell>{customer.name}</TableCell>
                                        <TableCell>{customer.email}</TableCell>
                                        <TableCell>{customer.phone}</TableCell>
                                        <TableCell>{customer.address}</TableCell>
                                        <TableCell>
                                            <Chip
                                                label={formatStatus(customer.status)}
                                                color={getStatusColor(customer.status)}
                                                size="small"
                                            />
                                        </TableCell>
                                        <TableCell>{customer.totalOrders}</TableCell>
                                        <TableCell>
                                            {new Date(customer.createdAt).toLocaleDateString()}
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>
        </ClientOnly>
    );
} 