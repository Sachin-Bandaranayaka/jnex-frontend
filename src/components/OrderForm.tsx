import { useState, useEffect } from 'react';
import { Order, Customer, Product } from '@/interfaces/interfaces';
import { api } from '@/lib/api';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    IconButton,
    Box,
    Typography,
    Grid,
    SelectChangeEvent,
} from '@mui/material';
import { Close as CloseIcon, Add as AddIcon, Remove as RemoveIcon } from '@mui/icons-material';

interface OrderFormProps {
    open: boolean;
    onClose: () => void;
    onSubmit: () => void;
    initialData?: Order;
}

interface OrderFormData {
    customer_id: string;
    products: Array<{
        product_id: string;
        quantity: number;
        price: number;
    }>;
    total_amount: number;
    status: string;
    payment_status: string;
}

export default function OrderForm({ open, onClose, onSubmit, initialData }: OrderFormProps) {
    const [formData, setFormData] = useState<OrderFormData>({
        customer_id: '',
        products: [],
        total_amount: 0,
        status: 'pending',
        payment_status: 'pending'
    });

    const [customers, setCustomers] = useState<Customer[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (open) {
            fetchData();
        }
    }, [open]);

    useEffect(() => {
        if (initialData) {
            setFormData({
                customer_id: initialData.customerId,
                products: initialData.products.map(p => ({
                    product_id: p.productId,
                    quantity: p.quantity,
                    price: p.price
                })),
                total_amount: initialData.totalAmount,
                status: initialData.status,
                payment_status: initialData.paymentStatus
            });
        }
    }, [initialData]);

    const fetchData = async () => {
        try {
            const [customersRes, productsRes] = await Promise.all([
                api.get('/api/customers'),
                api.get('/api/products')
            ]);
            setCustomers(customersRes.data);
            setProducts(productsRes.data);
        } catch (err) {
            console.error('Error fetching data:', err);
            setError('Failed to load form data');
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement> | SelectChangeEvent) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleProductChange = (index: number, field: string, value: string | number) => {
        setFormData(prev => {
            const newProducts = [...prev.products];
            newProducts[index] = {
                ...newProducts[index],
                [field]: value
            };

            // Recalculate total amount
            const total = newProducts.reduce((sum, product) => {
                return sum + (product.quantity * product.price);
            }, 0);

            return {
                ...prev,
                products: newProducts,
                total_amount: total
            };
        });
    };

    const addProduct = () => {
        setFormData(prev => ({
            ...prev,
            products: [
                ...prev.products,
                { product_id: '', quantity: 1, price: 0 }
            ]
        }));
    };

    const removeProduct = (index: number) => {
        setFormData(prev => {
            const newProducts = prev.products.filter((_, i) => i !== index);
            const total = newProducts.reduce((sum, product) => {
                return sum + (product.quantity * product.price);
            }, 0);

            return {
                ...prev,
                products: newProducts,
                total_amount: total
            };
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            if (initialData?.id) {
                await api.put(`/api/orders/${initialData.id}`, formData);
            } else {
                await api.post('/api/orders', formData);
            }
            onSubmit();
            onClose();
        } catch (err: any) {
            console.error('Failed to save order:', err);
            setError(err.message || 'Failed to save order');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle>
                {initialData ? 'Edit Order' : 'New Order'}
            </DialogTitle>
            <form onSubmit={handleSubmit}>
                <DialogContent>
                    <Box display="flex" flexDirection="column" gap={2}>
                        {error && (
                            <Box sx={{ color: 'error.main', mb: 2 }}>
                                {error}
                            </Box>
                        )}

                        <FormControl fullWidth>
                            <InputLabel>Customer</InputLabel>
                            <Select
                                name="customer_id"
                                value={formData.customer_id}
                                onChange={handleChange}
                                required
                            >
                                {customers.map(customer => (
                                    <MenuItem key={customer.id} value={customer.id}>
                                        {customer.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <Box>
                            <Button
                                type="button"
                                variant="outlined"
                                onClick={addProduct}
                                sx={{ mb: 2 }}
                            >
                                Add Product
                            </Button>

                            {formData.products.map((product, index) => (
                                <Box key={index} sx={{ mb: 2, p: 2, border: '1px solid #ddd', borderRadius: 1 }}>
                                    <Box display="flex" gap={2} alignItems="flex-start">
                                        <FormControl fullWidth>
                                            <InputLabel>Product</InputLabel>
                                            <Select
                                                value={product.product_id}
                                                onChange={(e) => handleProductChange(index, 'product_id', e.target.value)}
                                                required
                                            >
                                                {products.map(p => (
                                                    <MenuItem key={p.id} value={p.id}>
                                                        {p.name} - ${p.price}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>

                                        <TextField
                                            label="Quantity"
                                            type="number"
                                            value={product.quantity}
                                            onChange={(e) => handleProductChange(index, 'quantity', parseInt(e.target.value) || 0)}
                                            required
                                            InputProps={{ inputProps: { min: 1 } }}
                                        />

                                        <TextField
                                            label="Price"
                                            type="number"
                                            value={product.price}
                                            onChange={(e) => handleProductChange(index, 'price', parseFloat(e.target.value) || 0)}
                                            required
                                            InputProps={{ inputProps: { min: 0, step: 0.01 } }}
                                        />

                                        <Button
                                            type="button"
                                            color="error"
                                            onClick={() => removeProduct(index)}
                                        >
                                            Remove
                                        </Button>
                                    </Box>
                                </Box>
                            ))}
                        </Box>

                        <TextField
                            label="Total Amount"
                            type="number"
                            value={formData.total_amount}
                            InputProps={{
                                readOnly: true,
                                inputProps: { min: 0, step: 0.01 }
                            }}
                        />

                        <FormControl fullWidth>
                            <InputLabel>Status</InputLabel>
                            <Select
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
                                required
                            >
                                <MenuItem value="pending">Pending</MenuItem>
                                <MenuItem value="processing">Processing</MenuItem>
                                <MenuItem value="completed">Completed</MenuItem>
                                <MenuItem value="cancelled">Cancelled</MenuItem>
                            </Select>
                        </FormControl>

                        <FormControl fullWidth>
                            <InputLabel>Payment Status</InputLabel>
                            <Select
                                name="payment_status"
                                value={formData.payment_status}
                                onChange={handleChange}
                                required
                            >
                                <MenuItem value="pending">Pending</MenuItem>
                                <MenuItem value="processing">Processing</MenuItem>
                                <MenuItem value="paid">Paid</MenuItem>
                                <MenuItem value="failed">Failed</MenuItem>
                            </Select>
                        </FormControl>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={onClose}>Cancel</Button>
                    <Button
                        type="submit"
                        variant="contained"
                        disabled={loading}
                    >
                        {loading ? 'Saving...' : (initialData ? 'Save Changes' : 'Create Order')}
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
} 