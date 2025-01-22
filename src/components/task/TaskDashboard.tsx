import { useState } from "react";
import { Task } from "@/interfaces/interfaces";
import Link from "next/link";
import { formatDate } from "@/utils/dateUtils";
import TaskForm from '../TaskForm';
import { FaPlus } from 'react-icons/fa';

interface TaskDashboardProps {
  tasks: Task[];
  onTaskUpdate: (taskData: Partial<Task>, taskId?: number) => Promise<boolean>;
}

export default function TaskDashboard({ tasks = [], onTaskUpdate }: TaskDashboardProps) {
  const [error, setError] = useState<string | null>(null);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Safely calculate task counts
  const pendingCount = tasks?.filter((t) => t?.status?.toLowerCase() === "pending")?.length || 0;
  const inProgressCount = tasks?.filter((t) => ['in_progress', 'in progress'].includes(t?.status?.toLowerCase() || ''))?.length || 0;
  const completedCount = tasks?.filter((t) => t?.status?.toLowerCase() === "completed")?.length || 0;

  const handleSubmit = async (taskData: Partial<Task>) => {
    const success = await onTaskUpdate(taskData, editingTask?.id);
    if (success) {
      setEditingTask(null);
      setShowCreateModal(false);
    }
  };

  const handleStatusChange = (task: Task, newStatus: string) => {
    handleSubmit({
      ...task,
      status: newStatus as 'pending' | 'in_progress' | 'completed' | 'cancelled'
    });
  };

  const getPriorityColor = (priority: string | null | undefined): string => {
    if (!priority) return "bg-gray-100 text-gray-800"; // Default color for null/undefined

    switch (priority.toLowerCase()) {
      case "high":
        return "bg-red-100 text-red-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "low":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusColor = (status: string | null | undefined): string => {
    if (!status) return "bg-gray-100 text-gray-800"; // Default color for null/undefined

    switch (status.toLowerCase()) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "in_progress":
      case "in progress":
        return "bg-blue-100 text-blue-800";
      case "completed":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Task Management</h1>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700"
          onClick={() => setShowCreateModal(true)}
        >
          <FaPlus /> New Task
        </button>
      </div>

      {/* Task Filters */}
      <div className="mb-6 grid grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="font-semibold text-lg mb-2">Pending</h3>
          <p className="text-2xl">{pendingCount}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="font-semibold text-lg mb-2">In Progress</h3>
          <p className="text-2xl">{inProgressCount}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="font-semibold text-lg mb-2">Completed</h3>
          <p className="text-2xl">{completedCount}</p>
        </div>
      </div>

      {/* Task List */}
      <div className="space-y-4">
        {Array.isArray(tasks) && tasks.map((task) => (
          <div key={task.id} className="bg-white p-4 rounded-lg shadow">
            <div className="flex justify-between items-start">
              <div>
                <button
                  onClick={() => setEditingTask(task)}
                  className="text-lg font-semibold hover:text-blue-600"
                >
                  {task.title}
                </button>
                <p className="text-sm text-gray-600 mt-1">{task.description}</p>
              </div>
              <div className="text-sm text-gray-500">
                Due: {formatDate(task.due_date)}
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span
                  className={`px-2 py-1 rounded-full text-xs ${getPriorityColor(
                    task.priority
                  )}`}
                >
                  {task.priority?.charAt(0).toUpperCase() + task.priority?.slice(1) || ''}
                </span>
                <span
                  className={`px-2 py-1 rounded-full text-xs ${getStatusColor(
                    task.status
                  )}`}
                >
                  {task.status?.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ') || ''}
                </span>
                {task.lead_id && (
                  <Link
                    href={`/dashboard/leads/${task.lead_id}`}
                    className="text-sm text-blue-600 hover:text-blue-800"
                  >
                    View Lead
                  </Link>
                )}
              </div>

              <select
                value={task.status}
                onChange={(e) => handleStatusChange(task, e.target.value)}
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

        {(!Array.isArray(tasks) || tasks.length === 0) && (
          <div className="text-center py-8 text-gray-500">
            No tasks found
          </div>
        )}
      </div>

      {(showCreateModal || editingTask) && (
        <TaskForm
          open={true}
          onClose={() => {
            setShowCreateModal(false);
            setEditingTask(null);
          }}
          onSubmit={handleSubmit}
          initialData={editingTask || undefined}
          isEdit={!!editingTask}
        />
      )}
    </div>
  );
}
