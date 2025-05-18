
import { Account, ID, Client, Databases } from 'appwrite';
import { appwriteConfig } from '@/services/config'; // Fixed import path with @/ alias

const client = new Client();

client
    .setEndpoint(appwriteConfig.endpoint)
    .setProject(appwriteConfig.projectId);

export const account = new Account(client);
export const databases = new Databases(client);

export interface User {
  $id: string;
  name: string;
  email: string;
  roles: string[];
}

export type UserRole = 'student' | 'faculty' | 'admin';

// Sign up a new user
export const registerUser = async (email: string, password: string, name: string): Promise<User> => {
  try {
    const userAccount = await account.create(
      ID.unique(),
      email,
      password,
      name
    );

    if (!userAccount) {
      throw new Error('Account could not be created');
    }

    // Optionally, create a document in a database to store additional user data
    // and link it to the user's account using the user's ID.
    return mapAppwriteUser(userAccount);
  } catch (error: any) {
    console.error('Failed to register user', error);
    throw error;
  }
};

// Log in an existing user
export const loginUser = async (email: string, password: string): Promise<User> => {
  try {
    const session = await account.createEmailSession(email, password);
    if (!session) {
      throw new Error('Session could not be created');
    }
    
    const user = await getCurrentUser();
    return user as User;
  } catch (error: any) {
    console.error('Failed to login user', error);
    throw error;
  }
};

// Log out the current user
export const logoutUser = async (): Promise<void> => {
  try {
    await account.deleteSession('current');
  } catch (error: any) {
    console.error('Failed to logout user', error);
    throw error;
  }
};

// Get the current user
export const getCurrentUser = async (): Promise<User | null> => {
  try {
    const userAccount = await account.get();
    return mapAppwriteUser(userAccount);
  } catch (error: any) {
    console.log('No current session found', error);
    return null;
  }
};

// Map Appwrite user to our User interface
const mapAppwriteUser = (user: any): User => {
  return {
    $id: user.$id,
    name: user.name,
    email: user.email,
    roles: user.prefs?.roles || [] // Access roles from preferences
  };
};

// Check if the current user has a specific role
export const hasRole = (user: User | null, role: UserRole): boolean => {
  return !!user?.roles.includes(role);
};
