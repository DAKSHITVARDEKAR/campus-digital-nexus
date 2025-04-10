
import { useState, useEffect } from 'react';
import { getCurrentUser, User } from '@/services/mockAuth';

export const useAuthStatus = () => {
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
  
  return { user, loading, isAuthenticated: !!user };
};

export default useAuthStatus;
