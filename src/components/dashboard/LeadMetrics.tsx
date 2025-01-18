'use client';

import { Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

interface LeadMetricsProps {
    metrics: {
        leadsByStatus: Array<{
            status: string;
            count: number;
        }>;
        conversionRate: number;
        totalLeads: number;
        convertedLeads: number;
    };
}

export default function LeadMetrics({ metrics }: LeadMetricsProps) {
    const chartData = {
        labels: metrics.leadsByStatus.map(item => item.status),
        datasets: [
            {
                label: 'Leads by Status',
                data: metrics.leadsByStatus.map(item => item.count),
                backgroundColor: [
                    'rgba(54, 162, 235, 0.6)',
                    'rgba(75, 192, 192, 0.6)',
                    'rgba(255, 206, 86, 0.6)',
                    'rgba(255, 99, 132, 0.6)',
                ],
                borderColor: [
                    'rgba(54, 162, 235, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(255, 99, 132, 1)',
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
                text: 'Lead Distribution by Status',
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    stepSize: 1,
                },
            },
        },
    };

    return (
        <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-800">Lead Metrics</h2>
                <div className="text-sm text-gray-500">
                    Conversion Rate: {metrics.conversionRate}%
                </div>
            </div>
            <div className="h-64">
                <Bar data={chartData} options={options} />
            </div>
            <div className="mt-4 grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-gray-50 rounded">
                    <div className="text-2xl font-bold text-blue-600">
                        {metrics.totalLeads}
                    </div>
                    <div className="text-sm text-gray-500">Total Leads</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded">
                    <div className="text-2xl font-bold text-green-600">
                        {metrics.convertedLeads}
                    </div>
                    <div className="text-sm text-gray-500">Converted Leads</div>
                </div>
            </div>
        </div>
    );
} 