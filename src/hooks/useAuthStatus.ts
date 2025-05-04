import { useState, useEffect, useCallback } from 'react';
import { getCurrentUser, AppwriteUser } from '@/appwrite/auth'; // Import from Appwrite

// Define UserRole if not globally available
export type UserRole = 'Admin' | 'Faculty' | 'Student';

// Update AuthState interface
export interface AuthState {
  user: AppwriteUser | null; // Use AppwriteUser type
  loading: boolean;
  isAuthenticated: boolean;
  hasPermission: (action: string, resource: string, resourceId?: string) => boolean;
  mockRole: UserRole;
}

// Helper function to map Appwrite user to your application's User structure if needed
const mapAppwriteUser = (appwriteUser: AppwriteUser): AppwriteUser & { role: UserRole } => {
  let role: UserRole = 'Student'; // Default role
  if (appwriteUser.email.includes('admin')) {
    role = 'Admin';
  } else if (appwriteUser.email.includes('faculty')) {
    role = 'Faculty';
  }
  return { ...appwriteUser, role };
};

export const useAuthStatus = (): AuthState => {
  const [user, setUser] = useState<AppwriteUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [mockRole, setMockRole] = useState<UserRole>('Student');

  const checkAuth = useCallback(async () => {
    setLoading(true);
    try {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
      if (currentUser) {
        setMockRole(mapAppwriteUser(currentUser).role);
      } else {
        setMockRole('Student');
      }
    } catch (error) {
      if (error.code !== 401) {
        console.error('Auth status check error:', error);
      }
      setUser(null);
      setMockRole('Student');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

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

  return {
    user,
    loading,
    isAuthenticated: !!user,
    hasPermission,
    mockRole
  };
};

export default useAuthStatus;
