import { useState } from "react";
import { Customer } from "@/interfaces/interfaces";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Box,
} from "@mui/material";
import { SelectChangeEvent } from '@mui/material/Select';

interface CustomerFormProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (data: Partial<Customer>) => void;
    initialData?: Customer;
    isEdit?: boolean;
}

export default function CustomerForm({
    open,
    onClose,
    onSubmit,
    initialData,
    isEdit = false,
}: CustomerFormProps) {
    const [formData, setFormData] = useState<Partial<Customer>>(
        initialData || {
            name: "",
            email: "",
            phone: "",
            address: "",
            status: "active",
        }
    );

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleStatusChange = (e: SelectChangeEvent<'active' | 'inactive'>) => {
        setFormData((prev) => ({
            ...prev,
            status: e.target.value as 'active' | 'inactive',
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>{isEdit ? "Edit Customer" : "Create New Customer"}</DialogTitle>
            <form onSubmit={handleSubmit}>
                <DialogContent>
                    <div className="space-y-4">
                        <TextField
                            fullWidth
                            label="Name"
                            name="name"
                            value={formData.name || ""}
                            onChange={handleInputChange}
                            required
                        />

                        <TextField
                            fullWidth
                            label="Email"
                            name="email"
                            type="email"
                            value={formData.email || ""}
                            onChange={handleInputChange}
                            required
                        />

                        <TextField
                            fullWidth
                            label="Phone"
                            name="phone"
                            value={formData.phone || ""}
                            onChange={handleInputChange}
                            required
                        />

                        <TextField
                            fullWidth
                            label="Address"
                            name="address"
                            value={formData.address || ""}
                            onChange={handleInputChange}
                            multiline
                            rows={2}
                            required
                        />

                        <FormControl fullWidth>
                            <InputLabel>Status</InputLabel>
                            <Select
                                name="status"
                                value={formData.status || "active"}
                                onChange={handleStatusChange}
                                label="Status"
                                required
                            >
                                <MenuItem value="active">Active</MenuItem>
                                <MenuItem value="inactive">Inactive</MenuItem>
                            </Select>
                        </FormControl>
                    </div>
                </DialogContent>
                <DialogActions>
                    <Button onClick={onClose}>Cancel</Button>
                    <Button type="submit" variant="contained" color="primary">
                        {isEdit ? "Update" : "Create"}
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
} 