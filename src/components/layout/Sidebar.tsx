
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
  Settings
} from 'lucide-react';
import { Button } from '@/components/ui/button';

type NavItem = {
  name: string;
  to: string;
  icon: React.ReactNode;
};

const navItems: NavItem[] = [
  { name: 'Dashboard', to: '/', icon: <Home className="h-5 w-5" /> },
  { name: 'Elections', to: '/elections', icon: <Users className="h-5 w-5" /> },
  { name: 'Budget', to: '/budget', icon: <BarChart className="h-5 w-5" /> },
  { name: 'Facilities', to: '/facilities', icon: <Calendar className="h-5 w-5" /> },
  { name: 'Applications', to: '/applications', icon: <FileText className="h-5 w-5" /> },
  { name: 'Complaints', to: '/complaints', icon: <List className="h-5 w-5" /> },
];

export const Sidebar = ({ isOpen, setIsOpen }: { isOpen: boolean; setIsOpen: (open: boolean) => void }) => {
  const location = useLocation();
  
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
          <ul className="space-y-2 pt-4">
            {navItems.map((item) => (
              <li key={item.name}>
                <Link
                  to={item.to}
                  className={cn(
                    "flex items-center p-2 text-base font-normal rounded-lg group",
                    location.pathname === item.to
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
          
          <div className="pt-4 mt-4 border-t border-gray-200">
            <ul className="space-y-2">
              <li>
                <Link
                  to="/settings"
                  className="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg hover:bg-gray-100"
                >
                  <Settings className="h-5 w-5" />
                  <span className="ml-3">Settings</span>
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
