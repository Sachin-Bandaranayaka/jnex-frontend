import { useState, useEffect } from "react";
import Link from "next/link";
import { Task } from "@/interfaces/interfaces";
import { FaPlus } from "react-icons/fa";
import TaskForm from "./TaskForm";
import { api } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import React from "react";

export default function TaskDashboard() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      fetchTasks();
    }
  }, [user]);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get("/tasks");

      // Log the response for debugging
      console.log('Raw API Response:', response);
      console.log('API Response Data:', response.data);

      // Initialize empty array
      let tasksData: Task[] = [];

      // Handle different response structures
      if (response.data?.data && Array.isArray(response.data.data)) {
        tasksData = response.data.data;
      } else if (response.data?.tasks && Array.isArray(response.data.tasks)) {
        tasksData = response.data.tasks;
      } else if (Array.isArray(response.data)) {
        tasksData = response.data;
      }

      // Ensure each task has the required properties
      tasksData = tasksData.filter(task => {
        if (!task || typeof task !== 'object') return false;
        if (!('id' in task) || !('status' in task)) return false;
        return true;
      });

      console.log('Processed Tasks:', tasksData);
      setTasks(tasksData);
    } catch (err: any) {
      console.error("Error fetching tasks:", err);
      if (err.response?.status === 401) {
        router.push('/login');
      } else {
        setError(err.message || "Failed to load tasks");
      }
      // Set empty array on error
      setTasks([]);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (taskId: number, newStatus: string) => {
    try {
      await api.patch(`/tasks/${taskId}`, { status: newStatus });
      await fetchTasks();
    } catch (error) {
      console.error("Error updating task status:", error);
      setError("Failed to update task status");
    }
  };

  const handleSubmit = async (taskData: Partial<Task>) => {
    try {
      if (editingTask) {
        await api.patch(`/tasks/${editingTask.id}`, taskData);
      } else {
        await api.post("/tasks", taskData);
      }
      await fetchTasks();
      setShowCreateModal(false);
      setEditingTask(null);
    } catch (error) {
      console.error("Error saving task:", error);
      setError("Failed to save task");
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority.toUpperCase()) {
      case "HIGH":
        return "bg-red-100 text-red-800";
      case "MEDIUM":
        return "bg-yellow-100 text-yellow-800";
      case "LOW":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toUpperCase()) {
      case "NEW":
        return "bg-blue-100 text-blue-800";
      case "IN_PROGRESS":
        return "bg-yellow-100 text-yellow-800";
      case "COMPLETED":
        return "bg-green-100 text-green-800";
      case "CANCELLED":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Move the filter operations inside a useMemo to ensure we have valid data
  const { pendingTasks, completedTasks } = React.useMemo(() => {
    if (!Array.isArray(tasks)) {
      console.log('Tasks is not an array:', tasks);
      return { pendingTasks: [], completedTasks: [] };
    }

    return {
      pendingTasks: tasks.filter(task => task?.status === 'NEW' || task?.status === 'IN_PROGRESS'),
      completedTasks: tasks.filter(task => task?.status === 'COMPLETED')
    };
  }, [tasks]);

  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p>Please log in to view tasks</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p>Loading tasks...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Tasks</h1>
        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center"
        >
          <FaPlus className="mr-2" /> New Task
        </button>
      </div>

      <div className="grid gap-4">
        <div>
          <h2 className="text-xl font-semibold mb-3">Pending Tasks</h2>
          {pendingTasks.length === 0 ? (
            <p className="text-gray-500">No pending tasks</p>
          ) : (
            pendingTasks.map((task) => (
              <div key={task.id} className="bg-white p-4 rounded-lg shadow mb-3">
                <div className="flex justify-between items-start">
                  <div>
                    <Link
                      href={`/dashboard/leads/${task.lead_id}`}
                      className="text-lg font-semibold hover:text-blue-600"
                    >
                      {task.title}
                    </Link>
                    <p className="text-sm text-gray-600 mt-1">{task.description}</p>
                  </div>
                  <div className="text-sm text-gray-500">
                    Due: {new Date(task.due_date).toLocaleString()}
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${getPriorityColor(
                        task.priority
                      )}`}
                    >
                      {task.priority}
                    </span>
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${getStatusColor(
                        task.status
                      )}`}
                    >
                      {task.status}
                    </span>
                    <span className="text-sm text-gray-500">
                      Lead: {task.lead?.lead_no || task.lead_id}
                    </span>
                    {task.user && (
                      <span className="text-sm text-gray-500">
                        Assigned to: {task.user.name}
                      </span>
                    )}
                  </div>

                  <select
                    value={task.status}
                    onChange={(e) => handleStatusChange(task.id, e.target.value)}
                    className="border rounded px-2 py-1 text-sm"
                  >
                    <option value="NEW">New</option>
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="COMPLETED">Completed</option>
                    <option value="CANCELLED">Cancelled</option>
                  </select>
                </div>
              </div>
            ))
          )}
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-3">Completed Tasks</h2>
          {completedTasks.length === 0 ? (
            <p className="text-gray-500">No completed tasks</p>
          ) : (
            completedTasks.map((task) => (
              <div key={task.id} className="bg-white p-4 rounded-lg shadow mb-3 opacity-75">
                <div className="flex justify-between items-start">
                  <div>
                    <Link
                      href={`/dashboard/leads/${task.lead_id}`}
                      className="text-lg font-semibold hover:text-blue-600"
                    >
                      {task.title}
                    </Link>
                    <p className="text-sm text-gray-600 mt-1">{task.description}</p>
                  </div>
                  <div className="text-sm text-gray-500">
                    Due: {new Date(task.due_date).toLocaleString()}
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${getPriorityColor(
                        task.priority
                      )}`}
                    >
                      {task.priority}
                    </span>
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${getStatusColor(
                        task.status
                      )}`}
                    >
                      {task.status}
                    </span>
                    <span className="text-sm text-gray-500">
                      Lead: {task.lead?.lead_no || task.lead_id}
                    </span>
                    {task.user && (
                      <span className="text-sm text-gray-500">
                        Assigned to: {task.user.name}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <TaskForm
        open={showCreateModal || !!editingTask}
        onClose={() => {
          setShowCreateModal(false);
          setEditingTask(null);
        }}
        onSubmit={handleSubmit}
        initialData={editingTask || undefined}
        isEdit={!!editingTask}
      />
    </div>
  );
}
