import { useState, useEffect } from 'react';
import { Task } from '@/interfaces/interfaces';
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
    Box,
    SelectChangeEvent,
} from '@mui/material';

interface TaskFormProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (taskData: Partial<Task>) => Promise<void>;
    initialData?: Task;
    isEdit?: boolean;
}

interface TaskFormData {
    title: string;
    description?: string;
    lead_id?: number;
    staff_user?: number;
    due_date: Date;
    priority: 'low' | 'medium' | 'high';
    task_type: 'follow_up' | 'meeting' | 'call' | 'other';
    status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
}

export default function TaskForm({ open, onClose, onSubmit, initialData, isEdit }: TaskFormProps) {
    const [formData, setFormData] = useState<TaskFormData>({
        title: '',
        description: '',
        lead_id: undefined,
        staff_user: undefined,
        due_date: new Date(),
        priority: 'medium',
        task_type: 'follow_up',
        status: 'pending'
    });

    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (initialData) {
            const { title, description, lead_id, staff_user, due_date, priority, task_type, status } = initialData;
            setFormData({
                title: title || '',
                description: description || '',
                lead_id,
                staff_user,
                due_date: new Date(due_date),
                priority: priority as 'low' | 'medium' | 'high',
                task_type: task_type as 'follow_up' | 'meeting' | 'call' | 'other',
                status: status as 'pending' | 'in_progress' | 'completed' | 'cancelled'
            });
        }
    }, [initialData]);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent<string>
    ) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({
            ...prev,
            due_date: new Date(e.target.value)
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            const taskData = {
                ...formData,
                due_date: formData.due_date.toISOString()
            };
            await onSubmit(taskData);
            onClose();
        } catch (err: any) {
            console.error('Failed to save task:', err);
            setError(err.message || 'Failed to save task');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>
                {initialData ? 'Edit Task' : 'New Task'}
            </DialogTitle>
            <form onSubmit={handleSubmit}>
                <DialogContent>
                    <Box display="flex" flexDirection="column" gap={2}>
                        {error && (
                            <Box sx={{ color: 'error.main', mb: 2 }}>
                                {error}
                            </Box>
                        )}

                        <TextField
                            label="Title"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            required
                            fullWidth
                        />

                        <TextField
                            label="Description"
                            name="description"
                            value={formData.description || ''}
                            onChange={handleChange}
                            multiline
                            rows={3}
                            fullWidth
                        />

                        <TextField
                            label="Due Date"
                            type="datetime-local"
                            value={formData.due_date.toISOString().slice(0, 16)}
                            onChange={handleDateChange}
                            required
                            fullWidth
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />

                        <FormControl fullWidth>
                            <InputLabel>Priority</InputLabel>
                            <Select
                                name="priority"
                                value={formData.priority}
                                onChange={handleChange}
                                required
                            >
                                <MenuItem value="low">Low</MenuItem>
                                <MenuItem value="medium">Medium</MenuItem>
                                <MenuItem value="high">High</MenuItem>
                            </Select>
                        </FormControl>

                        <FormControl fullWidth>
                            <InputLabel>Type</InputLabel>
                            <Select
                                name="task_type"
                                value={formData.task_type}
                                onChange={handleChange}
                                required
                            >
                                <MenuItem value="follow_up">Follow Up</MenuItem>
                                <MenuItem value="meeting">Meeting</MenuItem>
                                <MenuItem value="call">Call</MenuItem>
                                <MenuItem value="other">Other</MenuItem>
                            </Select>
                        </FormControl>

                        <FormControl fullWidth>
                            <InputLabel>Status</InputLabel>
                            <Select
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
                                required
                            >
                                <MenuItem value="pending">Pending</MenuItem>
                                <MenuItem value="in_progress">In Progress</MenuItem>
                                <MenuItem value="completed">Completed</MenuItem>
                                <MenuItem value="cancelled">Cancelled</MenuItem>
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
                        {loading ? 'Saving...' : (initialData ? 'Save Changes' : 'Create Task')}
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
} 