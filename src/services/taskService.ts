
import { databases, DB_ID, TASKS_COLLECTION, handleError } from './appwriteService';
import { ID, Query } from 'appwrite';

export interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  priority: 'high' | 'medium' | 'low';
  dueDate?: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  category?: string;
  assignedTo?: string;
}

export const mapTaskFromDocument = (doc: any): Task => {
  return {
    id: doc.$id,
    title: doc.title,
    description: doc.description || '',
    completed: doc.completed || false,
    priority: doc.priority || 'medium',
    dueDate: doc.dueDate,
    userId: doc.userId,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
    category: doc.category,
    assignedTo: doc.assignedTo
  };
};

export const getUserTasks = async (userId: string): Promise<Task[]> => {
  try {
    const response = await databases.listDocuments(
      DB_ID,
      TASKS_COLLECTION,
      [
        Query.equal('userId', userId),
        Query.orderDesc('priority'),
        Query.orderAsc('dueDate')
      ]
    );
    
    return response.documents.map(mapTaskFromDocument);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    throw error;
  }
};

export const createTask = async (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): Promise<Task> => {
  try {
    const now = new Date().toISOString();
    
    const response = await databases.createDocument(
      DB_ID,
      TASKS_COLLECTION,
      ID.unique(),
      {
        ...taskData,
        createdAt: now,
        updatedAt: now
      }
    );
    
    return mapTaskFromDocument(response);
  } catch (error) {
    console.error('Error creating task:', error);
    throw error;
  }
};

export const updateTask = async (taskId: string, taskData: Partial<Omit<Task, 'id' | 'createdAt' | 'updatedAt'>>): Promise<Task> => {
  try {
    const updatedData = {
      ...taskData,
      updatedAt: new Date().toISOString()
    };
    
    const response = await databases.updateDocument(
      DB_ID,
      TASKS_COLLECTION,
      taskId,
      updatedData
    );
    
    return mapTaskFromDocument(response);
  } catch (error) {
    console.error(`Error updating task ${taskId}:`, error);
    throw error;
  }
};

export const deleteTask = async (taskId: string): Promise<boolean> => {
  try {
    await databases.deleteDocument(
      DB_ID,
      TASKS_COLLECTION,
      taskId
    );
    
    return true;
  } catch (error) {
    console.error(`Error deleting task ${taskId}:`, error);
    throw error;
  }
};

export const toggleTaskCompletion = async (taskId: string, completed: boolean): Promise<Task> => {
  return updateTask(taskId, { completed });
};

// Mock task service for development until Appwrite collection is set up
export const mockTaskService = {
  getUserTasks: async (userId: string): Promise<Task[]> => {
    return [
      {
        id: '1',
        title: 'Submit Mathematics Assignment',
        description: 'Complete and submit calculus problems 1-15',
        completed: false,
        priority: 'high',
        dueDate: new Date(Date.now() + 86400000).toISOString(), // tomorrow
        userId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        category: 'academic'
      },
      {
        id: '2',
        title: 'Book study room',
        description: 'Reserve library study room for group project',
        completed: false,
        priority: 'medium',
        dueDate: new Date(Date.now() + 172800000).toISOString(), // day after tomorrow
        userId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        category: 'facilities'
      },
      {
        id: '3',
        title: 'Vote in student council election',
        completed: true,
        priority: 'low',
        userId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        category: 'campus'
      }
    ];
  },
  createTask: async (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): Promise<Task> => {
    return {
      ...task,
      id: Math.random().toString(36).substring(2, 9),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  },
  toggleTaskCompletion: async (taskId: string, completed: boolean): Promise<Task> => {
    return {
      id: taskId,
      title: 'Mock task',
      completed,
      priority: 'medium',
      userId: 'mock-user',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  },
  deleteTask: async (taskId: string): Promise<boolean> => {
    return true;
  }
};
