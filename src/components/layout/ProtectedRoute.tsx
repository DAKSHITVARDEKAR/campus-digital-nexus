import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Layout } from './Layout';
import { Skeleton } from '@/components/ui/skeleton';

const ProtectedRoute: React.FC = () => {
  const { isAuthenticated, loading } = useAuth();

  // Always render the main Layout structure
  return (
    <Layout>
      {loading ? (
        // Loading state within the Layout's content area
        <div className="space-y-4 p-4">
          <Skeleton className="h-10 w-1/2" />
          <Skeleton className="h-64 w-full" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
          </div>
        </div>
      ) : isAuthenticated ? (
        // Render the actual page content if authenticated
        <Outlet />
      ) : (
        // Redirect if not authenticated
        <Navigate to="/login" replace />
      )}
    </Layout>
  );
};

export default ProtectedRoute;
