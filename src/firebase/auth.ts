
import { 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User
} from 'firebase/auth';
import { auth } from './config';
import { Client, Account, ID } from 'appwrite';

// Initialize Appwrite
const appwriteClient = new Client();
appwriteClient
  .setEndpoint('https://fra.cloud.appwrite.io/v1')
  .setProject('68166b45001f2c121a55');

const appwriteAccount = new Account(appwriteClient);

// Firebase auth functions
export const loginWithEmailAndPassword = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    
    // Also login to Appwrite if needed
    try {
      await appwriteAccount.createEmailPasswordSession(email, password);
    } catch (appwriteError) {
      console.error('Appwrite login failed, but Firebase succeeded:', appwriteError);
      // Continue with Firebase auth only
    }
    
    return userCredential.user;
  } catch (error) {
    throw error;
  }
};

export const registerWithEmailAndPassword = async (email: string, password: string) => {
  try {
    // Create Firebase user
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    
    // Also create Appwrite user if needed
    try {
      await appwriteAccount.create(
        ID.unique(),
        email,
        password,
        userCredential.user.displayName || email.split('@')[0]
      );
      
      // Login to Appwrite
      await appwriteAccount.createEmailPasswordSession(email, password);
    } catch (appwriteError) {
      console.error('Appwrite registration failed, but Firebase succeeded:', appwriteError);
      // Continue with Firebase auth only
    }
    
    return userCredential.user;
  } catch (error) {
    throw error;
  }
};

export const logoutUser = async () => {
  try {
    await signOut(auth);
    
    // Also logout from Appwrite if needed
    try {
      await appwriteAccount.deleteSession('current');
    } catch (appwriteError) {
      console.error('Appwrite logout failed:', appwriteError);
      // Continue with Firebase logout only
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
