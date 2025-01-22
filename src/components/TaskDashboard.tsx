import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { Task } from "@/interfaces/interfaces";
import { FaPlus } from "react-icons/fa";
import TaskForm from "./TaskForm";
import { api } from "@/lib/api";
import { useAuth } from "@/context/authContext";
import { useRouter } from "next/navigation";
import React from "react";
import { formatDate } from "@/utils/dateUtils";

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
      const response = await api.get("/api/tasks");
      setTasks(response.data);
    } catch (err: any) {
      console.error("Failed to fetch tasks:", err);
      setError(err.message || "Failed to fetch tasks. Please try again.");
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

  const getPriorityColor = (priority: string): string => {
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

  const getStatusColor = (status: string): string => {
    switch (status.toLowerCase()) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "in_progress":
        return "bg-blue-100 text-blue-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const { pendingTasks, completedTasks } = useMemo(() => {
    return {
      pendingTasks: tasks.filter(task => task?.status === 'pending' || task?.status === 'in_progress'),
      completedTasks: tasks.filter(task => task?.status === 'completed')
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
      <div className="flex justify-center items-center min-h-[200px]">
        <p>Loading tasks...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  const renderTaskList = (taskList: Task[], title: string) => (
    <div className="bg-white rounded-lg shadow mb-6">
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold">{title}</h2>
      </div>
      <div className="divide-y">
        {taskList.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            No tasks found
          </div>
        ) : (
          taskList.map((task) => (
            <div key={task.id} className="p-4 hover:bg-gray-50">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold">
                    {task.title}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {task.description}
                  </p>
                </div>
                <div className="text-sm text-gray-500">
                  Due: {formatDate(task.due_date)}
                </div>
              </div>
              <div className="mt-2 flex items-center gap-2">
                <span className={`px-2 py-1 rounded-full text-xs ${getPriorityColor(task.priority)}`}>
                  {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                </span>
                <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(task.status)}`}>
                  {task.status.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                </span>
                <span className="text-xs text-gray-500">
                  {task.task_type ?
                    task.task_type.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
                    : 'General Task'
                  }
                </span>
              </div>
              {task.assigned_to && (
                <div className="mt-2 text-sm text-gray-500">
                  Assigned to: {task.assigned_to}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );

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

      <div className="space-y-6">
        {renderTaskList(pendingTasks, 'Pending Tasks')}
        {renderTaskList(completedTasks, 'Completed Tasks')}
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
