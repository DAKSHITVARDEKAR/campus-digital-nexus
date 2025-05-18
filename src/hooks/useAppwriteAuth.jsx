
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

export const useAppwriteAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Check current session on load
  useEffect(() => {
    const checkSession = async () => {
      try {
        setLoading(true);
        // Import auth service dynamically to avoid issues
        const authService = await import('@/services/authService');
        const currentUser = await authService.getCurrentUser();
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
  const register = async (email, password, name) => {
    try {
      setLoading(true);
      setError(null);
      
      // Import auth service dynamically
      const authService = await import('@/services/authService');
      const newUser = await authService.registerUser(email, password, name);
      setUser(newUser);
      
      toast({
        title: "Registration successful",
        description: "Welcome to Campus-Nexus!",
      });
      
      navigate('/student');
      return true;
    } catch (err) {
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
  const login = async (email, password) => {
    try {
      setLoading(true);
      setError(null);
      
      // Import auth service dynamically
      const authService = await import('@/services/authService');
      const loggedUser = await authService.loginUser(email, password);
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
    } catch (err) {
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
      
      // Import auth service dynamically
      const authService = await import('@/services/authService');
      await authService.logoutUser();
      setUser(null);
      
      toast({
        title: "Logged out",
        description: "You have been logged out successfully",
      });
      
      navigate('/login');
      return true;
    } catch (err) {
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
  const checkHasRole = (role) => {
    if (!user) return false;
    return user.roles.includes(role);
  };

  // Check if user has permission for a specific action on a resource
  const hasPermission = (action, resource, resourceId) => {
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
