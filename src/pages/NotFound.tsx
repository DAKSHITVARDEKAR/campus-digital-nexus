
import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, ArrowLeft, Home, ArrowRight } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(5);
  const [redirectPath, setRedirectPath] = useState<string | null>(null);
  const [progressValue, setProgressValue] = useState(0);

  useEffect(() => {
    // Check if the current path is a known mistyped route
    const pathCorrections: Record<string, string> = {
      '/student-dashboard': '/student',
      '/faculty-dashboard': '/faculty',
      '/admin-dashboard': '/admin'
    };

    const currentPath = location.pathname;
    const correctedPath = pathCorrections[currentPath];

    if (correctedPath) {
      setRedirectPath(correctedPath);
      
      // Auto-redirect after countdown
      const timer = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            navigate(correctedPath);
            return 0;
          }
          return prev - 1;
        });
        
        // Update progress
        setProgressValue(prev => prev + 20);
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [location.pathname, navigate]);

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

          {redirectPath && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-blue-800 text-sm">
              <p className="font-medium">Did you mean to go to {redirectPath}?</p>
              <p className="mt-2">Redirecting in {countdown} seconds...</p>
              <Progress className="mt-2" value={progressValue} />
              <Button 
                className="w-full mt-3" 
                onClick={() => navigate(redirectPath)}
              >
                Go to {redirectPath} now
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          )}

          {!redirectPath && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-amber-800 text-sm">
              <p>If you were trying to access a specific feature, please check if you're logged in with the correct role (Student, Faculty, or Admin).</p>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex flex-col space-y-3 pt-2">
          <Button className="w-full" asChild>
            <Link to="/">
              <Home className="mr-2 h-4 w-4" />
              Return to Home
            </Link>
          </Button>
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
