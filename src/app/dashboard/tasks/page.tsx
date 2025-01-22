"use client";

import { useState, useEffect } from 'react';
import { Task } from '@/interfaces/interfaces';
import { api } from '@/lib/api';
import { useAuth } from '@/context/authContext';
import { useRouter } from 'next/navigation';
import TaskDashboard from '@/components/task/TaskDashboard';

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
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
      const response = await api.get('/api/tasks');
      // Check if response.data is an array, if not, check if it's nested
      const tasksData = Array.isArray(response.data) ? response.data : response.data?.data || [];
      setTasks(tasksData);
      console.log('Tasks data:', tasksData); // Debug log
    } catch (err: any) {
      console.error('Failed to fetch tasks:', err);
      if (err.response?.status === 401) {
        router.push('/login');
      } else {
        setError(err.message || 'Failed to fetch tasks. Please try again.');
      }
      setTasks([]);
    } finally {
      setLoading(false);
    }
  };

  const handleTaskUpdate = async (taskData: Partial<Task>, taskId?: number) => {
    try {
      if (taskId) {
        await api.put(`/api/tasks/${taskId}`, taskData);
      } else {
        await api.post('/api/tasks', taskData);
      }
      await fetchTasks();
      return true;
    } catch (error) {
      console.error('Error saving task:', error);
      setError('Failed to save task');
      return false;
    }
  };

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
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <TaskDashboard
        tasks={tasks}
        onTaskUpdate={handleTaskUpdate}
      />
    </div>
  );
}
