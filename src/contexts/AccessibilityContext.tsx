
import React, { createContext, useContext, useState } from 'react';

export interface AccessibilityContextType {
  fontSize: string;
  setFontSize: React.Dispatch<React.SetStateAction<string>>;
  contrast: string;
  setContrast: React.Dispatch<React.SetStateAction<string>>;
  motionReduced: boolean;
  setMotionReduced: React.Dispatch<React.SetStateAction<boolean>>;
  screenReaderMode: boolean;
  setScreenReaderMode: React.Dispatch<React.SetStateAction<boolean>>;
  highContrast: boolean;
  setHighContrast: React.Dispatch<React.SetStateAction<boolean>>;
  largeText: boolean;
  setLargeText: React.Dispatch<React.SetStateAction<boolean>>;
  // Add these properties to match what's used in AccessibilitySettings
  options: {
    fontSize: 'normal' | 'large' | 'x-large';
    contrast: 'normal' | 'high';
    animations: boolean;
    focusIndicator: boolean;
  };
  updateOption: <K extends keyof AccessibilityOptions>(key: K, value: AccessibilityOptions[K]) => void;
}

// Define the shape of options
interface AccessibilityOptions {
  fontSize: 'normal' | 'large' | 'x-large';
  contrast: 'normal' | 'high';
  animations: boolean;
  focusIndicator: boolean;
}

// Default options
const defaultOptions: AccessibilityOptions = {
  fontSize: 'normal',
  contrast: 'normal',
  animations: true,
  focusIndicator: false,
};

export const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

export const AccessibilityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [fontSize, setFontSize] = useState<string>('medium');
  const [contrast, setContrast] = useState<string>('normal');
  const [motionReduced, setMotionReduced] = useState<boolean>(false);
  const [screenReaderMode, setScreenReaderMode] = useState<boolean>(false);
  const [highContrast, setHighContrast] = useState<boolean>(false);
  const [largeText, setLargeText] = useState<boolean>(false);
  const [options, setOptions] = useState<AccessibilityOptions>(defaultOptions);

  const updateOption = <K extends keyof AccessibilityOptions>(key: K, value: AccessibilityOptions[K]) => {
    setOptions(prev => ({ ...prev, [key]: value }));
  };

  return (
    <AccessibilityContext.Provider
      value={{
        fontSize,
        setFontSize,
        contrast,
        setContrast,
        motionReduced,
        setMotionReduced,
        screenReaderMode,
        setScreenReaderMode,
        highContrast,
        setHighContrast,
        largeText,
        setLargeText,
        options,
        updateOption
      }}
    >
      {children}
    </AccessibilityContext.Provider>
  );
};

export const useAccessibilityContext = () => {
  const context = useContext(AccessibilityContext);
  if (context === undefined) {
    throw new Error('useAccessibilityContext must be used within an AccessibilityProvider');
  }
  return context;
};

// For backward compatibility
export const useAccessibility = useAccessibilityContext;

export default AccessibilityContext;
