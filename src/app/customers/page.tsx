'use client';

import React, { useState, useEffect } from 'react';
import {
    Box,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
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
    Grid,
    Card,
    CardContent,
} from '@mui/material';
import {
    Add as AddIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    Visibility as ViewIcon,
    Email as EmailIcon,
    Phone as PhoneIcon,
    LocationOn as LocationIcon,
} from '@mui/icons-material';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { customerService, Customer, CreateCustomerDto } from '@/services/customer.service';
import { Order } from '@/services/order.service';

export default function CustomersPage() {
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
    const [customerOrders, setCustomerOrders] = useState<Order[]>([]);
    const [openForm, setOpenForm] = useState(false);
    const [openDetails, setOpenDetails] = useState(false);
    const [formData, setFormData] = useState<CreateCustomerDto>({
        name: '',
        email: '',
        phone: '',
        address: '',
    });
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    useEffect(() => {
        fetchCustomers();
    }, []);

    const fetchCustomers = async () => {
        try {
            const data = await customerService.getCustomers();
            setCustomers(data);
        } catch (error) {
            console.error('Error fetching customers:', error);
        }
    };

    const fetchCustomerOrders = async (customerId: string) => {
        try {
            const orders = await customerService.getCustomerOrders(customerId);
            setCustomerOrders(orders);
        } catch (error) {
            console.error('Error fetching customer orders:', error);
        }
    };

    const handleOpenForm = (customer?: Customer) => {
        if (customer) {
            setFormData({
                name: customer.name,
                email: customer.email,
                phone: customer.phone,
                address: customer.address,
            });
            setSelectedCustomer(customer);
        } else {
            setFormData({
                name: '',
                email: '',
                phone: '',
                address: '',
            });
            setSelectedCustomer(null);
        }
        setOpenForm(true);
    };

    const handleViewDetails = async (customer: Customer) => {
        setSelectedCustomer(customer);
        await fetchCustomerOrders(customer.id);
        setOpenDetails(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (selectedCustomer) {
                await customerService.updateCustomer(selectedCustomer.id, formData);
            } else {
                await customerService.createCustomer(formData);
            }
            setOpenForm(false);
            fetchCustomers();
        } catch (error) {
            console.error('Error saving customer:', error);
        }
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this customer?')) {
            try {
                await customerService.deleteCustomer(id);
                fetchCustomers();
            } catch (error) {
                console.error('Error deleting customer:', error);
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
                    <Typography variant="h4">Customers</Typography>
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={() => handleOpenForm()}
                    >
                        Add Customer
                    </Button>
                </Box>

                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Name</TableCell>
                                <TableCell>Email</TableCell>
                                <TableCell>Phone</TableCell>
                                <TableCell>Status</TableCell>
                                <TableCell>Total Orders</TableCell>
                                <TableCell>Total Spent</TableCell>
                                <TableCell>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {customers
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map((customer) => (
                                    <TableRow key={customer.id}>
                                        <TableCell>{customer.name}</TableCell>
                                        <TableCell>{customer.email}</TableCell>
                                        <TableCell>{customer.phone}</TableCell>
                                        <TableCell>
                                            <Chip
                                                label={customer.status}
                                                color={customer.status === 'active' ? 'success' : 'default'}
                                                size="small"
                                            />
                                        </TableCell>
                                        <TableCell>{customer.totalOrders}</TableCell>
                                        <TableCell>${customer.totalSpent.toFixed(2)}</TableCell>
                                        <TableCell>
                                            <IconButton
                                                onClick={() => handleViewDetails(customer)}
                                                color="primary"
                                            >
                                                <ViewIcon />
                                            </IconButton>
                                            <IconButton
                                                onClick={() => handleOpenForm(customer)}
                                                color="info"
                                            >
                                                <EditIcon />
                                            </IconButton>
                                            <IconButton
                                                onClick={() => handleDelete(customer.id)}
                                                color="error"
                                            >
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
                        count={customers.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                </TableContainer>

                {/* Customer Form Dialog */}
                <Dialog open={openForm} onClose={() => setOpenForm(false)} maxWidth="sm" fullWidth>
                    <DialogTitle>
                        {selectedCustomer ? 'Edit Customer' : 'Add New Customer'}
                    </DialogTitle>
                    <form onSubmit={handleSubmit}>
                        <DialogContent>
                            <TextField
                                autoFocus
                                margin="dense"
                                label="Name"
                                fullWidth
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                required
                            />
                            <TextField
                                margin="dense"
                                label="Email"
                                type="email"
                                fullWidth
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                required
                            />
                            <TextField
                                margin="dense"
                                label="Phone"
                                fullWidth
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                required
                            />
                            <TextField
                                margin="dense"
                                label="Address"
                                fullWidth
                                multiline
                                rows={3}
                                value={formData.address}
                                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                required
                            />
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={() => setOpenForm(false)}>Cancel</Button>
                            <Button type="submit" variant="contained">
                                {selectedCustomer ? 'Update' : 'Create'}
                            </Button>
                        </DialogActions>
                    </form>
                </Dialog>

                {/* Customer Details Dialog */}
                <Dialog
                    open={openDetails}
                    onClose={() => setOpenDetails(false)}
                    maxWidth="md"
                    fullWidth
                >
                    <DialogTitle>Customer Details</DialogTitle>
                    <DialogContent>
                        {selectedCustomer && (
                            <Box>
                                <Grid container spacing={3}>
                                    <Grid item xs={12}>
                                        <Card>
                                            <CardContent>
                                                <Typography variant="h6" gutterBottom>
                                                    Contact Information
                                                </Typography>
                                                <Grid container spacing={2}>
                                                    <Grid item xs={12} sm={6}>
                                                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                                            <EmailIcon sx={{ mr: 1 }} />
                                                            <Typography>{selectedCustomer.email}</Typography>
                                                        </Box>
                                                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                                            <PhoneIcon sx={{ mr: 1 }} />
                                                            <Typography>{selectedCustomer.phone}</Typography>
                                                        </Box>
                                                    </Grid>
                                                    <Grid item xs={12} sm={6}>
                                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                            <LocationIcon sx={{ mr: 1 }} />
                                                            <Typography>{selectedCustomer.address}</Typography>
                                                        </Box>
                                                    </Grid>
                                                </Grid>
                                            </CardContent>
                                        </Card>
                                    </Grid>

                                    <Grid item xs={12}>
                                        <Typography variant="h6" gutterBottom>
                                            Order History
                                        </Typography>
                                        <TableContainer component={Paper} variant="outlined">
                                            <Table size="small">
                                                <TableHead>
                                                    <TableRow>
                                                        <TableCell>Order ID</TableCell>
                                                        <TableCell>Date</TableCell>
                                                        <TableCell>Status</TableCell>
                                                        <TableCell align="right">Amount</TableCell>
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    {customerOrders.map((order) => (
                                                        <TableRow key={order.id}>
                                                            <TableCell>{order.id}</TableCell>
                                                            <TableCell>{formatDate(order.createdAt)}</TableCell>
                                                            <TableCell>
                                                                <Chip
                                                                    label={order.status}
                                                                    size="small"
                                                                    color={
                                                                        order.status === 'completed'
                                                                            ? 'success'
                                                                            : order.status === 'cancelled'
                                                                                ? 'error'
                                                                                : 'warning'
                                                                    }
                                                                />
                                                            </TableCell>
                                                            <TableCell align="right">
                                                                ${order.totalAmount.toFixed(2)}
                                                            </TableCell>
                                                        </TableRow>
                                                    ))}
                                                </TableBody>
                                            </Table>
                                        </TableContainer>
                                    </Grid>
                                </Grid>
                            </Box>
                        )}
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setOpenDetails(false)}>Close</Button>
                    </DialogActions>
                </Dialog>
            </Box>
        </DashboardLayout>
    );
} 