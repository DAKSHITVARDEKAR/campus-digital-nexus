
import React from 'react';
import { Button } from '@/components/ui/button';
import { UserRole } from '@/services/mockAuth';
import { useAuth } from '@/contexts/AuthContext';

interface UserRoleSwitcherProps {
  onRoleChange?: (role: UserRole) => void;
}

const UserRoleSwitcher: React.FC<UserRoleSwitcherProps> = ({ onRoleChange }) => {
  const { user, switchRole } = useAuth();
  const currentRole = user?.role || 'Student';

  const handleRoleSwitch = (role: UserRole) => {
    switchRole(role);
    if (onRoleChange) {
      onRoleChange(role);
    }
  };

  return (
    <div className="flex items-center gap-2 bg-gray-100 p-2 rounded border">
      <span className="text-sm font-medium">Test as:</span>
      <Button 
        variant={currentRole === 'Student' ? "default" : "outline"} 
        size="sm"
        onClick={() => handleRoleSwitch('Student')}
      >
        Student
      </Button>
      <Button 
        variant={currentRole === 'Faculty' ? "default" : "outline"} 
        size="sm"
        onClick={() => handleRoleSwitch('Faculty')}
      >
        Faculty
      </Button>
      <Button 
        variant={currentRole === 'Admin' ? "default" : "outline"} 
        size="sm"
        onClick={() => handleRoleSwitch('Admin')}
      >
        Admin
      </Button>
    </div>
  );
};

export default UserRoleSwitcher;
