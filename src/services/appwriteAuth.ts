
import { account, teams } from './appwriteService';
import { ID } from 'appwrite';

export type UserRole = 'student' | 'faculty' | 'admin';

export interface User {
  $id: string;
  email: string;
  name: string;
  roles: string[];
}

// Register a new user
export const registerUser = async (
  email: string, 
  password: string, 
  name: string
): Promise<User> => {
  try {
    // Create user account
    const newUser = await account.create(
      ID.unique(),
      email,
      password,
      name
    );

    // Log in the user
    await account.createSession(email, password);

    // Add to students team by default
    try {
      // Fixed: Pass 'students' as a string, not an array
      await teams.createMembership(
        'students', // teamId
        email, // email
        [], // roles
        'member' // status
      );
    } catch (teamError) {
      console.error('Error adding user to students team:', teamError);
    }

    // Get user session
    const userAccount = await account.get();
    
    // Get user's team memberships to determine roles
    const userTeams = await teams.list();
    const roles = userTeams.teams.map(team => 
      team.$id.replace('team:', '')
    );
    
    return {
      $id: userAccount.$id,
      email: userAccount.email,
      name: userAccount.name,
      roles: roles
    };
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
};

// Login user
export const loginUser = async (
  email: string, 
  password: string
): Promise<User> => {
  try {
    // Create session
    await account.createSession(email, password);
    
    // Get user data
    const userAccount = await account.get();
    
    // Get user's team memberships
    const userTeams = await teams.list();
    const roles = userTeams.teams.map(team => 
      team.$id.replace('team:', '')
    );
    
    return {
      $id: userAccount.$id,
      email: userAccount.email,
      name: userAccount.name,
      roles: roles
    };
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

// Logout user
export const logoutUser = async (): Promise<void> => {
  try {
    await account.deleteSession('current');
  } catch (error) {
    console.error('Logout error:', error);
    throw error;
  }
};

// Get current user
export const getCurrentUser = async (): Promise<User | null> => {
  try {
    const userAccount = await account.get();
    
    // Get user's team memberships
    const userTeams = await teams.list();
    const roles = userTeams.teams.map(team => 
      team.$id.replace('team:', '')
    );
    
    return {
      $id: userAccount.$id,
      email: userAccount.email,
      name: userAccount.name,
      roles: roles
    };
  } catch (error) {
    // Not logged in
    return null;
  }
};

// Get user's role memberships
export const getUserRoles = async (): Promise<string[]> => {
  try {
    const userTeams = await teams.list();
    return userTeams.teams.map(team => 
      team.$id.replace('team:', '')
    );
  } catch (error) {
    console.error('Failed to get user roles:', error);
    return [];
  }
};

// Check if user has a specific role
export const hasRole = async (role: string): Promise<boolean> => {
  try {
    const roles = await getUserRoles();
    return roles.includes(role);
  } catch (error) {
    console.error('Failed to check role:', error);
    return false;
  }
};

// Mock auth for development (to be removed in production)
export const mockAuth = {
  getUserRoles: () => ['student'],
  hasRole: (role: string) => role === 'student',
  getCurrentUser: () => ({
    $id: 'mock-user',
    email: 'student@example.com',
    name: 'Mock Student',
    roles: ['student']
  })
};
