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
    MenuItem,
    Select,
    FormControl,
    InputLabel,
    Grid,
    Card,
    CardContent,
} from '@mui/material';
import {
    Add as AddIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    Flag as FlagIcon,
    Person as PersonIcon,
    Link as LinkIcon,
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { taskService, Task, CreateTaskDto } from '@/services/task.service';

const priorityColors = {
    low: 'success',
    medium: 'warning',
    high: 'error',
};

const statusColors = {
    pending: 'warning',
    in_progress: 'info',
    completed: 'success',
    cancelled: 'error',
};

export default function TasksPage() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [users, setUsers] = useState<{ id: string; name: string }[]>([]);
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);
    const [openForm, setOpenForm] = useState(false);
    const [formData, setFormData] = useState<CreateTaskDto>({
        title: '',
        description: '',
        priority: 'medium',
        dueDate: new Date().toISOString(),
        assignedTo: '',
    });
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    useEffect(() => {
        fetchTasks();
        fetchUsers();
    }, []);

    const fetchTasks = async () => {
        try {
            const data = await taskService.getTasks();
            setTasks(data);
        } catch (error) {
            console.error('Error fetching tasks:', error);
        }
    };

    const fetchUsers = async () => {
        try {
            const data = await taskService.getAssignableUsers();
            setUsers(data);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    const handleOpenForm = (task?: Task) => {
        if (task) {
            setFormData({
                title: task.title,
                description: task.description,
                priority: task.priority,
                dueDate: task.dueDate,
                assignedTo: task.assignedTo,
                relatedTo: task.relatedTo,
            });
            setSelectedTask(task);
        } else {
            setFormData({
                title: '',
                description: '',
                priority: 'medium',
                dueDate: new Date().toISOString(),
                assignedTo: '',
            });
            setSelectedTask(null);
        }
        setOpenForm(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (selectedTask) {
                await taskService.updateTask(selectedTask.id, formData);
            } else {
                await taskService.createTask(formData);
            }
            setOpenForm(false);
            fetchTasks();
        } catch (error) {
            console.error('Error saving task:', error);
        }
    };

    const handleStatusChange = async (taskId: string, status: Task['status']) => {
        try {
            await taskService.updateTask(taskId, { status });
            fetchTasks();
        } catch (error) {
            console.error('Error updating task status:', error);
        }
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this task?')) {
            try {
                await taskService.deleteTask(id);
                fetchTasks();
            } catch (error) {
                console.error('Error deleting task:', error);
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
                    <Typography variant="h4">Tasks</Typography>
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={() => handleOpenForm()}
                    >
                        Add Task
                    </Button>
                </Box>

                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Title</TableCell>
                                <TableCell>Priority</TableCell>
                                <TableCell>Status</TableCell>
                                <TableCell>Assigned To</TableCell>
                                <TableCell>Due Date</TableCell>
                                <TableCell>Related To</TableCell>
                                <TableCell>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {tasks
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map((task) => (
                                    <TableRow key={task.id}>
                                        <TableCell>{task.title}</TableCell>
                                        <TableCell>
                                            <Chip
                                                icon={<FlagIcon />}
                                                label={task.priority}
                                                color={priorityColors[task.priority] as any}
                                                size="small"
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Chip
                                                label={task.status.replace('_', ' ')}
                                                color={statusColors[task.status] as any}
                                                size="small"
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                <PersonIcon sx={{ mr: 1 }} />
                                                {task.assignedToName}
                                            </Box>
                                        </TableCell>
                                        <TableCell>{formatDate(task.dueDate)}</TableCell>
                                        <TableCell>
                                            {task.relatedTo && (
                                                <Chip
                                                    icon={<LinkIcon />}
                                                    label={`${task.relatedTo.type}: ${task.relatedTo.name}`}
                                                    size="small"
                                                />
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            <FormControl size="small" sx={{ minWidth: 120, mr: 1 }}>
                                                <Select
                                                    value={task.status}
                                                    onChange={(e) =>
                                                        handleStatusChange(task.id, e.target.value as Task['status'])
                                                    }
                                                    size="small"
                                                >
                                                    <MenuItem value="pending">Pending</MenuItem>
                                                    <MenuItem value="in_progress">In Progress</MenuItem>
                                                    <MenuItem value="completed">Completed</MenuItem>
                                                    <MenuItem value="cancelled">Cancelled</MenuItem>
                                                </Select>
                                            </FormControl>
                                            <IconButton onClick={() => handleOpenForm(task)} color="primary">
                                                <EditIcon />
                                            </IconButton>
                                            <IconButton onClick={() => handleDelete(task.id)} color="error">
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
                        count={tasks.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                </TableContainer>

                {/* Task Form Dialog */}
                <Dialog open={openForm} onClose={() => setOpenForm(false)} maxWidth="sm" fullWidth>
                    <DialogTitle>
                        {selectedTask ? 'Edit Task' : 'Add New Task'}
                    </DialogTitle>
                    <form onSubmit={handleSubmit}>
                        <DialogContent>
                            <TextField
                                autoFocus
                                margin="dense"
                                label="Title"
                                fullWidth
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                required
                            />
                            <TextField
                                margin="dense"
                                label="Description"
                                fullWidth
                                multiline
                                rows={3}
                                value={formData.description}
                                onChange={(e) =>
                                    setFormData({ ...formData, description: e.target.value })
                                }
                                required
                            />
                            <FormControl fullWidth margin="dense">
                                <InputLabel>Priority</InputLabel>
                                <Select
                                    value={formData.priority}
                                    label="Priority"
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            priority: e.target.value as 'low' | 'medium' | 'high',
                                        })
                                    }
                                >
                                    <MenuItem value="low">Low</MenuItem>
                                    <MenuItem value="medium">Medium</MenuItem>
                                    <MenuItem value="high">High</MenuItem>
                                </Select>
                            </FormControl>
                            <FormControl fullWidth margin="dense">
                                <InputLabel>Assigned To</InputLabel>
                                <Select
                                    value={formData.assignedTo}
                                    label="Assigned To"
                                    onChange={(e) =>
                                        setFormData({ ...formData, assignedTo: e.target.value })
                                    }
                                    required
                                >
                                    {users.map((user) => (
                                        <MenuItem key={user.id} value={user.id}>
                                            {user.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                                <DatePicker
                                    label="Due Date"
                                    value={new Date(formData.dueDate)}
                                    onChange={(newValue) => {
                                        if (newValue) {
                                            setFormData({
                                                ...formData,
                                                dueDate: newValue.toISOString(),
                                            });
                                        }
                                    }}
                                    sx={{ mt: 2, width: '100%' }}
                                />
                            </LocalizationProvider>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={() => setOpenForm(false)}>Cancel</Button>
                            <Button type="submit" variant="contained">
                                {selectedTask ? 'Update' : 'Create'}
                            </Button>
                        </DialogActions>
                    </form>
                </Dialog>
            </Box>
        </DashboardLayout>
    );
} 