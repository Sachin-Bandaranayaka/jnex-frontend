import { useState, useEffect } from 'react';
import { Task } from '@/interfaces/interfaces';
import { api } from '@/lib/api';
import Modal from './Modal';

interface TaskFormProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (data: Partial<Task>) => Promise<void>;
    initialData?: Task;
    isEdit?: boolean;
}

interface User {
    id: number;
    username: string;
    name: string;
}

interface Lead {
    id: number;
    lead_no: string;
    status: string;
}

export default function TaskForm({ open, onClose, onSubmit, initialData, isEdit }: TaskFormProps) {
    const [users, setUsers] = useState<User[]>([]);
    const [leads, setLeads] = useState<Lead[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [formData, setFormData] = useState<Partial<Task>>({
        title: '',
        description: '',
        lead_id: 0,
        staff_user: 0,
        due_date: new Date().toISOString().slice(0, 16),
        priority: 'MEDIUM',
        task_type: 'FOLLOW_UP',
        status: 'NEW'
    });

    useEffect(() => {
        if (open) {
            fetchUsers();
            fetchLeads();
            if (initialData) {
                setFormData({
                    ...initialData,
                    due_date: new Date(initialData.due_date).toISOString().slice(0, 16)
                });
            }
        }
    }, [open, initialData]);

    const fetchUsers = async () => {
        try {
            const response = await api.get('/users');
            setUsers(response.data.users);
        } catch (error) {
            console.error('Error fetching users:', error);
            setError('Failed to load users');
        }
    };

    const fetchLeads = async () => {
        try {
            const response = await api.get('/leads/active');
            setLeads(response.data.leads);
        } catch (error) {
            console.error('Error fetching leads:', error);
            setError('Failed to load leads');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            await onSubmit(formData);
            onClose();
        } catch (error) {
            console.error('Error submitting task:', error);
            setError('Failed to save task');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    return (
        <Modal open={open} onClose={onClose}>
            <div className="bg-white p-6 rounded-lg max-w-2xl w-full">
                <h2 className="text-2xl font-bold mb-6">{isEdit ? 'Edit Task' : 'Create New Task'}</h2>

                {error && (
                    <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-4">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Title</label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            required
                            className="mt-1 block w-full border rounded-md shadow-sm p-2"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Description</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows={3}
                            className="mt-1 block w-full border rounded-md shadow-sm p-2"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Lead</label>
                        <select
                            name="lead_id"
                            value={formData.lead_id}
                            onChange={handleChange}
                            required
                            className="mt-1 block w-full border rounded-md shadow-sm p-2"
                        >
                            <option value="">Select a lead</option>
                            {leads.map(lead => (
                                <option key={lead.id} value={lead.id}>
                                    {lead.lead_no} - {lead.status}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Assign To</label>
                        <select
                            name="staff_user"
                            value={formData.staff_user}
                            onChange={handleChange}
                            required
                            className="mt-1 block w-full border rounded-md shadow-sm p-2"
                        >
                            <option value="">Select a user</option>
                            {users.map(user => (
                                <option key={user.id} value={user.id}>
                                    {user.name} ({user.username})
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Due Date</label>
                        <input
                            type="datetime-local"
                            name="due_date"
                            value={formData.due_date}
                            onChange={handleChange}
                            required
                            className="mt-1 block w-full border rounded-md shadow-sm p-2"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Priority</label>
                        <select
                            name="priority"
                            value={formData.priority}
                            onChange={handleChange}
                            required
                            className="mt-1 block w-full border rounded-md shadow-sm p-2"
                        >
                            <option value="LOW">Low</option>
                            <option value="MEDIUM">Medium</option>
                            <option value="HIGH">High</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Type</label>
                        <select
                            name="task_type"
                            value={formData.task_type}
                            onChange={handleChange}
                            required
                            className="mt-1 block w-full border rounded-md shadow-sm p-2"
                        >
                            <option value="FOLLOW_UP">Follow Up</option>
                            <option value="MEETING">Meeting</option>
                            <option value="CALL">Call</option>
                            <option value="OTHER">Other</option>
                        </select>
                    </div>

                    {isEdit && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Status</label>
                            <select
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
                                required
                                className="mt-1 block w-full border rounded-md shadow-sm p-2"
                            >
                                <option value="NEW">New</option>
                                <option value="IN_PROGRESS">In Progress</option>
                                <option value="COMPLETED">Completed</option>
                                <option value="CANCELLED">Cancelled</option>
                            </select>
                        </div>
                    )}

                    <div className="flex justify-end space-x-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 border rounded-md text-gray-600 hover:bg-gray-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                        >
                            {loading ? 'Saving...' : isEdit ? 'Update Task' : 'Create Task'}
                        </button>
                    </div>
                </form>
            </div>
        </Modal>
    );
} 