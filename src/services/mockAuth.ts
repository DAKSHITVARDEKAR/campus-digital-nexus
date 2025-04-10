
// This file simulates a JWT authentication system
// In a real application, this would interact with a backend server

export type UserRole = 'Student' | 'Faculty' | 'Admin';

export interface User {
  userId: string;
  username: string;
  role: UserRole;
  email: string;
  name: string;
  department?: string;
}

// Simulated users for testing different roles
const MOCK_USERS: Record<string, User> = {
  'student123': {
    userId: 'student123',
    username: 'student',
    role: 'Student',
    email: 'student@example.edu',
    name: 'Alex Student',
    department: 'Computer Science'
  },
  'faculty456': {
    userId: 'faculty456',
    username: 'faculty',
    role: 'Faculty',
    email: 'faculty@example.edu',
    name: 'Professor Smith',
    department: 'Engineering'
  },
  'admin789': {
    userId: 'admin789',
    username: 'admin',
    role: 'Admin',
    email: 'admin@example.edu',
    name: 'Admin User'
  }
};

// Current user session storage
let currentUser: User | null = null;

/**
 * Login function that simulates JWT authentication
 */
export const login = (username: string, password: string): Promise<User> => {
  return new Promise((resolve, reject) => {
    // Simulate network delay
    setTimeout(() => {
      const user = MOCK_USERS[username];
      if (user && password === 'password') { // Super secure password check 😉
        currentUser = user;
        localStorage.setItem('mockAuthToken', JSON.stringify({
          token: `mock-jwt-token-${username}`,
          user
        }));
        resolve(user);
      } else {
        reject(new Error('Invalid username or password'));
      }
    }, 500);
  });
};

/**
 * Logout function
 */
export const logout = (): Promise<void> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      currentUser = null;
      localStorage.removeItem('mockAuthToken');
      resolve();
    }, 300);
  });
};

/**
 * Check if user is logged in and return user object
 */
export const getCurrentUser = (): Promise<User | null> => {
  return new Promise((resolve) => {
    if (currentUser) {
      resolve(currentUser);
      return;
    }
    
    // Try to get from localStorage
    const authData = localStorage.getItem('mockAuthToken');
    if (authData) {
      try {
        const parsed = JSON.parse(authData);
        currentUser = parsed.user;
        resolve(currentUser);
      } catch (e) {
        resolve(null);
      }
    } else {
      resolve(null);
    }
  });
};

/**
 * Check if user has specific role
 */
export const hasRole = async (roles: UserRole[]): Promise<boolean> => {
  const user = await getCurrentUser();
  return !!user && roles.includes(user.role);
};

/**
 * Initialize with a default user for demo purposes
 */
export const initializeWithDefaultUser = async (role: UserRole = 'Student'): Promise<User> => {
  let userId: string;
  switch (role) {
    case 'Admin':
      userId = 'admin789';
      break;
    case 'Faculty':
      userId = 'faculty456';
      break;
    default:
      userId = 'student123';
  }
  
  currentUser = MOCK_USERS[userId];
  localStorage.setItem('mockAuthToken', JSON.stringify({
    token: `mock-jwt-token-${userId}`,
    user: currentUser
  }));
  
  return currentUser;
};

// Initialize with student role by default when the app loads
// This is just for demo purposes, in a real app you would not do this
initializeWithDefaultUser('Student');
