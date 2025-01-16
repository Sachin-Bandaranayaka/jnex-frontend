import { useState, useEffect } from 'react';
import { Task } from '@/interfaces/interfaces';
import api from '@/lib/api';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

export default function TaskDashboard() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks = async () => {
        try {
            setError(null);
            // Log the current auth token
            const authTokenStr = Cookies.get("authToken");
            console.log("Current auth token:", authTokenStr);

            if (!authTokenStr) {
                console.error("No auth token found");
                router.push('/login');
                return;
            }

            const response = await api.get('/tasks');  // Changed from /tasks/my-tasks to /tasks
            console.log("Tasks response:", response);
            setTasks(response.data);
        } catch (error: any) {
            console.error('Error fetching tasks:', error);
            console.error('Error response:', error.response);
            if (error.response?.status === 401) {
                console.error('Unauthorized - redirecting to login');
                router.push('/login');
            } else {
                setError('Failed to fetch tasks. Please try again later.');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (taskId: number, newStatus: string) => {
        try {
            setError(null);
            const response = await api.put(`/tasks/${taskId}`, { status: newStatus });
            console.log("Status update response:", response);
            fetchTasks();
        } catch (error: any) {
            console.error('Error updating task status:', error);
            console.error('Error response:', error.response);
            if (error.response?.status === 401) {
                router.push('/login');
            } else {
                setError('Failed to update task status. Please try again.');
            }
        }
    };

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'high':
                return 'bg-red-100 text-red-800';
            case 'medium':
                return 'bg-yellow-100 text-yellow-800';
            case 'low':
                return 'bg-green-100 text-green-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'completed':
                return 'bg-green-100 text-green-800';
            case 'in_progress':
                return 'bg-blue-100 text-blue-800';
            case 'cancelled':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    if (loading) {
        return <div className="p-4">Loading tasks...</div>;
    }

    return (
        <div className="p-4">
            <h2 className="text-2xl font-bold mb-4">My Tasks</h2>

            {/* Task Filters */}
            <div className="mb-6 grid grid-cols-3 gap-4">
                <div className="bg-white p-4 rounded-lg shadow">
                    <h3 className="font-semibold text-lg mb-2">Pending</h3>
                    <p className="text-2xl">{tasks.filter(t => t.status === 'pending').length}</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow">
                    <h3 className="font-semibold text-lg mb-2">In Progress</h3>
                    <p className="text-2xl">{tasks.filter(t => t.status === 'in_progress').length}</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow">
                    <h3 className="font-semibold text-lg mb-2">Completed</h3>
                    <p className="text-2xl">{tasks.filter(t => t.status === 'completed').length}</p>
                </div>
            </div>

            {/* Task List */}
            <div className="space-y-4">
                {tasks.map((task) => (
                    <div key={task.id} className="bg-white p-4 rounded-lg shadow">
                        <div className="flex justify-between items-start">
                            <div>
                                <Link
                                    href={`/dashboard/leads/${task.leadId}`}
                                    className="text-lg font-semibold hover:text-blue-600"
                                >
                                    {task.title}
                                </Link>
                                <p className="text-sm text-gray-600 mt-1">{task.description}</p>
                            </div>
                            <div className="text-sm text-gray-500">
                                Due: {new Date(task.dueDate).toLocaleString()}
                            </div>
                        </div>

                        <div className="mt-4 flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                                <span className={`px-2 py-1 rounded-full text-xs ${getPriorityColor(task.priority)}`}>
                                    {task.priority}
                                </span>
                                <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(task.status)}`}>
                                    {task.status}
                                </span>
                                <span className="text-sm text-gray-500">
                                    Lead: {task.leadId}
                                </span>
                            </div>

                            <select
                                value={task.status}
                                onChange={(e) => handleStatusChange(task.id, e.target.value)}
                                className="border rounded px-2 py-1 text-sm"
                            >
                                <option value="pending">Pending</option>
                                <option value="in_progress">In Progress</option>
                                <option value="completed">Completed</option>
                                <option value="cancelled">Cancelled</option>
                            </select>
                        </div>
                    </div>
                ))}

                {tasks.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                        No tasks assigned to you
                    </div>
                )}
            </div>
        </div>
    );
} 