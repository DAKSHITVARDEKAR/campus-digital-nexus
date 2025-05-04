import { account } from './config';
import { ID, Models, OAuthProvider } from 'appwrite'; // Import OAuthProvider

export interface AppwriteUser extends Models.User<Models.Preferences> {}

export const loginWithEmailAndPassword = async (email: string, password: string): Promise<Models.Session> => {
  try {
    const session = await account.createEmailPasswordSession(email, password);
    return session;
  } catch (error) {
    console.error('Appwrite login error:', error);
    throw error;
  }
};

export const registerWithEmailAndPassword = async (email: string, password: string, name: string): Promise<AppwriteUser> => {
  try {
    // Use 'unique()' for userId to let Appwrite generate it
    const user = await account.create(ID.unique(), email, password, name);
    // Optionally, log the user in immediately after registration
    // await loginWithEmailAndPassword(email, password);
    return user;
  } catch (error) {
    console.error('Appwrite registration error:', error);
    throw error;
  }
};

export const logoutUser = async (): Promise<void> => {
  try {
    await account.deleteSession('current');
  } catch (error) {
    console.error('Appwrite logout error:', error);
    throw error;
  }
};

export const getCurrentUser = async (): Promise<AppwriteUser | null> => {
  try {
    const user = await account.get();
    return user;
  } catch (error) {
    // Appwrite throws an error if no session exists
    if (error.code !== 401) { // Don't log expected "not logged in" errors
        console.error('Appwrite get current user error:', error);
    }
    return null;
  }
};

export const createGoogleOAuthSession = async () => {
    try {
        // Redirect the user to the Google OAuth login page
        // Specify the success and failure redirect URLs
        account.createOAuth2Session(
            OAuthProvider.Google, // Use the enum value
            `${window.location.origin}/`, // Success URL
            `${window.location.origin}/login?error=oauth_failed` // Failure URL
        );
    } catch (error) {
        console.error('Appwrite Google OAuth error:', error);
        throw error;
    }
};

export const forgotPassword = async (email: string): Promise<Models.Token> => {
    try {
        // This initiates the password recovery process. Appwrite sends an email.
        // Returns a token object
        return await account.createRecovery(email, `${window.location.origin}/reset-password`); // URL user is redirected to after clicking email link
    } catch (error) {
        console.error('Appwrite forgot password error:', error);
        throw error;
    }
};

// Corrected function signature for updateRecovery
export const resetPassword = async (userId: string, secret: string, passwordA: string): Promise<Models.Token> => {
    try {
        // Confirms the password reset using the token from the email link
        // Requires userId, secret from the URL, and the new password
        // Appwrite asks for the password twice on its own pages, but the SDK takes it once.
        return await account.updateRecovery(userId, secret, passwordA);
    } catch (error) {
        console.error('Appwrite reset password error:', error);
        throw error;
    }
};
