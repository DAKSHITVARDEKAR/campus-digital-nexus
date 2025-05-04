import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import {
  AppwriteUser,
  loginWithEmailAndPassword,
  logoutUser,
  getCurrentUser,
  registerWithEmailAndPassword,
  createGoogleOAuthSession
} from '@/appwrite/auth';
import { useToast } from '@/hooks/use-toast';

export type UserRole = 'Admin' | 'Faculty' | 'Student';

interface AuthContextType {
  user: AppwriteUser | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<AppwriteUser | null>;
  logout: () => Promise<void>;
  switchRole: (role: UserRole) => Promise<void>;
  hasPermission: (action: string, resource: string, resourceId?: string) => boolean;
  signInWithGoogle: () => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<AppwriteUser | null>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const mapAppwriteUser = (appwriteUser: AppwriteUser): AppwriteUser & { role: UserRole } => {
  let role: UserRole = 'Student';
  if (appwriteUser.email.includes('admin')) {
    role = 'Admin';
  } else if (appwriteUser.email.includes('faculty')) {
    role = 'Faculty';
  }
  return { ...appwriteUser, role };
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AppwriteUser | null>(null);
  const [mockRole, setMockRole] = useState<UserRole>('Student');
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const checkUserSession = useCallback(async () => {
    setLoading(true);
    try {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
      if (currentUser) {
        setMockRole(mapAppwriteUser(currentUser).role);
      }
    } catch (error) {
      console.error('Auth initialization error:', error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkUserSession();
  }, [checkUserSession]);

  const handleLogin = async (email: string, password: string): Promise<AppwriteUser | null> => {
    try {
      await loginWithEmailAndPassword(email, password);
      const currentUser = await getCurrentUser();
      setUser(currentUser);
      if (currentUser) {
        setMockRole(mapAppwriteUser(currentUser).role);
        toast({
          title: "Login successful",
          description: `Welcome back, ${currentUser.name}!`,
        });
        return currentUser;
      }
      return null;
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: "Login failed",
        description: "Invalid email or password.",
        variant: "destructive",
      });
      throw error;
    }
  };

  const handleLogout = async () => {
    try {
      await logoutUser();
      setUser(null);
      setMockRole('Student');
      toast({
        title: "Logged out",
        description: "You have been logged out successfully.",
      });
    } catch (error) {
      console.error('Logout error:', error);
      toast({
        title: "Error",
        description: "Failed to log out. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleRegister = async (email: string, password: string, name: string): Promise<AppwriteUser | null> => {
    try {
      const newUser = await registerWithEmailAndPassword(email, password, name);
      await handleLogin(email, password);
      toast({
        title: "Registration successful",
        description: `Welcome, ${name}! Your account has been created.`,
      });
      return newUser;
    } catch (error) {
      console.error('Registration error:', error);
      toast({
        title: "Registration failed",
        description: "Could not create account. Please try again.",
        variant: "destructive",
      });
      throw error;
    }
  };

  const handleSignInWithGoogle = async () => {
    try {
      await createGoogleOAuthSession();
    } catch (error) {
      console.error('Google Sign In error:', error);
      toast({
        title: "Google Sign-In Failed",
        description: "Could not initiate Google Sign-In. Please try again.",
        variant: "destructive",
      });
    }
  };

  const switchRole = async (role: UserRole) => {
    if (user) {
      setMockRole(role);
      toast({
        title: "Role View Changed (Demo)",
        description: `You are now viewing the application as: ${role}`,
        duration: 3000,
      });
    } else {
      toast({
        title: "Error",
        description: "Cannot switch role when not logged in.",
        variant: "destructive",
      });
    }
  };

  const hasPermission = (action: string, resource: string, resourceId?: string): boolean => {
    if (!user) return false;

    const currentRole = mockRole;

    const permissions: Record<UserRole, Record<string, Record<string, boolean>>> = {
      Admin: {
        election: { create: true, read: true, update: true, delete: true, manage: true, approveCandidate: true, rejectCandidate: true },
        candidate: { create: true, read: true, update: true, delete: true, approve: true, reject: true },
        vote: { create: true, read: true },
      },
      Faculty: {
        election: { create: false, read: true, update: false, delete: false, manage: false, approveCandidate: true, rejectCandidate: true },
        candidate: { create: true, read: true, update: true, delete: true, approve: true, reject: true },
        vote: { create: true, read: true },
      },
      Student: {
        election: { create: false, read: true, update: false, delete: false, manage: false, approveCandidate: false, rejectCandidate: false },
        candidate: { create: true, read: true, update: true, delete: true, approve: false, reject: false },
        vote: { create: true, read: true },
      }
    };

    return permissions[currentRole]?.[resource]?.[action] || false;
  };

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    login: handleLogin,
    logout: handleLogout,
    switchRole,
    hasPermission,
    signInWithGoogle: handleSignInWithGoogle,
    register: handleRegister,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
