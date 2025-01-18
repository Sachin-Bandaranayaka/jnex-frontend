import { useState, useEffect } from "react";
import Link from "next/link";
import { Task } from "@/interfaces/interfaces";
import { FaPlus } from "react-icons/fa";
import TaskForm from "./TaskForm";
import { api } from "@/lib/api";

export default function TaskDashboard() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await api.get("/tasks");
      setTasks(response.data.tasks);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching tasks:", error);
      setError("Failed to load tasks");
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

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-600">{error}</div>;

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
        {tasks.map((task) => (
          <div key={task.id} className="bg-white p-4 rounded-lg shadow">
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
        ))}
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
