'use client';

interface PerformanceBoardProps {
    performance: {
        leadConversionByUser: Array<{
            staff_user: string;
            totalLeads: number;
            convertedLeads: number;
            staff: {
                username: string;
            };
        }>;
        taskCompletionByUser: Array<{
            assigned_to: string;
            totalTasks: number;
            completedTasks: number;
            assignee: {
                username: string;
            };
        }>;
    };
}

export default function PerformanceBoard({ performance }: PerformanceBoardProps) {
    const calculateConversionRate = (total: number, converted: number) => {
        return total > 0 ? ((converted / total) * 100).toFixed(1) : '0';
    };

    const calculateCompletionRate = (total: number, completed: number) => {
        return total > 0 ? ((completed / total) * 100).toFixed(1) : '0';
    };

    return (
        <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">Performance Board</h2>

            <div className="space-y-6">
                <div>
                    <h3 className="text-lg font-medium text-gray-700 mb-4">Lead Conversion</h3>
                    <div className="space-y-4">
                        {performance.leadConversionByUser.map((user) => (
                            <div key={user.staff_user} className="bg-gray-50 p-4 rounded">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <div className="font-medium">{user.staff?.username}</div>
                                        <div className="text-sm text-gray-500">
                                            {user.convertedLeads} of {user.totalLeads} leads converted
                                        </div>
                                    </div>
                                    <div className="text-lg font-semibold text-blue-600">
                                        {calculateConversionRate(user.totalLeads, user.convertedLeads)}%
                                    </div>
                                </div>
                                <div className="mt-2 h-2 bg-gray-200 rounded-full">
                                    <div
                                        className="h-2 bg-blue-500 rounded-full"
                                        style={{
                                            width: `${calculateConversionRate(user.totalLeads, user.convertedLeads)}%`
                                        }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div>
                    <h3 className="text-lg font-medium text-gray-700 mb-4">Task Completion</h3>
                    <div className="space-y-4">
                        {performance.taskCompletionByUser.map((user) => (
                            <div key={user.assigned_to} className="bg-gray-50 p-4 rounded">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <div className="font-medium">{user.assignee?.username}</div>
                                        <div className="text-sm text-gray-500">
                                            {user.completedTasks} of {user.totalTasks} tasks completed
                                        </div>
                                    </div>
                                    <div className="text-lg font-semibold text-green-600">
                                        {calculateCompletionRate(user.totalTasks, user.completedTasks)}%
                                    </div>
                                </div>
                                <div className="mt-2 h-2 bg-gray-200 rounded-full">
                                    <div
                                        className="h-2 bg-green-500 rounded-full"
                                        style={{
                                            width: `${calculateCompletionRate(user.totalTasks, user.completedTasks)}%`
                                        }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
} 