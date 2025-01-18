'use client';

import { useState, useEffect } from 'react';
import { Order } from '@/interfaces/interfaces';
import { Box, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Chip } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import ClientOnly from '@/components/ClientOnly';
import { formatDate } from '@/utils/dateUtils';
import { api } from '@/lib/api';
import OrderForm from '@/components/OrderForm';

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await api.get('/orders');
      setOrders(response.data);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch orders:', err);
      setError('Failed to fetch orders. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateOrder = () => {
    fetchOrders(); // Refresh the orders list after creating a new order
  };

  const getStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      pending: 'warning',
      confirmed: 'info',
      processing: 'primary',
      shipped: 'secondary',
      delivered: 'success',
      cancelled: 'error'
    };
    return colors[status] || 'default';
  };

  const getPaymentStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      unpaid: 'error',
      partially_paid: 'warning',
      paid: 'success',
      refunded: 'info'
    };
    return colors[status] || 'default';
  };

  if (loading) {
    return <div>Loading orders...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <ClientOnly>
      <Box p={3}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h5" component="h1">
            Order Management
          </Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => setShowCreateModal(true)}
          >
            New Order
          </Button>
        </Box>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Order No</TableCell>
                <TableCell>Customer</TableCell>
                <TableCell>Total Amount</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Payment Status</TableCell>
                <TableCell>Created At</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    No orders found
                  </TableCell>
                </TableRow>
              ) : (
                orders.map((order) => (
                  <TableRow
                    key={order.id}
                    hover
                    onClick={() => setSelectedOrder(order)}
                    style={{ cursor: 'pointer' }}
                  >
                    <TableCell>{order.orderNo}</TableCell>
                    <TableCell>{order.customer.name}</TableCell>
                    <TableCell>${order.totalAmount.toFixed(2)}</TableCell>
                    <TableCell>
                      <Chip
                        label={order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        color={getStatusColor(order.status) as any}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={order.paymentStatus.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                        color={getPaymentStatusColor(order.paymentStatus) as any}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>{formatDate(order.createdAt)}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {showCreateModal && (
          <OrderForm
            open={showCreateModal}
            onClose={() => setShowCreateModal(false)}
            onSubmit={handleCreateOrder}
          />
        )}

        {/* TODO: Add OrderDetails component for viewing order details */}
        {/* {selectedOrder && (
          <OrderDetails
            order={selectedOrder}
            open={!!selectedOrder}
            onClose={() => setSelectedOrder(null)}
          />
        )} */}
      </Box>
    </ClientOnly>
  );
}
