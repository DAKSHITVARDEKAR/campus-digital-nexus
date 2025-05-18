
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { mockTaskService, Task } from '@/services/taskService';
import { useAuth } from '@/contexts/AuthContext';

export const useTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    const fetchTasks = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        // In production, replace mockTaskService with the actual service
        const userTasks = await mockTaskService.getUserTasks(user?.userId || '');
        setTasks(userTasks);
      } catch (error) {
        console.error('Error fetching tasks:', error);
        toast({
          title: "Error loading tasks",
          description: "Failed to load your tasks. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [user, toast]);

  const addTask = async (title: string) => {
    if (!user) return;
    
    try {
      const newTask = await mockTaskService.createTask({
        title,
        completed: false,
        priority: 'medium', // Default priority
        userId: user.userId || '',
      });
      
      setTasks(prev => [...prev, newTask as Task]);
      
      toast({
        title: "Task added",
        description: "Your new task has been added successfully!",
      });
      
      return newTask;
    } catch (error) {
      console.error('Error adding task:', error);
      toast({
        title: "Error adding task",
        description: "Failed to add your task. Please try again.",
        variant: "destructive",
      });
    }
  };

  const toggleTask = async (taskId: string) => {
    try {
      const task = tasks.find(t => t.id === taskId);
      if (!task) return;
      
      const updatedTask = await mockTaskService.toggleTaskCompletion(taskId, !task.completed);
      
      setTasks(prev => prev.map(t => t.id === taskId ? updatedTask as Task : t));
    } catch (error) {
      console.error('Error toggling task:', error);
      toast({
        title: "Error updating task",
        description: "Failed to update task status. Please try again.",
        variant: "destructive",
      });
    }
  };

  const deleteTask = async (taskId: string) => {
    try {
      await mockTaskService.deleteTask(taskId);
      setTasks(prev => prev.filter(t => t.id !== taskId));
      
      toast({
        title: "Task deleted",
        description: "The task has been deleted successfully.",
      });
    } catch (error) {
      console.error('Error deleting task:', error);
      toast({
        title: "Error deleting task",
        description: "Failed to delete the task. Please try again.",
        variant: "destructive",
      });
    }
  };

  return {
    tasks,
    loading,
    addTask,
    toggleTask,
    deleteTask
  };
};

export default useTasks;
