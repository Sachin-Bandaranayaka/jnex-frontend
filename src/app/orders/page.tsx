'use client';

import React, { useState, useEffect } from 'react';
import {
    Box,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    IconButton,
    Typography,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TablePagination,
    Chip,
    MenuItem,
    Select,
    FormControl,
    InputLabel,
} from '@mui/material';
import {
    Add as AddIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    Visibility as ViewIcon,
} from '@mui/icons-material';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { orderService, Order, UpdateOrderDto } from '@/services/order.service';

const orderStatusColors = {
    pending: 'warning',
    processing: 'info',
    completed: 'success',
    cancelled: 'error',
};

const paymentStatusColors = {
    pending: 'warning',
    paid: 'success',
    failed: 'error',
};

export default function OrdersPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [openDetails, setOpenDetails] = useState(false);
    const [openStatusEdit, setOpenStatusEdit] = useState(false);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const data = await orderService.getOrders();
            setOrders(data);
        } catch (error) {
            console.error('Error fetching orders:', error);
        }
    };

    const handleViewDetails = (order: Order) => {
        setSelectedOrder(order);
        setOpenDetails(true);
    };

    const handleEditStatus = (order: Order) => {
        setSelectedOrder(order);
        setOpenStatusEdit(true);
    };

    const handleStatusUpdate = async (status: Order['status']) => {
        if (!selectedOrder) return;

        try {
            await orderService.updateOrder(selectedOrder.id, { status });
            setOpenStatusEdit(false);
            fetchOrders();
        } catch (error) {
            console.error('Error updating order status:', error);
        }
    };

    const handlePaymentStatusUpdate = async (paymentStatus: Order['paymentStatus']) => {
        if (!selectedOrder) return;

        try {
            await orderService.updateOrder(selectedOrder.id, { paymentStatus });
            setOpenStatusEdit(false);
            fetchOrders();
        } catch (error) {
            console.error('Error updating payment status:', error);
        }
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this order?')) {
            try {
                await orderService.deleteOrder(id);
                fetchOrders();
            } catch (error) {
                console.error('Error deleting order:', error);
            }
        }
    };

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    return (
        <DashboardLayout>
            <Box sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                    <Typography variant="h4">Orders</Typography>
                </Box>

                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Order ID</TableCell>
                                <TableCell>Customer</TableCell>
                                <TableCell>Total Amount</TableCell>
                                <TableCell>Status</TableCell>
                                <TableCell>Payment</TableCell>
                                <TableCell>Date</TableCell>
                                <TableCell>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {orders
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map((order) => (
                                    <TableRow key={order.id}>
                                        <TableCell>{order.id}</TableCell>
                                        <TableCell>{order.customerName}</TableCell>
                                        <TableCell>${order.totalAmount.toFixed(2)}</TableCell>
                                        <TableCell>
                                            <Chip
                                                label={order.status}
                                                color={orderStatusColors[order.status] as any}
                                                size="small"
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Chip
                                                label={order.paymentStatus}
                                                color={paymentStatusColors[order.paymentStatus] as any}
                                                size="small"
                                            />
                                        </TableCell>
                                        <TableCell>{formatDate(order.createdAt)}</TableCell>
                                        <TableCell>
                                            <IconButton onClick={() => handleViewDetails(order)} color="primary">
                                                <ViewIcon />
                                            </IconButton>
                                            <IconButton onClick={() => handleEditStatus(order)} color="info">
                                                <EditIcon />
                                            </IconButton>
                                            <IconButton onClick={() => handleDelete(order.id)} color="error">
                                                <DeleteIcon />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))}
                        </TableBody>
                    </Table>
                    <TablePagination
                        rowsPerPageOptions={[5, 10, 25]}
                        component="div"
                        count={orders.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                </TableContainer>

                {/* Order Details Dialog */}
                <Dialog open={openDetails} onClose={() => setOpenDetails(false)} maxWidth="md" fullWidth>
                    <DialogTitle>Order Details</DialogTitle>
                    <DialogContent>
                        {selectedOrder && (
                            <Box>
                                <Typography variant="h6" gutterBottom>
                                    Customer Information
                                </Typography>
                                <Typography>Name: {selectedOrder.customerName}</Typography>
                                <Typography>Order Date: {formatDate(selectedOrder.createdAt)}</Typography>

                                <Typography variant="h6" sx={{ mt: 3, mb: 2 }}>
                                    Order Items
                                </Typography>
                                <TableContainer component={Paper} variant="outlined">
                                    <Table size="small">
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>Product</TableCell>
                                                <TableCell align="right">Quantity</TableCell>
                                                <TableCell align="right">Price</TableCell>
                                                <TableCell align="right">Total</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {selectedOrder.items.map((item, index) => (
                                                <TableRow key={index}>
                                                    <TableCell>{item.productName}</TableCell>
                                                    <TableCell align="right">{item.quantity}</TableCell>
                                                    <TableCell align="right">${item.price.toFixed(2)}</TableCell>
                                                    <TableCell align="right">
                                                        ${(item.price * item.quantity).toFixed(2)}
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                            <TableRow>
                                                <TableCell colSpan={3} align="right">
                                                    <strong>Total Amount:</strong>
                                                </TableCell>
                                                <TableCell align="right">
                                                    <strong>${selectedOrder.totalAmount.toFixed(2)}</strong>
                                                </TableCell>
                                            </TableRow>
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </Box>
                        )}
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setOpenDetails(false)}>Close</Button>
                    </DialogActions>
                </Dialog>

                {/* Status Edit Dialog */}
                <Dialog open={openStatusEdit} onClose={() => setOpenStatusEdit(false)}>
                    <DialogTitle>Update Order Status</DialogTitle>
                    <DialogContent>
                        <FormControl fullWidth sx={{ mt: 2 }}>
                            <InputLabel>Order Status</InputLabel>
                            <Select
                                value={selectedOrder?.status || ''}
                                label="Order Status"
                                onChange={(e) => handleStatusUpdate(e.target.value as Order['status'])}
                            >
                                <MenuItem value="pending">Pending</MenuItem>
                                <MenuItem value="processing">Processing</MenuItem>
                                <MenuItem value="completed">Completed</MenuItem>
                                <MenuItem value="cancelled">Cancelled</MenuItem>
                            </Select>
                        </FormControl>

                        <FormControl fullWidth sx={{ mt: 2 }}>
                            <InputLabel>Payment Status</InputLabel>
                            <Select
                                value={selectedOrder?.paymentStatus || ''}
                                label="Payment Status"
                                onChange={(e) =>
                                    handlePaymentStatusUpdate(e.target.value as Order['paymentStatus'])
                                }
                            >
                                <MenuItem value="pending">Pending</MenuItem>
                                <MenuItem value="paid">Paid</MenuItem>
                                <MenuItem value="failed">Failed</MenuItem>
                            </Select>
                        </FormControl>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setOpenStatusEdit(false)}>Cancel</Button>
                    </DialogActions>
                </Dialog>
            </Box>
        </DashboardLayout>
    );
} 