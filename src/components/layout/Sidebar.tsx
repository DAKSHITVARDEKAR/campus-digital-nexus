
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { 
  Home, 
  Calendar, 
  FileText, 
  User, 
  Award, 
  Settings, 
  Vote, 
  AlertTriangle, 
  DollarSign, 
  BookOpen,
  Bell,
  CheckSquare
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

interface NavItem {
  path: string;
  label: string;
  icon: React.ReactNode;
  roles?: string[];
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen = true, onClose }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  
  const navItems: NavItem[] = [
    {
      path: user?.role === 'Admin' ? '/admin' : user?.role === 'Faculty' ? '/faculty' : '/student',
      label: 'Dashboard',
      icon: <Home className="h-5 w-5" />,
    },
    {
      path: '/elections',
      label: 'Elections',
      icon: <Vote className="h-5 w-5" />,
    },
    {
      path: '/facilities',
      label: 'Facilities',
      icon: <Calendar className="h-5 w-5" />,
    },
    {
      path: '/my-bookings',
      label: 'My Bookings',
      icon: <BookOpen className="h-5 w-5" />,
    },
    {
      path: '/applications',
      label: 'Applications',
      icon: <FileText className="h-5 w-5" />,
    },
    {
      path: '/cheating-records',
      label: 'Integrity Records',
      icon: <AlertTriangle className="h-5 w-5" />,
    },
    {
      path: '/complaints',
      label: 'Complaints',
      icon: <AlertTriangle className="h-5 w-5" />,
    },
    {
      path: '/budget',
      label: 'Budget',
      icon: <DollarSign className="h-5 w-5" />,
    },
    {
      path: '/achievements',
      label: 'Achievements',
      icon: <Award className="h-5 w-5" />,
    },
    {
      path: '/tasks',
      label: 'Tasks',
      icon: <CheckSquare className="h-5 w-5" />,
    },
    {
      path: '/notifications',
      label: 'Notifications',
      icon: <Bell className="h-5 w-5" />,
    },
    {
      path: '/profile',
      label: 'Profile',
      icon: <User className="h-5 w-5" />,
    },
    {
      path: '/settings',
      label: 'Settings',
      icon: <Settings className="h-5 w-5" />,
    },
  ];

  if (!user) {
    return null;
  }

  return (
    <aside
      className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transition-all duration-300 transform shadow-lg lg:shadow-none lg:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}
    >
      <div className="flex flex-col h-full">
        <div className="px-4 py-6 flex items-center justify-center border-b">
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-xl font-bold text-primary">Campus-Nexus</span>
          </Link>
        </div>

        <nav className="flex-1 px-4 py-6 overflow-y-auto">
          <ul className="space-y-2">
            {navItems.map((item) => {
              // Skip items that require specific roles if user doesn't have them
              if (item.roles && !item.roles.includes(user.role)) {
                return null;
              }

              const isActive = location.pathname === item.path;

              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={cn(
                      "flex items-center px-4 py-2.5 text-sm font-medium rounded-md",
                      isActive
                        ? "bg-primary text-white"
                        : "text-gray-700 hover:bg-primary-foreground"
                    )}
                  >
                    {item.icon}
                    <span className="ml-3">{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="p-4 border-t">
          <div className="flex flex-col space-y-2">
            <div className="text-sm font-medium text-gray-900">
              {user.name}
            </div>
            <div className="text-xs text-gray-500 truncate">
              {user.email}
            </div>
            <Button
              variant="outline"
              className="mt-2 w-full"
              onClick={() => logout()}
            >
              Sign Out
            </Button>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
