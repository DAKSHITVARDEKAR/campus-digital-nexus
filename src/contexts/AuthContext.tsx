
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, UserRole, getCurrentUser, login, logout, initializeWithDefaultUser } from '@/services/mockAuth';
import { useToast } from '@/hooks/use-toast';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<User>;
  logout: () => Promise<void>;
  switchRole: (role: UserRole) => Promise<void>;
  hasPermission: (action: string, resource: string, resourceId?: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Initialize authentication state
  useEffect(() => {
    async function initialize() {
      try {
        const currentUser = await getCurrentUser();
        setUser(currentUser);
      } catch (error) {
        console.error('Auth initialization error:', error);
      } finally {
        setLoading(false);
      }
    }

    initialize();
  }, []);

  // Login function
  const handleLogin = async (username: string, password: string) => {
    try {
      const user = await login(username, password);
      setUser(user);
      toast({
        title: "Login successful",
        description: `Welcome back, ${user.name}!`,
      });
      return user;
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: "Login failed",
        description: "Invalid username or password.",
        variant: "destructive",
      });
      throw error;
    }
  };

  // Logout function
  const handleLogout = async () => {
    try {
      await logout();
      setUser(null);
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

  // Switch role function for testing
  const switchRole = async (role: UserRole) => {
    try {
      const user = await initializeWithDefaultUser(role);
      setUser(user);
      toast({
        title: "Role Changed",
        description: `You are now using the application as: ${role}`,
        duration: 3000,
      });
      
      // Force page reload to update permissions
      window.location.reload();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to change role",
        variant: "destructive",
      });
    }
  };

  // Permission checking function based on user role
  const hasPermission = (action: string, resource: string, resourceId?: string): boolean => {
    // If no user is logged in, they have no permissions
    if (!user) return false;
    
    // Define role-based permissions
    const permissions: Record<UserRole, Record<string, Record<string, boolean>>> = {
      Admin: {
        election: {
          create: true,
          read: true,
          update: true,
          delete: true,
          manage: true,
          approveCandidate: true,
          rejectCandidate: true
        },
        candidate: {
          create: true,
          read: true,
          update: true,
          delete: true,
          approve: true,
          reject: true
        },
        vote: {
          create: true,
          read: true
        }
      },
      Faculty: {
        election: {
          create: false,
          read: true,
          update: false,
          delete: false,
          manage: false,
          approveCandidate: true,
          rejectCandidate: true
        },
        candidate: {
          create: true,
          read: true,
          update: true,
          delete: true,
          approve: true,
          reject: true
        },
        vote: {
          create: true,
          read: true
        }
      },
      Student: {
        election: {
          create: false,
          read: true,
          update: false,
          delete: false,
          manage: false,
          approveCandidate: false,
          rejectCandidate: false
        },
        candidate: {
          create: true,
          read: true,
          update: true, // Can only update own if pending
          delete: true, // Can only delete own if pending
          approve: false,
          reject: false
        },
        vote: {
          create: true, // Can only vote once per election
          read: true
        }
      }
    };
    
    // Check if the user has the requested permission
    return permissions[user.role]?.[resource]?.[action] || false;
  };

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    login: handleLogin,
    logout: handleLogout,
    switchRole,
    hasPermission
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
