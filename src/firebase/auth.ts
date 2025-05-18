
import { 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User
} from 'firebase/auth';
import { auth } from './config';
import { Client, Account, ID, Teams } from 'appwrite';

// Initialize Appwrite
const appwriteClient = new Client();
appwriteClient
  .setEndpoint('https://fra.cloud.appwrite.io/v1')
  .setProject('68166b45001f2c121a55');

const appwriteAccount = new Account(appwriteClient);
const appwriteTeams = new Teams(appwriteClient);

// Firebase auth functions with Appwrite integration
export const loginWithEmailAndPassword = async (email: string, password: string) => {
  try {
    // First, try Firebase authentication
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    
    // Also login to Appwrite
    try {
      await appwriteAccount.createEmailSession(email, password);
      console.log('Successfully logged into both Firebase and Appwrite');
    } catch (appwriteError) {
      console.error('Appwrite login failed, but Firebase succeeded:', appwriteError);
      
      // Check if it's because the user doesn't exist in Appwrite yet
      if (appwriteError instanceof Error && appwriteError.message.includes('User not found')) {
        try {
          // Try to create the user in Appwrite
          await appwriteAccount.create(
            ID.unique(),
            email,
            password,
            userCredential.user.displayName || email.split('@')[0]
          );
          
          // Now try to login again
          await appwriteAccount.createEmailSession(email, password);
          
          // Add to students team by default
          await appwriteTeams.createMembership(
            'students',
            [],
            email,
            ['member']
          );
          
          console.log('Created new Appwrite user and logged in');
        } catch (createError) {
          console.error('Failed to create Appwrite user:', createError);
        }
      }
    }
    
    return userCredential.user;
  } catch (error) {
    throw error;
  }
};

export const registerWithEmailAndPassword = async (email: string, password: string, name?: string) => {
  try {
    // Create Firebase user
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    
    // Also create Appwrite user
    try {
      await appwriteAccount.create(
        ID.unique(),
        email,
        password,
        name || userCredential.user.displayName || email.split('@')[0]
      );
      
      // Login to Appwrite
      await appwriteAccount.createEmailSession(email, password);
      
      // Add to students team by default
      await appwriteTeams.createMembership(
        'students',
        [],
        email,
        ['member']
      );
      
      console.log('Successfully registered in both Firebase and Appwrite');
    } catch (appwriteError) {
      console.error('Appwrite registration failed, but Firebase succeeded:', appwriteError);
    }
    
    return userCredential.user;
  } catch (error) {
    throw error;
  }
};

export const logoutUser = async () => {
  try {
    // Logout from Firebase
    await signOut(auth);
    
    // Also logout from Appwrite
    try {
      await appwriteAccount.deleteSession('current');
      console.log('Successfully logged out from both Firebase and Appwrite');
    } catch (appwriteError) {
      console.error('Appwrite logout failed:', appwriteError);
    }
  } catch (error) {
    throw error;
  }
};

export const getCurrentUser = (): User | null => {
  return auth.currentUser;
};

export const onAuthStateChange = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, callback);
};

// Helper functions for Appwrite-specific features

// Get user's team memberships (roles)
export const getUserRoles = async (): Promise<string[]> => {
  try {
    // Make sure we're logged in to Appwrite
    const session = await appwriteAccount.get();
    if (!session) return [];
    
    // Get team memberships
    const teamsData = await appwriteTeams.list();
    return teamsData.teams.map(team => 
      team.$id.replace('team:', '')
    );
  } catch (error) {
    console.error('Failed to get user roles from Appwrite:', error);
    return [];
  }
};

// Check if user has specific role
export const hasRole = async (role: string): Promise<boolean> => {
  try {
    const roles = await getUserRoles();
    return roles.includes(role);
  } catch (error) {
    console.error('Failed to check role:', error);
    return false;
  }
};
