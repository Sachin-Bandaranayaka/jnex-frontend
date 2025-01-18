import { FaUserCircle, FaLeaf, FaTasks, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

interface Activity {
    type: 'lead' | 'task';
    id: number;
    title: string;
    status: string;
    user: string;
    timestamp: string;
}

interface ActivityTimelineProps {
    activities: Activity[];
}

export default function ActivityTimeline({ activities }: ActivityTimelineProps) {
    const getActivityIcon = (type: string, status: string) => {
        switch (type) {
            case 'lead':
                return status === 'converted' ? <FaCheckCircle className="text-green-500" /> : <FaLeaf className="text-blue-500" />;
            case 'task':
                return status === 'completed' ? <FaCheckCircle className="text-green-500" /> : <FaTasks className="text-yellow-500" />;
            default:
                return <FaUserCircle className="text-gray-500" />;
        }
    };

    const getStatusColor = (type: string, status: string) => {
        if (type === 'lead') {
            switch (status.toLowerCase()) {
                case 'converted':
                    return 'text-green-600';
                case 'lost':
                    return 'text-red-600';
                default:
                    return 'text-blue-600';
            }
        } else {
            switch (status.toLowerCase()) {
                case 'completed':
                    return 'text-green-600';
                case 'overdue':
                    return 'text-red-600';
                default:
                    return 'text-yellow-600';
            }
        }
    };

    const formatTimestamp = (timestamp: string) => {
        const date = new Date(timestamp);
        const now = new Date();
        const diff = now.getTime() - date.getTime();
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);

        if (minutes < 60) {
            return `${minutes} minutes ago`;
        } else if (hours < 24) {
            return `${hours} hours ago`;
        } else if (days === 1) {
            return 'Yesterday';
        } else if (days < 7) {
            return `${days} days ago`;
        } else {
            return date.toLocaleDateString();
        }
    };

    return (
        <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">Recent Activities</h2>
            {activities.length === 0 ? (
                <div className="text-center text-gray-500 py-4">
                    No recent activities
                </div>
            ) : (
                <div className="space-y-4">
                    {activities.map((activity, index) => (
                        <div key={index} className="flex items-start space-x-3">
                            <div className="flex-shrink-0 mt-1">
                                {getActivityIcon(activity.type, activity.status)}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-start">
                                    <p className="text-sm font-medium text-gray-900">
                                        {activity.title}
                                    </p>
                                    <span className="text-xs text-gray-500">
                                        {formatTimestamp(activity.timestamp)}
                                    </span>
                                </div>
                                <div className="mt-1 flex items-center text-sm">
                                    <span className={`font-medium ${getStatusColor(activity.type, activity.status)}`}>
                                        {activity.status}
                                    </span>
                                    <span className="mx-1 text-gray-500">•</span>
                                    <span className="text-gray-500">{activity.user}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
} 