'use client';

interface Activity {
    type: 'lead' | 'task';
    id: number;
    title: string;
    status: string;
    user: string;
    timestamp: string;
}

interface ActivityFeedProps {
    activities: Activity[];
}

export default function ActivityFeed({ activities }: ActivityFeedProps) {
    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'completed':
            case 'converted':
                return 'text-green-600 bg-green-100';
            case 'pending':
            case 'new':
                return 'text-blue-600 bg-blue-100';
            case 'in_progress':
                return 'text-yellow-600 bg-yellow-100';
            case 'cancelled':
                return 'text-red-600 bg-red-100';
            default:
                return 'text-gray-600 bg-gray-100';
        }
    };

    const getActivityIcon = (type: string) => {
        switch (type) {
            case 'lead':
                return (
                    <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center">
                        <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                    </div>
                );
            case 'task':
                return (
                    <div className="h-8 w-8 rounded-full bg-green-500 flex items-center justify-center">
                        <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                        </svg>
                    </div>
                );
            default:
                return null;
        }
    };

    const formatTimestamp = (timestamp: string) => {
        const date = new Date(timestamp);
        return new Intl.RelativeTimeFormat('en', { numeric: 'auto' }).format(
            Math.ceil((date.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)),
            'day'
        );
    };

    return (
        <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">Recent Activity</h2>
            <div className="space-y-6">
                {activities.map((activity, index) => (
                    <div key={`${activity.type}-${activity.id}`} className="flex space-x-4">
                        {getActivityIcon(activity.type)}
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                                <p className="text-sm font-medium text-gray-900 truncate">
                                    {activity.title}
                                </p>
                                <span className="text-sm text-gray-500">
                                    {formatTimestamp(activity.timestamp)}
                                </span>
                            </div>
                            <div className="mt-1 flex items-center">
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(activity.status)}`}>
                                    {activity.status}
                                </span>
                                <span className="ml-2 text-sm text-gray-500">
                                    by {activity.user}
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
} 