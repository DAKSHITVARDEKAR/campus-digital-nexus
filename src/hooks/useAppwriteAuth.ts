
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { account, teams } from '../services/appwriteService';
import { ID } from 'appwrite';
import { useToast } from '@/hooks/use-toast';

export type UserRole = 'student' | 'faculty' | 'admin';

interface AppwriteUser {
  $id: string;
  email: string;
  name: string;
  roles: string[];
}

export const useAppwriteAuth = () => {
  const [user, setUser] = useState<AppwriteUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Check current session on load
  useEffect(() => {
    const checkSession = async () => {
      try {
        setLoading(true);
        // Try to get the current user session
        const session = await account.get();
        
        if (session) {
          // Fetch user's team memberships to determine roles
          const userTeams = await teams.listMemberships();
          const roles = userTeams.memberships.map(membership => 
            membership.teamId.replace('team:', '')
          );
          
          setUser({
            $id: session.$id,
            email: session.email,
            name: session.name,
            roles: roles,
          });
        }
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
      
      // Create the user account
      await account.create(
        ID.unique(),
        email,
        password,
        name
      );
      
      // After registration, create email session (login)
      await account.createEmailSession(email, password);
      
      // By default, add user to students team
      // In a production app, you might want to verify their email/role first
      try {
        await teams.createMembership(
          'students',  // Team ID for students
          ID.unique(),
          email,
          ['member']
        );
      } catch (teamError) {
        console.error('Error adding user to students team:', teamError);
      }
      
      // Get user details after login
      const session = await account.get();
      setUser({
        $id: session.$id,
        email: session.email,
        name: session.name,
        roles: ['student'], // Default role
      });
      
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
      
      // Create email session
      await account.createEmailSession(email, password);
      
      // Get user details
      const session = await account.get();
      
      // Fetch user's team memberships to determine roles
      const userTeams = await teams.listMemberships();
      const roles = userTeams.memberships.map(membership => 
        membership.teamId.replace('team:', '')
      );
      
      setUser({
        $id: session.$id,
        email: session.email,
        name: session.name,
        roles: roles,
      });
      
      toast({
        title: "Login successful",
        description: `Welcome back, ${session.name}!`,
      });
      
      // Redirect based on role
      if (roles.includes('admin')) {
        navigate('/admin');
      } else if (roles.includes('faculty')) {
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
      
      // Delete all sessions
      await account.deleteSession('current');
      
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
  const hasRole = (role: string): boolean => {
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
    hasRole,
    hasPermission,
  };
};

export default useAppwriteAuth;
