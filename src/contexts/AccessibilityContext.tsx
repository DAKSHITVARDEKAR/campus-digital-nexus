
import React, { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { useAppwriteAuth } from '@/hooks/useAppwriteAuth';

interface AccessibilityOptions {
  fontSize: 'normal' | 'large' | 'x-large';
  contrast: 'normal' | 'high';
  animations: boolean;
  focusIndicator: boolean;
}

interface AccessibilityContextType {
  // User role and permissions
  userRole: string | null;
  isStudent: boolean;
  isFaculty: boolean;
  isAdmin: boolean;
  
  // Content filtering based on role
  canViewContent: (resourceType: string, resourceId?: string) => boolean;
  canEditContent: (resourceType: string, resourceId?: string) => boolean;
  
  // Accessibility preferences
  options: AccessibilityOptions;
  updateOption: <K extends keyof AccessibilityOptions>(
    option: K, 
    value: AccessibilityOptions[K]
  ) => void;
  
  // Helper functions for content presentation
  getScreenReaderText: (visualElement: string, context?: any) => string;
  getAriaLabel: (elementType: string, context?: any) => string;
}

const defaultOptions: AccessibilityOptions = {
  fontSize: 'normal',
  contrast: 'normal',
  animations: true,
  focusIndicator: true
};

export const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

export const AccessibilityProvider = ({ children }: { children: ReactNode }) => {
  const { user, hasRole } = useAppwriteAuth();
  const [options, setOptions] = useState<AccessibilityOptions>(defaultOptions);
  
  // Determine user role
  const userRole = user?.roles?.[0] || null;
  const isStudent = hasRole('student');
  const isFaculty = hasRole('faculty');
  const isAdmin = hasRole('admin');
  
  // Load accessibility preferences from localStorage on mount
  useEffect(() => {
    const savedOptions = localStorage.getItem('accessibility-options');
    if (savedOptions) {
      try {
        setOptions(JSON.parse(savedOptions));
      } catch (e) {
        console.error('Failed to parse accessibility options:', e);
      }
    }
  }, []);
  
  // Update a single option
  const updateOption = <K extends keyof AccessibilityOptions>(
    option: K, 
    value: AccessibilityOptions[K]
  ) => {
    const newOptions = { ...options, [option]: value };
    setOptions(newOptions);
    localStorage.setItem('accessibility-options', JSON.stringify(newOptions));
    
    // Apply body classes for global styling based on accessibility options
    document.body.classList.toggle('font-size-large', newOptions.fontSize === 'large');
    document.body.classList.toggle('font-size-x-large', newOptions.fontSize === 'x-large');
    document.body.classList.toggle('high-contrast', newOptions.contrast === 'high');
    document.body.classList.toggle('reduce-animations', !newOptions.animations);
    document.body.classList.toggle('focus-visible-always', newOptions.focusIndicator);
  };
  
  // Function to determine if user can view specific content
  const canViewContent = (resourceType: string, resourceId?: string): boolean => {
    // Admin can view everything
    if (isAdmin) return true;
    
    // Resource type specific logic
    switch (resourceType) {
      case 'election':
        return true; // All users can view public elections
      
      case 'election-results':
        // Results might be visible once voting has ended
        return true;
      
      case 'facility':
        return true; // All users can view facilities
      
      case 'booking':
        // For specific booking - either it's the user's own booking or faculty/admin
        if (resourceId && user && user.$id) {
          // This is simplified - in a real app you'd check the booking's userId
          return resourceId.startsWith(user.$id) || isFaculty || isAdmin;
        }
        return isFaculty || isAdmin;
      
      case 'integrity-record':
        // Public records visible to all, detailed view to faculty/admin
        return true;
      
      case 'complaint':
        // Public complaints visible to all, all complaints to admin
        return true;
      
      case 'budget':
        // Public budget info visible to all, details to admin
        return true;
        
      case 'achievement':
        // Public achievements visible to all
        return true;
        
      default:
        return false;
    }
  };
  
  // Function to determine if user can edit specific content
  const canEditContent = (resourceType: string, resourceId?: string): boolean => {
    // Admin can edit everything
    if (isAdmin) return true;
    
    // Resource type specific logic
    switch (resourceType) {
      case 'election':
        // Only election committee and admin can edit elections
        return hasRole('election-committee');
      
      case 'facility':
        // Only facility managers and admin can edit facilities
        return hasRole('facility-manager');
      
      case 'booking':
        // Users can only edit their own bookings, faculty can approve/reject
        if (resourceId && user && user.$id) {
          // This is simplified - in a real app you'd check the booking's userId
          return resourceId.startsWith(user.$id) || isFaculty;
        }
        return false;
        
      case 'complaint':
        // Users can edit their own complaints, admins can moderate
        if (resourceId && user && user.$id) {
          // This is simplified - in a real app you'd check the complaint's userId
          return resourceId.startsWith(user.$id);
        }
        return false;
        
      case 'achievement':
        // Users can edit their own achievements
        if (resourceId && user && user.$id) {
          // This is simplified - in a real app you'd check the achievement's userId
          return resourceId.startsWith(user.$id);
        }
        return false;
        
      default:
        return false;
    }
  };
  
  // Helper function to get screen reader text for visual elements
  const getScreenReaderText = (visualElement: string, context?: any): string => {
    switch (visualElement) {
      case 'election-status-badge':
        return `Election status: ${context?.status}`;
      
      case 'vote-button':
        return 'Click to cast your vote for this candidate';
      
      case 'booking-status-badge':
        return `Booking status: ${context?.status}`;
      
      default:
        return '';
    }
  };
  
  // Helper function to get aria labels
  const getAriaLabel = (elementType: string, context?: any): string => {
    switch (elementType) {
      case 'election-card':
        return `Election: ${context?.title}. Status: ${context?.status}. Click to view details.`;
      
      case 'candidate-card':
        return `Candidate: ${context?.name} from ${context?.department}. Click to view details.`;
      
      case 'facility-card':
        return `Facility: ${context?.name}. Location: ${context?.location}. Click to view details.`;
      
      case 'booking-card':
        return `Booking for ${context?.facilityName} on ${context?.date} from ${context?.startTime} to ${context?.endTime}. Status: ${context?.status}.`;
      
      default:
        return '';
    }
  };
  
  // Value to provide in context
  const value: AccessibilityContextType = {
    userRole,
    isStudent,
    isFaculty,
    isAdmin,
    canViewContent,
    canEditContent,
    options,
    updateOption,
    getScreenReaderText,
    getAriaLabel
  };
  
  // Apply body classes on initial render
  useEffect(() => {
    document.body.classList.toggle('font-size-large', options.fontSize === 'large');
    document.body.classList.toggle('font-size-x-large', options.fontSize === 'x-large');
    document.body.classList.toggle('high-contrast', options.contrast === 'high');
    document.body.classList.toggle('reduce-animations', !options.animations);
    document.body.classList.toggle('focus-visible-always', options.focusIndicator);
    
    // Add role-specific body class
    document.body.classList.toggle('role-student', isStudent);
    document.body.classList.toggle('role-faculty', isFaculty);
    document.body.classList.toggle('role-admin', isAdmin);
    
    // Cleanup function
    return () => {
      document.body.classList.remove(
        'font-size-large', 
        'font-size-x-large', 
        'high-contrast', 
        'reduce-animations', 
        'focus-visible-always',
        'role-student',
        'role-faculty', 
        'role-admin'
      );
    };
  }, [options, isStudent, isFaculty, isAdmin]);
  
  return (
    <AccessibilityContext.Provider value={value}>
      {children}
    </AccessibilityContext.Provider>
  );
};

// Custom hook for using accessibility context
export const useAccessibility = (): AccessibilityContextType => {
  const context = useContext(AccessibilityContext);
  if (context === undefined) {
    throw new Error('useAccessibility must be used within an AccessibilityProvider');
  }
  return context;
};
