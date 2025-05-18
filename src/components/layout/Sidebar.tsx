
import React from 'react';
import { Link } from 'react-router-dom';
import { 
  HomeIcon, UserIcon, VoteIcon, CalendarIcon, 
  FileTextIcon, AlertTriangleIcon, MessageSquareIcon, 
  DollarSignIcon, AwardIcon, BellIcon, SettingsIcon,
  CheckSquare
} from 'lucide-react';

export interface SidebarProps {
  isOpen: boolean;
  setIsOpen?: React.Dispatch<React.SetStateAction<boolean>>;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, setIsOpen }) => {
  return (
    <div className={`fixed inset-y-0 left-0 z-40 w-64 bg-white shadow-lg transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 transition-transform duration-300 ease-in-out`}>
      <div className="flex items-center justify-center h-16 border-b">
        <h2 className="text-xl font-semibold">Campus-Nexus</h2>
      </div>
      <nav className="mt-5">
        <ul className="space-y-2 px-2">
          <li>
            <Link to="/" className="flex items-center px-4 py-2 text-gray-700 hover:bg-blue-100 hover:text-blue-600 rounded-md">
              <HomeIcon className="h-5 w-5 mr-3" />
              <span>Home</span>
            </Link>
          </li>
          <li>
            <Link to="/profile" className="flex items-center px-4 py-2 text-gray-700 hover:bg-blue-100 hover:text-blue-600 rounded-md">
              <UserIcon className="h-5 w-5 mr-3" />
              <span>Profile</span>
            </Link>
          </li>
          <li>
            <Link to="/elections" className="flex items-center px-4 py-2 text-gray-700 hover:bg-blue-100 hover:text-blue-600 rounded-md">
              <VoteIcon className="h-5 w-5 mr-3" />
              <span>Elections</span>
            </Link>
          </li>
          <li>
            <Link to="/facilities" className="flex items-center px-4 py-2 text-gray-700 hover:bg-blue-100 hover:text-blue-600 rounded-md">
              <CalendarIcon className="h-5 w-5 mr-3" />
              <span>Facility Booking</span>
            </Link>
          </li>
          <li>
            <Link to="/applications" className="flex items-center px-4 py-2 text-gray-700 hover:bg-blue-100 hover:text-blue-600 rounded-md">
              <FileTextIcon className="h-5 w-5 mr-3" />
              <span>Applications</span>
            </Link>
          </li>
          <li>
            <Link to="/integrity" className="flex items-center px-4 py-2 text-gray-700 hover:bg-blue-100 hover:text-blue-600 rounded-md">
              <AlertTriangleIcon className="h-5 w-5 mr-3" />
              <span>Academic Integrity</span>
            </Link>
          </li>
          <li>
            <Link to="/complaints" className="flex items-center px-4 py-2 text-gray-700 hover:bg-blue-100 hover:text-blue-600 rounded-md">
              <MessageSquareIcon className="h-5 w-5 mr-3" />
              <span>Complaints</span>
            </Link>
          </li>
          <li>
            <Link to="/budget" className="flex items-center px-4 py-2 text-gray-700 hover:bg-blue-100 hover:text-blue-600 rounded-md">
              <DollarSignIcon className="h-5 w-5 mr-3" />
              <span>Budget</span>
            </Link>
          </li>
          <li>
            <Link to="/achievements" className="flex items-center px-4 py-2 text-gray-700 hover:bg-blue-100 hover:text-blue-600 rounded-md">
              <AwardIcon className="h-5 w-5 mr-3" />
              <span>Achievements</span>
            </Link>
          </li>
          <li>
            <Link to="/tasks" className="flex items-center px-4 py-2 text-gray-700 hover:bg-blue-100 hover:text-blue-600 rounded-md">
              <CheckSquare className="h-5 w-5 mr-3" />
              <span>Tasks</span>
            </Link>
          </li>
          <li>
            <Link to="/notifications" className="flex items-center px-4 py-2 text-gray-700 hover:bg-blue-100 hover:text-blue-600 rounded-md">
              <BellIcon className="h-5 w-5 mr-3" />
              <span>Notifications</span>
            </Link>
          </li>
          <li>
            <Link to="/settings" className="flex items-center px-4 py-2 text-gray-700 hover:bg-blue-100 hover:text-blue-600 rounded-md">
              <SettingsIcon className="h-5 w-5 mr-3" />
              <span>Settings</span>
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
