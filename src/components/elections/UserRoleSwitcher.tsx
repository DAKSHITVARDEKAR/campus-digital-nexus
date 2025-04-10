
import React from 'react';
import { Button } from '@/components/ui/button';
import { UserRole } from '@/services/mockAuth';
import { useAuth } from '@/contexts/AuthContext';

const UserRoleSwitcher: React.FC = () => {
  const { user, switchRole } = useAuth();
  const currentRole = user?.role || 'Student';

  return (
    <div className="flex items-center gap-2 bg-gray-100 p-2 rounded border">
      <span className="text-sm font-medium">Test as:</span>
      <Button 
        variant={currentRole === 'Student' ? "default" : "outline"} 
        size="sm"
        onClick={() => switchRole('Student')}
      >
        Student
      </Button>
      <Button 
        variant={currentRole === 'Faculty' ? "default" : "outline"} 
        size="sm"
        onClick={() => switchRole('Faculty')}
      >
        Faculty
      </Button>
      <Button 
        variant={currentRole === 'Admin' ? "default" : "outline"} 
        size="sm"
        onClick={() => switchRole('Admin')}
      >
        Admin
      </Button>
    </div>
  );
};

export default UserRoleSwitcher;
