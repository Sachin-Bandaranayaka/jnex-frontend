"use client";

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { useRouter } from 'next/navigation';
import {
    FaUsers,
    FaChartLine,
    FaTasks,
    FaUserCheck,
    FaCalendarAlt
} from 'react-icons/fa';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell
} from 'recharts';

interface DashboardMetrics {
    leadMetrics: {
        leadsByStatus: Array<{ status: string; count: number }>;
        conversionRate: number;
        totalLeads: number;
        convertedLeads: number;
    };
    taskMetrics: {
        tasksByStatus: Array<{ status: string; count: number }>;
        completionRate: number;
        totalTasks: number;
        completedTasks: number;
        overdueTasks: number;
    };
    userPerformance: Array<{
        username: string;
        totalLeads: number;
        convertedLeads: number;
        conversionRate: number;
        completedTasks: number;
    }>;
    activityTimeline: Array<{
        type: string;
        description: string;
        timestamp: string;
        user: string;
    }>;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];
const STATUS_COLORS = {
    new: '#3B82F6',
    contacted: '#F59E0B',
    qualified: '#10B981',
    converted: '#8B5CF6',
    lost: '#EF4444'
};

export default function AnalyticsPage() {
    const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [dateRange, setDateRange] = useState('30');

    const router = useRouter();

    useEffect(() => {
        fetchMetrics();
    }, [dateRange]);

    const fetchMetrics = async () => {
        try {
            setError(null);
            const response = await api.get('/analytics/dashboard', {
                params: { dateRange }
            });

            if (response.data?.success) {
                setMetrics(response.data.data);
            } else {
                setError('Failed to fetch analytics data');
            }
        } catch (error: any) {
            console.error('Error fetching analytics:', error);
            if (error.response?.status === 401) {
                router.push('/login');
            } else {
                setError('Failed to fetch analytics data. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="flex justify-center items-center h-screen">Loading...</div>;
    }

    if (!metrics) {
        return <div className="p-6">No analytics data available.</div>;
    }

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Analytics Dashboard</h1>
                <select
                    value={dateRange}
                    onChange={(e) => setDateRange(e.target.value)}
                    className="border rounded-lg px-4 py-2"
                >
                    <option value="7">Last 7 days</option>
                    <option value="30">Last 30 days</option>
                    <option value="90">Last 90 days</option>
                    <option value="365">Last year</option>
                </select>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-500">Total Leads</p>
                            <h3 className="text-2xl font-bold">{metrics.leadMetrics.totalLeads}</h3>
                        </div>
                        <FaUsers className="text-blue-500 text-3xl" />
                    </div>
                    <p className="text-sm text-gray-600 mt-2">
                        Conversion Rate: {(metrics.leadMetrics.conversionRate * 100).toFixed(1)}%
                    </p>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-500">Converted Leads</p>
                            <h3 className="text-2xl font-bold">{metrics.leadMetrics.convertedLeads}</h3>
                        </div>
                        <FaChartLine className="text-green-500 text-3xl" />
                    </div>
                    <p className="text-sm text-gray-600 mt-2">
                        From {metrics.leadMetrics.totalLeads} total leads
                    </p>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-500">Total Tasks</p>
                            <h3 className="text-2xl font-bold">{metrics.taskMetrics.totalTasks}</h3>
                        </div>
                        <FaTasks className="text-yellow-500 text-3xl" />
                    </div>
                    <p className="text-sm text-gray-600 mt-2">
                        Completion Rate: {(metrics.taskMetrics.completionRate * 100).toFixed(1)}%
                    </p>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-500">Overdue Tasks</p>
                            <h3 className="text-2xl font-bold">{metrics.taskMetrics.overdueTasks}</h3>
                        </div>
                        <FaCalendarAlt className="text-red-500 text-3xl" />
                    </div>
                    <p className="text-sm text-gray-600 mt-2">
                        Needs immediate attention
                    </p>
                </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                {/* Lead Status Distribution */}
                <div className="bg-white rounded-lg shadow p-6">
                    <h3 className="text-lg font-semibold mb-4">Lead Status Distribution</h3>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={metrics.leadMetrics.leadsByStatus}
                                    dataKey="count"
                                    nameKey="status"
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={80}
                                    label
                                >
                                    {metrics.leadMetrics.leadsByStatus.map((entry, index) => (
                                        <Cell
                                            key={`cell-${index}`}
                                            fill={STATUS_COLORS[entry.status as keyof typeof STATUS_COLORS] || COLORS[index % COLORS.length]}
                                        />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Task Status Distribution */}
                <div className="bg-white rounded-lg shadow p-6">
                    <h3 className="text-lg font-semibold mb-4">Task Status Distribution</h3>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={metrics.taskMetrics.tasksByStatus}
                                    dataKey="count"
                                    nameKey="status"
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={80}
                                    label
                                >
                                    {metrics.taskMetrics.tasksByStatus.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* User Performance */}
            <div className="bg-white rounded-lg shadow p-6 mb-6">
                <h3 className="text-lg font-semibold mb-4">Team Performance</h3>
                <div className="overflow-x-auto">
                    <table className="min-w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    User
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Total Leads
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Converted Leads
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Conversion Rate
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Completed Tasks
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {metrics.userPerformance.map((user, index) => (
                                <tr key={index} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <FaUserCheck className="text-gray-400 mr-2" />
                                            <div className="text-sm font-medium text-gray-900">
                                                {user.username}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {user.totalLeads}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {user.convertedLeads}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">
                                            {(user.conversionRate * 100).toFixed(1)}%
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                            <div
                                                className="bg-blue-600 h-2 rounded-full"
                                                style={{ width: `${user.conversionRate * 100}%` }}
                                            />
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {user.completedTasks}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Activity Timeline */}
            <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
                <div className="space-y-4">
                    {metrics.activityTimeline.map((activity, index) => (
                        <div key={index} className="flex items-start space-x-3">
                            <div className="flex-shrink-0">
                                <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                                    <FaUserCheck className="text-blue-500" />
                                </div>
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900">
                                    {activity.description}
                                </p>
                                <p className="text-sm text-gray-500">
                                    by {activity.user} • {new Date(activity.timestamp).toLocaleString()}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {error && (
                <div className="mt-4 p-4 bg-red-100 text-red-700 rounded-lg">
                    {error}
                </div>
            )}
        </div>
    );
} 