'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

export type ThemeMode = 'light' | 'dark' | 'system';
export type ColorTheme = 'blue' | 'green' | 'purple' | 'red' | 'pink' | 'orange';

export interface ThemeColors {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  foreground: string;
  muted: string;
  border: string;
  card: string;
  destructive: string;
  ring: string;
}

export const colorThemes: Record<ColorTheme, { name: string; colors: ThemeColors }> = {
  blue: {
    name: 'Ocean Blue',
    colors: {
      primary: 'hsl(221.2 83.2% 53.3%)',
      secondary: 'hsl(210 40% 96%)',
      accent: 'hsl(210 40% 94%)',
      background: 'hsl(0 0% 100%)',
      foreground: 'hsl(222.2 84% 4.9%)',
      muted: 'hsl(210 40% 96%)',
      border: 'hsl(214.3 31.8% 91.4%)',
      card: 'hsl(0 0% 100%)',
      destructive: 'hsl(0 84.2% 60.2%)',
      ring: 'hsl(221.2 83.2% 53.3%)',
    },
  },
  green: {
    name: 'Forest Green',
    colors: {
      primary: 'hsl(142.1 76.2% 36.3%)',
      secondary: 'hsl(210 40% 96%)',
      accent: 'hsl(210 40% 94%)',
      background: 'hsl(0 0% 100%)',
      foreground: 'hsl(222.2 84% 4.9%)',
      muted: 'hsl(210 40% 96%)',
      border: 'hsl(214.3 31.8% 91.4%)',
      card: 'hsl(0 0% 100%)',
      destructive: 'hsl(0 84.2% 60.2%)',
      ring: 'hsl(142.1 76.2% 36.3%)',
    },
  },
  purple: {
    name: 'Royal Purple',
    colors: {
      primary: 'hsl(262.1 83.3% 57.8%)',
      secondary: 'hsl(210 40% 96%)',
      accent: 'hsl(210 40% 94%)',
      background: 'hsl(0 0% 100%)',
      foreground: 'hsl(222.2 84% 4.9%)',
      muted: 'hsl(210 40% 96%)',
      border: 'hsl(214.3 31.8% 91.4%)',
      card: 'hsl(0 0% 100%)',
      destructive: 'hsl(0 84.2% 60.2%)',
      ring: 'hsl(262.1 83.3% 57.8%)',
    },
  },
  red: {
    name: 'Crimson Red',
    colors: {
      primary: 'hsl(0 72.2% 50.6%)',
      secondary: 'hsl(210 40% 96%)',
      accent: 'hsl(210 40% 94%)',
      background: 'hsl(0 0% 100%)',
      foreground: 'hsl(222.2 84% 4.9%)',
      muted: 'hsl(210 40% 96%)',
      border: 'hsl(214.3 31.8% 91.4%)',
      card: 'hsl(0 0% 100%)',
      destructive: 'hsl(0 84.2% 60.2%)',
      ring: 'hsl(0 72.2% 50.6%)',
    },
  },
  pink: {
    name: 'Rose Pink',
    colors: {
      primary: 'hsl(336 75% 40%)',
      secondary: 'hsl(210 40% 96%)',
      accent: 'hsl(210 40% 94%)',
      background: 'hsl(0 0% 100%)',
      foreground: 'hsl(222.2 84% 4.9%)',
      muted: 'hsl(210 40% 96%)',
      border: 'hsl(214.3 31.8% 91.4%)',
      card: 'hsl(0 0% 100%)',
      destructive: 'hsl(0 84.2% 60.2%)',
      ring: 'hsl(336 75% 40%)',
    },
  },
  orange: {
    name: 'Sunset Orange',
    colors: {
      primary: 'hsl(24.6 95% 53.1%)',
      secondary: 'hsl(210 40% 96%)',
      accent: 'hsl(210 40% 94%)',
      background: 'hsl(0 0% 100%)',
      foreground: 'hsl(222.2 84% 4.9%)',
      muted: 'hsl(210 40% 96%)',
      border: 'hsl(214.3 31.8% 91.4%)',
      card: 'hsl(0 0% 100%)',
      destructive: 'hsl(0 84.2% 60.2%)',
      ring: 'hsl(24.6 95% 53.1%)',
    },
  },
};

interface ThemeContextType {
  mode: ThemeMode;
  colorTheme: ColorTheme;
  actualTheme: 'light' | 'dark';
  toggleMode: () => void;
  setMode: (mode: ThemeMode) => void;
  setColorTheme: (theme: ColorTheme) => void;
  colors: ThemeColors;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: React.ReactNode;
  defaultMode?: ThemeMode;
  defaultTheme?: ColorTheme;
}

export function ThemeProvider({ 
  children, 
  defaultMode = 'system', 
  defaultTheme = 'blue' 
}: ThemeProviderProps) {
  const [mode, setMode] = useState<ThemeMode>(defaultMode);
  const [colorTheme, setColorTheme] = useState<ColorTheme>(defaultTheme);
  const [actualTheme, setActualTheme] = useState<'light' | 'dark'>('light');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    // Check localStorage for saved preferences
    const savedMode = localStorage.getItem('theme-mode') as ThemeMode;
    const savedColorTheme = localStorage.getItem('color-theme') as ColorTheme;
    
    // Use saved values if they exist, otherwise use the default props
    if (savedMode) setMode(savedMode);
    if (savedColorTheme && colorThemes[savedColorTheme]) setColorTheme(savedColorTheme);
  }, []);

  useEffect(() => {
    const updateActualTheme = () => {
      if (mode === 'system') {
        const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        setActualTheme(systemTheme);
      } else {
        setActualTheme(mode as 'light' | 'dark');
      }
    };

    updateActualTheme();

    if (mode === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      mediaQuery.addEventListener('change', updateActualTheme);
      return () => mediaQuery.removeEventListener('change', updateActualTheme);
    }
  }, [mode]);

  useEffect(() => {
    if (!mounted) return;

    const root = document.documentElement;
    
    // Remove all theme classes
    root.classList.remove('light', 'dark');
    
    // Add current theme class
    root.classList.add(actualTheme);
    
    // Apply CSS variables for colors
    const colors = colorThemes[colorTheme].colors;
    Object.entries(colors).forEach(([key, value]) => {
      root.style.setProperty(`--${key}`, value);
    });
    
    // Apply dark mode variations if needed
    if (actualTheme === 'dark') {
      root.style.setProperty('--background', 'hsl(222.2 84% 4.9%)');
      root.style.setProperty('--foreground', 'hsl(210 40% 98%)');
      root.style.setProperty('--card', 'hsl(222.2 84% 4.9%)');
      root.style.setProperty('--secondary', 'hsl(217.2 32.6% 17.5%)');
      root.style.setProperty('--muted', 'hsl(217.2 32.6% 17.5%)');
      root.style.setProperty('--border', 'hsl(217.2 32.6% 17.5%)');
    }
    
    // Save to localStorage
    localStorage.setItem('theme-mode', mode);
    localStorage.setItem('color-theme', colorTheme);
  }, [mode, colorTheme, actualTheme, mounted]);

  const toggleMode = () => {
    if (mode === 'light') {
      setMode('dark');
    } else if (mode === 'dark') {
      setMode('system');
    } else {
      setMode('light');
    }
  };

  // Prevent hydration mismatch
  if (!mounted) {
    return <div style={{ visibility: 'hidden' }}>{children}</div>;
  }

  const value: ThemeContextType = {
    mode,
    colorTheme,
    actualTheme,
    toggleMode,
    setMode,
    setColorTheme,
    colors: colorThemes[colorTheme].colors,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
