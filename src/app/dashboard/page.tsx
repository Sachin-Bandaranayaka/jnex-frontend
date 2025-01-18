"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import MetricCard from "@/components/dashboard/MetricCard";
import LeadMetrics from "@/components/dashboard/LeadMetrics";
import TaskMetrics from "@/components/dashboard/TaskMetrics";
import UserPerformance from "@/components/dashboard/UserPerformance";
import ActivityTimeline from "@/components/dashboard/ActivityTimeline";

interface DashboardData {
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
  activities: Array<{
    type: "lead" | "task";
    id: number;
    title: string;
    status: string;
    user: string;
    timestamp: string;
  }>;
}

export default function Dashboard() {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await api.get("/analytics/dashboard");
        setDashboardData(response.data.data);
        setError(null);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setError("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
    // Refresh data every 5 minutes
    const interval = setInterval(fetchDashboardData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-500 text-center">
          <p className="text-xl font-semibold">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!dashboardData) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-8">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {/* <MetricCard
          title="Total Leads"
          value={dashboardData.leadMetrics.totalLeads}
          subtitle="Active leads in pipeline"
        />
        <MetricCard
          title="Conversion Rate"
          value={`${(dashboardData.leadMetrics.conversionRate * 100).toFixed(1)}%`}
          subtitle="Lead to customer conversion"
          trend={dashboardData.leadMetrics.conversionRate > 0.5 ? 'up' : 'down'}
          trendLabel={`${((dashboardData.leadMetrics.conversionRate - 0.5) * 100).toFixed(1)}% vs target`}
        />
        <MetricCard
          title="Tasks Due"
          value={dashboardData.taskMetrics.overdueTasks}
          subtitle="Tasks requiring attention"
          trend={dashboardData.taskMetrics.overdueTasks > 5 ? 'down' : 'up'}
          trendLabel={dashboardData.taskMetrics.overdueTasks > 5 ? 'Above threshold' : 'Within threshold'}
        /> */}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <LeadMetrics metrics={dashboardData.leadMetrics} />
        <TaskMetrics metrics={dashboardData.taskMetrics} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <UserPerformance performance={dashboardData.performance} />
        <ActivityTimeline activities={dashboardData.activities} />
      </div>
    </div>
  );
}
