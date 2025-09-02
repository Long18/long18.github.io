'use client';

import React, { useState, useEffect } from 'react';
import { Sun, Moon, Monitor } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';

const ThemeToggle: React.FC = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  // Only use theme context after mounting
  const { mode, toggleMode } = useTheme();

  const getIcon = () => {
    switch (mode) {
      case 'light':
        return <Sun className="h-4 w-4" />;
      case 'dark':
        return <Moon className="h-4 w-4" />;
      default:
        return <Monitor className="h-4 w-4" />;
    }
  };

  return (
    <button
      className="theme-toggle button-floating"
      onClick={toggleMode}
      aria-label="Toggle dark/light mode"
      title="Toggle dark/light mode"
    >
      {getIcon()}
    </button>
  );
};

export default ThemeToggle;
