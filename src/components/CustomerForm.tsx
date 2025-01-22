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
} from "@mui/material";

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

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name as string]: value,
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
                            onChange={handleChange}
                            required
                        />

                        <TextField
                            fullWidth
                            label="Email"
                            name="email"
                            type="email"
                            value={formData.email || ""}
                            onChange={handleChange}
                            required
                        />

                        <TextField
                            fullWidth
                            label="Phone"
                            name="phone"
                            value={formData.phone || ""}
                            onChange={handleChange}
                            required
                        />

                        <TextField
                            fullWidth
                            label="Address"
                            name="address"
                            value={formData.address || ""}
                            onChange={handleChange}
                            multiline
                            rows={2}
                            required
                        />

                        <FormControl fullWidth>
                            <InputLabel>Status</InputLabel>
                            <Select
                                name="status"
                                value={formData.status || "active"}
                                onChange={handleChange}
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