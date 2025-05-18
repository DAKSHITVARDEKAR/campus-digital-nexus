
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { registerUser, loginUser, logoutUser, getCurrentUser, hasRole } from '@/services/authService';
import { User, UserRole } from '@/services/authService';

export const useAppwriteAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Check current session on load
  useEffect(() => {
    const checkSession = async () => {
      try {
        setLoading(true);
        const currentUser = await getCurrentUser();
        setUser(currentUser);
      } catch (err) {
        console.log('No active session found');
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    
    checkSession();
  }, []);

  // Register new user
  const register = async (email: string, password: string, name: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const newUser = await registerUser(email, password, name);
      setUser(newUser);
      
      toast({
        title: "Registration successful",
        description: "Welcome to Campus-Nexus!",
      });
      
      navigate('/student');
      return true;
    } catch (err: any) {
      console.error('Registration error:', err);
      setError(err.message || 'Failed to register');
      
      toast({
        title: "Registration failed",
        description: err.message || 'An error occurred during registration',
        variant: "destructive",
      });
      
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Login user
  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const loggedUser = await loginUser(email, password);
      setUser(loggedUser);
      
      toast({
        title: "Login successful",
        description: `Welcome back, ${loggedUser.name}!`,
      });
      
      // Redirect based on role
      if (loggedUser.roles.includes('admin')) {
        navigate('/admin');
      } else if (loggedUser.roles.includes('faculty')) {
        navigate('/faculty');
      } else {
        navigate('/student');
      }
      
      return true;
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.message || 'Failed to login');
      
      toast({
        title: "Login failed",
        description: err.message || 'Invalid email or password',
        variant: "destructive",
      });
      
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Logout user
  const logout = async () => {
    try {
      setLoading(true);
      
      await logoutUser();
      setUser(null);
      
      toast({
        title: "Logged out",
        description: "You have been logged out successfully",
      });
      
      navigate('/login');
      return true;
    } catch (err: any) {
      console.error('Logout error:', err);
      
      toast({
        title: "Logout failed",
        description: err.message || 'An error occurred during logout',
        variant: "destructive",
      });
      
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Check if user has a specific role
  const checkHasRole = (role: string): boolean => {
    if (!user) return false;
    return user.roles.includes(role);
  };

  // Check if user has permission for a specific action on a resource
  const hasPermission = (action: string, resource: string, resourceId?: string): boolean => {
    if (!user) return false;
    
    // Admin has all permissions
    if (user.roles.includes('admin')) return true;
    
    // Check specific permissions
    if (action === 'manage' && resource === 'election') {
      return user.roles.includes('election-committee') || user.roles.includes('admin');
    }
    
    if (action === 'vote' && resource === 'election') {
      // Everyone can vote
      return true;
    }
    
    // Add more permission checks as needed
    
    return false;
  };

  return {
    user,
    loading,
    error,
    register,
    login,
    logout,
    hasRole: checkHasRole,
    hasPermission,
  };
};

export default useAppwriteAuth;
