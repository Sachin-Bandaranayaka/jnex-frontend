'use client';

import { useState, useEffect } from 'react';
import { Order } from '@/interfaces/interfaces';
import { Box, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Chip } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import ClientOnly from '@/components/ClientOnly';
import { formatDate } from '@/utils/dateUtils';
import { api } from '@/lib/api';
import OrderForm from '@/components/OrderForm';
import { useAuth } from '@/context/authContext';
import { useRouter } from 'next/navigation';

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      fetchOrders();
    }
  }, [user]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get('/orders');

      // Log the response for debugging
      console.log('Raw API Response:', response);
      console.log('API Response Data:', response.data);

      // Initialize empty array
      let ordersData: Order[] = [];

      // Handle different response structures
      if (response.data?.data && Array.isArray(response.data.data)) {
        ordersData = response.data.data;
      } else if (response.data?.orders && Array.isArray(response.data.orders)) {
        ordersData = response.data.orders;
      } else if (Array.isArray(response.data)) {
        ordersData = response.data;
      }

      // Ensure each order has the required properties
      ordersData = ordersData.filter(order => {
        if (!order || typeof order !== 'object') return false;
        if (!('id' in order) || !('orderNo' in order) || !('customer' in order)) return false;
        return true;
      });

      console.log('Processed Orders:', ordersData);
      setOrders(ordersData);
    } catch (err: any) {
      console.error('Failed to fetch orders:', err);
      if (err.response?.status === 401) {
        router.push('/login');
      } else {
        setError(err.message || 'Failed to fetch orders. Please try again.');
      }
      // Set empty array on error
      setOrders([]);
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
    return colors[status.toLowerCase()] || 'default';
  };

  const getPaymentStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      unpaid: 'error',
      partially_paid: 'warning',
      paid: 'success',
      refunded: 'info'
    };
    return colors[status.toLowerCase()] || 'default';
  };

  if (!user) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <Typography>Please log in to view orders</Typography>
      </Box>
    );
  }

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <Typography>Loading orders...</Typography>
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
              {!Array.isArray(orders) || orders.length === 0 ? (
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
                    <TableCell>{order.customer?.name || 'N/A'}</TableCell>
                    <TableCell>${(order.totalAmount || 0).toFixed(2)}</TableCell>
                    <TableCell>
                      <Chip
                        label={order.status ? order.status.charAt(0).toUpperCase() + order.status.slice(1) : 'Unknown'}
                        color={getStatusColor(order.status || '')}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={order.paymentStatus ? order.paymentStatus.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ') : 'Unknown'}
                        color={getPaymentStatusColor(order.paymentStatus || '')}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>{order.createdAt ? formatDate(order.createdAt) : 'N/A'}</TableCell>
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
      </Box>
    </ClientOnly>
  );
}
