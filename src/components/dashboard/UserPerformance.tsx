import { FaUserCircle, FaChartLine, FaTasks } from 'react-icons/fa';

interface UserPerformanceProps {
    performance: {
        leadConversionByUser: Array<{
            username: string;
            totalLeads: number;
            convertedLeads: number;
        }>;
        taskCompletionByUser: Array<{
            username: string;
            totalTasks: number;
            completedTasks: number;
        }>;
    };
}

export default function UserPerformance({ performance }: UserPerformanceProps) {
    const getConversionRate = (total: number, converted: number) => {
        if (total === 0) return 0;
        return (converted / total) * 100;
    };

    const getCompletionRate = (total: number, completed: number) => {
        if (total === 0) return 0;
        return (completed / total) * 100;
    };

    return (
        <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">Team Performance</h2>
            <div className="space-y-6">
                {/* Lead Conversion Performance */}
                <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-3">Lead Conversion</h3>
                    <div className="space-y-4">
                        {performance.leadConversionByUser.map((user, index) => (
                            <div key={index} className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-2">
                                        <FaUserCircle className="text-gray-400" />
                                        <span className="text-sm font-medium text-gray-700">{user.username}</span>
                                    </div>
                                    <div className="text-sm text-gray-600">
                                        {user.convertedLeads} / {user.totalLeads}
                                    </div>
                                </div>
                                <div className="relative pt-1">
                                    <div className="flex mb-2 items-center justify-between">
                                        <div>
                                            <span className="text-xs font-semibold inline-block text-blue-600">
                                                {getConversionRate(user.totalLeads, user.convertedLeads).toFixed(1)}%
                                            </span>
                                        </div>
                                    </div>
                                    <div className="overflow-hidden h-2 text-xs flex rounded bg-blue-100">
                                        <div
                                            style={{ width: `${getConversionRate(user.totalLeads, user.convertedLeads)}%` }}
                                            className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500"
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Task Completion Performance */}
                <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-3">Task Completion</h3>
                    <div className="space-y-4">
                        {performance.taskCompletionByUser.map((user, index) => (
                            <div key={index} className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-2">
                                        <FaUserCircle className="text-gray-400" />
                                        <span className="text-sm font-medium text-gray-700">{user.username}</span>
                                    </div>
                                    <div className="text-sm text-gray-600">
                                        {user.completedTasks} / {user.totalTasks}
                                    </div>
                                </div>
                                <div className="relative pt-1">
                                    <div className="flex mb-2 items-center justify-between">
                                        <div>
                                            <span className="text-xs font-semibold inline-block text-green-600">
                                                {getCompletionRate(user.totalTasks, user.completedTasks).toFixed(1)}%
                                            </span>
                                        </div>
                                    </div>
                                    <div className="overflow-hidden h-2 text-xs flex rounded bg-green-100">
                                        <div
                                            style={{ width: `${getCompletionRate(user.totalTasks, user.completedTasks)}%` }}
                                            className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-green-500"
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
} 