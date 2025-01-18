import { useState } from "react";
import { Lead, Task } from "@/interfaces/interfaces";
import api from "@/lib/api";

interface LeadDetailsProps {
  lead: Lead;
  onUpdate: () => void;
}

export default function LeadDetails({ lead, onUpdate }: LeadDetailsProps) {
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    dueDate: "",
    priority: "medium",
    taskType: "follow_up",
  });
  const [newNote, setNewNote] = useState("");

  // Status options with colors
  const statusOptions = {
    new: { label: "New", color: "bg-blue-500" },
    contacted: { label: "Contacted", color: "bg-yellow-500" },
    qualified: { label: "Qualified", color: "bg-green-500" },
    converted: { label: "Converted", color: "bg-purple-500" },
    lost: { label: "Lost", color: "bg-red-500" },
  };

  // Update lead status
  const handleStatusChange = async (status: string) => {
    try {
      await api.put(`/leads/${lead.id}/status`, {
        status,
        notes: `Status changed to ${status}`,
      });
      onUpdate();
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  // Add a new task
  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post(`/leads/${lead.id}/tasks`, newTask);
      setNewTask({
        title: "",
        description: "",
        dueDate: "",
        priority: "medium",
        taskType: "follow_up",
      });
      onUpdate();
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  // Add a new interaction note
  const handleAddNote = async () => {
    try {
      await api.post(`/leads/${lead.id}/interactions`, {
        type: "note",
        notes: newNote,
      });
      setNewNote("");
      onUpdate();
    } catch (error) {
      console.error("Error adding note:", error);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 space-y-6">
      {/* Lead Status and Score */}
      <div className="flex justify-between items-center">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold">Lead #{lead.lead_no}</h2>
          <div className="flex items-center space-x-2">
            <span className="font-semibold">Status:</span>
            <select
              value={lead.status}
              onChange={(e) => handleStatusChange(e.target.value)}
              className="border rounded px-2 py-1"
            >
              {Object.entries(statusOptions).map(([value, { label }]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center space-x-2">
            <span className="font-semibold">Score:</span>
            <span
              className={`px-2 py-1 rounded ${
                lead.score >= 50 ? "bg-green-100" : "bg-yellow-100"
              }`}
            >
              {lead.score}
            </span>
          </div>
        </div>
      </div>

      {/* Customer Information */}
      <div className="border-t pt-4">
        <h3 className="font-semibold mb-2">Customer Information</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p>
              <span className="font-medium">Name:</span> {lead.customer.name}
            </p>
            <p>
              <span className="font-medium">Phone:</span> {lead.customer.phone}
            </p>
          </div>
          <div>
            <p>
              <span className="font-medium">Email:</span> {lead.customer.email}
            </p>
            <p>
              <span className="font-medium">Address:</span>{" "}
              {lead.customer.address}
            </p>
          </div>
        </div>
      </div>

      {/* Tasks Section */}
      <div className="border-t pt-4">
        <h3 className="font-semibold mb-2">Tasks</h3>
        <form onSubmit={handleAddTask} className="space-y-4 mb-4">
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Task title"
              value={newTask.title}
              onChange={(e) =>
                setNewTask({ ...newTask, title: e.target.value })
              }
              className="border rounded px-3 py-2"
              required
            />
            <input
              type="datetime-local"
              value={newTask.dueDate}
              onChange={(e) =>
                setNewTask({ ...newTask, dueDate: e.target.value })
              }
              className="border rounded px-3 py-2"
              required
            />
            <select
              value={newTask.priority}
              onChange={(e) =>
                setNewTask({ ...newTask, priority: e.target.value })
              }
              className="border rounded px-3 py-2"
            >
              <option value="low">Low Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="high">High Priority</option>
            </select>
            <select
              value={newTask.taskType}
              onChange={(e) =>
                setNewTask({ ...newTask, taskType: e.target.value })
              }
              className="border rounded px-3 py-2"
            >
              <option value="follow_up">Follow Up</option>
              <option value="meeting">Meeting</option>
              <option value="call">Call</option>
              <option value="other">Other</option>
            </select>
          </div>
          <textarea
            placeholder="Task description"
            value={newTask.description}
            onChange={(e) =>
              setNewTask({ ...newTask, description: e.target.value })
            }
            className="border rounded px-3 py-2 w-full"
            rows={2}
          />
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Add Task
          </button>
        </form>

        {/* Task List */}
        <div className="space-y-2">
          {lead.tasks?.map((task: Task) => (
            <div key={task.id} className="border rounded p-3">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-medium">{task.title}</h4>
                  <p className="text-sm text-gray-600">{task.description}</p>
                </div>
                <div className="text-sm text-gray-500">
                  Due: {new Date(task.due_date).toLocaleString()}
                </div>
              </div>
              <div className="mt-2 flex items-center space-x-2">
                <span
                  className={`px-2 py-1 rounded text-sm ${
                    task.priority === "high"
                      ? "bg-red-100"
                      : task.priority === "medium"
                      ? "bg-yellow-100"
                      : "bg-green-100"
                  }`}
                >
                  {task.priority}
                </span>
                <span
                  className={`px-2 py-1 rounded text-sm ${
                    task.status === "completed"
                      ? "bg-green-100"
                      : task.status === "in_progress"
                      ? "bg-blue-100"
                      : "bg-gray-100"
                  }`}
                >
                  {task.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Interaction History */}
      <div className="border-t pt-4">
        <h3 className="font-semibold mb-2">Interaction History</h3>
        <div className="mb-4">
          <textarea
            placeholder="Add a note..."
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            className="border rounded px-3 py-2 w-full"
            rows={3}
          />
          <button
            onClick={handleAddNote}
            className="mt-2 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            Add Note
          </button>
        </div>
        <div className="space-y-2">
          {lead.interactionHistory?.map((interaction, index) => (
            <div key={index} className="border-l-4 border-blue-500 pl-3 py-2">
              <div className="text-sm text-gray-500">
                {new Date(interaction.timestamp).toLocaleString()} -{" "}
                {interaction.user}
              </div>
              <div className="mt-1">
                <span className="font-medium">{interaction.type}:</span>{" "}
                {interaction.notes}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
