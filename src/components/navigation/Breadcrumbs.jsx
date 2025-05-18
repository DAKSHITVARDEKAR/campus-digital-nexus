
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Breadcrumb, 
  BreadcrumbList, 
  BreadcrumbItem, 
  BreadcrumbLink, 
  BreadcrumbSeparator,
  BreadcrumbPage 
} from '@/components/ui/breadcrumb';
import { ChevronRight, Home } from 'lucide-react';

const Breadcrumbs = () => {
  const location = useLocation();
  
  // Get current path and split into segments
  const paths = location.pathname.split('/').filter(path => path !== '');
  
  // Map of path segments to readable names
  const pathMap = {
    admin: 'Admin Dashboard',
    student: 'Student Dashboard',
    faculty: 'Faculty Dashboard',
    elections: 'Elections',
    complaints: 'Complaints',
    'cheating-records': 'Academic Integrity Records',
    'board-review': 'Board Review',
    applications: 'Applications',
    budget: 'Budget',
    profile: 'Profile',
    settings: 'Settings',
    notifications: 'Notifications',
    facilities: 'Facilities',
    'book-facility': 'Book Facility',
    'my-bookings': 'My Bookings',
    achievements: 'Achievements',
    tasks: 'Tasks',
    login: 'Login',
    signup: 'Sign Up',
    'forgot-password': 'Forgot Password'
  };
  
  // Build breadcrumb items
  const breadcrumbItems = paths.map((path, index) => {
    // Create URL for this breadcrumb level
    const url = `/${paths.slice(0, index + 1).join('/')}`;
    const isLast = index === paths.length - 1;
    
    // If the path is a dynamic parameter (like electionId), try to parse it
    const isParam = path.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i);
    const displayName = pathMap[path] || (isParam ? 'Details' : path.charAt(0).toUpperCase() + path.slice(1));
    
    return (
      <BreadcrumbItem key={url}>
        {isLast ? (
          <BreadcrumbPage>{displayName}</BreadcrumbPage>
        ) : (
          <BreadcrumbLink asChild>
            <Link to={url}>{displayName}</Link>
          </BreadcrumbLink>
        )}
        {!isLast && <BreadcrumbSeparator><ChevronRight size={16} /></BreadcrumbSeparator>}
      </BreadcrumbItem>
    );
  });

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link to="/"><Home size={16} /></Link>
          </BreadcrumbLink>
          {paths.length > 0 && <BreadcrumbSeparator><ChevronRight size={16} /></BreadcrumbSeparator>}
        </BreadcrumbItem>
        {breadcrumbItems}
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export default Breadcrumbs;
