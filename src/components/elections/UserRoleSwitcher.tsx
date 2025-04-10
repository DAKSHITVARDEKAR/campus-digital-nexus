
import React from 'react';
import { Button } from '@/components/ui/button';
import { initializeWithDefaultUser, UserRole } from '@/services/mockAuth';
import { useToast } from '@/hooks/use-toast';

interface UserRoleSwitcherProps {
  onRoleChange?: (role: UserRole) => void;
}

const UserRoleSwitcher: React.FC<UserRoleSwitcherProps> = ({ onRoleChange }) => {
  const { toast } = useToast();
  const [currentRole, setCurrentRole] = React.useState<UserRole>('Student');

  const switchRole = async (role: UserRole) => {
    try {
      const user = await initializeWithDefaultUser(role);
      setCurrentRole(role);
      
      toast({
        title: "Role Changed",
        description: `You are now using the application as: ${role}`,
        duration: 3000,
      });
      
      if (onRoleChange) {
        onRoleChange(role);
      }
      
      // Force page reload to update permissions
      window.location.reload();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to change role",
        variant: "destructive",
      });
    }
  };

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
