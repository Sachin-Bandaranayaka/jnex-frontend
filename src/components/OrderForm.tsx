import { useState, useEffect } from 'react';
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
} from '@mui/material';
import { Close as CloseIcon, Add as AddIcon, Remove as RemoveIcon } from '@mui/icons-material';
import { api } from '@/lib/api';

interface Customer {
    id: number;
    name: string;
}

interface Product {
    id: number;
    code: string;
    name: string;
    price: number;
}

interface OrderItem {
    product_code: string;
    quantity: number;
    unit_price: number;
}

interface OrderFormProps {
    open: boolean;
    onClose: () => void;
    onSubmit: () => void;
}

export default function OrderForm({ open, onClose, onSubmit }: OrderFormProps) {
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        customer_id: '',
        shipping_address: '',
        payment_method: 'cash',
        notes: '',
        items: [{ product_code: '', quantity: 1, unit_price: 0 }]
    });

    useEffect(() => {
        fetchCustomers();
        fetchProducts();
    }, []);

    const fetchCustomers = async () => {
        try {
            const response = await api.get('/customers');
            setCustomers(response.data);
        } catch (error) {
            console.error('Error fetching customers:', error);
        }
    };

    const fetchProducts = async () => {
        try {
            const response = await api.get('/products');
            setProducts(response.data);
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name as string]: value
        }));
    };

    const handleItemChange = (index: number, field: keyof OrderItem, value: any) => {
        const newItems = [...formData.items];
        newItems[index] = {
            ...newItems[index],
            [field]: value
        };

        // If product is selected, set its price
        if (field === 'product_code') {
            const product = products.find(p => p.code === value);
            if (product) {
                newItems[index].unit_price = product.price;
            }
        }

        setFormData(prev => ({
            ...prev,
            items: newItems
        }));
    };

    const addItem = () => {
        setFormData(prev => ({
            ...prev,
            items: [...prev.items, { product_code: '', quantity: 1, unit_price: 0 }]
        }));
    };

    const removeItem = (index: number) => {
        if (formData.items.length > 1) {
            setFormData(prev => ({
                ...prev,
                items: prev.items.filter((_, i) => i !== index)
            }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post('/orders', formData);
            onSubmit();
            onClose();
        } catch (error) {
            console.error('Error creating order:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle>
                Create New Order
                <IconButton
                    aria-label="close"
                    onClick={onClose}
                    sx={{ position: 'absolute', right: 8, top: 8 }}
                >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <form onSubmit={handleSubmit}>
                <DialogContent>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
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
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Shipping Address"
                                name="shipping_address"
                                value={formData.shipping_address}
                                onChange={handleChange}
                                required
                                multiline
                                rows={2}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <FormControl fullWidth>
                                <InputLabel>Payment Method</InputLabel>
                                <Select
                                    name="payment_method"
                                    value={formData.payment_method}
                                    onChange={handleChange}
                                    required
                                >
                                    <MenuItem value="cash">Cash</MenuItem>
                                    <MenuItem value="card">Card</MenuItem>
                                    <MenuItem value="bank_transfer">Bank Transfer</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Notes"
                                name="notes"
                                value={formData.notes}
                                onChange={handleChange}
                                multiline
                                rows={2}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <Typography variant="h6" gutterBottom>
                                Order Items
                            </Typography>
                            {formData.items.map((item, index) => (
                                <Box key={index} sx={{ mb: 2, display: 'flex', gap: 1 }}>
                                    <FormControl sx={{ flex: 2 }}>
                                        <InputLabel>Product</InputLabel>
                                        <Select
                                            value={item.product_code}
                                            onChange={(e) => handleItemChange(index, 'product_code', e.target.value)}
                                            required
                                        >
                                            {products.map(product => (
                                                <MenuItem key={product.code} value={product.code}>
                                                    {product.name} (${product.price})
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                    <TextField
                                        sx={{ flex: 1 }}
                                        type="number"
                                        label="Quantity"
                                        value={item.quantity}
                                        onChange={(e) => handleItemChange(index, 'quantity', parseInt(e.target.value))}
                                        required
                                        inputProps={{ min: 1 }}
                                    />
                                    <TextField
                                        sx={{ flex: 1 }}
                                        type="number"
                                        label="Unit Price"
                                        value={item.unit_price}
                                        disabled
                                    />
                                    <IconButton
                                        color="error"
                                        onClick={() => removeItem(index)}
                                        disabled={formData.items.length === 1}
                                    >
                                        <RemoveIcon />
                                    </IconButton>
                                </Box>
                            ))}
                            <Button
                                startIcon={<AddIcon />}
                                onClick={addItem}
                                variant="outlined"
                                size="small"
                            >
                                Add Item
                            </Button>
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={onClose}>Cancel</Button>
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        disabled={loading}
                    >
                        {loading ? 'Creating...' : 'Create Order'}
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
} 