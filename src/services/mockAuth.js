
// Mock authentication service for development purposes
// This will be replaced by Appwrite authentication in production

export const mockUsers = {
  'student123': {
    userId: 'student123',
    email: 'student@campus.edu',
    name: 'Test Student',
    role: 'Student',
    department: 'Computer Science'
  },
  'faculty456': {
    userId: 'faculty456',
    email: 'faculty@campus.edu',
    name: 'Test Faculty',
    role: 'Faculty',
    department: 'Computer Science'
  },
  'admin789': {
    userId: 'admin789',
    email: 'admin@campus.edu',
    name: 'Test Admin',
    role: 'Admin'
  }
};

let currentUser = null;

export const login = (email, password) => {
  // Simple mock login - in real app we would validate credentials
  const user = Object.values(mockUsers).find(user => user.email === email);
  
  if (!user) {
    throw new Error('User not found');
  }
  
  currentUser = user;
  localStorage.setItem('mockUser', JSON.stringify(user));
  return user;
};

export const logout = () => {
  currentUser = null;
  localStorage.removeItem('mockUser');
};

export const getCurrentUser = () => {
  if (currentUser) return currentUser;
  
  const storedUser = localStorage.getItem('mockUser');
  if (storedUser) {
    currentUser = JSON.parse(storedUser);
    return currentUser;
  }
  
  return null;
};

export const registerUser = (email, name, role = 'Student') => {
  const userId = 'user_' + Math.random().toString(36).substr(2, 9);
  const newUser = {
    userId,
    email,
    name,
    role,
  };
  
  // In a real app, we would make an API call to create the user
  mockUsers[userId] = newUser;
  currentUser = newUser;
  localStorage.setItem('mockUser', JSON.stringify(newUser));
  
  return newUser;
};

// Helper for checking permissions
export const hasPermission = (action, resource) => {
  const user = getCurrentUser();
  if (!user) return false;
  
  // Admin can do everything
  if (user.role === 'Admin') return true;
  
  // Define permissions for Faculty
  if (user.role === 'Faculty') {
    switch (`${action}:${resource}`) {
      case 'create:election':
      case 'update:election':
        return false;
      case 'read:election':
      case 'approve:candidate':
      case 'reject:candidate':
      case 'view:integrityRecords':
      case 'create:integrityRecord':
        return true;
      default:
        return false;
    }
  }
  
  // Define permissions for Students
  if (user.role === 'Student') {
    switch (`${action}:${resource}`) {
      case 'read:election':
      case 'vote:election':
      case 'create:candidate':
      case 'create:application':
      case 'create:complaint':
      case 'create:achievement':
        return true;
      default:
        return false;
    }
  }
  
  return false;
};
