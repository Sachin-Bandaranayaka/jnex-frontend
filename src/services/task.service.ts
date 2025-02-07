import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export interface Task {
  id: string;
  title: string;
  description: string;
  priority: "low" | "medium" | "high";
  status: "pending" | "in_progress" | "completed" | "cancelled";
  dueDate: string;
  assignedTo: string;
  assignedToName: string;
  relatedTo?: {
    type: "customer" | "order" | "product";
    id: string;
    name: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface CreateTaskDto {
  title: string;
  description: string;
  priority: "low" | "medium" | "high";
  dueDate: string;
  assignedTo: string;
  relatedTo?: {
    type: "customer" | "order" | "product";
    id: string;
  };
}

export interface UpdateTaskDto extends Partial<CreateTaskDto> {
  status?: "pending" | "in_progress" | "completed" | "cancelled";
}

export const taskService = {
  async getTasks(): Promise<Task[]> {
    const response = await axios.get(`${API_URL}/tasks`);
    return response.data;
  },

  async getTask(id: string): Promise<Task> {
    const response = await axios.get(`${API_URL}/tasks/${id}`);
    return response.data;
  },

  async createTask(task: CreateTaskDto): Promise<Task> {
    const response = await axios.post(`${API_URL}/tasks`, task);
    return response.data;
  },

  async updateTask(id: string, task: UpdateTaskDto): Promise<Task> {
    const response = await axios.put(`${API_URL}/tasks/${id}`, task);
    return response.data;
  },

  async deleteTask(id: string): Promise<void> {
    await axios.delete(`${API_URL}/tasks/${id}`);
  },

  async getAssignableUsers(): Promise<{ id: string; name: string }[]> {
    const response = await axios.get(`${API_URL}/users`);
    return response.data;
  },
};
