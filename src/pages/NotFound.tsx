
import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, ArrowLeft, Home } from 'lucide-react';

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState<number | null>(null);
  const currentPath = location.pathname;

  // Check for specific route errors
  const isStudentDashboardError = currentPath === '/student-dashboard';
  
  // Redirect automatically for known route errors
  useEffect(() => {
    if (isStudentDashboardError) {
      setCountdown(5);
      
      const timer = setInterval(() => {
        setCountdown(prev => {
          if (prev === 1) {
            clearInterval(timer);
            navigate('/student');
            return null;
          }
          return prev ? prev - 1 : null;
        });
      }, 1000);
      
      return () => clearInterval(timer);
    }
  }, [isStudentDashboardError, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center pb-6">
          <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="h-8 w-8 text-red-500" />
          </div>
          <CardTitle className="text-2xl font-bold">Page Not Found</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-muted-foreground">
            Sorry, we couldn't find the page you're looking for. The page might have been moved, deleted, or might never have existed.
          </p>
          
          {isStudentDashboardError && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-blue-800 text-sm">
              <p className="font-medium">It looks like you're trying to access the Student Dashboard.</p>
              <p className="mt-1">The correct URL is <strong>/student</strong> instead of /student-dashboard.</p>
              {countdown && <p className="mt-2">Redirecting you in {countdown} seconds...</p>}
            </div>
          )}
          
          {!isStudentDashboardError && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-amber-800 text-sm">
              <p>If you were trying to access a specific feature, please check if you're logged in with the correct role (Student, Faculty, or Admin).</p>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex flex-col space-y-3 pt-2">
          {isStudentDashboardError ? (
            <Button className="w-full" onClick={() => navigate('/student')}>
              Go to Student Dashboard Now
            </Button>
          ) : (
            <Button className="w-full" asChild>
              <Link to="/">
                <Home className="mr-2 h-4 w-4" />
                Return to Home
              </Link>
            </Button>
          )}
          
          <Button variant="outline" className="w-full" asChild>
            <Link to="/login">
              Go to Login
            </Link>
          </Button>
          
          <Button variant="link" className="w-full" onClick={() => window.history.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Go Back
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default NotFound;
