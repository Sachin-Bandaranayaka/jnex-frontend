'use client';

import { Doughnut } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend
} from 'chart.js';

ChartJS.register(
    ArcElement,
    Tooltip,
    Legend
);

interface TaskMetricsProps {
    metrics: {
        tasksByStatus: Array<{
            status: string;
            count: number;
        }>;
        completionRate: number;
        totalTasks: number;
        completedTasks: number;
        overdueTasks: number;
    };
}

export default function TaskMetrics({ metrics }: TaskMetricsProps) {
    const chartData = {
        labels: metrics.tasksByStatus.map(item => item.status),
        datasets: [
            {
                data: metrics.tasksByStatus.map(item => item.count),
                backgroundColor: [
                    'rgba(255, 99, 132, 0.6)',
                    'rgba(54, 162, 235, 0.6)',
                    'rgba(255, 206, 86, 0.6)',
                    'rgba(75, 192, 192, 0.6)',
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                ],
                borderWidth: 1,
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top' as const,
            },
            title: {
                display: true,
                text: 'Task Distribution by Status',
            },
        },
    };

    return (
        <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-800">Task Metrics</h2>
                <div className="text-sm text-gray-500">
                    Completion Rate: {metrics.completionRate}%
                </div>
            </div>
            <div className="h-64 flex justify-center">
                <Doughnut data={chartData} options={options} />
            </div>
            <div className="mt-4 grid grid-cols-3 gap-4">
                <div className="text-center p-4 bg-gray-50 rounded">
                    <div className="text-2xl font-bold text-blue-600">
                        {metrics.totalTasks}
                    </div>
                    <div className="text-sm text-gray-500">Total Tasks</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded">
                    <div className="text-2xl font-bold text-green-600">
                        {metrics.completedTasks}
                    </div>
                    <div className="text-sm text-gray-500">Completed</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded">
                    <div className="text-2xl font-bold text-red-600">
                        {metrics.overdueTasks}
                    </div>
                    <div className="text-sm text-gray-500">Overdue</div>
                </div>
            </div>
        </div>
    );
} 