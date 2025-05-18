
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

/**
 * RoleGuard component to protect routes based on user roles
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components to render if authorized
 * @param {string[]} props.allowedRoles - Array of roles allowed to access the route
 * @param {string} [props.redirectTo] - Where to redirect unauthorized users (defaults to login)
 * @returns {React.ReactElement}
 */
const RoleGuard = ({ children, allowedRoles, redirectTo = '/login' }) => {
  const { user, loading, isAuthenticated } = useAuth();
  
  // Show loading state if still checking authentication
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }
  
  // If authenticated but no role matches allowed roles, redirect
  if (!allowedRoles.includes(user.role)) {
    // Redirect different roles to their appropriate dashboards
    if (user.role === 'Admin') {
      return <Navigate to="/admin" replace />;
    } else if (user.role === 'Faculty') {
      return <Navigate to="/faculty" replace />;
    } else {
      return <Navigate to="/student" replace />;
    }
  }
  
  // User has required role, render the protected content
  return <>{children}</>;
};

export default RoleGuard;
