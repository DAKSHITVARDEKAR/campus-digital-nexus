
import { useState, useEffect } from 'react';
import { getCurrentUser, User, UserRole } from '@/services/mockAuth';

export interface AuthState {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  hasPermission: (action: string, resource: string, resourceId?: string) => boolean;
}

export const useAuthStatus = (): AuthState => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const currentUser = await getCurrentUser();
        setUser(currentUser);
      } catch (error) {
        console.error('Auth error:', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    
    checkAuth();
  }, []);
  
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
  
  return { 
    user, 
    loading, 
    isAuthenticated: !!user,
    hasPermission
  };
};

export default useAuthStatus;
