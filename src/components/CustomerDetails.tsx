import { useState } from "react";
import { Customer } from "@/interfaces/interfaces";
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
import CustomerForm from "./CustomerForm";

interface CustomerDetailsProps {
    customer: Customer;
    onClose: () => void;
    onUpdate: (data: Partial<Customer>) => void;
}

export default function CustomerDetails({
    customer,
    onClose,
    onUpdate,
}: CustomerDetailsProps) {
    const [isEditing, setIsEditing] = useState(false);

    const handleUpdate = (data: Partial<Customer>) => {
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

    if (isEditing) {
        return (
            <CustomerForm
                open={true}
                onClose={() => setIsEditing(false)}
                onSubmit={handleUpdate}
                initialData={customer}
                isEdit={true}
            />
        );
    }

    return (
        <Dialog open={true} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>Customer Details</DialogTitle>
            <DialogContent>
                <Box className="space-y-4">
                    <Box className="flex justify-between items-start">
                        <Typography variant="h6">{customer.name}</Typography>
                        <Chip
                            label={customer.status.charAt(0).toUpperCase() + customer.status.slice(1)}
                            color={getStatusColor(customer.status)}
                            size="small"
                        />
                    </Box>

                    <Divider />

                    <Box className="space-y-2">
                        <Typography variant="subtitle2" color="textSecondary">
                            Contact Information
                        </Typography>
                        <Typography>Email: {customer.email}</Typography>
                        <Typography>Phone: {customer.phone}</Typography>
                        <Typography>Address: {customer.address}</Typography>
                    </Box>

                    <Divider />

                    <Box className="space-y-2">
                        <Typography variant="subtitle2" color="textSecondary">
                            Order Information
                        </Typography>
                        <Typography>Total Orders: {customer.totalOrders}</Typography>
                        <Typography>
                            Created: {new Date(customer.createdAt).toLocaleDateString()}
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