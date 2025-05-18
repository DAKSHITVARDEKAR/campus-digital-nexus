
import React, { createContext, useContext, useState, useEffect } from 'react';

// Default accessibility options
const defaultOptions = {
  fontSize: 'normal', // 'normal', 'large', 'x-large'
  contrast: 'normal', // 'normal', 'high'
  motion: 'full', // 'full', 'reduced'
  screenReader: false, // Whether screen reader optimizations are active
};

// Context for accessibility settings
export const AccessibilityContext = createContext({
  options: defaultOptions,
  updateOption: () => {},
  getAriaLabel: () => '',
  getScreenReaderText: () => '',
});

// Accessibility Provider component
export const AccessibilityProvider = ({ children }) => {
  // Load saved preferences from local storage
  const loadSavedOptions = () => {
    try {
      const savedOptions = localStorage.getItem('accessibilityOptions');
      return savedOptions ? JSON.parse(savedOptions) : defaultOptions;
    } catch (e) {
      console.error('Error loading accessibility options:', e);
      return defaultOptions;
    }
  };

  const [options, setOptions] = useState(loadSavedOptions);

  // Update an option and save to local storage
  const updateOption = (key, value) => {
    const newOptions = { ...options, [key]: value };
    setOptions(newOptions);
    
    try {
      localStorage.setItem('accessibilityOptions', JSON.stringify(newOptions));
    } catch (e) {
      console.error('Error saving accessibility options:', e);
    }
  };

  // Apply options as CSS variables for global styling
  useEffect(() => {
    const root = document.documentElement;
    
    // Font size
    switch (options.fontSize) {
      case 'large':
        root.style.setProperty('--base-font-size', '1.125rem');
        break;
      case 'x-large':
        root.style.setProperty('--base-font-size', '1.25rem');
        break;
      default:
        root.style.setProperty('--base-font-size', '1rem');
    }
    
    // Contrast
    if (options.contrast === 'high') {
      document.body.classList.add('high-contrast');
    } else {
      document.body.classList.remove('high-contrast');
    }
    
    // Motion
    if (options.motion === 'reduced') {
      document.body.classList.add('reduce-motion');
    } else {
      document.body.classList.remove('reduce-motion');
    }
    
    // Screen reader class for potential optimizations
    if (options.screenReader) {
      document.body.classList.add('screen-reader-active');
    } else {
      document.body.classList.remove('screen-reader-active');
    }
  }, [options]);

  // Helper function to generate appropriate aria labels
  const getAriaLabel = (elementType, context = {}) => {
    switch (elementType) {
      case 'election-card':
        return `Election: ${context.title}. Status: ${context.status}. Runs from ${context.startDate} to ${context.endDate}.`;
      case 'candidate-card':
        return `Candidate: ${context.name}. Position: ${context.position}. Department: ${context.department}.`;
      case 'application-form':
        return `Application form for ${context.position || 'candidate'}.`;
      default:
        return '';
    }
  };

  // Helper function for screen reader specific text
  const getScreenReaderText = (elementType, context = {}) => {
    switch (elementType) {
      case 'election-status-badge':
        return `Election status: ${context.status}`;
      case 'vote-button':
        return `Vote for ${context.candidateName} for the position of ${context.position}`;
      default:
        return '';
    }
  };

  const value = {
    options,
    updateOption,
    getAriaLabel,
    getScreenReaderText,
  };

  return (
    <AccessibilityContext.Provider value={value}>
      {children}
    </AccessibilityContext.Provider>
  );
};

// Custom hook to use accessibility context
export const useAccessibility = () => {
  const context = useContext(AccessibilityContext);
  if (context === undefined) {
    throw new Error('useAccessibility must be used within an AccessibilityProvider');
  }
  return context;
};

export default useAccessibility;
