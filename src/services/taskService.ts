
import { ID, Query } from 'appwrite';
import { databases } from './appwriteService';

export interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  dueDate?: string;
  assignedTo?: string;
  category?: string;
  userId: string;
  createdAt: string;
}

const DB_ID = 'campusNexusDB';
const TASKS_COLLECTION = 'tasks';

// Fetch tasks for the current user
export const getUserTasks = async (userId: string) => {
  try {
    const response = await databases.listDocuments(
      DB_ID,
      TASKS_COLLECTION,
      [Query.equal('userId', userId)]
    );
    
    return response.documents.map(doc => ({
      id: doc.$id,
      title: doc.title,
      description: doc.description,
      completed: doc.completed,
      priority: doc.priority,
      dueDate: doc.dueDate,
      assignedTo: doc.assignedTo,
      category: doc.category,
      userId: doc.userId,
      createdAt: doc.createdAt
    }));
  } catch (error) {
    console.error('Failed to fetch tasks:', error);
    throw error;
  }
};

// Create a new task
export const createTask = async (taskData: Omit<Task, 'id' | 'createdAt'>) => {
  try {
    const response = await databases.createDocument(
      DB_ID,
      TASKS_COLLECTION,
      ID.unique(),
      {
        ...taskData,
        createdAt: new Date().toISOString()
      }
    );
    
    return {
      id: response.$id,
      title: response.title,
      description: response.description,
      completed: response.completed,
      priority: response.priority,
      dueDate: response.dueDate,
      assignedTo: response.assignedTo,
      category: response.category,
      userId: response.userId,
      createdAt: response.createdAt
    };
  } catch (error) {
    console.error('Failed to create task:', error);
    throw error;
  }
};

// Update a task
export const updateTask = async (id: string, taskData: Partial<Omit<Task, 'id' | 'createdAt' | 'userId'>>) => {
  try {
    const response = await databases.updateDocument(
      DB_ID,
      TASKS_COLLECTION,
      id,
      taskData
    );
    
    return {
      id: response.$id,
      title: response.title,
      description: response.description,
      completed: response.completed,
      priority: response.priority,
      dueDate: response.dueDate,
      assignedTo: response.assignedTo,
      category: response.category,
      userId: response.userId,
      createdAt: response.createdAt
    };
  } catch (error) {
    console.error(`Failed to update task ${id}:`, error);
    throw error;
  }
};

// Delete a task
export const deleteTask = async (id: string) => {
  try {
    await databases.deleteDocument(
      DB_ID,
      TASKS_COLLECTION,
      id
    );
    return true;
  } catch (error) {
    console.error(`Failed to delete task ${id}:`, error);
    throw error;
  }
};

// Mark task as complete/incomplete
export const toggleTaskCompletion = async (id: string, isCompleted: boolean) => {
  return updateTask(id, { completed: isCompleted });
};

// Mock implementation for development
export const mockTaskService = {
  tasks: [
    {
      id: '1',
      title: 'Submit Project Proposal',
      description: 'Finalize and submit project proposal for Computer Science class',
      completed: false,
      priority: 'high',
      dueDate: '2023-06-15',
      category: 'academic',
      userId: 'user123',
      createdAt: '2023-06-10'
    },
    {
      id: '2',
      title: 'Book Study Room',
      description: 'Reserve a study room for group project meeting',
      completed: true,
      priority: 'medium',
      dueDate: '2023-06-12',
      category: 'facility',
      userId: 'user123',
      createdAt: '2023-06-08'
    },
    {
      id: '3',
      title: 'Apply for Summer Internship',
      description: 'Complete application for summer internship program',
      completed: false,
      priority: 'high',
      dueDate: '2023-06-20',
      category: 'career',
      userId: 'user123',
      createdAt: '2023-06-01'
    },
  ] as Task[],

  getUserTasks: function(userId: string) {
    return Promise.resolve(this.tasks.filter(task => task.userId === userId));
  },

  createTask: function(taskData: Omit<Task, 'id' | 'createdAt'>) {
    const newTask = {
      id: `task_${this.tasks.length + 1}`,
      ...taskData,
      createdAt: new Date().toISOString()
    };
    this.tasks.push(newTask as Task);
    return Promise.resolve(newTask);
  },

  updateTask: function(id: string, taskData: Partial<Task>) {
    const index = this.tasks.findIndex(task => task.id === id);
    if (index === -1) {
      return Promise.reject(new Error('Task not found'));
    }
    this.tasks[index] = { ...this.tasks[index], ...taskData };
    return Promise.resolve(this.tasks[index]);
  },

  deleteTask: function(id: string) {
    const index = this.tasks.findIndex(task => task.id === id);
    if (index === -1) {
      return Promise.reject(new Error('Task not found'));
    }
    this.tasks.splice(index, 1);
    return Promise.resolve(true);
  },

  toggleTaskCompletion: function(id: string, isCompleted: boolean) {
    return this.updateTask(id, { completed: isCompleted });
  }
};
