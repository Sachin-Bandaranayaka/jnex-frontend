"use client";

import { useState, useEffect } from 'react';
import { Box, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Chip } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import ClientOnly from '@/components/ClientOnly';
import { api } from '@/lib/api';
import { useAuth } from '@/context/authContext';
import { useRouter } from 'next/navigation';

interface Product {
    id: number;
    code: string;
    name: string;
    description: string;
    price: string | number;
    stock: number;
    category: string;
    status: 'active' | 'inactive' | string;
    createdAt: string;
}

export default function ProductsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { user } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (user) {
            fetchProducts();
        }
    }, [user]);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const response = await api.get('/products');
            if (response.data?.data) {
                setProducts(response.data.data);
            } else {
                setProducts([]);
            }
            setError(null);
        } catch (err: any) {
            console.error('Failed to fetch products:', err);
            if (err.response?.status === 401) {
                router.push('/login');
            } else {
                setError('Failed to fetch products. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    const formatPrice = (price: string | number): string => {
        const numericPrice = typeof price === 'string' ? parseFloat(price) : price;
        return !isNaN(numericPrice) ? `$${numericPrice.toFixed(2)}` : '$0.00';
    };

    const getStockStatusColor = (stock: number) => {
        if (stock <= 0) return 'error';
        if (stock <= 10) return 'warning';
        return 'success';
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
                <Typography>Please log in to view products</Typography>
            </Box>
        );
    }

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
                <Typography>Loading products...</Typography>
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
                        Product Management
                    </Typography>
                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={<AddIcon />}
                        onClick={() => {/* TODO: Implement add product */ }}
                    >
                        New Product
                    </Button>
                </Box>

                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Code</TableCell>
                                <TableCell>Name</TableCell>
                                <TableCell>Description</TableCell>
                                <TableCell>Price</TableCell>
                                <TableCell>Stock</TableCell>
                                <TableCell>Category</TableCell>
                                <TableCell>Status</TableCell>
                                <TableCell>Created At</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {!Array.isArray(products) || products.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={8} align="center">
                                        No products found
                                    </TableCell>
                                </TableRow>
                            ) : (
                                products.map((product) => (
                                    <TableRow key={product.id}>
                                        <TableCell>{product.code}</TableCell>
                                        <TableCell>{product.name}</TableCell>
                                        <TableCell>{product.description}</TableCell>
                                        <TableCell>{formatPrice(product.price)}</TableCell>
                                        <TableCell>
                                            <Chip
                                                label={`${product.stock} units`}
                                                color={getStockStatusColor(product.stock)}
                                                size="small"
                                            />
                                        </TableCell>
                                        <TableCell>{product.category}</TableCell>
                                        <TableCell>
                                            <Chip
                                                label={formatStatus(product.status)}
                                                color={getStatusColor(product.status)}
                                                size="small"
                                            />
                                        </TableCell>
                                        <TableCell>
                                            {new Date(product.createdAt).toLocaleDateString()}
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