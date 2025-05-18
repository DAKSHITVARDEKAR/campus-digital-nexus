
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { 
  Home, 
  BarChart, 
  Calendar, 
  FileText, 
  Users, 
  List,
  Settings,
  Mail,
  Shield,
  BookOpen,
  Layers,
  Activity,
  CheckSquare
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

type NavItem = {
  name: string;
  to: string;
  icon: React.ReactNode;
  roles?: string[];
  badge?: string;
};

const commonNavItems: NavItem[] = [
  { name: 'Dashboard', to: '/', icon: <Home className="h-5 w-5" /> },
  { name: 'Tasks', to: '/tasks', icon: <CheckSquare className="h-5 w-5" /> },
  { name: 'Elections', to: '/elections', icon: <Users className="h-5 w-5" /> },
  { name: 'Budget', to: '/budget', icon: <BarChart className="h-5 w-5" /> },
  { name: 'Facilities', to: '/facilities', icon: <Calendar className="h-5 w-5" /> },
  { name: 'Applications', to: '/applications', icon: <FileText className="h-5 w-5" /> },
  { name: 'Complaints', to: '/complaints', icon: <List className="h-5 w-5" /> },
];

const roleSpecificNavItems: NavItem[] = [
  // Student specific
  { name: 'My Bookings', to: '/facilities/my-bookings', icon: <Calendar className="h-5 w-5" />, roles: ['student'] },
  { name: 'My Courses', to: '/courses', icon: <BookOpen className="h-5 w-5" />, roles: ['student'] },
  
  // Faculty specific
  { name: 'Board Review', to: '/faculty/board-review', icon: <Shield className="h-5 w-5" />, roles: ['faculty'], badge: 'New' },
  { name: 'Department Exams', to: '/faculty/exams', icon: <FileText className="h-5 w-5" />, roles: ['faculty'] },
  { name: 'Report Incident', to: '/faculty/report-incident', icon: <Activity className="h-5 w-5" />, roles: ['faculty'] },
  
  // Admin specific
  { name: 'User Management', to: '/admin/users', icon: <Users className="h-5 w-5" />, roles: ['admin'] },
  { name: 'System Logs', to: '/admin/logs', icon: <Layers className="h-5 w-5" />, roles: ['admin'] },
  { name: 'Announcements', to: '/admin/announcements', icon: <Mail className="h-5 w-5" />, roles: ['admin'] },
];

export const Sidebar = ({ isOpen, setIsOpen }: { isOpen: boolean; setIsOpen: (open: boolean) => void }) => {
  const location = useLocation();
  
  // Determine current user role - this would come from auth context in a real app
  const getCurrentRole = () => {
    if (location.pathname.includes('/faculty')) return 'faculty';
    if (location.pathname.includes('/admin')) return 'admin';
    if (location.pathname.includes('/student')) return 'student';
    return 'student'; // Default to student if can't determine
  };
  
  const currentRole = getCurrentRole();
  
  // Filter nav items based on role
  const filteredRoleItems = roleSpecificNavItems.filter(item => 
    !item.roles || item.roles.includes(currentRole)
  );
  
  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 md:hidden" 
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 z-40 w-64 h-screen pt-16 transition-transform bg-white border-r border-gray-200 md:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="h-full px-3 pb-4 overflow-y-auto">
          <div className="pt-4 mb-4">
            <div className="px-3 py-2">
              <div className="text-xs uppercase text-gray-500 font-semibold tracking-wider">
                {currentRole.charAt(0).toUpperCase() + currentRole.slice(1)} Portal
              </div>
            </div>
          </div>
          
          <ul className="space-y-2">
            {commonNavItems.map((item) => (
              <li key={item.name}>
                <Link
                  to={item.to}
                  className={cn(
                    "flex items-center p-2 text-base font-normal rounded-lg group",
                    location.pathname === item.to || location.pathname.startsWith(`${item.to}/`)
                      ? "bg-primary text-white"
                      : "text-gray-900 hover:bg-gray-100"
                  )}
                >
                  {item.icon}
                  <span className="ml-3">{item.name}</span>
                </Link>
              </li>
            ))}
          </ul>
          
          {filteredRoleItems.length > 0 && (
            <>
              <Separator className="my-4" />
              
              <div className="px-3 py-2">
                <div className="text-xs uppercase text-gray-500 font-semibold tracking-wider">
                  Role Specific
                </div>
              </div>
              
              <ul className="space-y-2">
                {filteredRoleItems.map((item) => (
                  <li key={item.name}>
                    <Link
                      to={item.to}
                      className={cn(
                        "flex items-center p-2 text-base font-normal rounded-lg group",
                        location.pathname === item.to || location.pathname.startsWith(`${item.to}/`)
                          ? "bg-primary text-white"
                          : "text-gray-900 hover:bg-gray-100"
                      )}
                    >
                      {item.icon}
                      <span className="ml-3 flex-1">{item.name}</span>
                      {item.badge && (
                        <Badge className="ml-auto bg-blue-100 text-blue-800 hover:bg-blue-200 border-blue-200">
                          {item.badge}
                        </Badge>
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            </>
          )}
          
          <div className="pt-4 mt-4 border-t border-gray-200">
            <ul className="space-y-2">
              <li>
                <Link
                  to="/settings"
                  className={cn(
                    "flex items-center p-2 text-base font-normal rounded-lg",
                    location.pathname === "/settings"
                      ? "bg-primary text-white"
                      : "text-gray-900 hover:bg-gray-100"
                  )}
                >
                  <Settings className="h-5 w-5" />
                  <span className="ml-3">Settings</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/login"
                  className="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg hover:bg-gray-100"
                >
                  <svg 
                    className="h-5 w-5" 
                    xmlns="http://www.w3.org/2000/svg" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" 
                    />
                  </svg>
                  <span className="ml-3">Log Out</span>
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
