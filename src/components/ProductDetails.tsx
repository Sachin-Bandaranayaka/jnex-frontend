import { useState } from "react";
import { Product } from "@/interfaces/interfaces";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    Box,
    Chip,
    Divider,
} from "@mui/material";
import ProductForm from "./ProductForm";

interface ProductDetailsProps {
    product: Product;
    onClose: () => void;
    onUpdate: (data: Partial<Product>) => void;
}

export default function ProductDetails({
    product,
    onClose,
    onUpdate,
}: ProductDetailsProps) {
    const [isEditing, setIsEditing] = useState(false);

    const handleUpdate = (data: Partial<Product>) => {
        onUpdate(data);
        setIsEditing(false);
    };

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case "active":
                return "success";
            case "inactive":
                return "error";
            default:
                return "default";
        }
    };

    const getStockStatusColor = (stock: number) => {
        if (stock <= 0) return "error";
        if (stock <= 10) return "warning";
        return "success";
    };

    const formatPrice = (price: string | number): string => {
        const numericPrice = typeof price === 'string' ? parseFloat(price) : price;
        return !isNaN(numericPrice) ? `$${numericPrice.toFixed(2)}` : '$0.00';
    };

    if (isEditing) {
        return (
            <ProductForm
                open={true}
                onClose={() => setIsEditing(false)}
                onSubmit={handleUpdate}
                initialData={product}
                isEdit={true}
            />
        );
    }

    return (
        <Dialog open={true} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>Product Details</DialogTitle>
            <DialogContent>
                <Box className="space-y-4">
                    <Box className="flex justify-between items-start">
                        <Typography variant="h6">{product.name}</Typography>
                        <Chip
                            label={product.status.charAt(0).toUpperCase() + product.status.slice(1)}
                            color={getStatusColor(product.status)}
                            size="small"
                        />
                    </Box>

                    <Divider />

                    <Box className="space-y-2">
                        <Typography variant="subtitle2" color="textSecondary">
                            Basic Information
                        </Typography>
                        <Typography>Code: {product.code}</Typography>
                        <Typography>Description: {product.description}</Typography>
                        <Typography>Category: {product.category}</Typography>
                    </Box>

                    <Divider />

                    <Box className="space-y-2">
                        <Typography variant="subtitle2" color="textSecondary">
                            Stock & Price
                        </Typography>
                        <Typography>Price: {formatPrice(product.price)}</Typography>
                        <Box display="flex" alignItems="center" gap={1}>
                            <Typography>Stock:</Typography>
                            <Chip
                                label={`${product.stock} units`}
                                color={getStockStatusColor(product.stock)}
                                size="small"
                            />
                        </Box>
                    </Box>

                    <Divider />

                    <Box className="space-y-2">
                        <Typography variant="subtitle2" color="textSecondary">
                            Additional Information
                        </Typography>
                        <Typography>
                            Created: {new Date(product.createdAt).toLocaleDateString()}
                        </Typography>
                    </Box>
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Close</Button>
                <Button onClick={() => setIsEditing(true)} variant="contained" color="primary">
                    Edit
                </Button>
            </DialogActions>
        </Dialog>
    );
} 